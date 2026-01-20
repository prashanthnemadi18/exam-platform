# Deployment Guide - Vercel

## Overview
This guide explains how to deploy updates to your existing Vercel project at `https://online-platfrom.vercel.app`

---

## Quick Deploy (Recommended)

### Method 1: Git Push (Automatic Deployment)

**This is the EASIEST method - Vercel automatically deploys when you push to Git!**

```bash
# 1. Navigate to teacher directory
cd teacher

# 2. Check what files changed
git status

# 3. Add all changes
git add .

# 4. Commit with a message
git commit -m "Fixed PDF generation and added documentation"

# 5. Push to GitHub/GitLab
git push origin main
# OR
git push origin master

# 6. Vercel will automatically deploy! ✅
# Check: https://vercel.com/dashboard
```

**That's it!** Vercel detects the push and deploys automatically within 1-2 minutes.

---

### Method 2: Vercel CLI (Manual Deployment)

**Use this if you want to deploy without pushing to Git:**

```bash
# 1. Navigate to teacher directory
cd teacher

# 2. Build the project first (optional but recommended)
npm run build

# 3. Deploy to production
vercel --prod

# OR use the npm script
npm run deploy
```

**Output:**
```
🔍 Inspect: https://vercel.com/...
✅ Production: https://online-platfrom.vercel.app [2s]
```

---

### Method 3: Vercel Dashboard (Manual Upload)

1. Go to https://vercel.com/dashboard
2. Select your project "online-platfrom"
3. Click "Deployments" tab
4. Click "Redeploy" button
5. Confirm deployment

---

## Step-by-Step: Deploy Your Changes

### Step 1: Verify Changes Locally

```bash
# Navigate to teacher directory
cd teacher

# Test the build
npm run build

# If build succeeds, you're ready to deploy!
```

**Expected Output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

---

### Step 2: Check Environment Variables

**Verify Vercel has all required environment variables:**

```bash
# List environment variables
vercel env ls

# Should show:
# GOOGLE_GENAI_API_KEY (Production, Preview, Development)
# MONGODB_URI (if using MongoDB)
```

**If missing, add them:**

```bash
# Add Google AI key
vercel env add GOOGLE_GENAI_API_KEY

# When prompted:
# - Enter your API key
# - Select: Production, Preview, Development (all)
# - Confirm
```

---

### Step 3: Deploy Changes

**Option A: Git Push (Recommended)**

```bash
# 1. Stage all changes
git add .

# 2. Commit
git commit -m "Update: Fixed PDF generation, added AI explanations, improved security"

# 3. Push
git push origin main

# 4. Wait 1-2 minutes
# 5. Check https://online-platfrom.vercel.app
```

**Option B: Vercel CLI**

```bash
# Deploy to production
vercel --prod

# Follow prompts if any
```

---

### Step 4: Verify Deployment

**1. Check Deployment Status:**

Visit: https://vercel.com/dashboard

Look for:
- ✅ "Ready" status
- ✅ Green checkmark
- ✅ Recent timestamp

**2. Test Your Website:**

```bash
# Open in browser
npm run open

# Or visit directly
# https://online-platfrom.vercel.app
```

**3. Test Key Features:**

- [ ] Homepage loads
- [ ] Teacher login works
- [ ] Student registration works
- [ ] Create exam with AI questions
- [ ] Share exam link
- [ ] Student can take exam
- [ ] PDF download works
- [ ] Results display correctly

---

## Deployment Checklist

### Before Deploying

- [ ] Run `npm run build` successfully
- [ ] Test locally with `npm run dev`
- [ ] Check all features work
- [ ] Verify no console errors
- [ ] Review changed files
- [ ] Update version number (optional)
- [ ] Write clear commit message

### During Deployment

- [ ] Commit changes to Git
- [ ] Push to remote repository
- [ ] Monitor Vercel dashboard
- [ ] Wait for "Ready" status
- [ ] Check build logs for errors

### After Deployment

- [ ] Visit production URL
- [ ] Test critical features
- [ ] Check browser console for errors
- [ ] Verify API endpoints work
- [ ] Test on mobile device
- [ ] Monitor for issues

---

## Common Deployment Issues

### Issue 1: Build Fails

