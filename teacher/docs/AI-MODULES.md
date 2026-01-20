# AI Modules Documentation

## Overview

This project uses **4 AI providers** with an intelligent fallback system to generate exam questions automatically. The AI modules are the core feature that makes this platform unique and powerful.

---

## AI Providers Used

### 1. **Google AI (Gemini Flash)** - PRIMARY ✅

**Status:** Active and Configured

**Model:** `gemini-flash-latest` (Gemini 2.0 Flash)

**Why Used:**
- ✅ **Fast:** Generates questions in 2-5 seconds
- ✅ **Free:** Generous free tier available
- ✅ **High Quality:** Produces accurate, educational questions
- ✅ **Real-time:** Instant question generation
- ✅ **Multilingual:** Supports multiple languages (English, Kannada, etc.)

**Configuration:**
```env
GOOGLE_GENAI_API_KEY=AIzaSy...
NEXT_PUBLIC_GOOGLE_GENAI_API_KEY=AIzaSy...
```

**How It Works:**
1. Teacher enters exam details (subject, topic, difficulty)
2. System sends request to Google AI with detailed prompt
3. AI generates unique questions with options and explanations
4. Questions are parsed and displayed to teacher
5. Teacher can review and create the exam

**File:** `src/ai/google-ai-client.ts`

---

### 2. **Claude AI (Anthropic)** - OPTIONAL ⚠️

**Status:** Not Configured (Code Ready)

**Model:** `claude-sonnet-4-20250514` (Claude Sonnet 4.5)

**Why Available:**
- ✅ **Backup:** Alternative if Google AI fails
- ✅ **High Quality:** Excellent for complex questions
- ✅ **Detailed Explanations:** Provides thorough reasoning

**To Enable:**
```env
ANTHROPIC_API_KEY=your_key_here
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_key_here
```

**File:** `src/ai/claude-client.ts`

---

### 3. **OpenAI (GPT)** - OPTIONAL ⚠️

**Status:** Not Configured (Code Ready)

**Model:** `gpt-3.5-turbo` / `gpt-4o-mini`

**Why Available:**
- ✅ **Backup:** Another fallback option
- ✅ **Reliable:** Well-tested and stable
- ✅ **Versatile:** Good for various question types

**To Enable:**
```env
OPENAI_API_KEY=your_key_here
NEXT_PUBLIC_OPENAI_API_KEY=your_key_here
```

**File:** `src/ai/openai-client.ts`

---

### 4. **Free AI (Hugging Face)** - FALLBACK 🆓

**Status:** Always Available (No API Key Needed)

**Model:** `mistralai/Mistral-7B-Instruct-v0.2`

**Why Used:**
- ✅ **No Cost:** Completely free, no API key required
- ✅ **Always Available:** Works when other providers fail
- ✅ **Smart Templates:** Uses intelligent question templates
- ✅ **Offline Capable:** Can work without external APIs

**How It Works:**
- Uses Hugging Face's free inference API
- Falls back to smart template-based generation if API fails
- Generates contextual questions based on subject and topic

**File:** `src/ai/free-ai-client.ts`

---

## Unified AI System

**File:** `src/ai/unified-ai.ts`

### Priority Order:

```
1. Google AI (Gemini) ← Currently Active ✅
   ↓ (if fails)
2. Claude AI (if configured)
   ↓ (if fails)
3. OpenAI (if configured)
   ↓ (if fails)
4. Free AI (Hugging Face) ← Always works
```

### Key Features:

**1. Automatic Fallback**
- If one provider fails, automatically tries the next
- Ensures questions are always generated
- No manual intervention needed

**2. Smart Question Generation**
- Supports MCQ, True/False, Fill in the Blanks
- Handles "Auto Mixed" difficulty and question types
- Generates unique questions every time

**3. Real-time Processing**
- Questions generated instantly
- No pre-generated question banks
- Fresh, unique content every time

**4. Multilingual Support**
- Works with any language (English, Kannada, Hindi, etc.)
- AI understands context in multiple languages
- Generates culturally appropriate questions

---

## Importance of AI Modules in This Project

### 1. **Core Functionality** 🎯
- AI is the **heart** of the exam generation system
- Without AI, teachers would need to manually create all questions
- Saves **hours of work** for teachers

### 2. **Scalability** 📈
- Can generate unlimited questions instantly
- No question bank limitations
- Supports any subject, any topic

### 3. **Quality Assurance** ✅
- AI generates educationally sound questions
- Includes explanations for correct answers
- Maintains consistent difficulty levels

### 4. **Flexibility** 🔄
- Adapts to any subject or topic
- Supports multiple question types
- Handles different difficulty levels

### 5. **Cost Efficiency** 💰
- Uses free tier of Google AI
- Fallback to completely free options
- No expensive question bank subscriptions

---

## How AI Modules Work in This Project

### Step-by-Step Process:

#### 1. **Teacher Input**
```
Subject: Biology
Topic: Eyes
Difficulty: Medium
Question Type: MCQ
Number of Questions: 5
Duration: 60 minutes
```

#### 2. **AI Request**
```javascript
// System calls unified AI
const questions = await generateQuestions({
  subject: "Biology",
  topic: "Eyes",
  difficulty: "Medium",
  questionType: "MCQ",
  numberOfQuestions: 5
});
```

