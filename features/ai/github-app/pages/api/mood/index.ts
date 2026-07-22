import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!session || !session.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = (session.user as any).id;

  if (req.method === 'GET') {
    const since = req.query.since as string | undefined;
    try {
      const where: any = { userId };
      if (since) {
        const sinceDate = new Date(since);
        where.createdAt = { gte: sinceDate };
      }
      const moods = await prisma.moodEntry.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 });
      return res.status(200).json({ moods });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  if (req.method === 'POST') {
    const { mood, energy, note } = req.body;
    if (!mood) return res.status(400).json({ error: 'mood required' });
    try {
      const entry = await prisma.moodEntry.create({ data: { userId, mood, energy: energy ?? null, note: note ?? null } });
      return res.status(201).json({ entry });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  return res.status(405).end();
}
