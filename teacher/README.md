# AssessAI - Online Examination Platform

An AI-powered platform for secure, automated online exams built with Next.js, TypeScript, and Google Genkit AI.

## 🌐 Live Website Features

- **Teacher Portal:** Login, create exams, generate exam links, view analytics
- **Student Portal:** Register, take exams via shared links
- **AI-Powered:** Automatic question generation and grading
- **Real-time Analytics:** Track student performance

## Features

- 🤖 AI Question Generation using Google Genkit
- 🔒 Secure Exam Environment
- 📊 In-depth Analytics & Performance Tracking
- ✅ Automated Grading
- 👨‍🎓 Student-Friendly Interface
- 💬 AI Chatbot Support
- 🔗 Shareable Exam Links
- 📱 Responsive Design

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **AI:** Google Generative AI with Gemini Pro
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Google AI API Key (for Genkit)

## Local Development Setup

1. **Install Dependencies:**
   ```bash
   cd teacher
   npm install
   ```

2. **Set up Environment Variables:**
   - Copy `.env.example` to `.env.local`
   - Add your Google AI API key:
   ```
   GOOGLE_GENAI_API_KEY=your_actual_api_key_here
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deploy to Production (Live Website)

### Option 1: Vercel (Recommended - FREE & Easy)

Vercel is the easiest way to deploy Next.js apps with a real domain.

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Set Root Directory to `teacher`
   - Add Environment Variable: `GOOGLE_GENAI_API_KEY`
   - Click "Deploy"

3. **Your Live Website:**
   - Vercel gives you a URL like: `https://your-exam-site.vercel.app`
   - You can add a custom domain later

### Option 2: Netlify (FREE)

1. **Build the project:**
   ```bash
   cd teacher
   npm run build
   ```

2. **Deploy:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `.next` folder
   - Add environment variables in Netlify dashboard

### Option 3: Railway (FREE tier available)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy:**
   ```bash
   cd teacher
   railway login
   railway init
   railway up
   ```

### Option 4: Self-Hosted (VPS/Cloud Server)

For AWS, DigitalOcean, or your own server:

1. **Build the project:**
   ```bash
   cd teacher
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Use PM2 to keep it running:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "exam-site" -- start
   pm2 save
   pm2 startup
   ```

4. **Setup Nginx as reverse proxy** (port 80/443 to 3000)

## Available Scripts

- `npm run dev` - Start development server (localhost)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
teacher/
├── src/
│   ├── ai/              # AI/Genkit configuration
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   │   ├── auth/        # Authentication components
│   │   ├── dashboard/   # Teacher dashboard
│   │   ├── exam/        # Exam components
│   │   ├── student/     # Student components
│   │   ├── shared/      # Shared components
│   │   └── ui/          # UI components (Radix)
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions
├── public/              # Static assets
└── ...config files
```

## Getting Google AI API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy and paste it into your `.env.local` file

## License

MIT