#### 3. **AI Processing**
- Google AI receives detailed prompt
- Generates unique questions about the topic
- Creates 4 options for each MCQ
- Provides correct answers and explanations

#### 4. **Response Parsing**
```json
[
  {
    "questionText": "What is the function of the retina?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "C",
    "explanation": "The retina converts light into neural signals..."
  }
]
```

#### 5. **Display to Teacher**
- Questions shown in preview
- Teacher can review and edit
- Can regenerate if not satisfied

#### 6. **Exam Creation**
- Questions saved to database
- Exam becomes available to students
- Results automatically graded using AI-provided answers

---

## AI Module Architecture

```
┌─────────────────────────────────────┐
│   Teacher Dashboard (Frontend)      │
│   - Create Exam Form                │
│   - Subject, Topic, Difficulty      │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   Unified AI System                  │
│   (src/ai/unified-ai.ts)            │
│   - Manages all AI providers        │
│   - Handles fallback logic          │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┬───────────┬──────────┐
       ↓               ↓           ↓          ↓
┌──────────┐   ┌──────────┐  ┌─────────┐  ┌─────────┐
│ Google AI│   │ Claude AI│  │ OpenAI  │  │ Free AI │
│ (Active) │   │(Optional)│  │(Optional)│  │(Fallback)│
└──────────┘   └──────────┘  └─────────┘  └─────────┘
       │               │           │          │
       └───────┬───────┴───────────┴──────────┘
               ↓
┌─────────────────────────────────────┐
│   Generated Questions                │
│   - Parsed and validated            │
│   - Stored in database              │
└─────────────────────────────────────┘
```

---

## Benefits of This AI System

### For Teachers:
- ✅ **Time Saving:** Generate 10 questions in 5 seconds
- ✅ **Quality:** Professional, educational questions
- ✅ **Variety:** Unlimited unique questions
- ✅ **Flexibility:** Any subject, any topic
- ✅ **Easy:** Just fill a form, AI does the rest

### For Students:
- ✅ **Fair:** Unique questions for each exam
- ✅ **Educational:** Questions with explanations
- ✅ **Challenging:** Appropriate difficulty levels
- ✅ **Diverse:** Different question types

### For the Platform:
- ✅ **Scalable:** Handles unlimited exams
- ✅ **Reliable:** Multiple fallback options
- ✅ **Cost-effective:** Uses free tiers
- ✅ **Maintainable:** Clean, modular code

---

## Example: AI-Generated Question

**Input:**
```
Subject: Biology
Topic: Eyes
Difficulty: Medium
Type: MCQ
```

**AI Output:**
```
Question: "A patient shifts focus from a mountain range (far distance) 
to a book held 30 cm away (near distance). Which anatomical change 
correctly describes the eye's accommodation process required for 
clear near vision?"

Options:
A) Ciliary muscles relax, increasing tension on the suspensory ligaments
B) Ciliary muscles contract, decreasing tension on the suspensory ligaments ✓
C) The pupil dilates significantly to increase light
D) The vitreous humor volume decreases

Correct Answer: B

Explanation: "For near vision, the eye needs more refractive power. 
The ciliary muscles contract, moving the ciliary body inward. This 
relaxes the tension on the suspensory ligaments, allowing the elastic 
lens to assume its natural, rounder, and thicker shape, increasing 
its focusing power."
```

---

## Configuration Files

### Environment Variables:
```env
# Google AI (Active)
GOOGLE_GENAI_API_KEY=AIzaSy...
NEXT_PUBLIC_GOOGLE_GENAI_API_KEY=AIzaSy...

# Claude AI (Optional)
# ANTHROPIC_API_KEY=sk-ant-...
# NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...

# OpenAI (Optional)
# OPENAI_API_KEY=sk-...
# NEXT_PUBLIC_OPENAI_API_KEY=sk-...
```

### API Keys Setup:
See `docs/API-KEYS.md` for detailed instructions on obtaining API keys.

---

## Testing AI Modules

### Test if AI is working:

1. Go to: `http://localhost:3003/dashboard/create-exam`
2. Fill in exam details
3. Click "Generate Questions"
4. Check console for: `✅ SUCCESS! Google AI generated X questions`

### Troubleshooting:

**If AI fails:**
1. Check API key is configured in `.env.local`
2. Verify API key is valid
3. Check console for error messages
4. System will automatically fallback to Free AI

---

## Future Enhancements

### Planned Features:
- 🔄 Question difficulty analysis
- 🎯 Adaptive question generation based on student performance
- 📊 AI-powered answer evaluation for descriptive questions
- 🌐 More language support
- 🤖 AI teaching assistant for students

---

## Summary

This project uses **4 AI providers** with **Google AI (Gemini)** as the primary engine. The AI modules are essential for:

1. ✅ **Automatic question generation**
2. ✅ **Time-saving for teachers**
3. ✅ **Unlimited unique content**
4. ✅ **High-quality educational questions**
5. ✅ **Reliable fallback system**

**Current Status:** Fully functional with Google AI active and working perfectly! 🎉

---

**Last Updated:** November 29, 2025
**AI Provider:** Google AI (Gemini Flash Latest)
**Status:** ✅ Active and Working
