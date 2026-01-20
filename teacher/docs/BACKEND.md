# Backend Documentation

## Overview
This document provides comprehensive information about the backend architecture of the AssessAI Teacher Exam Platform, including API routes, database operations, server-side logic, and data flow.

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [API Routes](#api-routes)
3. [Database Layer](#database-layer)
4. [Data Models](#data-models)
5. [Server-Side Logic](#server-side-logic)
6. [Authentication & Security](#authentication--security)
7. [Error Handling](#error-handling)
8. [Performance Optimization](#performance-optimization)
9. [Deployment](#deployment)

---

## Architecture Overview

### Technology Stack

**Framework:**
- Next.js 15.0.2 (App Router)
- Server-side rendering (SSR)
- API Routes
- Server Actions

**Runtime:**
- Node.js
- Edge Runtime (optional)

**Database:**
- MongoDB (optional)
- File-based storage (default)
- Vercel KV (optional)

**AI Integration:**
- Google AI (Gemini)
- OpenAI (GPT)
- Anthropic (Claude)
- Hugging Face

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│                  React Components                        │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP Requests
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js API Routes Layer                    │
│  /api/exams  /api/students  /api/submissions           │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐         ┌──────────────┐
│ Database     │         │ AI Services  │
│ Layer        │         │              │
│              │         │ • Google AI  │
│ • MongoDB    │         │ • OpenAI     │
│ • File Store │         │ • Claude     │
│ • Vercel KV  │         │ • HuggingFace│
└──────────────┘         └──────────────┘
```

### Request Flow

1. **Client Request** → Browser sends HTTP request
2. **API Route** → Next.js route handler receives request
3. **Validation** → Request data validated
4. **Business Logic** → Process request (AI, calculations, etc.)
5. **Database** → Store/retrieve data
6. **Response** → Send JSON response to client

---

## API Routes

### Base URL
- **Development:** `http://localhost:3003/api`
- **Production:** `https://your-domain.com/api`

### Route Structure

```
/api
├── /exams
│   ├── GET     - Fetch all exams
│   ├── POST    - Create new exam
│   └── /[id]
│       ├── /pdf
│       │   └── GET - Download class results PDF
│       └── /question-paper
│           └── GET - Download question paper PDF
│
├── /students
│   ├── GET     - Fetch all students
│   └── POST    - Register new student
│
└── /submissions
    ├── GET     - Fetch all submissions
    ├── POST    - Submit exam answers
    └── /[id]
        └── /pdf
            └── GET - Download student result PDF
```

---

## API Routes

### 1. Exams API

#### GET /api/exams
**Purpose:** Fetch all exams

**Request:**
```http
GET /api/exams HTTP/1.1
Host: localhost:3003
```

**Response:**
```json
[
  {
    "id": "exam-123",
    "title": "Midterm Exam",
    "subject": "Computer Science",
    "topic": "Data Structures",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "numberOfQuestions": 10,
    "duration": 60,
    "questions": [...],
    "createdAt": "2024-11-29T10:00:00.000Z",
    "createdBy": "teacher"
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

**Location:** `teacher/src/app/api/exams/route.ts`

**Implementation:**
```typescript
export async function GET() {
  try {
    const exams = await db.exams.getAll();
    return NextResponse.json(exams);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exams' }, 
      { status: 500 }
    );
  }
}
```

---

#### POST /api/exams
**Purpose:** Create new exam

**Request:**
```http
POST /api/exams HTTP/1.1
Host: localhost:3003
Content-Type: application/json

{
  "title": "Final Exam",
  "subject": "Mathematics",
  "topic": "Calculus",
  "difficulty": "Hard",
  "questionType": "MCQ",
  "numberOfQuestions": 15,
  "duration": 90,
  "questions": [
    {
      "questionText": "What is the derivative of x²?",
      "options": ["2x", "x", "x²", "2"],
      "correctAnswer": "2x",
      "explanation": "Using power rule: d/dx(x²) = 2x"
    }
  ],
  "createdBy": "teacher"
}
```

**Response:**
```json
{
  "id": "exam-456",
  "title": "Final Exam",
  "subject": "Mathematics",
  "topic": "Calculus",
  "difficulty": "Hard",
  "questionType": "MCQ",
  "numberOfQuestions": 15,
  "duration": 90,
  "questions": [...],
  "createdAt": "2024-11-29T11:00:00.000Z",
  "createdBy": "teacher"
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Invalid request data
- `500` - Server error

**Location:** `teacher/src/app/api/exams/route.ts`

**Implementation:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newExam = {
      ...body,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
    };
    
    await db.exams.add(newExam);
    
    return NextResponse.json(newExam, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to save exam' }, 
      { status: 500 }
    );
  }
}
```

---

### 2. Students API

#### GET /api/students
**Purpose:** Fetch all registered students

**Request:**
```http
GET /api/students HTTP/1.1
Host: localhost:3003
```

**Response:**
```json
[
  {
    "id": "student-123",
    "name": "John Doe",
    "usn": "CS001",
    "email": "john@example.com",
    "semester": "5",
    "registeredAt": "2024-11-29T09:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

**Location:** `teacher/src/app/api/students/route.ts`

---

#### POST /api/students
**Purpose:** Register new student

**Request:**
```http
POST /api/students HTTP/1.1
Host: localhost:3003
Content-Type: application/json

{
  "name": "Jane Smith",
  "usn": "CS002",
  "email": "jane@example.com",
  "semester": "6"
}
```

**Response:**
```json
{
  "id": "student-456",
  "name": "Jane Smith",
  "usn": "CS002",
  "email": "jane@example.com",
  "semester": "6",
  "registeredAt": "2024-11-29T10:30:00.000Z"
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Invalid request data
- `500` - Server error

**Location:** `teacher/src/app/api/students/route.ts`

---

### 3. Submissions API

#### GET /api/submissions
**Purpose:** Fetch exam submissions

**Request:**
```http
GET /api/submissions HTTP/1.1
Host: localhost:3003

# Or filter by exam
GET /api/submissions?examId=exam-123 HTTP/1.1
```

**Response:**
```json
[
  {
    "id": "sub-123",
    "examId": "exam-123",
    "studentId": "student-123",
    "studentName": "John Doe",
    "studentUSN": "CS001",
    "studentEmail": "john@example.com",
    "answers": [
      {
        "questionIndex": 0,
        "answer": "2x",
        "isCorrect": true
      }
    ],
    "score": 8,
    "totalQuestions": 10,
    "submittedAt": "2024-11-29T12:00:00.000Z",
    "wasTerminated": false,
    "tabSwitchCount": 0,
    "cheatingDetected": false
  }
]
```

**Query Parameters:**
- `examId` (optional) - Filter by exam ID

**Status Codes:**
- `200` - Success
- `500` - Server error

**Location:** `teacher/src/app/api/submissions/route.ts`

---

#### POST /api/submissions
**Purpose:** Submit exam answers

**Request:**
```http
POST /api/submissions HTTP/1.1
Host: localhost:3003
Content-Type: application/json

{
  "examId": "exam-123",
  "studentId": "student-123",
  "studentName": "John Doe",
  "studentUSN": "CS001",
  "studentEmail": "john@example.com",
  "answers": [
    {
      "questionIndex": 0,
      "answer": "2x",
      "isCorrect": true
    }
  ],
  "score": 8,
  "totalQuestions": 10,
  "wasTerminated": false,
  "timeRemaining": 120,
  "tabSwitchCount": 0,
  "terminationReason": "",
  "cheatingDetected": false
}
```

**Response:**
```json
{
  "id": "sub-456",
  "examId": "exam-123",
  "studentName": "John Doe",
  "score": 8,
  "totalQuestions": 10,
  "submittedAt": "2024-11-29T12:00:00.000Z"
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Invalid request data
- `500` - Server error

**Location:** `teacher/src/app/api/submissions/route.ts`

---

### 4. PDF Generation APIs

#### GET /api/submissions/[id]/pdf
**Purpose:** Download individual student result PDF

**Request:**
```http
GET /api/submissions/sub-123/pdf HTTP/1.1
Host: localhost:3003
```

**Response:**
- Content-Type: `application/pdf`
- Binary PDF file

**Status Codes:**
- `200` - Success
- `404` - Submission not found
- `500` - Server error

**Location:** `teacher/src/app/api/submissions/[id]/pdf/route.ts`

---

#### GET /api/exams/[id]/pdf
**Purpose:** Download class results PDF (all students)

**Request:**
```http
GET /api/exams/exam-123/pdf HTTP/1.1
Host: localhost:3003
```

**Response:**
- Content-Type: `application/pdf`
- Binary PDF file with all student results

**Status Codes:**
- `200` - Success
- `404` - Exam not found or no submissions
- `500` - Server error

**Location:** `teacher/src/app/api/exams/[id]/pdf/route.ts`

---

#### GET /api/exams/[id]/question-paper
**Purpose:** Download question paper PDF

**Request:**
```http
GET /api/exams/exam-123/question-paper HTTP/1.1
Host: localhost:3003
```

**Response:**
- Content-Type: `application/pdf`
- Binary PDF file with questions and answers

**Status Codes:**
- `200` - Success
- `404` - Exam not found
- `500` - Server error

**Location:** `teacher/src/app/api/exams/[id]/question-paper/route.ts`

---

## Database Layer

### Database Abstraction

**Location:** `teacher/src/lib/db.ts`

**Purpose:**
- Provide unified interface for data operations
- Support multiple storage backends
- Automatic fallback mechanism

**Supported Backends:**
1. **MongoDB** (Production)
2. **File Storage** (Development/Default)
3. **Vercel KV** (Optional)

### Database Interface

```typescript
export const db = {
  students: {
    getAll: () => Promise<Student[]>,
    add: (student: Student) => Promise<Student>,
    findById: (id: string) => Promise<Student | null>,
  },
  exams: {
    getAll: () => Promise<Exam[]>,
    add: (exam: Exam) => Promise<Exam>,
    findById: (id: string) => Promise<Exam | null>,
  },
  submissions: {
    getAll: () => Promise<Submission[]>,
    add: (submission: Submission) => Promise<Submission>,
    findByExamId: (examId: string) => Promise<Submission[]>,
  },
};
```

### Storage Backends

#### 1. File-Based Storage (Default)

**Location:** `teacher/src/lib/file-storage.ts`

**How it Works:**
```typescript
// Data stored in JSON files
teacher/data/
├── students.json
├── exams.json
└── submissions.json

// Read operation
function readData<T>(filePath: string): T[] {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Write operation
function writeData<T>(filePath: string, data: T[]): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
```

**Benefits:**
- ✅ No database setup required
- ✅ Easy to backup
- ✅ Human-readable
- ✅ Version control friendly
- ✅ Perfect for development

**Limitations:**
- ❌ Not suitable for high concurrency
- ❌ Limited query capabilities
- ❌ No transactions
- ❌ Single-server only

---

#### 2. MongoDB (Production)

**Location:** Used in `teacher/src/lib/db.ts`

**How it Works:**
```typescript
// Connection
const client = new MongoClient(process.env.MONGODB_URI);
const database = client.db('exam-platform');

// Collections
const students = database.collection('students');
const exams = database.collection('exams');
const submissions = database.collection('submissions');

// Operations
await students.insertOne(newStudent);
await exams.find({}).sort({ createdAt: -1 }).toArray();
await submissions.find({ examId }).toArray();
```

**Benefits:**
- ✅ Scalable
- ✅ Cloud-based
- ✅ Rich queries
- ✅ Transactions
- ✅ Automatic backups
- ✅ Multi-user support

**Configuration:**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/exam-platform
```

---

#### 3. Vercel KV (Optional)

**Location:** Optional integration

**How it Works:**
```typescript
import { kv } from '@vercel/kv';

// Store
await kv.set('exam:123', examData);

// Retrieve
const exam = await kv.get('exam:123');

// Delete
await kv.del('exam:123');
```

**Benefits:**
- ✅ Ultra-fast
- ✅ Edge-compatible
- ✅ Simple API
- ✅ Global distribution

**Use Cases:**
- Session storage
- Caching
- Rate limiting

---

## Data Models

### Student Model

```typescript
interface Student {
  id: string;                    // Unique identifier
  name: string;                  // Full name
  usn: string;                   // University Serial Number
  email: string;                 // Email address
  semester: string;              // Current semester
  registeredAt: string;          // ISO 8601 timestamp
}
```

**Example:**
```json
{
  "id": "lq2x8k9p0a",
  "name": "John Doe",
  "usn": "CS001",
  "email": "john@example.com",
  "semester": "5",
  "registeredAt": "2024-11-29T09:00:00.000Z"
}
```

**Validation Rules:**
- `name`: Min 2 characters
- `usn`: Min 5 characters
- `email`: Valid email format
- `semester`: 1-8

---

### Exam Model

```typescript
interface Exam {
  id: string;                    // Unique identifier
  title: string;                 // Exam title
  subject: string;               // Subject name
  topic: string;                 // Topic/chapter
  difficulty: string;            // Easy, Medium, Hard, Auto Mixed
  questionType: string;          // MCQ, True/False, Fill in the Blanks, Auto Mixed
  numberOfQuestions: number;     // Total questions
  duration: number;              // Duration in minutes
  questions: Question[];         // Array of questions
  createdAt: string;             // ISO 8601 timestamp
  createdBy: string;             // Creator identifier
}

interface Question {
  questionText: string;          // Question content
  options?: string[];            // Answer options (for MCQ/True-False)
  correctAnswer: string;         // Correct answer
  explanation?: string;          // AI-generated explanation
}
```

**Example:**
```json
{
  "id": "exam-lq2x8k9p0a",
  "title": "Midterm Exam",
  "subject": "Computer Science",
  "topic": "Data Structures",
  "difficulty": "Medium",
  "questionType": "MCQ",
  "numberOfQuestions": 10,
  "duration": 60,
  "questions": [
    {
      "questionText": "What is the time complexity of binary search?",
      "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      "correctAnswer": "O(log n)",
      "explanation": "Binary search divides the search space in half each time."
    }
  ],
  "createdAt": "2024-11-29T10:00:00.000Z",
  "createdBy": "teacher"
}
```

**Validation Rules:**
- `title`: Min 3 characters
- `subject`: Min 2 characters
- `numberOfQuestions`: 1-180
- `duration`: 10-180 minutes

---

### Submission Model

```typescript
interface Submission {
  id: string;                    // Unique identifier
  examId: string;                // Reference to exam
  studentId: string;             // Reference to student
  studentName: string;           // Student name
  studentUSN: string;            // Student USN
  studentEmail: string;          // Student email
  answers: Answer[];             // Student answers
  score: number;                 // Total correct answers
  totalQuestions: number;        // Total questions
  submittedAt: string;           // ISO 8601 timestamp
  wasTerminated?: boolean;       // Auto-submitted flag
  timeRemaining?: number;        // Seconds remaining
  tabSwitchCount?: number;       // Tab switch violations
  terminationReason?: string;    // Reason for termination
  cheatingDetected?: boolean;    // Cheating flag
}

interface Answer {
  questionIndex: number;         // Question position
  answer: string;                // Student's answer
  isCorrect: boolean;            // Correctness flag
  explanation?: string;          // AI explanation
}
```

**Example:**
```json
{
  "id": "sub-lq2x8k9p0a",
  "examId": "exam-123",
  "studentId": "student-456",
  "studentName": "John Doe",
  "studentUSN": "CS001",
  "studentEmail": "john@example.com",
  "answers": [
    {
      "questionIndex": 0,
      "answer": "O(log n)",
      "isCorrect": true,
      "explanation": "Correct! Binary search has logarithmic time complexity."
    }
  ],
  "score": 8,
  "totalQuestions": 10,
  "submittedAt": "2024-11-29T12:00:00.000Z",
  "wasTerminated": false,
  "timeRemaining": 120,
  "tabSwitchCount": 0,
  "terminationReason": "",
  "cheatingDetected": false
}
```

---

## Server-Side Logic

### 1. ID Generation

**Algorithm:** Timestamp + Random String  
**Location:** API routes

```typescript
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Example output: "lq2x8k9p0a"
```

**Benefits:**
- Unique across instances
- Sortable by creation time
- URL-safe
- Collision-resistant

---

### 2. Timestamp Generation

**Format:** ISO 8601  
**Location:** API routes

```typescript
const timestamp = new Date().toISOString();
// Output: "2024-11-29T12:00:00.000Z"
```

**Benefits:**
- Standardized format
- Timezone-aware
- Sortable
- Human-readable

---

### 3. Score Calculation

**Location:** Client-side (exam submission)

```typescript
function calculateScore(answers: Answer[], questions: Question[]): number {
  let score = 0;
  
  answers.forEach((answer) => {
    const question = questions[answer.questionIndex];
    if (answer.answer === question.correctAnswer) {
      score++;
      answer.isCorrect = true;
    } else {
      answer.isCorrect = false;
    }
  });
  
  return score;
}
```

---

### 4. AI Question Generation

**Location:** `teacher/src/ai/unified-ai.ts`

**Flow:**
```
1. Receive parameters (subject, topic, difficulty, type, count)
2. Try Google AI (primary)
3. If fails, try Claude
4. If fails, try OpenAI
5. If fails, try Free AI (Hugging Face)
6. If all fail, use fallback templates
7. Return generated questions
```

**Implementation:**
```typescript
export async function generateQuestions(params: AIQuestionParams) {
  // Try Google AI first
  if (isGoogleAIAvailable()) {
    try {
      return await generateQuestionsWithGoogleAI(params);
    } catch (error) {
      console.error('Google AI failed:', error);
    }
  }
  
  // Try Claude
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await generateQuestionsWithClaude(params);
    } catch (error) {
      console.error('Claude failed:', error);
    }
  }
  
  // Try OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      return await generateQuestionsWithOpenAI(params);
    } catch (error) {
      console.error('OpenAI failed:', error);
    }
  }
  
  // Fallback to free AI
  return await generateQuestionsWithFreeAI(params);
}
```

---

### 5. PDF Generation

**Location:** `teacher/src/lib/pdf-generator.ts`

**Process:**
```
1. Fetch submission/exam data
2. Decode HTML entities
3. Create PDF document
4. Add header and metadata
5. Add questions and answers
6. Add AI explanations
7. Handle pagination
8. Generate buffer
9. Return as downloadable file
```

**Implementation:**
```typescript
export function generateStudentPDF(
  studentResult: StudentResult,
  examData: ExamData
): jsPDF {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Exam Result Report', 105, 20, { align: 'center' });
  
  // Add student info
  doc.text(`Name: ${studentResult.studentName}`, 20, 40);
  doc.text(`Score: ${studentResult.score}/${studentResult.totalQuestions}`, 20, 50);
  
  // Add questions with explanations
  studentResult.answers.forEach((answer, index) => {
    const question = examData.questions[answer.questionIndex];
    
    // Question text
    doc.text(`Q${index + 1}: ${question.questionText}`, 20, yPosition);
    
    // Answer
    doc.text(`Your Answer: ${answer.answer}`, 20, yPosition + 10);
    doc.text(`Correct Answer: ${question.correctAnswer}`, 20, yPosition + 20);
    
    // AI Explanation
    doc.text(`Explanation: ${question.explanation}`, 20, yPosition + 30);
  });
  
  return doc;
}
```

---

## Authentication & Security

### 1. Student Verification

**Location:** `teacher/src/app/exam/[id]/page.tsx`

**Process:**
```typescript
async function verifyStudent(data: StudentData) {
  // 1. Fetch all registered students
  const students = await fetch('/api/students').then(r => r.json());
  
  // 2. Find matching student (case-insensitive)
  const registeredStudent = students.find((s: any) => 
    s.usn.toLowerCase() === data.usn.toLowerCase() &&
    s.name.toLowerCase() === data.name.toLowerCase() &&
    s.email.toLowerCase() === data.email.toLowerCase()
  );
  
  // 3. Check if student exists
  if (!registeredStudent) {
    return { error: 'Student not registered' };
  }
  
  // 4. Check for duplicate submission
  const submissions = await fetch('/api/submissions').then(r => r.json());
  const existingSubmission = submissions.find((sub: any) => 
    sub.examId === examId && 
    sub.studentUSN.toLowerCase() === data.usn.toLowerCase()
  );
  
  if (existingSubmission) {
    return { error: 'Already submitted' };
  }
  
  // 5. Allow access
  return { success: true };
}
```

**Security Features:**
- ✅ Case-insensitive matching
- ✅ Multi-field verification
- ✅ Duplicate submission prevention
- ✅ No password required (simplified for exams)

---

### 2. Anti-Cheating Measures

**Location:** `teacher/src/app/exam/[id]/page.tsx`

**Implemented Features:**

**a) Tab Switch Detection**
```typescript
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    tabSwitchCount++;
    if (tabSwitchCount >= 2) {
      autoSubmitExam("Tab switching detected");
    }
  }
});
```

**b) Window Blur Detection**
```typescript
window.addEventListener("blur", () => {
  windowBlurCount++;
  if (windowBlurCount >= 2) {
    autoSubmitExam("Switched to another application");
  }
});
```

**c) Copy/Paste Prevention**
```typescript
document.addEventListener("copy", (e) => {
  e.preventDefault();
  alert("Copying is disabled during the exam!");
});

document.addEventListener("paste", (e) => {
  e.preventDefault();
  alert("Pasting is disabled during the exam!");
});
```

**d) Context Menu Disabled**
```typescript
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  alert("Right-click is disabled during the exam!");
});
```

**e) Keyboard Shortcuts Blocked**
```typescript
document.addEventListener("keydown", (e) => {
  if (
    (e.ctrlKey && ['c', 'x', 'v', 'a', 'p'].includes(e.key)) ||
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && e.key === 'I')
  ) {
    e.preventDefault();
    alert("This action is disabled during the exam!");
  }
});
```

**f) Activity Monitoring**
```typescript
const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
events.forEach(event => {
  document.addEventListener(event, () => {
    lastActivityTime = Date.now();
  });
});

