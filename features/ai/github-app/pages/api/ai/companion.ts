import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { callOpenAI } from '../../lib/ai';
import { systemPrompt } from '../../lib/prompts';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions as any);
  if (!session || !session.user) return res.status(401).json({ error: 'Unauthorized' });

  const { conversationId, userMessage } = req.body;
  if (!userMessage) return res.status(400).json({ error: 'userMessage required' });

  try {
    const userId = (session.user as any).id;

    // Load recent messages if conversationId provided
    let messages = [
      { role: 'system', content: systemPrompt(session.user?.name || undefined) },
      { role: 'user', content: userMessage },
    ];

    if (conversationId) {
      const convo = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
      if (convo) {
        messages = [
          { role: 'system', content: systemPrompt(session.user?.name || undefined) },
          ...convo.messages.map((m) => ({ role: m.role as any, content: m.content })),
          { role: 'user', content: userMessage },
        ];
      }
    }

    const reply = await callOpenAI(messages as any);

    // Persist conversation & messages
    let convoId = conversationId;
    if (!convoId) {
      const convo = await prisma.conversation.create({
        data: { userId: userId, title: null },
      });
      convoId = convo.id;
    }

    await prisma.message.createMany({
      data: [
        { conversationId: convoId, role: 'user', content: userMessage },
        { conversationId: convoId, role: 'assistant', content: reply || '' },
      ],
    });

    res.status(200).json({ conversationId: convoId, reply });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
}