**Error:** "Failed to compile"

**Solution:**
```bash
# 1. Check build locally
npm run build

# 2. Fix any errors shown
# 3. Commit and push again
git add .
git commit -m "Fix build errors"
git push origin main
```

---

### Issue 2: Environment Variables Missing

**Error:** "API key not found"

**Solution:**
```bash
# Add missing environment variables
vercel env add GOOGLE_GENAI_API_KEY

# Redeploy
vercel --prod
```

---

### Issue 3: Old Version Still Showing

**Problem:** Changes not visible on production

**Solution:**
```bash
# 1. Hard refresh browser
# Ctrl + Shift + R (Windows/Linux)
# Cmd + Shift + R (Mac)

# 2. Clear browser cache

# 3. Check Vercel dashboard for latest deployment

# 4. Force redeploy if needed
vercel --prod --force
```

---

### Issue 4: 404 Errors

**Problem:** Pages not found

**Solution:**
```bash
# 1. Check file structure
# 2. Verify routes are correct
# 3. Check next.config.js
# 4. Rebuild and redeploy
npm run build
vercel --prod
```

---

## Vercel CLI Commands

### Installation

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login
```

### Common Commands

```bash
# Deploy to preview (test deployment)
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# View environment variables
vercel env ls

# Add environment variable
vercel env add VARIABLE_NAME

# Remove environment variable
vercel env rm VARIABLE_NAME

# Link to existing project
vercel link

# Open project in browser
vercel open
```

---

## Deployment Workflow

### Development → Production

```
1. Local Development
   ├── Make changes
   ├── Test locally (npm run dev)
   └── Build (npm run build)
   
2. Version Control
   ├── git add .
   ├── git commit -m "message"
   └── git push origin main
   
3. Automatic Deployment
   ├── Vercel detects push
   ├── Runs build
   ├── Deploys to production
   └── Updates https://online-platfrom.vercel.app
   
4. Verification
   ├── Check Vercel dashboard
   ├── Test production site
   └── Monitor for issues
```

---

## Environment Variables Setup

### Required Variables for Production

```bash
# 1. Google AI API Key (REQUIRED)
vercel env add GOOGLE_GENAI_API_KEY
# Enter your key when prompted
# Select: Production, Preview, Development

vercel env add NEXT_PUBLIC_GOOGLE_GENAI_API_KEY
# Enter same key
# Select: Production, Preview, Development
```

### Optional Variables

```bash
# MongoDB (if using)
vercel env add MONGODB_URI
vercel env add STORAGE_URL

# OpenAI (if using)
vercel env add OPENAI_API_KEY
vercel env add NEXT_PUBLIC_OPENAI_API_KEY

# Anthropic (if using)
vercel env add ANTHROPIC_API_KEY
vercel env add NEXT_PUBLIC_ANTHROPIC_API_KEY
```

---

## Monitoring Deployment

### Vercel Dashboard

**URL:** https://vercel.com/dashboard

**What to Check:**
1. **Deployments Tab**
   - Latest deployment status
   - Build logs
   - Deployment time

2. **Analytics Tab**
   - Page views
   - Performance metrics
   - Error rates

3. **Logs Tab**
   - Runtime logs
   - Error messages
   - API calls

### Build Logs

**View in Dashboard:**
1. Go to Deployments
2. Click on latest deployment
3. Click "Building" or "View Function Logs"
4. Check for errors

**View via CLI:**
```bash
vercel logs
```

---

## Rollback Procedure

### If Deployment Has Issues

**Method 1: Vercel Dashboard**

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Deployments" tab
4. Find previous working deployment
5. Click "..." menu
6. Click "Promote to Production"

**Method 2: Git Revert**

```bash
# 1. Revert last commit
git revert HEAD

# 2. Push
git push origin main

# 3. Vercel will deploy the reverted version
```

**Method 3: Redeploy Previous Version**

```bash
# 1. Find previous deployment URL
vercel ls

