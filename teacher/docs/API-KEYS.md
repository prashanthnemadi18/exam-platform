# API Keys Documentation

## ⚠️ CRITICAL SECURITY WARNING

> 🔴 **NEVER COMMIT REAL API KEYS TO GIT!**  
> 🔴 **NEVER SHARE API KEYS PUBLICLY!**  
> 🔴 **NEVER HARDCODE API KEYS IN CODE!**

**This document contains:**
- ✅ Instructions on how to obtain API keys
- ✅ Placeholder examples (e.g., `your_api_key_here`)
- ✅ Configuration guidelines
- ❌ NO real API keys

**Your actual API keys should ONLY be in:**
- `.env.local` file (which is in `.gitignore`)
- Production environment variables (Vercel, etc.)
- Secure password manager

---

## Overview
This document provides comprehensive information about all API keys required for the AssessAI Teacher Exam Platform, including how to obtain them, configure them, and best practices for security.

---

## Table of Contents
1. [Required API Keys](#required-api-keys)
2. [Optional API Keys](#optional-api-keys)
3. [How to Obtain API Keys](#how-to-obtain-api-keys)
4. [Configuration](#configuration)
5. [Environment Variables](#environment-variables)
6. [Security Best Practices](#security-best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Cost Considerations](#cost-considerations)

---

## Required API Keys

### 1. Google AI API Key (Gemini)
**Status:** ✅ **REQUIRED** (Primary AI Provider)  
**Purpose:** Generate exam questions using Google's Gemini AI  
**Cost:** Free tier available (60 requests/minute)  
**Model Used:** `gemini-flash-latest`

**Why Required:**
- Primary AI provider for question generation
- Fast, real-time question generation
- High-quality, contextual questions
- Cost-effective with generous free tier

**Features Enabled:**
- ✅ AI-powered exam question generation
- ✅ Multiple question types (MCQ, True/False, Fill in the Blanks)
- ✅ Difficulty levels (Easy, Medium, Hard)
- ✅ Subject-specific questions
- ✅ AI chatbot support

**Environment Variables:**
```env
GOOGLE_GENAI_API_KEY=your_api_key_here
NEXT_PUBLIC_GOOGLE_GENAI_API_KEY=your_api_key_here
```

**Get Your Key:**
🔗 https://aistudio.google.com/app/apikey

---

## Optional API Keys

### 2. MongoDB Connection String
**Status:** ⚪ **OPTIONAL** (Recommended for Production)  
**Purpose:** Store data in MongoDB database  
**Cost:** Free tier available (512 MB storage)  
**Alternative:** File-based storage (JSON files)

**Why Optional:**
- System works with file-based storage by default
- MongoDB recommended for production/scalability
- Better performance with large datasets
- Cloud-based, accessible from anywhere

**Features Enabled:**
- ✅ Scalable data storage
- ✅ Cloud-based database
- ✅ Better query performance
- ✅ Automatic backups
- ✅ Multi-user support

**Environment Variables:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/exam-platform
STORAGE_URL=mongodb+srv://username:password@cluster.mongodb.net/exam-platform
```

**Get Your Connection String:**
🔗 https://www.mongodb.com/cloud/atlas

---

### 3. OpenAI API Key (GPT)
**Status:** ⚪ **OPTIONAL** (Fallback AI Provider)  
**Purpose:** Alternative AI provider for question generation  
**Cost:** Pay-as-you-go (starts at $0.002/1K tokens)  
**Model Used:** `gpt-4` or `gpt-3.5-turbo`

**Why Optional:**
- Fallback if Google AI is unavailable
- Alternative AI provider
- Proven reliability
- Good for specific use cases

**Features Enabled:**
- ✅ Fallback question generation
- ✅ Alternative AI responses
- ✅ Redundancy and reliability

**Environment Variables:**
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

**Get Your Key:**
🔗 https://platform.openai.com/api-keys

---

### 4. Anthropic Claude API Key
**Status:** ⚪ **OPTIONAL** (Fallback AI Provider)  
**Purpose:** Alternative AI provider using Claude Sonnet  
**Cost:** Pay-as-you-go (starts at $0.003/1K tokens)  
**Model Used:** `claude-3-sonnet-20240229`

**Why Optional:**
- Fallback if Google AI is unavailable
- Excellent reasoning capabilities
- Detailed explanations
- Safety features

**Features Enabled:**
- ✅ Fallback question generation
- ✅ Detailed answer explanations
- ✅ Complex reasoning support

**Environment Variables:**
```env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
```

**Get Your Key:**
🔗 https://console.anthropic.com/settings/keys

---

### 5. Vercel KV API Keys
**Status:** ⚪ **OPTIONAL** (Advanced Caching)  
**Purpose:** Fast key-value storage for caching  
**Cost:** Free tier available  
**Alternative:** Not required for basic functionality

**Why Optional:**
- Advanced caching feature
- Improves performance
- Edge-compatible
- Only needed for high-traffic deployments

**Features Enabled:**
- ✅ Fast data caching
- ✅ Session management
- ✅ Edge-compatible storage

**Environment Variables:**
```env
KV_URL=your_kv_url
KV_REST_API_URL=your_api_url
KV_REST_API_TOKEN=your_token
```

**Get Your Keys:**
🔗 https://vercel.com/docs/storage/vercel-kv

---

## How to Obtain API Keys

### Google AI (Gemini) - REQUIRED ⭐

**Step-by-Step Guide:**

1. **Visit Google AI Studio**
   - Go to: https://aistudio.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key" button
   - Select "Create API key in new project" or choose existing project
   - Copy the generated API key

3. **Configure in Project**
   - Open `teacher/.env.local` file
   - Add your API key:
   ```env
   GOOGLE_GENAI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_GOOGLE_GENAI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

4. **Verify Setup**
   - Restart your development server
   - Try creating an exam with AI questions
   - Check console for "Using Google AI" message

**Free Tier Limits:**
- ✅ 60 requests per minute
- ✅ 1,500 requests per day
- ✅ Sufficient for most use cases

---

### MongoDB Atlas - OPTIONAL

**Step-by-Step Guide:**

1. **Create Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Click "Try Free" and sign up

2. **Create Cluster**
   - Choose "Shared" (Free tier)
   - Select cloud provider and region
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Grant "Read and write to any database" permission

4. **Setup Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add your specific IP address

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Configure in Project**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/exam-platform?retryWrites=true&w=majority
   STORAGE_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/exam-platform?retryWrites=true&w=majority
   ```

**Free Tier Limits:**
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Sufficient for small to medium deployments

---

### OpenAI - OPTIONAL

**Step-by-Step Guide:**

1. **Create Account**
   - Go to: https://platform.openai.com/signup
   - Sign up with email or Google

2. **Add Payment Method**
   - Go to "Billing" → "Payment methods"
   - Add credit card (required even for free tier)
   - Set usage limits to control costs

3. **Create API Key**
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Give it a name (e.g., "AssessAI")
   - Copy the key immediately (won't be shown again)

4. **Configure in Project**
   ```env
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
   ```

**Pricing:**
- GPT-4: $0.03/1K input tokens, $0.06/1K output tokens
- GPT-3.5-turbo: $0.0015/1K input tokens, $0.002/1K output tokens
- Set usage limits to control costs

---

### Anthropic Claude - OPTIONAL

**Step-by-Step Guide:**

1. **Create Account**
   - Go to: https://console.anthropic.com/
   - Sign up with email

2. **Add Credits**
   - Go to "Billing"
   - Add payment method
   - Purchase credits ($5 minimum)

3. **Create API Key**
   - Go to: https://console.anthropic.com/settings/keys
   - Click "Create Key"
   - Give it a name
   - Copy the key

4. **Configure in Project**
   ```env
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
   ```

**Pricing:**
- Claude 3 Sonnet: $0.003/1K input tokens, $0.015/1K output tokens
- Claude 3 Haiku: $0.00025/1K input tokens, $0.00125/1K output tokens

---

## Configuration

### Environment File Setup

**1. Create `.env.local` File**

In the `teacher/` directory, create a file named `.env.local`:

```bash
# Navigate to teacher directory
cd teacher

# Create .env.local file
touch .env.local  # On Mac/Linux
# OR
type nul > .env.local  # On Windows
```

**2. Add Your API Keys**

Copy the template below and add your actual keys:

```env
# ============================================
# REQUIRED: Google AI (Gemini)
# ============================================
GOOGLE_GENAI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_GOOGLE_GENAI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ============================================
# OPTIONAL: MongoDB Database
# ============================================
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/exam-platform
# STORAGE_URL=mongodb+srv://username:password@cluster.mongodb.net/exam-platform

# ============================================
# OPTIONAL: OpenAI (GPT)
# ============================================
# OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
# NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx

# ============================================
# OPTIONAL: Anthropic (Claude)
# ============================================
# ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
# NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx

# ============================================
# OPTIONAL: Vercel KV
# ============================================
# KV_URL=your_kv_url
# KV_REST_API_URL=your_api_url
# KV_REST_API_TOKEN=your_token
```

**3. Restart Development Server**

After adding API keys, restart your server:

```bash
npm run dev
```

---

### Environment Variables Explained

#### Why Two Variables?

Some API keys have two versions:
- `API_KEY` - Used on server-side (API routes)
- `NEXT_PUBLIC_API_KEY` - Used on client-side (browser)

**Example:**
```env
GOOGLE_GENAI_API_KEY=xxx          # Server-side only
NEXT_PUBLIC_GOOGLE_GENAI_API_KEY=xxx  # Client-side accessible
```

**Security Note:** 
- Server-side keys are never exposed to the browser
- Client-side keys are visible in browser (use with caution)
- For production, use server-side keys only

---

### Verification

**Check if API Keys are Working:**

1. **Google AI (Gemini)**
   ```bash
   # Start server
   npm run dev
   
   # Create an exam with AI questions
   # Check browser console for:
   # "🤖 Using Google AI (Gemini Flash Latest)"
   # "✅ SUCCESS! Google AI generated X questions"
   ```

2. **MongoDB**
   ```bash
   # Check server logs for:
   # "Connected to MongoDB"
   # OR
   # "Using file-based storage"
   ```

3. **Test API Endpoint**
   ```bash
   # Visit: http://localhost:3003/api/exams
   # Should return JSON array (empty or with exams)
   ```

---

## Security Best Practices

### 1. Never Commit API Keys

**Add to `.gitignore`:**

```gitignore
# Environment variables
.env
.env.local
.env.production
.env.development

# API keys
*.key
*.pem
```

**Verify:**
```bash
# Check if .env.local is ignored
git status

# Should NOT show .env.local
```

---

### 2. Use Environment Variables

**✅ Good Practice:**
```typescript
// Access via environment variables
const apiKey = process.env.GOOGLE_GENAI_API_KEY;
```

**❌ Bad Practice:**
```typescript
// NEVER hardcode API keys
const apiKey = "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
```

---

### 3. Separate Keys for Environments

**Development:**
```env
# .env.local (local development)
GOOGLE_GENAI_API_KEY=dev_key_here
```

**Production:**
```env
# Vercel/Production environment
GOOGLE_GENAI_API_KEY=prod_key_here
```

---

### 4. Rotate Keys Regularly

**Best Practices:**
- Rotate API keys every 90 days
- Immediately rotate if compromised
- Use different keys for dev/prod
- Monitor usage for anomalies

**How to Rotate:**
1. Generate new API key
2. Update `.env.local`
3. Test thoroughly
4. Delete old key from provider
5. Update production environment

---

### 5. Limit API Key Permissions

**Google AI:**
- Restrict to specific APIs only
- Set usage quotas
- Monitor usage dashboard

**MongoDB:**
- Create separate users for dev/prod
- Grant minimum required permissions
- Use IP whitelisting

**OpenAI/Claude:**
- Set spending limits
- Monitor usage
- Use separate keys per project

---

### 6. Monitor Usage

**Set Up Alerts:**

**Google AI:**
- Visit: https://console.cloud.google.com/
- Set up billing alerts
- Monitor quota usage

**MongoDB:**
- Check Atlas dashboard
- Set up storage alerts
- Monitor connection count

**OpenAI:**
- Set usage limits in dashboard
- Enable email notifications
- Monitor spending

---

## Troubleshooting

### Common Issues

#### 1. "API Key Not Found" Error

**Problem:** Environment variables not loaded

**Solution:**
```bash
# 1. Check .env.local exists
ls -la teacher/.env.local

# 2. Verify file content
cat teacher/.env.local

# 3. Restart server
npm run dev

# 4. Check if variables are loaded
# Add to your code temporarily:
console.log('API Key:', process.env.GOOGLE_GENAI_API_KEY ? 'Found' : 'Not Found');
```

---

#### 2. "Invalid API Key" Error

**Problem:** API key is incorrect or expired

**Solution:**
1. Verify key is copied correctly (no extra spaces)
2. Check if key is active in provider dashboard
3. Generate new key if needed
4. Update `.env.local`
5. Restart server

---

#### 3. "Rate Limit Exceeded" Error

**Problem:** Too many requests to AI provider

**Solution:**
```typescript
// Add retry logic with exponential backoff
async function generateWithRetry(params, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateQuestions(params);
    } catch (error) {
      if (error.message.includes('rate limit')) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}
```

**Or:**
- Wait a few minutes
- Reduce request frequency
- Upgrade to paid tier
- Use fallback provider

---

#### 4. "MongoDB Connection Failed" Error

**Problem:** Cannot connect to MongoDB

**Solution:**
1. Check connection string format
2. Verify username/password
3. Check IP whitelist (0.0.0.0/0 for all)
4. Ensure cluster is running
5. Test connection:
   ```bash
   # Use MongoDB Compass or mongosh
   mongosh "mongodb+srv://cluster.mongodb.net/" --username user
   ```

**Fallback:**
- System will automatically use file-based storage
- Check console: "Using file-based storage"

---

#### 5. "CORS Error" in Browser

**Problem:** Client-side API key not set

**Solution:**
```env
# Add NEXT_PUBLIC_ prefix for client-side access
NEXT_PUBLIC_GOOGLE_GENAI_API_KEY=your_key_here
```

**Note:** Only use client-side keys for non-sensitive operations

---

### Debug Mode

**Enable Detailed Logging:**

```typescript
// Add to your AI client files
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('🔍 API Key Status:', {
    googleAI: !!process.env.GOOGLE_GENAI_API_KEY,
    openAI: !!process.env.OPENAI_API_KEY,
    claude: !!process.env.ANTHROPIC_API_KEY,
  });
}
```

---

## Cost Considerations

### Free Tier Comparison

| Provider | Free Tier | Limits | Best For |
|----------|-----------|--------|----------|
| **Google AI** | ✅ Yes | 60 req/min, 1500 req/day | Primary choice |
| **MongoDB** | ✅ Yes | 512 MB storage | Small to medium |
| **OpenAI** | ❌ No | $5 minimum | Fallback only |
| **Claude** | ❌ No | $5 minimum | Fallback only |
| **Vercel KV** | ✅ Yes | Limited storage | Optional |

---

### Cost Optimization Tips

**1. Use Google AI as Primary**
- Free tier is generous
- Fast response times
- High quality output

**2. Implement Caching**
```typescript
// Cache generated questions
const cache = new Map();

async function getCachedQuestions(params) {
  const key = JSON.stringify(params);
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const questions = await generateQuestions(params);
  cache.set(key, questions);
  return questions;
}
```

**3. Batch Requests**
```typescript
// Generate multiple questions in one request
const questions = await generateQuestions({
  ...params,
  numberOfQuestions: 10, // Instead of 10 separate requests
});
```

**4. Monitor Usage**
- Set up billing alerts
- Track API calls
- Review usage monthly
- Optimize inefficient code

**5. Use Fallbacks Wisely**
- Only use paid providers when free tier exhausted
- Implement smart fallback logic
- Monitor fallback usage

---

### Estimated Monthly Costs

**Scenario 1: Small School (100 students, 10 exams/month)**
- Google AI: $0 (within free tier)
- MongoDB: $0 (within free tier)
- **Total: $0/month**

**Scenario 2: Medium School (500 students, 50 exams/month)**
- Google AI: $0 (within free tier)
- MongoDB: $0 (within free tier)
- **Total: $0/month**

**Scenario 3: Large School (2000 students, 200 exams/month)**
- Google AI: $0-5 (may exceed free tier)
- MongoDB: $0-9 (may need paid tier)
- **Total: $0-14/month**

**Note:** Costs vary based on:
- Number of questions per exam
- Question complexity
- Data storage needs
- API usage patterns

---

## Production Deployment

### Vercel Deployment

**1. Add Environment Variables in Vercel:**

```bash
# Via Vercel Dashboard:
# Settings → Environment Variables → Add

# Or via CLI:
vercel env add GOOGLE_GENAI_API_KEY
vercel env add MONGODB_URI
```

**2. Set for All Environments:**
- ✅ Production
- ✅ Preview
- ✅ Development

**3. Redeploy:**
```bash
vercel --prod
```

---

### Other Platforms

**Netlify:**
```bash
# Site settings → Build & deploy → Environment
# Add each variable
```

**Railway:**
```bash
# Variables tab in project settings
# Add each variable
```

**Docker:**
```dockerfile
# Use .env file or pass via -e flag
docker run -e GOOGLE_GENAI_API_KEY=xxx app
```

---

## Quick Start Checklist

- [ ] Create `.env.local` file in `teacher/` directory
- [ ] Get Google AI API key from https://aistudio.google.com/app/apikey
- [ ] Add `GOOGLE_GENAI_API_KEY` to `.env.local`
- [ ] Add `NEXT_PUBLIC_GOOGLE_GENAI_API_KEY` to `.env.local`
- [ ] Restart development server (`npm run dev`)
- [ ] Test by creating an exam with AI questions
- [ ] Verify console shows "Using Google AI"
- [ ] (Optional) Set up MongoDB for production
- [ ] (Optional) Add OpenAI/Claude keys for fallback
- [ ] Add `.env.local` to `.gitignore`
- [ ] Never commit API keys to Git

---

## Support & Resources

### Official Documentation
- **Google AI:** https://ai.google.dev/docs
- **MongoDB:** https://docs.mongodb.com/
- **OpenAI:** https://platform.openai.com/docs
- **Anthropic:** https://docs.anthropic.com/
- **Next.js Env:** https://nextjs.org/docs/basic-features/environment-variables

### Community Support
- **GitHub Issues:** Report problems
- **Discord/Slack:** Community help
- **Stack Overflow:** Technical questions

### Contact
For project-specific issues, check the main README.md file.

---

**Last Updated:** November 29, 2024  
**Version:** 0.1.0  
**Security Level:** High Priority
