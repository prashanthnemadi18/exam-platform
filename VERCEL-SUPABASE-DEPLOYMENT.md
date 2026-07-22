# 🚀 Deploy to Vercel with Supabase Database

## Complete Guide: Connect Supabase to Vercel

---

## ✅ Prerequisites

Before you start, make sure:
- [x] Supabase database is set up (tables created)
- [x] Local development works (`npm run dev`)
- [x] You have a Vercel account (https://vercel.com)
- [x] Your code is on GitHub

---

## 📋 Step-by-Step Deployment

### Step 1: Prepare Your Project

**1.1 Check if .gitignore is correct**

Make sure your `.gitignore` includes:
```
.env.local
.env
node_modules
.next
```

**1.2 Commit your changes to Git**

```bash
cd "c:\Prashanth_N Projects\AI-online-exam\teacher"
git add .
git commit -m "Migrated to Supabase database"
git push origin main
```

---

### Step 2: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

**2.1 Go to Vercel Dashboard**
- Visit: https://vercel.com/new
- Sign in with GitHub

**2.2 Import Your Repository**
- Click "Import Project"
- Select your GitHub repository: `AI-online-exam`
- Click "Import"

**2.3 Configure Project**
- Framework Preset: **Next.js** (auto-detected)
- Root Directory: `teacher`
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**2.4 Add Environment Variables** ⚠️ IMPORTANT

Click "Environment Variables" and add these:

```env
# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://viyrntyvcxmujghbjrxg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_L6n5Suzmf4EsRfd4kgK6ug_ZzzzZDaP

# Google AI (for question generation)
GOOGLE_GENAI_API_KEY=AIzaSyBMLITtYnGZ-Q6IbylskL9zxLuF1NJqAdY
NEXT_PUBLIC_GOOGLE_GENAI_API_KEY=AIzaSyBMLITtYnGZ-Q6IbylskL9zxLuF1NJqAdY
```

**Important:** Make sure to select **"Production"** for all variables!

**2.5 Deploy**
- Click "Deploy"
- Wait 2-3 minutes
- Your site will be live! 🎉

---

#### Option B: Via Vercel CLI

**2.1 Install Vercel CLI**
```bash
npm install -g vercel
```

**2.2 Login to Vercel**
```bash
vercel login
```

**2.3 Deploy**
```bash
cd teacher
vercel
```

**2.4 Follow prompts:**
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name? **ai-exam-platform**
- Directory? **./teacher**
- Override settings? **No**

**2.5 Add Environment Variables**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter: https://viyrntyvcxmujghbjrxg.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Enter: sb_publishable_L6n5Suzmf4EsRfd4kgK6ug_ZzzzZDaP

vercel env add GOOGLE_GENAI_API_KEY
# Enter: AIzaSyBMLITtYnGZ-Q6IbylskL9zxLuF1NJqAdY

vercel env add NEXT_PUBLIC_GOOGLE_GENAI_API_KEY
# Enter: AIzaSyBMLITtYnGZ-Q6IbylskL9zxLuF1NJqAdY
```

**2.6 Deploy to Production**
```bash
vercel --prod
```

---

### Step 3: Verify Deployment

**3.1 Check Deployment URL**

Vercel will give you a URL like:
```
https://ai-exam-platform.vercel.app
```

**3.2 Test Your App**

1. Visit your deployment URL
2. Try registering a student
3. Try creating an exam
4. Check if data appears in Supabase Dashboard

**3.3 Check Supabase Connection**

Go to Supabase Dashboard → Table Editor:
- You should see new students/exams appear
- Data is being stored in cloud database

---

## 🔧 Configuration Files

### vercel.json (Optional - for advanced config)

Create `teacher/vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "GOOGLE_GENAI_API_KEY": "@google-ai-key",
    "NEXT_PUBLIC_GOOGLE_GENAI_API_KEY": "@google-ai-key"
  }
}
```

---

## 🌐 Environment Variables Summary

You need to add these to Vercel:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://viyrntyvcxmujghbjrxg.supabase.co` | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_L6n5Suzmf4EsRfd4kgK6ug_ZzzzZDaP` | Production |
| `GOOGLE_GENAI_API_KEY` | `AIzaSyBMLITtYnGZ-Q6IbylskL9zxLuF1NJqAdY` | Production |
| `NEXT_PUBLIC_GOOGLE_GENAI_API_KEY` | `AIzaSyBMLITtYnGZ-Q6IbylskL9zxLuF1NJqAdY` | Production |

---

## 🎯 How to Add Environment Variables in Vercel Dashboard

### Method 1: During Initial Deployment

1. When deploying, click "Environment Variables"
2. Add each variable:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://viyrntyvcxmujghbjrxg.supabase.co`
   - Environment: **Production** ✓