// Check for idle time
setInterval(() => {
  const idleTime = Date.now() - lastActivityTime;
  if (idleTime > 5 * 60 * 1000) { // 5 minutes
    console.warn('Student idle for 5+ minutes');
  }
}, 30000);
```

---

### 3. Data Validation

**Server-Side Validation:**

```typescript
// Validate exam creation
function validateExam(data: any): boolean {
  if (!data.title || data.title.length < 3) {
    throw new Error('Title must be at least 3 characters');
  }
  
  if (!data.subject || data.subject.length < 2) {
    throw new Error('Subject must be at least 2 characters');
  }
  
  if (data.numberOfQuestions < 1 || data.numberOfQuestions > 180) {
    throw new Error('Number of questions must be between 1 and 180');
  }
  
  if (data.duration < 10 || data.duration > 180) {
    throw new Error('Duration must be between 10 and 180 minutes');
  }
  
  return true;
}
```

**Client-Side Validation (Zod):**

```typescript
const examSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subject: z.string().min(2, 'Subject required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Auto Mixed']),
  numberOfQuestions: z.number().min(1).max(180),
  duration: z.number().min(10).max(180),
});
```

---

### 4. Rate Limiting

**Implementation (Optional):**

```typescript
// Simple in-memory rate limiter
const rateLimiter = new Map<string, number[]>();

