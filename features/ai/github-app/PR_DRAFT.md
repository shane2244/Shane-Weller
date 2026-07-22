# Draft PR: Add initial ShaneAI scaffold

This draft PR adds the initial ShaneAI scaffold under features/ai/github-app. It includes:

- .env.example
- prisma/schema.prisma (User, JournalEntry, MoodEntry, Conversation, Message)
- package.json (minimal scripts & deps for a Next.js app)
- README.md with setup instructions
- lib/prisma.ts (Prisma client helper)
- lib/ai.ts (OpenAI wrapper)
- lib/prompts.ts (system prompt template)
- pages/api/ai/companion.ts (API stub that calls OpenAI and persists messages)
- pages/api/auth/[...nextauth].ts (NextAuth skeleton)
- Placeholder pages: dashboard, ai/companion, journal, mood

Checklist
- [x] Add scaffold files
- [ ] Add Prisma migration (dev)
- [ ] Wire NextAuth sessions into API routes
- [ ] Add CRUD API for Journal & Mood
- [ ] Add frontend components (Chat, JournalEditor, MoodPills)
- [ ] Add tests & CI

Notes
- Add repository secrets: OPENAI_API_KEY, DATABASE_URL, NEXTAUTH_SECRET before testing the AI and DB.
- This is a draft PR for incremental review.
