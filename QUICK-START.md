# 🚀 Quick Start Guide - AssessAI

## Get Started in 5 Minutes!

### Step 1: Install Dependencies (1 minute)

```bash
cd teacher
npm install
```

### Step 2: Configure AI (2 minutes)

Create `.env.local` file in the `teacher` folder:

```bash
# Get OpenAI API Key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-actual-key-here

# Optional: MongoDB for production
MONGODB_URI=your-mongodb-connection-string
```

### Step 3: Run the Project (1 minute)

```bash
npm run dev
```

Open http://localhost:3003

### Step 4: Create Your First Exam (1 minute)

1. Go to http://localhost:3003/login
2. Click "Log In to Dashboard" (no password needed for demo)
3. Click "Create Exam"
4. Fill in:
   - **Exam Title**: "Test Exam"
   - **Subject**: "Computer Science"
   - **Topics**: "Data Structures"
   - **Difficulty**: Medium
   - **Type**: MCQ
   - **Questions**: 5
   - **Duration**: 30
5. Click "Generate Questions with AI"
6. Wait 10 seconds
7. Click "Save Exam & Publish"
8. Copy the exam link!

### Step 5: Take the Exam (As Student)

1. Open the exam link in a new tab
2. Enter:
   - **Name**: Your Name
   - **USN**: 123456
   - **Email**: test@example.com
3. Click "Start Exam"
4. Answer questions
5. Click "Submit Exam"
6. See your score!

## 🎉 That's It!

You now have a fully functional AI-powered exam system!

## 📝 What You Can Do

### As Teacher:
- ✅ Create exams for ANY subject
- ✅ Generate questions with AI
- ✅ Share exam links
- ✅ View student submissions
- ✅ See analytics

### As Student:
- ✅ Register for exams
- ✅ Take timed exams
- ✅ Get instant scores
- ✅ Review answers

## 🔧 Troubleshooting

### "No AI provider configured"
**Fix**: Add `OPENAI_API_KEY` to `.env.local` and restart server

### "Failed to generate questions"
**Fix**: Check your API key is valid and has credits

### "Exam not found"
**Fix**: Make sure you saved the exam before sharing the link

## 📚 Next Steps

1. Read [AI Setup Guide](./teacher/AI-SETUP-GUIDE.md) for detailed AI configuration
2. Read [Complete Analysis](./COMPLETE-PROJECT-ANALYSIS.md) for full documentation
3. Deploy to Vercel using [Deployment Guide](./FINAL-DEPLOYMENT-STEPS.md)

## 🎯 Example Subjects to Try

- Computer Science → Data Structures, Algorithms, Networks
- Mathematics → Calculus, Linear Algebra, Statistics
- Physics → Mechanics, Thermodynamics, Optics
- Biology → Cell Biology, Genetics, Ecology
- History → World War II, Ancient Rome, Industrial Revolution

## 💡 Pro Tips

1. **Be Specific**: Use "Binary Search Trees" instead of "Trees"
2. **Review Questions**: Always check AI-generated questions
3. **Test First**: Create a test exam before sharing with students
4. **Mobile Friendly**: Students can take exams on phones
5. **Save Links**: Copy exam links before closing the page

## 🚀 Ready to Go!

Your AI-powered examination platform is ready to use!

**Happy Teaching!** 🎓
