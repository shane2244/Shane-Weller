import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    // GitHub OAuth (optional)
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    // Email sign-in (requires an email provider config)
    EmailProvider({
      server: process.env.EMAIL_SERVER, // e.g. smtp://user:pass@smtp.example.com:587
      from: process.env.EMAIL_FROM,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      // attach user id to session for API use
      // @ts-ignore
      session.user.id = user.id;
      return session;
    },
  },
};

export default NextAuth(authOptions as any);