function checkRateLimit(ip: string, limit: number = 60): boolean {
  const now = Date.now();
  const requests = rateLimiter.get(ip) || [];
  
  // Remove requests older than 1 minute
  const recentRequests = requests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= limit) {
    return false; // Rate limit exceeded
  }
  
  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);
  return true;
}

// Usage in API route
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  if (!checkRateLimit(ip, 60)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  // Process request...
}
```

---

### 5. CORS Configuration

**Location:** `teacher/next.config.js`

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
```

---

## Error Handling

### 1. API Error Responses

**Standard Error Format:**

```typescript
interface ErrorResponse {
  error: string;           // Error message
  details?: any;           // Additional details
  code?: string;           // Error code
}
```

**Example:**
```json
{
  "error": "Failed to fetch exams",
  "details": "Database connection timeout",
  "code": "DB_TIMEOUT"
}
```

---

### 2. Try-Catch Pattern

**All API routes use try-catch:**

```typescript
export async function GET() {
  try {
    const data = await db.exams.getAll();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    );
  }
}
```

---

### 3. Error Logging

**Console Logging:**

```typescript
console.error('API Error:', error);
console.warn('Warning:', message);
console.log('Info:', data);
```

**Production Logging (Optional):**

```typescript
// Use services like Sentry, LogRocket, etc.
import * as Sentry from '@sentry/nextjs';

Sentry.captureException(error);
```

