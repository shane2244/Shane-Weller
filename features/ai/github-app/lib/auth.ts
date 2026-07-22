import { getServerSession as nextAuthGetServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import type { NextApiRequest, NextApiResponse } from 'next';

export async function getServerAuthSession(req: NextApiRequest, res: NextApiResponse) {
  return await nextAuthGetServerSession(req, res, authOptions as any);
}
