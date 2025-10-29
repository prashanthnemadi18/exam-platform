# 🤖 AI-Powered Exam Generation - Complete Setup Guide

## Overview
This system uses AI (OpenAI or Google AI) to generate real-time exam questions based on any subject and topic. The system automatically uses the best available AI provider.

## 🎯 Features

### Real-Time Question Generation
- ✅ Generate questions for ANY subject (Computer Science, History, Biology, etc.)
- ✅ Generate questions for ANY topic within that subject
- ✅ Support for multiple question types (MCQ, True/False, Fill in the Blanks)
- ✅ Adjustable difficulty levels (Easy, Medium, Hard)
- ✅ 1-20 questions per exam
- ✅ Automatic fallback to demo questions if AI is not configured

### AI Providers Supported
1. **OpenAI (Recommended)** - GPT-3.5-Turbo
2. **Google AI** - Gemini Pro
3. **Fallback** - Demo questions for testing

## 🚀 Quick Start

### Step 1: Get an AI API Key

#### Option A: OpenAI (Recommended)
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)
5. **Cost**: ~$0.002 per exam (very cheap!)

#### Option B: Google AI
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. **Cost**: Free tier available

### Step 2: Configure Your Project

1. Create a `.env.local` file in the `teacher` folder:
```bash
# For OpenAI (Recommended)
OPENAI_API_KEY=sk-your-actual-key-here

# OR for Google AI
GOOGLE_GENAI_API_KEY=your-google-key-here
```

2. Restart your development server:
```bash
npm run dev
```

### Step 3: Create Your First AI-Generated Exam

1. Go to http://localhost:3003/dashboard/create-exam
2. Fill in the form:
   - **Exam Title**: "Midterm Exam 2025"
   - **Subject**: "Computer Science" (or ANY subject)
   - **Topics**: "Data Structures, Algorithms" (or ANY topics)
   - **Difficulty**: Medium
   - **Question Type**: MCQ
   - **Number of Questions**: 5
   - **Duration**: 60 minutes

3. Click "Generate Questions with AI"
4. Wait 5-10 seconds for AI to generate questions
5. Review the generated questions
6. Click "Save Exam & Publish"
7. Share the exam link with students!

## 📋 How It Works

### Architecture

```
User Input (Subject + Topic)
    ↓
Unified AI Client
    ↓
┌─────────────┬──────────────┬──────────────┐
│  OpenAI     │  Google AI   │  Fallback    │
│  (Primary)  │  (Secondary) │  (Demo)      │
└─────────────┴──────────────┴──────────────┘
    ↓
Generated Questions
    ↓
Save to Database
    ↓
Generate Shareable Link
```

### Question Generation Process

1. **Input Validation**: Validates subject, topic, difficulty, type
2. **AI Provider Selection**: Automatically selects OpenAI → Google AI → Fallback
3. **Prompt Engineering**: Creates optimized prompt for the AI
4. **AI Generation**: Sends request to AI provider
5. **Response Parsing**: Extracts and validates questions
6. **Quality Check**: Ensures questions match requirements
7. **Return Results**: Sends questions back to UI

## 🎨 Example Subjects & Topics

### Computer Science
- **Data Structures**: Arrays, Linked Lists, Trees, Graphs
- **Algorithms**: Sorting, Searching, Dynamic Programming
- **Networks**: OSI Model, TCP/IP, HTTP/HTTPS
- **Databases**: SQL, NoSQL, Normalization
- **Programming**: Python, JavaScript, Java

### Mathematics
- **Calculus**: Derivatives, Integrals, Limits
- **Linear Algebra**: Matrices, Vectors, Eigenvalues
- **Statistics**: Probability, Distributions, Hypothesis Testing
- **Geometry**: Triangles, Circles, Trigonometry

### Physics
- **Mechanics**: Newton's Laws, Motion, Energy
- **Thermodynamics**: Heat, Entropy, Laws
- **Electromagnetism**: Electric Fields, Magnetic Fields
- **Optics**: Light, Reflection, Refraction

### Biology
- **Cell Biology**: Cell Structure, Organelles, Mitosis
- **Genetics**: DNA, RNA, Inheritance
- **Ecology**: Ecosystems, Food Chains, Biodiversity
- **Human Anatomy**: Organs, Systems, Functions

### History
- **World War II**: Causes, Events, Consequences
- **Ancient Civilizations**: Egypt, Rome, Greece
- **Industrial Revolution**: Inventions, Impact, Changes

## 🔧 Advanced Configuration

### Using Environment Variables

```bash
# .env.local

# OpenAI Configuration
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-3.5-turbo  # or gpt-4 for better quality

# Google AI Configuration
GOOGLE_GENAI_API_KEY=your-key-here

# Database
MONGODB_URI=your-mongodb-connection-string
```

