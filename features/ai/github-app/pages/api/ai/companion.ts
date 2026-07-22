import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { callOpenAI } from '../../lib/ai';
import { systemPrompt } from '../../lib/prompts';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

// Rate limit configuration (simple, DB-backed)
const RATE_LIMIT_WINDOW_SEC = 60; // per-minute window
const MAX_REQUESTS_PER_WINDOW = 5;
const DAILY_TOKENS_LIMIT = 20000; // conservative token cap per day

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions as any);
  if (!session || !session.user) return res.status(401).json({ error: 'Unauthorized' });

  const { conversationId, userMessage } = req.body;
  if (!userMessage) return res.status(400).json({ error: 'userMessage required' });

  const userId = (session.user as any).id;

  try {
    // Rate limit check: count requests in the last window
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_SEC * 1000);
    const recentCalls = await prisma.apiLog.count({ where: { userId, path: '/api/ai/companion', createdAt: { gte: windowStart } } });
    if (recentCalls >= MAX_REQUESTS_PER_WINDOW) {
      await prisma.apiLog.create({ data: { userId, path: '/api/ai/companion', method: 'POST', status: 429, note: 'rate_limited' } });
      return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    }

    // Daily token check: sum totalTokens for today
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const usageToday = await prisma.aiUsage.aggregate({ where: { userId, createdAt: { gte: startOfDay } }, _sum: { totalTokens: true } });
    const tokensUsedToday = usageToday._sum.totalTokens ?? 0;
    if (tokensUsedToday >= DAILY_TOKENS_LIMIT) {
      await prisma.apiLog.create({ data: { userId, path: '/api/ai/companion', method: 'POST', status: 402, note: 'daily_token_quota_exceeded' } });
      return res.status(402).json({ error: 'Daily token quota exceeded. Upgrade plan or wait until tomorrow.' });
    }

    // Build messages with conversation history (limit to last 8 messages)
    let messages: any[] = [{ role: 'system', content: systemPrompt(session.user?.name || undefined) }];

    if (conversationId) {
      const convo = await prisma.conversation.findUnique({ where: { id: conversationId }, include: { messages: { orderBy: { createdAt: 'asc' }, take: 50 } } });
      if (convo) {
        // take the last 8 messages
        const recent = convo.messages.slice(-8);
        messages = [messages[0], ...recent.map((m) => ({ role: m.role as any, content: m.content }))];
      }
    }

    messages.push({ role: 'user', content: userMessage });

    // Call OpenAI
    const { reply, usage, raw } = await callOpenAI(messages as any);

    // Persist conversation & messages
    let convoId = conversationId;
    if (!convoId) {
      const convo = await prisma.conversation.create({ data: { userId, title: null } });
      convoId = convo.id;
    }

    await prisma.message.createMany({ data: [ { conversationId: convoId, role: 'user', content: userMessage }, { conversationId: convoId, role: 'assistant', content: reply || '' } ] });

    // Log API call
    await prisma.apiLog.create({ data: { userId, path: '/api/ai/companion', method: 'POST', status: 200 } });

    // Record token usage if available
    if (usage) {
      try {
        await prisma.aiUsage.create({ data: { userId, model: raw.model || 'unknown', promptTokens: usage.prompt_tokens || null, completionTokens: usage.completion_tokens || null, totalTokens: usage.total_tokens || null } });
      } catch (e) {
        console.warn('Failed to persist AI usage', e);
      }
    }

    // Update conversation summary/title in background (best-effort)
    (async () => {
      try {
        const summaryPrompt = [{ role: 'system', content: 'Summarize this conversation in one short title (6 words or fewer). Be specific and human-friendly.' }, ...messages.map((m) => ({ role: m.role, content: m.content }))];
        const { reply: titleCandidate } = await callOpenAI(summaryPrompt as any);
        if (titleCandidate) {
          await prisma.conversation.update({ where: { id: convoId }, data: { title: titleCandidate.slice(0, 150), summary: titleCandidate } });
        }
      } catch (err) {
        console.warn('Conversation summarization failed', err);
      }
    })();

    res.status(200).json({ conversationId: convoId, reply, usage });
  } catch (err: any) {
    console.error(err);
    await prisma.apiLog.create({ data: { userId: (session.user as any).id, path: '/api/ai/companion', method: 'POST', status: 500, note: err.message?.slice(0, 200) } });
    res.status(500).json({ error: err.message || 'Server error' });
  }
}
