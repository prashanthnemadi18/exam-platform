# 🎓 AI-Powered Exam Assessment Platform

An intelligent exam creation and assessment platform with real-time AI question generation, anti-cheating features, and comprehensive analytics.

---

## ✨ Features

- 🤖 **Real-time AI Question Generation** - Unique questions generated on-demand
- 🔒 **Anti-Cheating System** - Tab detection, copy prevention, time tracking
- 📊 **Performance Analytics** - Visual charts and detailed student insights
- 💬 **AI Chatbot Support** - Intelligent help for students
- 🎯 **Multiple Question Types** - MCQ, True/False, Fill in the Blanks
- 📱 **Responsive Design** - Works on all devices

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd teacher
npm install
```

### 2. Configure Environment
Create `.env.local` file:
```bash
# Optional: Add Google AI key for premium question generation
GOOGLE_GENAI_API_KEY=your_key_here

# FREE AI works automatically without any key!
```

### 3. Start Server
```bash
npm run dev    # Development mode
# OR
npm start      # Production mode (port 3003)
```

### 4. Open Browser
```
http://localhost:3000  (dev mode)
http://localhost:3003  (production mode)
```

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 15, React, TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini, Hugging Face (FREE fallback)
- **Storage:** Local file system (JSON)
- **Deployment:** Vercel-ready

---

## 📁 Project Structure

```
teacher/
├── src/
│   ├── ai/                    # AI integration
│   │   ├── google-ai-client.ts
│   │   ├── free-ai-client.ts
│   │   └── unified-ai.ts
│   ├── app/                   # Next.js pages
│   │   ├── dashboard/
│   │   ├── exam/
│   │   └── api/
│   ├── components/            # React components
│   └── lib/                   # Utilities
├── .env.local                 # Environment config
└── package.json
```

---

## 🎯 How It Works

### For Teachers:
1. Register/Login
2. Create exam with subject, topic, difficulty
3. AI generates unique questions
4. Share exam link with students
5. View results and analytics

### For Students:
1. Access exam via link
2. Enter name and details
3. Take timed exam
4. Submit answers
5. View results

---

## 🤖 AI Integration

The platform uses a multi-tier AI system:

1. **Primary:** Google Gemini 1.5 Flash (when API key provided)
2. **Fallback:** Hugging Face Free AI (no key needed)
3. **Backup:** Smart template-based generation

This ensures **100% uptime** - questions always generate!

---

## 🔑 Getting Google AI Key (Optional)

1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy key and add to `.env.local`

**Note:** FREE AI works without any key!

---

## 📚 Documentation

- **README-FIRST.md** - Quick overview and status
- **PRESENTATION-READY-CHECKLIST.md** - Demo guide
- **FINAL-STATUS-REPORT.md** - Complete system status
- **GET-VALID-API-KEY-NOW.md** - API key setup guide
- **QUICK-START-PRESENTATION.txt** - Quick reference card

---

## 🎓 For Presentation

### Demo Flow (3 minutes):
1. **Register** → Create teacher account (30s)
2. **Create Exam** → Generate AI questions (1min)
3. **Student View** → Take exam (1min)
4. **Results** → Show analytics (30s)

### Key Talking Points:
- Real-time AI question generation
- Multi-provider fallback system
- Production-ready error handling
- Modern tech stack (Next.js 15)
- Complete anti-cheating features

---

## 🐛 Troubleshooting

### Port Already in Use:
```bash
netstat -ano | findstr :3003
taskkill /F /PID [process_id]
npm start
```

### Questions Not Generating:
- FREE AI fallback is always active
- Check console for logs
- Refresh page if needed

---

## 🚀 Deployment

Ready to deploy to Vercel:
```bash
vercel deploy
```

Configuration is already set in `vercel.json`.

---

## 📊 Features Breakdown

### Authentication
- Teacher registration/login
- Session management
- Secure password handling

### Exam Creation
- Custom subject and topics
- Difficulty levels (Easy/Medium/Hard)
- Multiple question types
- Real-time AI generation

### Anti-Cheating
- Tab switching detection
- Copy/paste prevention
- Time tracking
- Full-screen mode
- Activity monitoring

### Analytics
- Student performance tracking
- Visual charts and graphs
- Exam statistics
- Student management

---

## 🎉 Status

✅ **All Systems Operational**
- Build: Successful
- Tests: Passing
- Features: Complete
- Ready: For Production

---

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review console logs
3. Verify environment configuration

---

## 📝 License

Educational project - Free to use and modify

---

**Built with ❤️ using Next.js 15 and AI**