---

### 4. Graceful Degradation

**AI Fallback:**

```typescript
// If Google AI fails, try Claude
// If Claude fails, try OpenAI
// If OpenAI fails, use Free AI
// If all fail, use template questions
```

**Database Fallback:**

```typescript
// If MongoDB fails, use file storage
// If file storage fails, use in-memory storage
```

---

## Performance Optimization

### 1. Caching Strategies

**API Response Caching:**

```typescript
// Cache exam data for 5 minutes
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
```

**In-Memory Caching:**

```typescript
const cache = new Map<string, { data: any; timestamp: number }>();

function getCached(key: string, ttl: number = 300000) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}
```

---

### 2. Database Optimization

**Indexing (MongoDB):**

```typescript
// Create indexes for faster queries
await students.createIndex({ usn: 1 });
await exams.createIndex({ createdAt: -1 });
await submissions.createIndex({ examId: 1, studentUSN: 1 });
```

**Query Optimization:**

```typescript
// ✅ Good: Specific fields
await students.find({}, { projection: { name: 1, usn: 1 } });

// ❌ Bad: All fields
await students.find({});
```

---

### 3. Pagination

**Implementation:**

```typescript
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;
  
  const students = await db.students.getAll();
  const paginated = students.slice(skip, skip + limit);
  
  return NextResponse.json({
    data: paginated,
    page,
    limit,
    total: students.length,
    totalPages: Math.ceil(students.length / limit),
  });
}
```