# 2. Promote to production
vercel promote <deployment-url>
```

---

## Performance Optimization

### Build Optimization

```javascript
// next.config.js
module.exports = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    domains: ['your-domain.com'],
  },
  
  // Enable SWC minification
  swcMinify: true,
};
```

### Caching Strategy

```typescript
// API route with caching
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
```

---

## Continuous Deployment

### Automatic Deployment (Enabled by Default)

**How it Works:**
1. You push code to GitHub/GitLab
2. Vercel detects the push
3. Vercel runs `npm run build`
4. If successful, deploys to production
5. Updates your live site

**Branches:**
- `main` or `master` → Production
- Other branches → Preview deployments

### Preview Deployments

**Every branch gets a preview URL:**

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and push
git push origin feature/new-feature

# Vercel creates preview deployment
# URL: https://online-platfrom-git-feature-new-feature.vercel.app
```

**Benefits:**
- Test before merging to main
- Share with team for review
- No impact on production

---

## Your Current Setup

### Project Information

**Project Name:** `online-platfrom`  
**Production URL:** https://online-platfrom.vercel.app  
**Framework:** Next.js 15.0.2  
**Node Version:** 18.x (default)

### Deployment Scripts

**In package.json:**

```json
{
  "scripts": {
    "deploy": "npm run build && vercel --prod && start https://online-platfrom.vercel.app",
    "open": "start https://online-platfrom.vercel.app"
  }
}
```

**Usage:**

```bash
# Deploy and open in browser
npm run deploy

# Just open production site
npm run open
```

---

## Quick Deploy Guide (Your Project)

### 🚀 Deploy Your Recent Changes

```bash
# Step 1: Navigate to teacher directory
cd teacher

# Step 2: Check your changes
git status

# Step 3: Add all changes
git add .

# Step 4: Commit with descriptive message
git commit -m "Fixed PDF HTML entities, added AI explanations, improved security, added documentation"

# Step 5: Push to GitHub
git push origin main

# Step 6: Wait 1-2 minutes for automatic deployment

# Step 7: Open your site
npm run open
# OR visit: https://online-platfrom.vercel.app
```

**That's it!** Your changes are now live! ✅

---

### Alternative: Manual Deploy

```bash
# If you don't want to push to Git yet
cd teacher
npm run deploy

# This will:
# 1. Build the project
# 2. Deploy to Vercel
# 3. Open the site in browser
```

---

## Verify Deployment

### Check Deployment Status

**Option 1: Vercel Dashboard**
1. Visit: https://vercel.com/dashboard
2. Find "online-platfrom" project
3. Check latest deployment status
4. Should show "Ready" with green checkmark

**Option 2: CLI**
```bash
vercel ls

# Output shows recent deployments
```

### Test Your Changes

**1. PDF Generation:**
- Create an exam
- Download question paper
- Check if `&` displays correctly (not `&amp;`)
- Verify AI explanations are included

**2. Student Flow:**
- Register a student
- Share exam link
- Student takes exam
- Verify exam loads (not "Exam not found")
- Submit exam
- Download result PDF

**3. Data Persistence:**
- Create exam
- Refresh page
- Exam should still be there
- Check if data persists

---

## Environment Variables on Vercel

### Check Current Variables

```bash
# List all environment variables
vercel env ls
```

### Add/Update Variables

```bash
# Add new variable
vercel env add GOOGLE_GENAI_API_KEY

# When prompted:
# ? What's the value of GOOGLE_GENAI_API_KEY?
# > [Enter your API key]
# 
# ? Add GOOGLE_GENAI_API_KEY to which Environments?
# > [Select all: Production, Preview, Development]
```

### Required Variables for Your Project

```bash
# Google AI (REQUIRED)
vercel env add GOOGLE_GENAI_API_KEY
vercel env add NEXT_PUBLIC_GOOGLE_GENAI_API_KEY

# MongoDB (OPTIONAL - if using)
vercel env add MONGODB_URI
vercel env add STORAGE_URL
```

**After adding variables, redeploy:**
```bash
vercel --prod
```

---

## Deployment Logs

### View Real-Time Logs

```bash
# View function logs
vercel logs

# Follow logs in real-time
vercel logs --follow

# Filter by function
vercel logs --function=api/exams
```

### Check Build Logs

**Via Dashboard:**
1. Go to https://vercel.com/dashboard
2. Click on your project
3. Click on latest deployment
4. View "Building" logs

**Via CLI:**
```bash
vercel logs --build
```

