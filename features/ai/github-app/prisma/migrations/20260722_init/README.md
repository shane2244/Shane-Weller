# Migration notes

This migration SQL creates the core application tables (User, JournalEntry, MoodEntry, Conversation, Message).

Important:
- NextAuth / Prisma adapter also requires additional tables (Account, Session, VerificationToken). Depending on your Prisma version and adapter, you may want to generate migrations using `npx prisma migrate dev` which will produce the adapter tables automatically.
- To apply this migration locally:
  - Ensure DATABASE_URL in your .env is set
  - From the features/ai/github-app folder (or repo root) run: `psql <DATABASE_URL> -f prisma/migrations/20260722_init/migration.sql` OR run `npx prisma migrate dev --name init` which will generate and apply migrations based on schema.prisma
