# 🚀 Supabase Setup Guide for AI Exam Platform

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or Email
4. Create a new organization (if needed)

## Step 2: Create New Project

1. Click "New Project"
2. Fill in details:
   - **Name:** `ai-exam-platform` (or your choice)
   - **Database Password:** Choose a strong password (save it!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free tier is fine for development
3. Click "Create new project"
4. Wait 2-3 minutes for setup to complete

## Step 3: Create Database Tables

Go to **SQL Editor** in Supabase Dashboard and run this SQL:

```sql
-- ============================================
-- STUDENTS TABLE
-- ============================================
CREATE TABLE students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  usn TEXT NOT NULL,
  semester TEXT NOT NULL,
  email TEXT NOT NULL,
  "registeredAt" TEXT NOT NULL,
  "teacherId" TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_students_teacherId ON students("teacherId");
CREATE INDEX idx_students_usn ON students(usn);
CREATE INDEX idx_students_email ON students(email);

-- ============================================
-- EXAMS TABLE
-- ============================================
CREATE TABLE exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  "questionType" TEXT NOT NULL,
  "numberOfQuestions" INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  questions JSONB NOT NULL, -- Store questions as JSON
  "createdAt" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "teacherId" TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_exams_teacherId ON exams("teacherId");
CREATE INDEX idx_exams_createdAt ON exams("createdAt");

-- ============================================
-- SUBMISSIONS TABLE
-- ============================================
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  "examId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "studentName" TEXT NOT NULL,
  "studentUSN" TEXT NOT NULL,
  "studentEmail" TEXT NOT NULL,
  answers JSONB NOT NULL, -- Store answers as JSON
  score INTEGER NOT NULL,
  "totalQuestions" INTEGER NOT NULL,
  "submittedAt" TEXT NOT NULL,
  "wasTerminated" BOOLEAN DEFAULT FALSE,
  "timeRemaining" INTEGER,
  "tabSwitchCount" INTEGER DEFAULT 0,
  "terminationReason" TEXT,
  "cheatingDetected" BOOLEAN DEFAULT FALSE,
  "teacherId" TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_submissions_examId ON submissions("examId");
CREATE INDEX idx_submissions_studentUSN ON submissions("studentUSN");
CREATE INDEX idx_submissions_teacherId ON submissions("teacherId");
CREATE INDEX idx_submissions_submittedAt ON submissions("submittedAt");

-- Composite index for duplicate check
CREATE UNIQUE INDEX idx_submissions_exam_student ON submissions("examId", "studentUSN");
```

## Step 4: Enable Row Level Security (RLS) - Optional

For now, we'll disable RLS for simplicity. Later you can enable it for production.

```sql
-- Disable RLS (for development)
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;

-- OR if you want to enable RLS (for production):
-- ALTER TABLE students ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Then create policies (example):
-- CREATE POLICY "Allow public read" ON students FOR SELECT USING (true);
-- CREATE POLICY "Allow public insert" ON students FOR INSERT WITH CHECK (true);
```

## Step 5: Get API Keys

1. Go to **Settings** → **API** in Supabase Dashboard
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** Long string starting with `eyJ...`

## Step 6: Update Environment Variables

Open `teacher/.env.local` and update:

```env
# ============================================
# DATABASE: Supabase (PostgreSQL)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjc5...
```

## Step 7: Test Connection

Run this command to start your development server:

```bash
cd teacher
npm run dev
```

Your application should now connect to Supabase! 🎉

## Step 8: Verify Data (Optional)

You can view your data in Supabase Dashboard:
1. Go to **Table Editor**
2. Select `students`, `exams`, or `submissions`
3. View and edit data directly

## Troubleshooting

### Connection Error
```
❌ Supabase connection failed
```

**Solution:**
- Check if SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Make sure tables are created (run SQL from Step 3)
- Check if RLS is disabled (or policies are set)

### JSONB Column Errors
```
Error: column "questions" is of type jsonb
```

**Solution:**
- Questions and answers are stored as JSONB (JSON in PostgreSQL)
- Make sure you're sending proper JSON format
- Arrays and objects are automatically handled

### Unique Constraint Error
```
Error: duplicate key value violates unique constraint
```

**Solution:**
- This means student already submitted this exam
- Check the duplicate prevention logic in your code

## Migration from MongoDB

If you have existing MongoDB data, you can export and import:

### Export from MongoDB
```bash
# Export students
mongoexport --db=exam-platform --collection=students --out=students.json

# Export exams
mongoexport --db=exam-platform --collection=exams --out=exams.json

# Export submissions
mongoexport --db=exam-platform --collection=submissions --out=submissions.json
```

### Import to Supabase
1. Go to **Table Editor** in Supabase
2. Select table (students/exams/submissions)
3. Click **Insert** → **Import Data**
4. Upload JSON file

Or use the Supabase client to bulk insert:
```typescript
import { supabase } from './lib/supabase';

// Read JSON files
const students = JSON.parse(fs.readFileSync('students.json'));

// Bulk insert
const { error } = await supabase
  .from('students')
  .insert(students);
```

## Benefits of Supabase

✅ **Free Tier:**
- 500MB database
- 2GB bandwidth
- 50,000 monthly active users

✅ **Built-in Features:**
- Real-time subscriptions
- Auto-generated REST API
- Row Level Security
- PostgreSQL (ACID compliant)
- Built-in authentication

✅ **Developer Experience:**
- Visual table editor
- SQL editor
- Logs and monitoring
- Automatic backups

✅ **Production Ready:**
- Hosted on AWS
- Daily backups
- Point-in-time recovery
- 99.9% uptime SLA

## Next Steps

1. ✅ Create Supabase account
2. ✅ Create project
3. ✅ Run SQL to create tables
4. ✅ Get API keys
5. ✅ Update .env.local
6. ✅ Test connection
7. 🚀 Start building!

## Support

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **Issue?** Check browser console for errors

---

**Your project is now using Supabase! 🎉**

The best part? Your existing code doesn't need any changes - the database layer handles everything!
