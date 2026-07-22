-- Migration: add AI usage and API log tables, add summary to Conversation
-- Date: 2026-07-22

ALTER TABLE "Conversation" ADD COLUMN IF NOT EXISTS summary TEXT;

CREATE TABLE IF NOT EXISTS "AiUsage" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  model TEXT,
  "promptTokens" INTEGER,
  "completionTokens" INTEGER,
  "totalTokens" INTEGER,
  "costEstimate" DOUBLE PRECISION,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "ApiLog" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  path TEXT,
  method TEXT,
  status INTEGER,
  note TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