---

## Troubleshooting Deployment

### Issue 1: Deployment Fails

**Check build logs:**
```bash
vercel logs --build
```

**Common causes:**
- TypeScript errors
- Missing dependencies
- Environment variables not set
- Build timeout

**Solution:**
```bash
# Fix errors locally first
npm run build

# If successful, deploy again
git push origin main
```

---

### Issue 2: Changes Not Showing

**Problem:** Old version still showing

**Solutions:**

1. **Hard refresh browser:**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Clear browser cache:**
   - Chrome: Settings → Privacy → Clear browsing data

3. **Check deployment status:**
   ```bash
   vercel ls
   # Verify latest deployment is "Ready"
   ```

4. **Force redeploy:**
   ```bash
   vercel --prod --force
   ```

---

### Issue 3: Environment Variables Not Working

**Problem:** API keys not found in production

**Solution:**

```bash
# 1. Check if variables exist
vercel env ls

# 2. If missing, add them
vercel env add GOOGLE_GENAI_API_KEY

# 3. Redeploy
vercel --prod

# 4. Check logs
vercel logs
```

---

### Issue 4: File Storage Not Working

**Problem:** Data not persisting on Vercel

**Explanation:**
- Vercel is serverless (stateless)
- File storage doesn't work on Vercel
- Need to use MongoDB or Vercel KV

**Solution:**

**Option A: Use MongoDB (Recommended)**
```bash
# 1. Set up MongoDB Atlas (free)
# 2. Add connection string to Vercel
vercel env add MONGODB_URI

# 3. Redeploy
vercel --prod
```

**Option B: Use Vercel KV**
```bash
# 1. Enable Vercel KV in dashboard
# 2. Variables added automatically
# 3. Update code to use KV
```

---

## Deployment Best Practices

### 1. Test Before Deploying

```bash
# Always build locally first
npm run build

# Test in production mode
npm run start

# Check for errors
npm run lint
```

### 2. Use Meaningful Commit Messages

```bash
# ✅ Good
git commit -m "Fix: PDF HTML entity decoding issue"
git commit -m "Feature: Add AI explanations to PDFs"
git commit -m "Security: Remove exposed API keys"

# ❌ Bad
git commit -m "update"
git commit -m "fix"
git commit -m "changes"
```

### 3. Deploy During Low Traffic

- Deploy during off-peak hours
- Avoid deploying during exams
- Notify users of maintenance if needed

### 4. Monitor After Deployment

- Check error logs for 30 minutes
- Monitor user reports
- Be ready to rollback if needed

---

## Deployment Schedule

### Recommended Workflow

**Development:**
```bash
# Work on features locally
npm run dev

# Test thoroughly
npm run build
```

**Staging (Preview):**
```bash
# Push to feature branch
git push origin feature/new-feature

# Test preview deployment
# https://online-platfrom-git-feature-new-feature.vercel.app
```

**Production:**
```bash
# Merge to main
git checkout main
git merge feature/new-feature
git push origin main

# Automatic deployment to production
```

---

## Your Deployment Commands

### Quick Reference

```bash
# 1. Deploy changes (automatic via Git)
git add .
git commit -m "Your message"
git push origin main

# 2. Deploy changes (manual via CLI)
npm run deploy

# 3. Open production site
npm run open

# 4. View logs
vercel logs

# 5. Check deployments
vercel ls

# 6. Rollback to previous version
vercel promote <previous-deployment-url>
```

---

## Production URL

**Your Live Site:**
🔗 https://online-platfrom.vercel.app

**Vercel Dashboard:**
🔗 https://vercel.com/dashboard

**GitHub Repository:**
🔗 (Your GitHub repo URL)

---

## Support

### Vercel Documentation
- Deployment: https://vercel.com/docs/deployments
- Environment Variables: https://vercel.com/docs/environment-variables
- CLI: https://vercel.com/docs/cli

### Need Help?
- Vercel Support: https://vercel.com/support
- Vercel Community: https://github.com/vercel/vercel/discussions

---

**Last Updated:** November 29, 2024  
**Project:** online-platfrom  
**Framework:** Next.js 15.0.2  
**Deployment:** Automatic via Git Push
