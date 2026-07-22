# ShaneAI - features/ai/github-app

This folder contains the initial ShaneAI scaffolding: Prisma schema, NextAuth skeleton, and minimal API endpoints for the AI Companion.

Setup (local):

1. Copy `.env.example` to `.env` and set DATABASE_URL, NEXTAUTH_SECRET, OPENAI_API_KEY, and optional GitHub OAuth creds.
2. Install dependencies at the repository root or inside this folder if you treat it as a standalone app: `npm install`.
3. Generate Prisma client: `npx prisma generate`.
4. Create migration (dev): `npx prisma migrate dev --name init`.
5. Run the dev server: `npm run dev`.

Note: This is an incremental scaffold. The API routes currently do minimal validation and are intended for early review. Add secrets to your GitHub repo (OPENAI_API_KEY, DATABASE_URL, NEXTAUTH_SECRET) before deploying.