---

### 4. Compression

**Enable Gzip Compression:**

```javascript
// next.config.js
module.exports = {
  compress: true,
};
```

---

### 5. Code Splitting

**Dynamic Imports:**

```typescript
// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
});
```

---

## Deployment

### 1. Vercel Deployment

**Steps:**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
cd teacher
vercel

# 4. Deploy to production
vercel --prod
```

**Environment Variables:**

```bash
# Add via Vercel Dashboard or CLI
vercel env add GOOGLE_GENAI_API_KEY
vercel env add MONGODB_URI
```

---

### 2. Docker Deployment

**Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3003

CMD ["npm", "start"]
```

**Build and Run:**

```bash
# Build image
docker build -t assessai-teacher .

# Run container
docker run -p 3003:3003 \
  -e GOOGLE_GENAI_API_KEY=xxx \
  -e MONGODB_URI=xxx \
  assessai-teacher
```

---

### 3. Environment Configuration

**Production Checklist:**

- [ ] Set all required environment variables
- [ ] Configure MongoDB connection
- [ ] Set up API keys
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Set up error logging
- [ ] Enable compression
- [ ] Configure caching
- [ ] Set up monitoring
- [ ] Configure backups

---

## API Testing

### Using cURL

**Get all exams:**
```bash
curl http://localhost:3003/api/exams
```