3. Click "Add"
4. Repeat for all variables

### Method 2: After Deployment

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click "Settings" tab
4. Click "Environment Variables" in sidebar
5. Click "Add New"
6. Enter Key and Value
7. Select "Production" environment
8. Click "Save"
9. **Redeploy** for changes to take effect

---

## 🔄 How to Redeploy

After adding environment variables, you need to redeploy:

**Option 1: Via Dashboard**
1. Go to your project in Vercel
2. Click "Deployments" tab
3. Click "..." on latest deployment
4. Click "Redeploy"

**Option 2: Via CLI**
```bash
vercel --prod
```

**Option 3: Push to GitHub**
```bash
git push origin main
# Vercel auto-deploys on push
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Site is accessible at Vercel URL
- [ ] Can register a student
- [ ] Can create an exam (AI working)
- [ ] Can take an exam
- [ ] Data appears in Supabase Dashboard
- [ ] No console errors in browser

---

## 🆘 Troubleshooting

### Error: "Supabase credentials not configured"

**Problem:** Environment variables not set in Vercel

**Solution:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add all required variables
3. Redeploy

---

### Error: "Could not find table"

**Problem:** Database tables not created in Supabase

**Solution:**
- The tables are already created in your Supabase project
- Make sure the URL is correct
- Check Supabase Dashboard → Table Editor

---

### Error: "API key invalid"

**Problem:** Wrong API keys in Vercel

**Solution:**
1. Verify keys in `.env.local` work locally
2. Copy exact same values to Vercel
3. Redeploy

---

### Error: Build Failed

**Problem:** Build errors during deployment

**Solution:**
```bash
# Test build locally first
npm run build

# If successful, push and deploy
git push origin main
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────┐
│         User's Browser              │
└──────────────┬──────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────┐
│     Vercel (Production Server)      │
│   - Next.js Application             │
│   - API Routes                      │
│   - Serverless Functions            │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌──────────────┐  ┌──────────────┐
│   Supabase   │  │  Google AI   │
│  (Database)  │  │   (Gemini)   │
│              │  │              │
│ • PostgreSQL │  │ • Question   │
│ • Students   │  │   Generation │
│ • Exams      │  │              │
│ • Submissions│  │              │
└──────────────┘  └──────────────┘
```

---

## 🎉 Success!

Once deployed:

✅ Your app is live on the internet
✅ Anyone can access it via Vercel URL
✅ Data is stored in Supabase (cloud)
✅ AI question generation works
✅ No local MongoDB needed
✅ Automatic HTTPS
✅ Global CDN
✅ Auto-scaling

---

## 📱 Share Your App

Your deployment URL will be something like:
```
https://ai-exam-platform.vercel.app
```

You can:
- Share this link with students
- Add a custom domain (in Vercel settings)
- Share via WhatsApp/Email

---

## 🔐 Security Note

⚠️ **Important:** Your Supabase keys are already in this document. For production:

1. **Enable Row Level Security (RLS)** in Supabase:
   ```sql
   ALTER TABLE students ENABLE ROW LEVEL SECURITY;
   ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
   ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
   ```

2. **Create Policies** (for future - requires authentication):
   ```sql
   CREATE POLICY "Allow all" ON students FOR ALL USING (true);
   ```

For now, RLS is disabled for simplicity, which is fine for development/testing.

---

## 📚 Additional Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment

---

**Ready to deploy? Follow Step 1 above! 🚀**
