# Modules Documentation

## Overview
This document provides a comprehensive guide to all modules used in the AssessAI Teacher Exam Platform. Each module is documented with its purpose, benefits, usage examples, and file locations.

---

## Table of Contents
1. [Core Modules](#core-modules)
2. [AI Integration Modules](#ai-integration-modules)
3. [Database & Storage Modules](#database--storage-modules)
4. [UI Component Modules](#ui-component-modules)
5. [Authentication Modules](#authentication-modules)
6. [Exam Management Modules](#exam-management-modules)
7. [PDF Generation Modules](#pdf-generation-modules)
8. [Utility Modules](#utility-modules)
9. [Form Management Modules](#form-management-modules)
10. [Anti-Cheating Modules](#anti-cheating-modules)

---

## Core Modules

### 1. Next.js App Router Module
**Package:** `next@15.0.2`  
**Type:** Framework Core  
**Location:** `teacher/src/app/`

**Purpose:**
- Provides file-based routing system
- Enables server-side rendering (SSR)
- Supports API routes
- Manages layouts and pages

**Benefits:**
- ✅ Automatic code splitting
- ✅ Built-in optimization
- ✅ Server and client components
- ✅ SEO-friendly rendering
- ✅ Fast page loads

**How to Use:**
```typescript
// Create a page: app/dashboard/page.tsx
export default function DashboardPage() {
  return <div>Dashboard Content</div>;
}

// Create an API route: app/api/exams/route.ts
export async function GET() {
  return NextResponse.json({ data: [] });
}

// Create a layout: app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return <div><Sidebar />{children}</div>;
}
```

**Key Features:**
- File-based routing
- Nested layouts
- Loading states
- Error boundaries
- Metadata API

---

### 2. React Module
**Package:** `react@18.3.1`, `react-dom@18.3.1`  
**Type:** UI Library  
**Location:** Throughout `teacher/src/`

**Purpose:**
- Build interactive user interfaces
- Manage component state
- Handle user interactions
- Create reusable components

**Benefits:**
- ✅ Component-based architecture
- ✅ Virtual DOM for performance
- ✅ Rich ecosystem
- ✅ Concurrent features
- ✅ Hooks for state management

**How to Use:**
```typescript
import { useState, useEffect } from 'react';

function ExamTimer() {
  const [time, setTime] = useState(3600);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => t - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return <div>Time: {time}s</div>;
}
```

**Key Hooks Used:**
- `useState` - Local state
- `useEffect` - Side effects
- `useCallback` - Memoized callbacks
- `useMemo` - Memoized values
- `useRef` - DOM references

---

### 3. TypeScript Module
**Package:** `typescript@5`  
**Type:** Language  
**Location:** All `.ts` and `.tsx` files

**Purpose:**
- Add static typing to JavaScript
- Catch errors at compile time
- Improve code documentation
- Enable better IDE support

**Benefits:**
- ✅ Type safety
- ✅ Better refactoring
- ✅ IntelliSense support
- ✅ Reduced runtime errors
- ✅ Self-documenting code

**How to Use:**
```typescript
// Define interfaces
interface Exam {
  id: string;
  title: string;
  questions: Question[];
}

// Type-safe functions
function calculateScore(answers: Answer[]): number {
  return answers.filter(a => a.isCorrect).length;
}

// Generic types
function findById<T extends { id: string }>(
  items: T[], 
  id: string
): T | undefined {
  return items.find(item => item.id === id);
}
```

**Configuration:** `tsconfig.json`

---

## AI Integration Modules

### ⚠️ IMPORTANT: Pre-Trained vs Custom-Trained Models

**Our Approach:**
> 🔴 **WE DO NOT TRAIN OUR OWN AI MODELS**  
> 🟢 **WE USE PRE-TRAINED MODELS FROM MAJOR AI PROVIDERS**

**What This Means:**

**Pre-Trained Models (What We Use):**
- ✅ Models trained by Google, OpenAI, Anthropic, Hugging Face
- ✅ Trained on massive datasets (billions of parameters)
- ✅ Accessed via API calls
- ✅ No training infrastructure needed
- ✅ No GPU clusters required
- ✅ No machine learning expertise needed
- ✅ Pay-per-use or free tier
- ✅ Regular updates from providers

**Custom-Trained Models (What We DON'T Do):**
- ❌ Training our own models from scratch
- ❌ Fine-tuning existing models
- ❌ Collecting training data
- ❌ Running GPU clusters
- ❌ Managing ML infrastructure
- ❌ Hiring ML engineers
- ❌ Spending months on training

**Why Pre-Trained Models?**

1. **Cost-Effective**
   - No expensive GPU infrastructure
   - No training costs
   - Pay only for API usage
   - Free tiers available

2. **Time-Efficient**
   - Immediate availability
   - No training time (weeks/months)
   - No model optimization needed
   - Ready to use out-of-the-box

3. **Quality**
   - State-of-the-art performance
   - Trained on massive datasets
   - Billions of parameters
   - Continuous improvements

4. **Maintenance**
   - No model updates needed
   - Providers handle improvements
   - Automatic bug fixes
   - Regular feature additions

5. **Expertise**
   - No ML expertise required
   - Simple API integration
   - Well-documented
   - Community support

**Our Role:**
- 📝 Write effective prompts
- 🔌 Integrate with AI APIs
- 🔄 Handle responses
- 🎨 Format output
- 🛡️ Implement fallbacks
- ⚡ Optimize API calls

**Technical Comparison:**

| Aspect | Pre-Trained (Our Approach) | Custom-Trained |
|--------|---------------------------|----------------|
| Training | Done by provider | We would do it |
| Cost | API fees only | $100K+ infrastructure |
| Time | Immediate | Months of training |
| Expertise | Basic API knowledge | ML/AI experts needed |
| Maintenance | Provider handles | We would handle |
| Updates | Automatic | Manual retraining |
| Quality | State-of-the-art | Depends on our data |
| Infrastructure | None needed | GPU clusters needed |

---

### 4. Unified AI Module
**Location:** `teacher/src/ai/unified-ai.ts`  
**Type:** Custom Integration Module  
**Dependencies:** Multiple AI providers  
**Model Type:** ⚠️ **PRE-TRAINED MODELS** (Not Custom Trained)

**Purpose:**
- Provide single interface for multiple AI providers
- Automatic fallback between providers
- Generate exam questions using AI
- Handle chat responses

**Important Note:**
> 🔴 **We DO NOT train our own AI models**  
> 🟢 **We USE pre-trained models from major AI providers**  
> 
> This module is an **integration layer** that connects to existing AI services. We leverage powerful pre-trained models from Google, OpenAI, Anthropic, and Hugging Face rather than training custom models.

**Why Pre-Trained Models?**
- ✅ No training infrastructure needed
- ✅ Access to state-of-the-art models
- ✅ Regular updates from providers
- ✅ Cost-effective (no GPU clusters)
- ✅ Immediate availability
- ✅ Proven reliability
- ✅ Multi-language support

**Benefits:**
- ✅ Provider-agnostic interface
- ✅ Automatic failover
- ✅ No vendor lock-in
- ✅ Consistent API
- ✅ Easy to add new providers
- ✅ No model training required
- ✅ No ML expertise needed

**How to Use:**
```typescript
import { generateQuestions } from '@/ai/unified-ai';

// This calls pre-trained AI models via API
const questions = await generateQuestions({
  subject: 'Computer Science',
  topic: 'Data Structures',
  difficulty: 'Medium',
  questionType: 'MCQ',
  numberOfQuestions: 10,
});
```

**Supported Pre-Trained Models:**
1. **Google AI (Gemini)** - Primary
   - Model: `gemini-flash-latest`
   - Pre-trained by Google
   - General-purpose LLM

2. **Claude (Anthropic)** - Fallback
   - Model: `claude-3-sonnet-20240229`
   - Pre-trained by Anthropic
   - Excellent reasoning

3. **OpenAI (GPT)** - Fallback
   - Model: `gpt-4` or `gpt-3.5-turbo`
   - Pre-trained by OpenAI
   - Widely used LLM

4. **Hugging Face** - Free fallback
   - Various pre-trained models
   - Open-source community

**Key Functions:**
- `generateQuestions()` - Generate exam questions
- `generateChatResponse()` - AI chatbot
- `getAvailableAIProvider()` - Check configured provider

**Technical Details:**
- **Training:** None (uses pre-trained models)
- **Fine-tuning:** None (uses models as-is)
- **Customization:** Prompt engineering only
- **Infrastructure:** API calls only (no GPU needed)

---

### 5. Google AI Module
**Package:** `@google/generative-ai@0.21.0`  
**Location:** `teacher/src/ai/google-ai-client.ts`  
**Type:** Pre-Trained AI Provider (API Integration)  
**Model Type:** ⚠️ **PRE-TRAINED** by Google

**Purpose:**
- Generate questions using Google Gemini
- Fast, real-time question generation
- High-quality, contextual questions

**Model Information:**
- **Model Name:** `gemini-flash-latest`
- **Trained By:** Google DeepMind
- **Training Data:** Google's proprietary dataset
- **Parameters:** Billions (exact number not disclosed)
- **Training:** Pre-trained by Google (not by us)
- **Access Method:** API calls only
- **Customization:** None (prompt engineering only)

**What We Do:**
- ✅ Send prompts via API
- ✅ Receive generated text
- ✅ Parse and format responses
- ❌ Do NOT train the model
- ❌ Do NOT fine-tune the model
- ❌ Do NOT have access to model weights

**Benefits:**
- ✅ Fast response times
- ✅ Latest Gemini Flash model
- ✅ Cost-effective (free tier)
- ✅ High-quality output
- ✅ Supports structured output
- ✅ No training infrastructure needed
- ✅ Regular updates from Google

**How to Use:**
```typescript
import { generateQuestionsWithGoogleAI } from '@/ai/google-ai-client';

// This sends a request to Google's pre-trained model
const questions = await generateQuestionsWithGoogleAI({
  subject: 'Biology',
  topic: 'Cell Structure',
  difficulty: 'Easy',
  questionType: 'True/False',
  numberOfQuestions: 5,
});
```

**Configuration:**
```env
GOOGLE_GENAI_API_KEY=your_api_key_here
```

**Technical Architecture:**
```
Our App → API Request → Google's Servers → Pre-trained Gemini Model → Response → Our App
```

---

### 6. Claude AI Module
**Package:** `@anthropic-ai/sdk@0.68.0`  
**Location:** `teacher/src/ai/claude-client.ts`  
**Type:** Pre-Trained AI Provider (API Integration)  
**Model Type:** ⚠️ **PRE-TRAINED** by Anthropic

**Purpose:**
- Generate questions using Claude Sonnet
- Provide detailed explanations
- Handle complex reasoning

**Model Information:**
- **Model Name:** `claude-3-sonnet-20240229`
- **Trained By:** Anthropic
- **Training Data:** Anthropic's proprietary dataset
- **Parameters:** Billions (exact number not disclosed)
- **Training:** Pre-trained by Anthropic (not by us)
- **Access Method:** API calls only
- **Customization:** None (prompt engineering only)

**What We Do:**
- ✅ Send prompts via API
- ✅ Receive generated text
- ✅ Parse and format responses
- ❌ Do NOT train the model
- ❌ Do NOT fine-tune the model
- ❌ Do NOT have access to model weights

**Benefits:**
- ✅ Excellent reasoning capabilities
- ✅ Detailed explanations
- ✅ Context awareness
- ✅ Safety features
- ✅ Long context window (200K tokens)
- ✅ No training infrastructure needed
- ✅ Constitutional AI principles

**How to Use:**
```typescript
import { generateQuestionsWithClaude } from '@/ai/claude-client';

// This sends a request to Anthropic's pre-trained model
const questions = await generateQuestionsWithClaude({
  subject: 'Physics',
  topic: 'Quantum Mechanics',
  difficulty: 'Hard',
  questionType: 'Fill in the Blanks',
  numberOfQuestions: 8,
});
```

**Configuration:**
```env
ANTHROPIC_API_KEY=your_api_key_here
```

**Technical Architecture:**
```
Our App → API Request → Anthropic's Servers → Pre-trained Claude Model → Response → Our App
```

---

### 7. OpenAI Module
**Package:** `openai@6.7.0`  
**Location:** `teacher/src/ai/openai-client.ts`  
**Type:** Pre-Trained AI Provider (API Integration)  
**Model Type:** ⚠️ **PRE-TRAINED** by OpenAI

**Purpose:**
- Generate questions using GPT models
- Provide alternative AI provider
- Handle chat completions

**Model Information:**
- **Model Names:** `gpt-4`, `gpt-3.5-turbo`
- **Trained By:** OpenAI
- **Training Data:** OpenAI's proprietary dataset
- **Parameters:** 
  - GPT-4: ~1.76 trillion parameters (estimated)
  - GPT-3.5: ~175 billion parameters
- **Training:** Pre-trained by OpenAI (not by us)
- **Access Method:** API calls only
- **Customization:** None (prompt engineering only)

**What We Do:**
- ✅ Send prompts via API
- ✅ Receive generated text
- ✅ Parse and format responses
- ❌ Do NOT train the model
- ❌ Do NOT fine-tune the model
- ❌ Do NOT have access to model weights

**Benefits:**
- ✅ Proven reliability
- ✅ Wide adoption
- ✅ Good documentation
- ✅ Consistent output
- ✅ Multiple models available
- ✅ No training infrastructure needed
- ✅ Regular model updates

**How to Use:**
```typescript
import { generateQuestionsWithOpenAI } from '@/ai/openai-client';

// This sends a request to OpenAI's pre-trained model
const questions = await generateQuestionsWithOpenAI({
  subject: 'Mathematics',
  topic: 'Calculus',
  difficulty: 'Medium',
  questionType: 'MCQ',
  numberOfQuestions: 10,
});
```

**Configuration:**
```env
OPENAI_API_KEY=your_api_key_here
```

**Technical Architecture:**
```
Our App → API Request → OpenAI's Servers → Pre-trained GPT Model → Response → Our App
```

---

### 8. Free AI Module (Hugging Face)
**Package:** `@huggingface/inference@4.13.0`  
**Location:** `teacher/src/ai/free-ai-client.ts`  
**Type:** Pre-Trained AI Provider (Free API Integration)  
**Model Type:** ⚠️ **PRE-TRAINED** by Hugging Face Community

**Purpose:**
- Provide free AI fallback
- No API key required
- Generate basic questions

**Model Information:**
- **Models:** Various open-source models
- **Trained By:** Hugging Face community & partners
- **Training Data:** Various open datasets
- **Parameters:** Varies by model (millions to billions)
- **Training:** Pre-trained by community (not by us)
- **Access Method:** Free API calls
- **Customization:** None (prompt engineering only)

**What We Do:**
- ✅ Send prompts via API
- ✅ Receive generated text
- ✅ Parse and format responses
- ❌ Do NOT train the model
- ❌ Do NOT fine-tune the model
- ❌ Do NOT host the model

**Benefits:**
- ✅ No cost (completely free)
- ✅ No API key needed
- ✅ Always available
- ✅ Good for testing
- ✅ Fallback option
- ✅ Open-source models
- ✅ Community-driven

**How to Use:**
```typescript
import { generateQuestionsWithFreeAI } from '@/ai/free-ai-client';

// This sends a request to Hugging Face's pre-trained models
const questions = await generateQuestionsWithFreeAI({
  subject: 'History',
  topic: 'World War II',
  difficulty: 'Easy',
  questionType: 'True/False',
  numberOfQuestions: 5,
});
```

**No Configuration Required** - Works out of the box!

**Technical Architecture:**
```
Our App → API Request → Hugging Face Servers → Pre-trained Open-Source Model → Response → Our App
```

---

### 9. AI Flows Module
**Location:** `teacher/src/ai/flows/`  
**Type:** Workflow Module

**Purpose:**
- Orchestrate AI operations
- Handle complex workflows
- Manage fallbacks

**Sub-modules:**

**a) Generate Exam Questions Flow**
- **Location:** `teacher/src/ai/flows/generate-exam-questions.ts`
- **Purpose:** Complete workflow for question generation
- **Features:** Validation, fallbacks, mixed questions

**b) AI Chatbot Support Flow**
- **Location:** `teacher/src/ai/flows/provide-ai-chatbot-support.ts`
- **Purpose:** Student support chatbot
- **Features:** Context-aware responses

**How to Use:**
```typescript
import { generateExamQuestions } from '@/ai/flows/generate-exam-questions';

const result = await generateExamQuestions({
  topic: 'Data Structures - Arrays',
  difficulty: 'Auto Mixed',
  questionType: 'Auto Mixed',
  numberOfQuestions: 15,
  subject: 'Computer Science',
});

console.log(`Generated ${result.questions.length} questions`);
console.log(`Provider used: ${result.provider}`);
```

---

## Database & Storage Modules

### 10. Database Module
**Location:** `teacher/src/lib/db.ts`  
**Type:** Data Access Layer  
**Dependencies:** MongoDB, File Storage

**Purpose:**
- Unified database interface
- Support multiple storage backends
- Automatic fallback to file storage

**Benefits:**
- ✅ Storage-agnostic
- ✅ Easy to switch backends
- ✅ Consistent API
- ✅ Automatic fallbacks
- ✅ Type-safe operations

**How to Use:**
```typescript
import { db } from '@/lib/db';

// Students
const students = await db.students.getAll();
const student = await db.students.findById('123');
await db.students.add(newStudent);

// Exams
const exams = await db.exams.getAll();
const exam = await db.exams.findById('exam-123');
await db.exams.add(newExam);

// Submissions
const submissions = await db.submissions.getAll();
const examSubs = await db.submissions.findByExamId('exam-123');
await db.submissions.add(newSubmission);
```

**Supported Backends:**
1. MongoDB (if configured)
2. File-based storage (default)
3. Vercel KV (optional)

---

### 11. File Storage Module
**Location:** `teacher/src/lib/file-storage.ts`  
**Type:** Persistence Layer  
**Dependencies:** Node.js fs module

**Purpose:**
- Store data in JSON files
- Provide persistent storage
- Work without database setup

**Benefits:**
- ✅ No database required
- ✅ Easy to backup
- ✅ Human-readable
- ✅ Version control friendly
- ✅ Simple deployment

**How to Use:**
```typescript
import { fileStorage } from '@/lib/file-storage';

// Read all students
const students = fileStorage.students.getAll();

// Add new student
const newStudent = {
  id: 'student-123',
  name: 'John Doe',
  usn: 'CS001',
  email: 'john@example.com',
  semester: '5',
  registeredAt: new Date().toISOString(),
};
fileStorage.students.add(newStudent);

// Find by ID
const student = fileStorage.students.findById('student-123');
```

**Data Files:**
- `teacher/data/students.json`
- `teacher/data/exams.json`
- `teacher/data/submissions.json`

**Features:**
- Automatic file creation
- JSON formatting
- Type-safe operations
- Synchronous I/O

---

### 12. MongoDB Module
**Package:** `mongodb@6.21.0`  
**Type:** Database Driver  
**Location:** Used in `teacher/src/lib/db.ts`

**Purpose:**
- Connect to MongoDB database
- Perform CRUD operations
- Handle production data

**Benefits:**
- ✅ Scalable
- ✅ Flexible schema
- ✅ Rich queries
- ✅ Aggregation pipeline
- ✅ Cloud-ready

**How to Use:**
```typescript
// Configured in db.ts
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const database = client.db('exam-platform');

// Collections
const students = database.collection('students');
const exams = database.collection('exams');
const submissions = database.collection('submissions');
```

**Configuration:**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
```

---

### 13. Vercel KV Module
**Package:** `@vercel/kv@3.0.0`  
**Type:** Key-Value Store  
**Location:** Optional integration

**Purpose:**
- Fast key-value storage
- Edge-compatible
- Session management

**Benefits:**
- ✅ Ultra-fast reads
- ✅ Global distribution
- ✅ Simple API
- ✅ Serverless-friendly
- ✅ Built for Vercel

**How to Use:**
```typescript
import { kv } from '@vercel/kv';

// Store data
await kv.set('exam:123', examData);

// Retrieve data
const exam = await kv.get('exam:123');

// Delete data
await kv.del('exam:123');

// List keys
const keys = await kv.keys('exam:*');
```

**Configuration:**
```env
KV_URL=your_kv_url
KV_REST_API_URL=your_api_url
KV_REST_API_TOKEN=your_token
```

---

## UI Component Modules

### 14. Radix UI Module
**Package:** `@radix-ui/react-*` (Multiple packages)  
**Type:** UI Primitives  
**Location:** `teacher/src/components/ui/`

**Purpose:**
- Provide accessible UI components
- Unstyled, customizable primitives
- WAI-ARIA compliant

**Benefits:**
- ✅ Fully accessible
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Customizable styling
- ✅ Production-ready

**Components Used:**
- Dialog, Alert Dialog
- Dropdown Menu, Select
- Checkbox, Radio Group
- Tabs, Accordion
- Toast, Tooltip
- Progress, Slider
- And more...

**How to Use:**
```typescript
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

function ExamDialog() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogTitle>Exam Details</DialogTitle>
        <p>Content here</p>
      </DialogContent>
    </Dialog>
  );
}
```

**Styling:** Tailwind CSS classes

---

### 15. Lucide Icons Module
**Package:** `lucide-react@0.436.0`  
**Type:** Icon Library  
**Location:** Throughout components

**Purpose:**
- Provide consistent icons
- Beautiful, modern design
- Tree-shakeable

**Benefits:**
- ✅ 1000+ icons
- ✅ Customizable size/color
- ✅ Lightweight
- ✅ TypeScript support
- ✅ Consistent design

**How to Use:**
```typescript
import { 
  FileText, 
  Users, 
  Trophy, 
  Download,
  AlertTriangle 
} from 'lucide-react';

function Dashboard() {
  return (
    <div>
      <FileText className="h-6 w-6 text-primary" />
      <Users className="h-5 w-5" />
      <Trophy className="h-8 w-8 text-yellow-500" />
    </div>
  );
}
```

**Common Icons Used:**
- `FileText` - Exams
- `Users` - Students
- `Trophy` - Top performers
- `Download` - PDF downloads
- `AlertTriangle` - Warnings
- `Check` - Success
- `X` - Close/Error

---

### 16. Recharts Module
**Package:** `recharts@2.12.7`  
**Type:** Charting Library  
**Location:** `teacher/src/components/dashboard/performance-analytics.tsx`

**Purpose:**
- Display data visualizations
- Create interactive charts
- Show performance metrics

**Benefits:**
- ✅ React-based
- ✅ Responsive
- ✅ Customizable
- ✅ Multiple chart types
- ✅ Animation support

**How to Use:**
```typescript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function PerformanceChart({ data }) {
  return (
    <BarChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="score" fill="#8b5cf6" />
    </BarChart>
  );
}
```

**Chart Types:**
- Bar Chart
- Line Chart
- Pie Chart
- Area Chart

---

## Authentication Modules

### 17. Login Form Module
**Location:** `teacher/src/components/auth/login-form.tsx`  
**Type:** Authentication Component  
**Dependencies:** React Hook Form, Zod

**Purpose:**
- Handle teacher authentication
- Validate credentials
- Manage login state

**Benefits:**
- ✅ Form validation
- ✅ Error handling
- ✅ User feedback
- ✅ Secure authentication
- ✅ Session management

**How to Use:**
```typescript
import { LoginForm } from '@/components/auth/login-form';

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
```

**Features:**
- Email validation
- Password validation
- Remember me option
- Error messages
- Loading states

---

### 18. Student Login Module
**Location:** `teacher/src/components/exam/student-login.tsx`  
**Type:** Verification Component

**Purpose:**
- Verify student identity
- Check registration status
- Prevent unauthorized access

**Benefits:**
- ✅ Identity verification
- ✅ Registration check
- ✅ Duplicate prevention
- ✅ Secure access
- ✅ User-friendly

**How to Use:**
```typescript
import { StudentLogin } from '@/components/exam/student-login';

function ExamPage() {
  const handleLogin = async (data) => {
    // Verify student
    const isValid = await verifyStudent(data);
    if (isValid) {
      setStudentData(data);
    }
  };

  return <StudentLogin examTitle="Midterm" onLogin={handleLogin} />;
}
```

**Validation:**
- Name matching
- USN verification
- Email confirmation
- Case-insensitive comparison

---

## Exam Management Modules

### 19. Create Exam Form Module
**Location:** `teacher/src/components/dashboard/create-exam-form.tsx`  
**Type:** Exam Creation Component  
**Dependencies:** React Hook Form, Zod, AI Module

**Purpose:**
- Create new exams
- Generate AI questions
- Configure exam settings

**Benefits:**
- ✅ AI-powered generation
- ✅ Form validation
- ✅ Real-time preview
- ✅ Flexible configuration
- ✅ Link sharing

**How to Use:**
```typescript
import { CreateExamForm } from '@/components/dashboard/create-exam-form';

function CreateExamPage() {
  return (
    <div className="container mx-auto p-6">
      <h1>Create New Exam</h1>
      <CreateExamForm />
    </div>
  );
}
```

**Features:**
- Subject/topic selection
- Difficulty levels
- Question types
- AI generation
- Manual editing
- Link generation
- WhatsApp/Email sharing

---

### 20. Exam Form Module
**Location:** `teacher/src/components/exam/exam-form.tsx`  
**Type:** Exam Taking Component

**Purpose:**
- Display exam questions
- Collect student answers
- Handle submission
- Track progress

**Benefits:**
- ✅ Clean interface
- ✅ Progress tracking
- ✅ Auto-save
- ✅ Validation
- ✅ Timer integration

**How to Use:**
```typescript
import { ExamForm } from '@/components/exam/exam-form';

function ExamPage() {
  return (
    <ExamForm
      examId="exam-123"
      studentData={studentData}
      examData={examData}
      timeRemaining={timeRemaining}
      isTerminated={false}
      onSubmitStart={() => setSubmitting(true)}
      tabSwitchCount={0}
      terminationReason=""
    />
  );
}
```

**Features:**
- Question navigation
- Answer selection
- Progress indicator
- Submit confirmation
- Anti-cheating integration

---

### 21. Exam Results Module
**Location:** `teacher/src/components/dashboard/exam-results.tsx`  
**Type:** Results Display Component

**Purpose:**
- Display exam results
- Show statistics
- Generate PDFs
- Track cheating

**Benefits:**
- ✅ Comprehensive statistics
- ✅ Student rankings
- ✅ PDF downloads
- ✅ Cheating detection
- ✅ Performance metrics

**How to Use:**
```typescript
import { ExamResults } from '@/components/dashboard/exam-results';

function ResultsPage() {
  return (
    <ExamResults
      examId="exam-123"
      examTitle="Midterm Exam"
      submissions={submissions}
    />
  );
}
```

**Features:**
- Total submissions
- Average score
- Pass rate
- Cheating count
- Top performers
- Individual PDFs
- Combined PDF

---

### 22. Performance Analytics Module
**Location:** `teacher/src/components/dashboard/performance-analytics.tsx`  
**Type:** Analytics Component  
**Dependencies:** Recharts

**Purpose:**
- Visualize performance data
- Show trends
- Identify patterns
- AI insights

**Benefits:**
- ✅ Visual analytics
- ✅ AI-powered insights
- ✅ Strengths/weaknesses
- ✅ Improvement suggestions
- ✅ Interactive charts

**How to Use:**
```typescript
import { PerformanceAnalytics } from '@/components/dashboard/performance-analytics';

function AnalyticsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1>Performance Analytics</h1>
      <PerformanceAnalytics />
    </div>
  );
}
```

**Features:**
- Marks distribution
- Top performers
- AI analysis
- Strengths identification
- Weakness detection
- Improvement suggestions

---

### 23. Student Table Module
**Location:** `teacher/src/components/dashboard/student-table.tsx`  
**Type:** Data Display Component

**Purpose:**
- Display registered students
- Show student details
- Manage student data

**Benefits:**
- ✅ Sortable columns
- ✅ Search functionality
- ✅ Pagination
- ✅ Export options
- ✅ Responsive design

**How to Use:**
```typescript
import { StudentTable } from '@/components/dashboard/student-table';

function StudentsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1>Registered Students</h1>
      <StudentTable students={students} />
    </div>
  );
}
```

**Features:**
- Student list
- Registration dates
- Contact information
- Semester details
- Search/filter

---

### 24. Generate Link Button Module
**Location:** `teacher/src/components/dashboard/generate-link-button.tsx`  
**Type:** Link Sharing Component

**Purpose:**
- Generate registration links
- Share via multiple channels
- Provide instructions

**Benefits:**
- ✅ Easy sharing
- ✅ Multiple channels
- ✅ Copy to clipboard
- ✅ WhatsApp integration
- ✅ Email integration

**How to Use:**
```typescript
import { GenerateLinkButton } from '@/components/dashboard/generate-link-button';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <GenerateLinkButton />
    </div>
  );
}
```

**Features:**
- Link generation
- Copy button
- WhatsApp share
- Email share
- Mobile instructions

---

## PDF Generation Modules

### 25. PDF Generator Module
**Location:** `teacher/src/lib/pdf-generator.ts`  
**Type:** Document Generation  
**Dependencies:** jsPDF, jspdf-autotable

**Purpose:**
- Generate student result PDFs
- Create class summary PDFs
- Include AI explanations
- Format professional documents

**Benefits:**
- ✅ Professional formatting
- ✅ AI explanations
- ✅ Multi-page support
- ✅ Proper text encoding
- ✅ Customizable layout

**How to Use:**
```typescript
import { generateStudentPDF, generateClassPDF } from '@/lib/pdf-generator';

// Individual student PDF
const studentResult = {
  studentName: 'John Doe',
  studentUSN: 'CS001',
  studentEmail: 'john@example.com',
  score: 8,
  totalQuestions: 10,
  percentage: 80,
  submittedAt: new Date().toISOString(),
  answers: [...],
};

const examData = {
  title: 'Midterm Exam',
  subject: 'Computer Science',
  topic: 'Data Structures',
  difficulty: 'Medium',
  questions: [...],
};

const doc = generateStudentPDF(studentResult, examData);
doc.save('student_result.pdf');

// Class PDF
const results = [studentResult1, studentResult2, ...];
const classDoc = generateClassPDF(results, examData);
classDoc.save('class_results.pdf');
```

**Features:**
- Question-by-question breakdown
- AI explanations
- Color-coded results
- Score summary
- Multi-page support
- HTML entity decoding

---

### 26. jsPDF Module
**Package:** `jspdf@3.0.3`  
**Type:** PDF Library  
**Location:** Used in PDF generator

**Purpose:**
- Create PDF documents
- Add text and graphics
- Generate downloadable files

**Benefits:**
- ✅ Client-side generation
- ✅ No server required
- ✅ Customizable
- ✅ Cross-browser
- ✅ Lightweight

**How to Use:**
```typescript
import { jsPDF } from 'jspdf';

const doc = new jsPDF();

// Add text
doc.setFontSize(20);
doc.text('Exam Results', 20, 20);

// Add shapes
doc.setFillColor(139, 92, 246);
doc.rect(10, 30, 190, 10, 'F');

// Save
doc.save('document.pdf');
```

---

### 27. jsPDF AutoTable Module
**Package:** `jspdf-autotable@5.0.2`  
**Type:** PDF Table Plugin

**Purpose:**
- Create tables in PDFs
- Format tabular data
- Auto-pagination

**Benefits:**
- ✅ Automatic layout
- ✅ Styling options
- ✅ Page breaks
- ✅ Custom headers
- ✅ Cell formatting

**How to Use:**
```typescript
import autoTable from 'jspdf-autotable';

autoTable(doc, {
  startY: 50,
  head: [['Name', 'Score', 'Status']],
  body: [
    ['John Doe', '85%', 'Pass'],
    ['Jane Smith', '92%', 'Pass'],
  ],
  theme: 'striped',
  headStyles: { fillColor: [66, 139, 202] },
});
```

---

## Form Management Modules

### 28. React Hook Form Module
**Package:** `react-hook-form@7.53.0`  
**Type:** Form Library  
**Location:** Throughout form components

**Purpose:**
- Manage form state
- Handle validation
- Minimize re-renders
- Improve performance

**Benefits:**
- ✅ Minimal re-renders
- ✅ Easy validation
- ✅ TypeScript support
- ✅ Small bundle size
- ✅ Great DX

**How to Use:**
```typescript
import { useForm } from 'react-hook-form';

function ExamForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title', { required: true })} />
      {errors.title && <span>This field is required</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Features:**
- Field registration
- Validation
- Error handling
- Form state
- Submit handling

---

### 29. Zod Module
**Package:** `zod@3.23.8`  
**Type:** Schema Validation  
**Location:** Form schemas throughout

**Purpose:**
- Define data schemas
- Runtime validation
- Type inference
- Error messages

**Benefits:**
- ✅ TypeScript-first
- ✅ Runtime safety
- ✅ Type inference
- ✅ Composable
- ✅ Clear errors

**How to Use:**
```typescript
import { z } from 'zod';

const examSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subject: z.string().min(2),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  numberOfQuestions: z.number().min(1).max(180),
});

type ExamInput = z.infer<typeof examSchema>;

// Validate
const result = examSchema.safeParse(data);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

**Common Validations:**
- String length
- Number ranges
- Email format
- Enum values
- Custom rules

---

### 30. Hookform Resolvers Module
**Package:** `@hookform/resolvers@3.9.0`  
**Type:** Validation Bridge

**Purpose:**
- Connect Zod with React Hook Form
- Enable schema validation
- Provide error messages

**Benefits:**
- ✅ Seamless integration
- ✅ Type safety
- ✅ Automatic errors
- ✅ Multiple resolvers
- ✅ Easy setup

**How to Use:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return <form>...</form>;
}
```

---

## Utility Modules

### 31. Tailwind CSS Module
**Package:** `tailwindcss@3.4.1`  
**Type:** CSS Framework  
**Location:** `teacher/tailwind.config.ts`, `teacher/src/app/globals.css`

**Purpose:**
- Utility-first styling
- Responsive design
- Custom design system
- Consistent UI

**Benefits:**
- ✅ Rapid development
- ✅ Small bundle size
- ✅ Customizable
- ✅ Responsive utilities
- ✅ Dark mode support

**How to Use:**
```typescript
function Card() {
  return (
    <div className="
      bg-white 
      rounded-lg 
      shadow-md 
      p-6 
      hover:shadow-lg 
      transition-shadow
      md:p-8
      lg:p-10
    ">
      <h2 className="text-2xl font-bold text-gray-900">Title</h2>
      <p className="text-gray-600 mt-2">Description</p>
    </div>
  );
}
```

**Custom Configuration:**
- Colors
- Fonts
- Animations
- Breakpoints
- Spacing

---

### 32. Framer Motion Module
**Package:** `framer-motion@12.23.24`  
**Type:** Animation Library  
**Location:** Throughout components

**Purpose:**
- Create smooth animations
- Handle gestures
- Animate layouts
- Scroll animations

**Benefits:**
- ✅ Declarative API
- ✅ Spring physics
- ✅ Gesture support
- ✅ Layout animations
- ✅ Performance

**How to Use:**
```typescript
import { motion } from 'framer-motion';

function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <h2>Animated Content</h2>
    </motion.div>
  );
}
```

**Common Animations:**
- Fade in/out
- Slide in/out
- Scale
- Rotate
- Stagger children

---

### 33. Class Variance Authority Module
**Package:** `class-variance-authority@0.7.0`  
**Type:** Variant Management

**Purpose:**
- Manage component variants
- Type-safe class names
- Conditional styling

**Benefits:**
- ✅ Type safety
- ✅ Variant management
- ✅ Composable
- ✅ IntelliSense
- ✅ Clean API

**How to Use:**
```typescript
import { cva } from 'class-variance-authority';

const button = cva('px-4 py-2 rounded-md font-semibold', {
  variants: {
    intent: {
      primary: 'bg-primary text-white',
      secondary: 'bg-secondary text-gray-900',
      danger: 'bg-red-600 text-white',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },
});

// Usage
<button className={button({ intent: 'danger', size: 'lg' })}>
  Delete
</button>
```

---

### 34. Date-fns Module
**Package:** `date-fns@3.6.0`  
**Type:** Date Utility

**Purpose:**
- Format dates
- Calculate differences
- Parse dates
- Manipulate dates

**Benefits:**
- ✅ Lightweight
- ✅ Immutable
- ✅ Tree-shakeable
- ✅ TypeScript support
- ✅ Comprehensive

**How to Use:**
```typescript
import { format, formatDistance, addDays } from 'date-fns';

// Format date
const formatted = format(new Date(), 'PPpp');
// "Apr 29, 2023, 9:30 AM"

// Relative time
const relative = formatDistance(new Date(2023, 0, 1), new Date());
// "3 months ago"

// Add days
const future = addDays(new Date(), 7);
```

---

## Anti-Cheating Modules

### 35. Tab Switch Detection Module
**Location:** `teacher/src/app/exam/[id]/page.tsx`  
**Type:** Security Feature

**Purpose:**
- Detect tab switching
- Prevent cheating
- Auto-submit on violations
- Track violations

**Benefits:**
- ✅ Prevents cheating
- ✅ Fair exams
- ✅ Automatic enforcement
- ✅ Violation tracking
- ✅ Configurable limits

**How to Use:**
```typescript
useEffect(() => {
  if (!studentData || isExamTerminated) return;

  const handleVisibilityChange = () => {
    if (document.hidden) {
      setTabSwitchCount((prev) => {
        const newCount = prev + 1;
        
        if (newCount >= 2) {
          setIsExamTerminated(true);
          setTerminationReason("Tab switching detected");
          // Auto-submit
          submitExam();
        }
        return newCount;
      });
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
}, [studentData, isExamTerminated]);
```

**Features:**
- Visibility API
- Warning system
- Auto-submission
- Violation logging

---

### 36. Window Blur Detection Module
**Location:** `teacher/src/app/exam/[id]/page.tsx`  
**Type:** Security Feature

**Purpose:**
- Detect window switching
- Prevent Alt+Tab cheating
- Track application switches

**Benefits:**
- ✅ Detects app switching
- ✅ Laptop-friendly
- ✅ Comprehensive monitoring
- ✅ Fair enforcement

**How to Use:**
```typescript
useEffect(() => {
  if (!studentData || isExamTerminated) return;

  const handleWindowBlur = () => {
    setWindowBlurCount((prev) => prev + 1);
    setTabSwitchCount((tabCount) => {
      const totalCount = tabCount + 1;
      
      if (totalCount >= 2) {
        setIsExamTerminated(true);
        setTerminationReason("Switched to another application");
        submitExam();
      }
      return totalCount;
    });
  };

  window.addEventListener("blur", handleWindowBlur);
  return () => window.removeEventListener("blur", handleWindowBlur);
}, [studentData, isExamTerminated]);
```

---

### 37. Copy/Paste Prevention Module
**Location:** `teacher/src/app/exam/[id]/page.tsx`  
**Type:** Security Feature

**Purpose:**
- Prevent copying questions
- Block pasting answers
- Disable context menu
- Block keyboard shortcuts

**Benefits:**
- ✅ Prevents copying
- ✅ Blocks pasting
- ✅ Disables right-click
- ✅ Blocks shortcuts
- ✅ User alerts

**How to Use:**
```typescript
useEffect(() => {
  if (!studentData || isExamTerminated) return;

  const preventCopy = (e: ClipboardEvent) => {
    e.preventDefault();
    alert("⚠️ Copying is disabled during the exam!");
  };

  const preventContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    alert("⚠️ Right-click is disabled during the exam!");
  };

  const preventKeyboardShortcuts = (e: KeyboardEvent) => {
    if (
      (e.ctrlKey && ['c', 'x', 'v', 'a', 'p'].includes(e.key)) ||
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && e.key === 'I')
    ) {
      e.preventDefault();
      alert("⚠️ This action is disabled during the exam!");
    }
  };

  document.addEventListener("copy", preventCopy);
  document.addEventListener("contextmenu", preventContextMenu);
  document.addEventListener("keydown", preventKeyboardShortcuts);

  return () => {
    document.removeEventListener("copy", preventCopy);
    document.removeEventListener("contextmenu", preventContextMenu);
    document.removeEventListener("keydown", preventKeyboardShortcuts);
  };
}, [studentData, isExamTerminated]);
```

---

### 38. Activity Monitoring Module
**Location:** `teacher/src/app/exam/[id]/page.tsx`  
**Type:** Security Feature

**Purpose:**
- Track user activity
- Detect idle time
- Monitor engagement
- Identify anomalies

**Benefits:**
- ✅ Engagement tracking
- ✅ Idle detection
- ✅ Anomaly identification
- ✅ Investigation support

**How to Use:**
```typescript
useEffect(() => {
  if (!studentData || isExamTerminated) return;

  const updateActivity = () => {
    setLastActivityTime(Date.now());
  };

  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
  events.forEach(event => {
    document.addEventListener(event, updateActivity);
  });

  const idleCheckInterval = setInterval(() => {
    const idleTime = Date.now() - lastActivityTime;
    const idleMinutes = Math.floor(idleTime / 60000);
    
    if (idleMinutes >= 5) {
      console.warn(`⚠️ Student idle for ${idleMinutes} minutes`);
    }
  }, 30000);

  return () => {
    events.forEach(event => {
      document.removeEventListener(event, updateActivity);
    });
    clearInterval(idleCheckInterval);
  };
}, [studentData, isExamTerminated, lastActivityTime]);
```

---

## Shared Modules

### 39. Chatbot Module
**Location:** `teacher/src/components/shared/chatbot.tsx`  
**Type:** Support Component  
**Dependencies:** AI Module

**Purpose:**
- Provide student support
- Answer questions
- AI-powered responses
- Context-aware help

**Benefits:**
- ✅ 24/7 availability
- ✅ Instant responses
- ✅ Context-aware
- ✅ Reduces teacher load
- ✅ Improves UX

**How to Use:**
```typescript
import { Chatbot } from '@/components/shared/chatbot';

function ExamPage() {
  return (
    <div>
      <ExamContent />
      <Chatbot />
    </div>
  );
}
```

**Features:**
- AI responses
- Conversation history
- Context awareness
- Helpful suggestions
- Floating UI

---

### 40. Toast Notification Module
**Location:** `teacher/src/hooks/use-toast.ts`, `teacher/src/components/ui/toast.tsx`  
**Type:** Notification System  
**Dependencies:** Radix UI Toast

**Purpose:**
- Show notifications
- Provide feedback
- Display errors
- Confirm actions

**Benefits:**
- ✅ Non-intrusive
- ✅ Auto-dismiss
- ✅ Customizable
- ✅ Accessible
- ✅ Action support

**How to Use:**
```typescript
import { toast } from '@/hooks/use-toast';

function handleSubmit() {
  try {
    // Submit logic
    toast({
      title: "Success!",
      description: "Exam submitted successfully.",
    });
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to submit exam.",
    });
  }
}

// With action
toast({
  title: "Exam saved",
  description: "Your progress has been saved.",
  action: <Button size="sm">Undo</Button>,
});
```

**Variants:**
- Default
- Destructive (error)
- Success
- Warning

---

## Module Integration Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App Router                   │
│                    (Core Framework)                      │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐      ┌────────▼────────┐
│   UI Modules   │      │  Backend Modules │
│                │      │                  │
│ • Radix UI     │      │ • Database       │
│ • Tailwind     │      │ • File Storage   │
│ • Framer       │      │ • AI Integration │
│ • Recharts     │      │ • PDF Generator  │
└───────┬────────┘      └────────┬─────────┘
        │                        │
        └────────────┬───────────┘
                     │
        ┌────────────▼────────────┐
        │   Feature Modules       │
        │                         │
        │ • Authentication        │
        │ • Exam Management       │
        │ • Anti-Cheating         │
        │ • Analytics             │
        └─────────────────────────┘
```

---

## Module Dependencies

### Critical Dependencies
1. **Next.js** → React, TypeScript
2. **AI Module** → Google AI, Claude, OpenAI
3. **Database** → MongoDB, File Storage
4. **PDF Generator** → jsPDF, AutoTable
5. **Forms** → React Hook Form, Zod

### Optional Dependencies
1. **MongoDB** → Can use File Storage
2. **AI Providers** → Fallback to Free AI
3. **Vercel KV** → Optional caching

---

## Best Practices

### 1. Module Organization
- Keep modules focused and single-purpose
- Use clear naming conventions
- Document dependencies
- Maintain separation of concerns

### 2. Import Management
```typescript
// ✅ Good: Organized imports
import { useState } from 'react';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';

// ❌ Bad: Mixed imports
import { useState, db, Button } from 'various-places';
```

### 3. Module Reusability
- Create generic, reusable modules
- Avoid tight coupling
- Use dependency injection
- Support configuration

### 4. Performance
- Lazy load heavy modules
- Use dynamic imports
- Tree-shake unused code
- Minimize bundle size

---

## Conclusion

The AssessAI platform uses a modular architecture with 40+ well-defined modules, each serving a specific purpose. This modular approach provides:

- **Maintainability** - Easy to update individual modules
- **Scalability** - Add new features without affecting existing code
- **Testability** - Test modules independently
- **Reusability** - Use modules across different parts of the app
- **Flexibility** - Swap implementations easily

All modules are documented, type-safe, and follow best practices for modern web development.

---

**Last Updated:** November 29, 2024  
**Version:** 0.1.0  
**Total Modules Documented:** 40