**Create exam:**
```bash
curl -X POST http://localhost:3003/api/exams \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Exam",
    "subject": "Math",
    "topic": "Algebra",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "numberOfQuestions": 5,
    "duration": 30,
    "questions": [],
    "createdBy": "teacher"
  }'
```

**Register student:**
```bash
curl -X POST http://localhost:3003/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "usn": "CS001",
    "email": "john@example.com",
    "semester": "5"
  }'
```

---

### Using Postman

1. Import collection
2. Set base URL: `http://localhost:3003`
3. Test each endpoint
4. Verify responses

---

## Monitoring & Logging

### 1. Server Logs

**Development:**
```bash
npm run dev
# Logs appear in terminal
```

**Production:**
```bash
# View Vercel logs
vercel logs

# Or check platform-specific logs
```

---

### 2. Error Tracking

**Recommended Tools:**
- Sentry
- LogRocket
- Datadog
- New Relic

---

### 3. Performance Monitoring

**Metrics to Track:**
- API response times
- Database query times
- Error rates
- Request counts
- Cache hit rates

---

## Conclusion

The AssessAI backend provides a robust, scalable, and secure foundation for the exam platform. Key features include:

- **RESTful API** - Clean, consistent endpoints
- **Multiple Storage Options** - MongoDB, File Storage, Vercel KV
- **AI Integration** - Multiple providers with fallbacks
- **Security** - Anti-cheating, validation, rate limiting
- **Performance** - Caching, optimization, compression
- **Error Handling** - Graceful degradation, logging
- **Deployment** - Vercel, Docker, custom platforms

---

**Last Updated:** November 29, 2024  
**Version:** 0.1.0  
**API Version:** v1

