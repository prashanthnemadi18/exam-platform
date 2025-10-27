# Deployment Guide - AssessAI Online Examination Platform

This guide will help you deploy your online examination website to a real domain (not localhost).

## 🎯 Quick Start - Deploy in 5 Minutes

### Vercel (Easiest & FREE)

1. **Create GitHub Repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub
   - Click "Import Project"
   - Select your repository
   - Configure:
     - **Root Directory:** `teacher`
     - **Build Command:** `npm run build`
     - **Output Directory:** `.next`
   - Add Environment Variable:
     - Key: `GOOGLE_GENAI_API_KEY`
     - Value: Your Google AI API key
   - Click "Deploy"

3. **Access Your Live Website:**
   - Vercel provides: `https://your-project-name.vercel.app`
   - Share this URL with teachers and students!

## 📋 How It Works

Once deployed, your website will have:

### Teacher Access
- **Login Page:** `https://your-site.vercel.app/login`
- **Registration:** `https://your-site.vercel.app/register`
- **Dashboard:** Create exams, generate shareable links, view analytics

### Student Access
- **Exam Links:** Teachers generate unique links like:
  - `https://your-site.vercel.app/exam/abc123`
- Students click the link to take the exam
- No localhost needed - works from anywhere!

## 🌐 Other Deployment Options

### Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   cd teacher
   npm run build
   netlify deploy --prod
   ```

3. **Or use Netlify Dashboard:**
   - Go to [netlify.com](https://netlify.com)
   - Connect GitHub repository
   - Set build settings:
     - Base directory: `teacher`
     - Build command: `npm run build`
     - Publish directory: `.next`

### Railway

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

3. **Add Environment Variables:**
   ```bash
   railway variables set GOOGLE_GENAI_API_KEY=your_key_here
   ```

### Render

1. **Create `render.yaml`:**
   ```yaml
   services:
     - type: web
       name: exam-platform
       env: node
       buildCommand: cd teacher && npm install && npm run build
       startCommand: cd teacher && npm start
       envVars:
         - key: GOOGLE_GENAI_API_KEY
           sync: false
   ```

2. **Deploy:**
   - Push to GitHub
   - Connect repository on [render.com](https://render.com)
   - Add environment variables

## 🔧 Environment Variables

Make sure to set these on your hosting platform:

```
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
```

## 🎓 Usage After Deployment

### For Teachers:

1. Visit your live website: `https://your-site.vercel.app`
2. Register/Login at `/login`
3. Create exams in the dashboard
4. Click "Generate Link" to create shareable exam URLs
5. Share the exam link with students via email, WhatsApp, etc.

### For Students:

1. Receive exam link from teacher
2. Click the link (e.g., `https://your-site.vercel.app/exam/xyz789`)
3. Register/Login if required
4. Take the exam
5. Submit and view results

## 🔒 Security Considerations

- Never commit `.env.local` to Git
- Use environment variables on hosting platform
- Enable HTTPS (automatic on Vercel/Netlify)
- Consider adding authentication middleware

## 📊 Monitoring

- **Vercel:** Built-in analytics and logs
- **Netlify:** Analytics dashboard
- **Railway:** Logs and metrics in dashboard

## 🆘 Troubleshooting

### Build Fails
```bash
# Test build locally first
cd teacher
npm run build
```

### Environment Variables Not Working
- Check spelling of variable names
- Redeploy after adding variables
- Check platform-specific syntax

### 404 Errors
- Ensure root directory is set to `teacher`
- Check Next.js routing configuration

## 💡 Custom Domain (Optional)

After deploying, you can add your own domain:

1. **Buy a domain** (e.g., from Namecheap, GoDaddy)
2. **Add to Vercel:**
   - Go to Project Settings → Domains
   - Add your domain
   - Update DNS records as instructed
3. **Your site becomes:** `https://yourexamsite.com`

## 🎉 Success!

Your online examination platform is now live and accessible from anywhere in the world!

Teachers can login, create exams, and share links.
Students can access exams via the shared links.
No localhost required!