### Customizing AI Behavior

Edit `teacher/src/ai/openai-client.ts`:

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',  // Change to 'gpt-4' for better quality
  temperature: 0.7,         // 0.0 = deterministic, 1.0 = creative
  max_tokens: 2000,         // Maximum response length
});
```

## 📊 Cost Estimation

### OpenAI Pricing (GPT-3.5-Turbo)
- **Input**: $0.0015 per 1K tokens
- **Output**: $0.002 per 1K tokens
- **Average exam**: ~500 tokens = $0.001-0.002 per exam
- **100 exams**: ~$0.10-0.20

### Google AI Pricing
- **Free tier**: 60 requests per minute
- **Paid tier**: Very competitive pricing

## 🐛 Troubleshooting

### Issue: "No AI provider configured"
**Solution**: Add API key to `.env.local` and restart server

### Issue: "Failed to generate questions"
**Solutions**:
1. Check API key is valid
2. Check internet connection
3. Check API quota/billing
4. System will automatically use fallback questions

### Issue: Questions not relevant to topic
**Solutions**:
1. Be more specific with topic (e.g., "Binary Search Trees" instead of "Trees")
2. Use GPT-4 instead of GPT-3.5 for better quality
3. Adjust temperature in `openai-client.ts`

### Issue: API rate limit exceeded
**Solutions**:
1. Wait a few minutes
2. Upgrade API plan
3. Use Google AI as alternative

## 🎯 Best Practices

### Writing Good Topics
✅ **Good**: "Binary Search Trees and Tree Traversal"
❌ **Bad**: "Trees"

✅ **Good**: "World War II - Causes and Major Events"
❌ **Bad**: "History"

✅ **Good**: "Derivatives and Integration in Calculus"
❌ **Bad**: "Math"

### Question Quality
- Use **Medium** or **Hard** difficulty for better questions
- Generate 5-10 questions for best quality
- Review questions before publishing
- Edit questions if needed

### Performance
- Questions generate in 5-15 seconds
- Faster with GPT-3.5, slower but better with GPT-4
- Cache frequently used topics (future feature)

## 📱 Mobile Access

Students can take exams on mobile devices:
1. Teacher creates exam on computer
2. System generates shareable link
3. Students open link on phone/tablet
4. Responsive design works on all devices

## 🔐 Security

- API keys stored in `.env.local` (never committed to git)
- Server-side generation (keys not exposed to client)
- Exam links are unique and shareable
- Student authentication required

## 🚀 Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `MONGODB_URI`
4. Deploy!

### Environment Variables in Vercel
```
Settings → Environment Variables → Add:
- OPENAI_API_KEY = sk-your-key-here
- MONGODB_URI = mongodb+srv://...
```

## 📚 API Reference

### Generate Questions Function
```typescript
import { generateExamQuestions } from '@/ai/flows/generate-exam-questions';

const result = await generateExamQuestions({
  topic: 'Data Structures - Binary Trees',
  difficulty: 'Medium',
  questionType: 'MCQ',
  numberOfQuestions: 5,
  subject: 'Computer Science',
});

// Returns:
{
  questions: [
    {
      questionText: "What is the time complexity of searching in a balanced BST?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: "O(log n)",
      explanation: "Balanced BST has logarithmic search time"
    }
  ],
  provider: 'openai'
}
```

## 🎉 Success Checklist

- [ ] API key added to `.env.local`
- [ ] Server restarted
- [ ] Test exam created successfully
- [ ] Questions are relevant to topic
- [ ] Exam saved and link generated
- [ ] Students can access exam link
- [ ] Submissions working correctly

## 📞 Support

If you encounter issues:
1. Check this guide
2. Check console logs for errors
3. Verify API key is correct
4. Test with fallback questions first
5. Check API provider status page

## 🎓 Example Workflow

```
Teacher:
1. Login → Dashboard → Create Exam
2. Enter: "Physics - Newton's Laws of Motion"
3. Select: Medium, MCQ, 5 questions
4. Click: Generate with AI
5. Review: AI-generated questions
6. Click: Save & Publish
7. Copy: Exam link
8. Share: With students via WhatsApp/Email

Students:
1. Open: Exam link on phone
2. Enter: Name, USN, Email
3. Take: Exam (timed)
4. Submit: Answers
5. View: Score immediately

Teacher:
1. View: Analytics dashboard
2. See: Student performance
3. Export: Results
```

## 🌟 Future Enhancements

- [ ] Support for more AI providers (Anthropic Claude, etc.)
- [ ] Question bank caching
- [ ] Bulk exam generation
- [ ] Custom question templates
- [ ] Multi-language support
- [ ] Image-based questions
- [ ] Adaptive difficulty

---

**Ready to create AI-powered exams? Start now!** 🚀
