# 📤 Push to GitHub - Final Steps

## Step 1: Create Repository on GitHub

Go to: **https://github.com/prashanthnemadi18/exam-platform**

Or create new: **https://github.com/new**
- Name: `exam-platform`
- Public
- Don't initialize with README
- Click "Create repository"

## Step 2: Push Your Code

Run these commands:

```bash
git remote add origin https://github.com/prashanthnemadi18/exam-platform.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy on Vercel

1. Go to: **https://vercel.com/new**
2. Sign in with GitHub
3. Click **"Import"** next to `exam-platform`
4. Configure:
   - **Root Directory:** `teacher`
   - **Environment Variable:** 
     - Name: `GOOGLE_GENAI_API_KEY`
     - Value: Your API key
5. Click **"Deploy"**

## Step 4: Get Your Public URL

After deployment (2-3 minutes):
- Your website: `https://exam-platform.vercel.app`
- Registration link: `https://exam-platform.vercel.app/register`

Share this link with students - it will work on mobile!

## ✅ Done!

Your website is now public and accessible from anywhere!
