    -- ============================================
    -- SUPABASE SCHEMA FOR AI EXAM PLATFORM
    -- ============================================
    -- Run this in Supabase SQL Editor
    -- Go to: https://supabase.com/dashboard/project/_/sql/new

    -- ============================================
    -- 1. STUDENTS TABLE
    -- ============================================
    CREATE TABLE IF NOT EXISTS students (
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
    CREATE INDEX IF NOT EXISTS idx_students_teacherId ON students("teacherId");
    CREATE INDEX IF NOT EXISTS idx_students_usn ON students(usn);
    CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

    -- ============================================
    -- 2. EXAMS TABLE
    -- ============================================
    CREATE TABLE IF NOT EXISTS exams (
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
    "teacherId" TEXT,
    created_at TIMESTAMP DEFAULT NOW()
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_exams_teacherId ON exams("teacherId");
    CREATE INDEX IF NOT EXISTS idx_exams_createdAt ON exams("createdAt");

    -- ============================================
    -- 3. SUBMISSIONS TABLE
    -- ============================================
    CREATE TABLE IF NOT EXISTS submissions (
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
    "teacherId" TEXT,
    created_at TIMESTAMP DEFAULT NOW()
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_submissions_examId ON submissions("examId");
    CREATE INDEX IF NOT EXISTS idx_submissions_studentUSN ON submissions("studentUSN");
    CREATE INDEX IF NOT EXISTS idx_submissions_teacherId ON submissions("teacherId");
    CREATE INDEX IF NOT EXISTS idx_submissions_submittedAt ON submissions("submittedAt");

    -- Composite index for duplicate check
    CREATE UNIQUE INDEX IF NOT EXISTS idx_submissions_exam_student 
    ON submissions("examId", "studentUSN");

    -- ============================================
    -- 4. DISABLE ROW LEVEL SECURITY (for development)
    -- ============================================
    -- This allows public access for now
    -- You can enable RLS later for production security

    ALTER TABLE students DISABLE ROW LEVEL SECURITY;
    ALTER TABLE exams DISABLE ROW LEVEL SECURITY;
    ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;

    -- ============================================
    -- SUCCESS!
    -- ============================================
    -- Tables created successfully!
    -- You can now close this and run: npm run dev
