import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!session || !session.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = (session.user as any).id;
  const { id } = req.query as { id: string };

  if (req.method === 'GET') {
    try {
      const entry = await prisma.journalEntry.findUnique({ where: { id } });
      if (!entry || entry.userId !== userId) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ entry });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  if (req.method === 'PUT') {
    const { title, content, mood, tags } = req.body;
    if (!content) return res.status(400).json({ error: 'content required' });
    try {
      const existing = await prisma.journalEntry.findUnique({ where: { id } });
      if (!existing || existing.userId !== userId) return res.status(404).json({ error: 'Not found' });
      const updated = await prisma.journalEntry.update({
        where: { id },
        data: {
          title: title || null,
          content,
          mood: mood || null,
          tags: Array.isArray(tags) ? tags : [],
        },
      });
      return res.status(200).json({ entry: updated });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const existing = await prisma.journalEntry.findUnique({ where: { id } });
      if (!existing || existing.userId !== userId) return res.status(404).json({ error: 'Not found' });
      await prisma.journalEntry.delete({ where: { id } });
      return res.status(204).end();
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  return res.status(405).end();
}
