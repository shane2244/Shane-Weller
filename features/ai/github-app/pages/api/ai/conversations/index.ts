import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!session || !session.user) return res.status(401).json({ error: 'Unauthorized' });
  const userId = (session.user as any).id;

  if (req.method === 'GET') {
    try {
      const convos = await prisma.conversation.findMany({
        where: { userId },
        include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
        orderBy: { updatedAt: 'desc' },
        take: 50,
      });

      const summaries = convos.map((c) => ({
        id: c.id,
        title: c.title,
        updatedAt: c.updatedAt,
        lastMessage: c.messages[0] ? { role: c.messages[0].role, content: c.messages[0].content, createdAt: c.messages[0].createdAt } : undefined,
      }));

      return res.status(200).json({ conversations: summaries });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  return res.status(405).end();
}
