import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!session || !session.user) return res.status(401).json({ error: 'Unauthorized' });
  const userId = (session.user as any).id;
  const { id } = req.query as { id: string };

  if (req.method === 'GET') {
    try {
      const convo = await prisma.conversation.findUnique({
        where: { id },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
      if (!convo || convo.userId !== userId) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ messages: convo.messages });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  return res.status(405).end();
}
