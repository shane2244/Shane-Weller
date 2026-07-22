import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!session || !session.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = (session.user as any).id;

  if (req.method === 'GET') {
    try {
      const journals = await prisma.journalEntry.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      return res.status(200).json({ journals });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  if (req.method === 'POST') {
    const { title, content, mood, tags } = req.body;
    if (!content) return res.status(400).json({ error: 'content required' });

    try {
      const entry = await prisma.journalEntry.create({
        data: {
          userId,
          title: title || null,
          content,
          mood: mood || null,
          tags: Array.isArray(tags) ? tags : [],
        },
      });
      return res.status(201).json({ entry });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  return res.status(405).end();
}
