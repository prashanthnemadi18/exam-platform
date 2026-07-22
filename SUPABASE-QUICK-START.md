# ⚡ Supabase Quick Start - 5 Minutes Setup

## 1️⃣ Create Account (1 min)
- Go to https://supabase.com
- Sign up → Create Project
- Name: `ai-exam-platform`
- Wait for setup ☕

## 2️⃣ Create Tables (2 min)
Go to **SQL Editor** → Run this:

```sql
-- Students Table
CREATE TABLE students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  usn TEXT NOT NULL,
  semester TEXT NOT NULL,
  email TEXT NOT NULL,
  "registeredAt" TEXT NOT NULL,
  "teacherId" TEXT
);

-- Exams Table
CREATE TABLE exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  "questionType" TEXT NOT NULL,
  "numberOfQuestions" INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  questions JSONB NOT NULL,
  "createdAt" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "teacherId" TEXT
);

-- Submissions Table
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  "examId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "studentName" TEXT NOT NULL,
  "studentUSN" TEXT NOT NULL,
  "studentEmail" TEXT NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  "totalQuestions" INTEGER NOT NULL,
  "submittedAt" TEXT NOT NULL,
  "wasTerminated" BOOLEAN DEFAULT FALSE,
  "timeRemaining" INTEGER,
  "tabSwitchCount" INTEGER DEFAULT 0,
  "terminationReason" TEXT,
  "cheatingDetected" BOOLEAN DEFAULT FALSE,
  "teacherId" TEXT
);

-- Disable RLS for now
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;
```

## 3️⃣ Get API Keys (1 min)
- Settings → API
- Copy:
  - **Project URL**
  - **anon public** key

## 4️⃣ Update .env.local (1 min)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## 5️⃣ Run Project
```bash
npm run dev
```

## ✅ Done!

Your project now uses Supabase instead of MongoDB!

---

**Need help?** See `SUPABASE-SETUP-GUIDE.md` for detailed instructions.
