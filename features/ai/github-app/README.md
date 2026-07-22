# ShaneAI - features/ai/github-app

This folder contains the initial ShaneAI scaffolding: Prisma schema, NextAuth skeleton, and minimal API endpoints for the AI Companion.

Setup (local):

1. Copy `.env.example` to `.env` and set DATABASE_URL, NEXTAUTH_SECRET, OPENAI_API_KEY, and optional GitHub OAuth creds.
2. Install dependencies at the repository root or inside this folder if you treat it as a standalone app: `npm install`.
3. Generate Prisma client: `npx prisma generate`.
4. Create migration (dev): `npx prisma migrate dev --name init`.
   - Note: We're using the Prisma adapter for NextAuth. Ensure your DATABASE_URL is set before running migrations.
5. Run the dev server: `npm run dev`.

Notes: 
- Add repository secrets: OPENAI_API_KEY, DATABASE_URL, NEXTAUTH_SECRET before deploying.
- After running migrations, NextAuth will create required tables for accounts/sessions if using the Prisma adapter.
- This is an incremental scaffold. The API routes currently do minimal validation and are intended for early review. Add secrets to your GitHub repo (OPENAI_API_KEY, DATABASE_URL, NEXTAUTH_SECRET) before deploying.
