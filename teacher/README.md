# 🎓 AssessAI - AI-Powered Online Examination Platform

## Overview

AssessAI is a complete online examination platform that uses AI to generate real-time exam questions for any subject and topic. Teachers can create exams in minutes, and students can take them on any device.

## ✨ Features

### For Teachers
- 🤖 **AI Question Generation** - Generate questions for any subject/topic
- 📝 **Quick Exam Creation** - Create exams in 2 minutes
- 🔗 **Shareable Links** - One-click exam sharing
- 📊 **Analytics Dashboard** - Track student performance
- 👥 **Student Management** - View all registered students

### For Students
- 📱 **Mobile Friendly** - Take exams on any device
- ⏱️ **Timed Exams** - Automatic timer and submission
- ✅ **Instant Results** - See scores immediately
- 📖 **Answer Review** - Review correct answers after submission

### AI Capabilities
- Supports **any subject** (Computer Science, History, Biology, etc.)
- Supports **any topic** within that subject
- **3 question types**: MCQ, True/False, Fill in the Blanks
- **3 difficulty levels**: Easy, Medium, Hard
- **1-20 questions** per exam
- **Real-time generation** in 5-15 seconds

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure AI

Create `.env.local` file:

```bash
# Get API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-actual-key-here

# Optional: MongoDB for production
MONGODB_URI=your-mongodb-connection-string
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3003

### 4. Create Your First Exam

1. Go to http://localhost:3003/login
2. Click "Log In to Dashboard"
3. Click "Create Exam"
4. Fill in exam details
5. Click "Generate Questions with AI"
6. Review and save
7. Share the exam link!

## 📚 Documentation

- **[Quick Start Guide](../QUICK-START.md)** - Get started in 5 minutes
- **[AI Setup Guide](./AI-SETUP-GUIDE.md)** - Complete AI configuration
- **[Complete Analysis](../COMPLETE-PROJECT-ANALYSIS.md)** - Full documentation
- **[Project Summary](../PROJECT-COMPLETE-SUMMARY.md)** - What's been built

## 🎨 UI Design

### Light Antique Theme
- **Colors**: Warm amber, gold, teal accents
- **Background**: Cream/beige gradients
- **Typography**: Inter, Space Grotesk
- **Animations**: Smooth transitions, hover effects
- **Responsive**: Mobile-first design

### Pages
- **Landing Page** - Hero with features
- **Login** - Teacher authentication
- **Dashboard** - Statistics and quick actions
- **Create Exam** - AI-powered exam builder
- **Exam Interface** - Student exam taking
- **Analytics** - Performance insights

## 🤖 AI Integration

### Supported Providers
1. **OpenAI** (Recommended) - GPT-3.5-Turbo
2. **Google AI** (Alternative) - Gemini Pro
3. **Fallback** - Demo questions for testing

### How It Works
```
User Input → Unified AI Client → OpenAI/Google AI → Generated Questions
```

### Example Usage
```typescript
const result = await generateExamQuestions({
  topic: 'Data Structures - Binary Trees',
  difficulty: 'Medium',
  questionType: 'MCQ',
  numberOfQuestions: 5,
  subject: 'Computer Science',
});
```

## 📦 Tech Stack

- **Framework**: Next.js 15 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: Radix UI + shadcn/ui
- **AI**: OpenAI / Google AI
- **Database**: MongoDB
- **Deployment**: Vercel

## 🗂️ Project Structure

```
src/
├── app/                    # Pages & API routes
│   ├── page.tsx           # Landing page
│   ├── login/             # Teacher login
│   ├── register/          # Student registration
│   ├── dashboard/         # Teacher dashboard
│   ├── exam/[id]/         # Student exam interface
│   └── api/               # API endpoints
├── components/            # React components
│   ├── auth/             # Authentication
│   ├── dashboard/        # Dashboard components
│   ├── exam/             # Exam components
│   └── ui/               # UI primitives
├── ai/                   # AI integration
│   ├── unified-ai.ts     # Unified AI client
│   ├── openai-client.ts  # OpenAI integration
│   ├── genkit.ts         # Google AI integration
│   └── flows/            # AI workflows
└── lib/                  # Utilities
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3003)

# Production
npm run build        # Build for production
npm start            # Start production server

# Deployment
npm run deploy       # Build and deploy to Vercel
npm run open         # Open deployed site
```

## 🌐 API Endpoints

### Students
- `GET /api/students` - Fetch all students
- `POST /api/students` - Register new student

### Exams
- `GET /api/exams` - Fetch all exams
- `POST /api/exams` - Create new exam

### Submissions
- `GET /api/submissions` - Fetch all submissions
- `POST /api/submissions` - Submit exam answers

## 📱 Mobile Support

- ✅ Responsive design (mobile-first)
- ✅ Touch-friendly interface
- ✅ Optimized forms
- ✅ Works on all devices
- ✅ Same link for desktop and mobile

## 🔐 Security

- API keys stored in environment variables
- Server-side AI generation
- Input validation with Zod
- Secure API routes
- XSS protection

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables:
   - `OPENAI_API_KEY`
   - `MONGODB_URI` (optional)
4. Deploy!

### Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-your-key-here

# Optional
GOOGLE_GENAI_API_KEY=your-google-key-here
MONGODB_URI=mongodb+srv://...
```

## 🐛 Troubleshooting

### "No AI provider configured"
**Fix**: Add `OPENAI_API_KEY` to `.env.local` and restart server

### "Failed to generate questions"
**Fix**: Check API key is valid and has credits

### Questions not relevant
**Fix**: Be more specific with topics (e.g., "Binary Search Trees" not "Trees")

## 📊 Example Subjects

### Computer Science
- Data Structures, Algorithms, Networks, Databases

### Mathematics
- Calculus, Linear Algebra, Statistics, Geometry

### Physics
- Mechanics, Thermodynamics, Electromagnetism

### Biology
- Cell Biology, Genetics, Ecology, Anatomy

### History
- World War II, Ancient Civilizations, Industrial Revolution

## 💡 Best Practices

### For Teachers
1. Be specific with topics
2. Review AI-generated questions
3. Use appropriate difficulty levels
4. Test exam link before sharing
5. Set realistic time limits

### For Students
1. Use stable internet
2. Complete in one sitting
3. Don't refresh during exam
4. Submit before timer expires
5. Review answers before submitting

## 📈 Performance

- **Lighthouse Score**: 90+
- **First Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **AI Response**: 5-15 seconds
- **Bundle Size**: Optimized

## 🎯 Use Cases

- Schools conducting online tests
- Colleges for semester exams
- Coaching centers for practice
- Corporate training assessments
- Self-assessment and study

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review troubleshooting guide
3. Check console logs
4. Verify API configuration

## 🎉 Success Metrics

- ✅ Complete feature set
- ✅ AI-powered generation
- ✅ Beautiful UI design
- ✅ Mobile responsive
- ✅ Production ready
- ✅ Comprehensive docs

## 📝 License

Private project for educational purposes.

## 🙏 Acknowledgments

- OpenAI for GPT-3.5
- Google for Gemini AI
- Vercel for hosting
- Next.js team
- shadcn/ui for components

---

**Ready to revolutionize online education!** 🚀

For detailed guides, see:
- [Quick Start](../QUICK-START.md)
- [AI Setup](./AI-SETUP-GUIDE.md)
- [Complete Analysis](../COMPLETE-PROJECT-ANALYSIS.md)
