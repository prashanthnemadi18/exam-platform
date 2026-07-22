# ⚡ Quick Vercel Deployment - 5 Minutes

## 🚀 Deploy to Vercel in 5 Steps

### Step 1: Push to GitHub (1 min)
```bash
cd "c:\Prashanth_N Projects\AI-online-exam"
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Go to Vercel (1 min)
- Visit: https://vercel.com/new
- Click "Import Project"
- Select your GitHub repo: `AI-online-exam`
- Root Directory: **`teacher`** ⚠️ IMPORTANT

### Step 3: Add Environment Variables (2 min)

Click "Environment Variables" and add:

```env
NEXT_PUBLIC_SUPABASE_URL
Value: https://viyrntyvcxmujghbjrxg.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: sb_publishable_L6n5Suzmf4EsRfd4kgK6ug_ZzzzZDaP

GOOGLE_GENAI_API_KEY
Value: AIzaSyBMLITtYnGZ-Q6IbylskL9zxLuF1NJqAdY

NEXT_PUBLIC_GOOGLE_GENAI_API_KEY
Value: AIzaSyBMLITtYnGZ-Q6IbylskL9zxLuF1NJqAdY
```

**Make sure to select "Production" for all!**

### Step 4: Deploy (1 min)
- Click "Deploy"
- Wait 2-3 minutes
- Get your URL: `https://your-project.vercel.app`

### Step 5: Test
- Visit your URL
- Register a student
- Create an exam
- Verify data in Supabase

---

## ✅ That's It!

Your app is now live with Supabase database! 🎉

---

## 🔄 To Update Later

Just push to GitHub:
```bash
git push origin main
```
Vercel auto-deploys!

---

**Need help?** See `VERCEL-SUPABASE-DEPLOYMENT.md` for detailed guide.
