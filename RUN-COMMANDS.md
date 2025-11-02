# 🚀 Run Commands for Online Examination Platform

## 📋 All Available Commands

### 1. Run Locally (Development Mode)
```bash
cd teacher
npm run dev
```
Opens at: `http://localhost:3000`

### 2. Build for Production
```bash
cd teacher
npm run build
```

### 3. Run Production Build Locally
```bash
cd teacher
npm run build
npm start
```

### 4. Deploy to Vercel (Make it Public)
```bash
cd teacher
npx vercel --prod
```

### 5. Deploy and Auto-Open (PowerShell)
```powershell
cd teacher
.\deploy.ps1
```

## 🎯 Quick Start Commands

### First Time Setup:
```bash
# Navigate to project
cd "C:\Final project\teacher"

# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

### For Development (Local Testing):
```bash
cd teacher
npm run dev
```
Then open: http://localhost:3000

### For Production (Public Website):
```bash
cd teacher
npm run build
npx vercel --prod
```

## 📱 After Running Commands:

### Local Development URLs:
- Homepage: http://localhost:3000
- Registration: http://localhost:3000/register
- Teacher Login: http://localhost:3000/login
- Dashboard: http://localhost:3000/dashboard

### Production URLs (After Deploy):
- Homepage: https://online-platfrom.vercel.app
- Registration: https://online-platfrom.vercel.app/register
- Teacher Login: https://online-platfrom.vercel.app/login
- Dashboard: https://online-platfrom.vercel.app/dashboard

## 🔧 Troubleshooting Commands

### If npm install fails:
```bash
cd teacher
rm -rf node_modules
rm package-lock.json
npm install
```

### If build fails:
```bash
cd teacher
npm run build
```
Check the error messages and fix them.

### If deployment fails:
```bash
cd teacher
npx vercel --prod --debug
```

## 📊 Useful Commands

### Check if project is ready:
```bash
cd teacher
npm run build
```
If successful, you're ready to deploy!

### View all npm scripts:
```bash
cd teacher
npm run
```

### Update dependencies:
```bash
cd teacher
npm update
```

## 🎓 Recommended Workflow

### For Local Testing:
1. Open terminal
2. Run: `cd "C:\Final project\teacher"`
3. Run: `npm run dev`
4. Open browser: http://localhost:3000
5. Test the website
6. Press Ctrl+C to stop

### For Public Deployment:
1. Open terminal
2. Run: `cd "C:\Final project\teacher"`
3. Run: `npm run build` (test if it builds)
4. Run: `npx vercel --prod` (deploy)
5. Share the public URL with students!

## ⚡ One-Line Commands

### Run locally:
```bash
cd "C:\Final project\teacher" && npm run dev
```

### Build and deploy:
```bash
cd "C:\Final project\teacher" && npm run build && npx vercel --prod
```

## 🌐 Your Live Website

After deployment, your website is always available at:
**https://online-platfrom.vercel.app**

No need to run any commands - it's live 24/7!

Students can register anytime at:
**https://online-platfrom.vercel.app/register**
