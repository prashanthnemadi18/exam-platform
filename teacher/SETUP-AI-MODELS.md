# Setup AI Models for Face Detection

## 📦 Required Models

To use smart proctoring with face detection, you need to download AI model files.

---

## 🚀 Quick Setup

### Option 1: Automatic Download (Recommended)

Run this command in your project:

```bash
cd teacher
npx degit justadudewhohacks/face-api.js/weights public/models
```

### Option 2: Manual Download

1. **Create models folder**:
```bash
mkdir public/models
```

2. **Download from GitHub**:

Visit: [Face-API Models](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)

3. **Download these files**:

**Tiny Face Detector** (Required):
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1`

**Face Landmarks** (Required):
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`

**Face Recognition** (Required):
- `face_recognition_model-weights_manifest.json`
- `face_recognition_model-shard1`

**Face Expression** (Required):
- `face_expression_model-weights_manifest.json`
- `face_expression_model-shard1`

4. **Place all files in** `public/models/`

---

## 📁 Final Folder Structure

```
teacher/
├── public/
│   ├── models/
│   │   ├── tiny_face_detector_model-weights_manifest.json
│   │   ├── tiny_face_detector_model-shard1
│   │   ├── face_landmark_68_model-weights_manifest.json
│   │   ├── face_landmark_68_model-shard1
│   │   ├── face_recognition_model-weights_manifest.json
│   │   ├── face_recognition_model-shard1
│   │   ├── face_expression_model-weights_manifest.json
│   │   └── face_expression_model-shard1
│   └── ...
└── ...
```

---

## ✅ Verify Setup

1. **Start development server**:
```bash
npm run dev
```

2. **Check browser console** for:
```
🤖 Loading AI models for smart proctoring...
✅ All AI models loaded successfully
```

3. **If you see errors**:
```
❌ Failed to load AI models
```

Check:
- Files are in `public/models/`
- File names match exactly
- No extra spaces or typos
- Files downloaded completely

---

## 📊 Model Sizes

| Model | Size | Purpose |
|-------|------|---------|
| Tiny Face Detector | ~200KB | Fast face detection |
| Face Landmarks | ~350KB | 68 facial points |
| Face Recognition | ~6MB | Identity verification |
| Face Expression | ~300KB | Emotion detection |

**Total**: ~7MB (one-time download)

---

## 🎯 Alternative: Use CDN (Not Recommended)

If you can't download locally, use CDN:

```typescript
// In smart-proctoring.tsx
const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
```

⚠️ **Drawbacks**:
- Slower loading
- Requires internet during exam
- Less reliable
- Privacy concerns

**Use local models for production!**

---

## 🔧 Troubleshooting

### "Failed to fetch models"

**Solution 1**: Check file paths
```bash
ls -la public/models/
```

**Solution 2**: Clear browser cache
```
Ctrl + Shift + Delete → Clear cache
```

**Solution 3**: Check Network tab
```
Open DevTools → Network → Filter: models
See which files failed to load
```

### "Model weights manifest not found"

Ensure you downloaded BOTH files:
- `.json` manifest file
- Corresponding shard file(s)

### Slow Model Loading

Models load on first use. To preload:

```typescript
// Add to app startup
useEffect(() => {
  async function preloadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');
  }
  
  preloadModels();
}, []);
```

---

## 📝 Testing

After setup, test the component:

```bash
# Start dev server
npm run dev

# Open browser
http://localhost:3000

# Navigate to exam page
# Check if camera proctoring shows:
✓ "AI models loaded successfully"
✓ Face detection working
✓ Bounding boxes appearing
✓ Emotion labels showing
```

---

## 🚀 Production Deployment

Before deploying:

1. **Verify models are committed**:
```bash
git add public/models/
git commit -m "Add AI models for face detection"
```

2. **Check `.gitignore`** doesn't exclude models:
```bash
# Make sure this is NOT in .gitignore:
# public/models/
```

3. **Test in production build**:
```bash
npm run build
npm start

# Verify models load correctly
```

4. **For Vercel deployment**:
```bash
# Models in public/ folder are automatically deployed
# No extra configuration needed
```

---

## ✅ Checklist

Before using smart proctoring:

- [ ] Downloaded all 8 model files
- [ ] Placed in `public/models/` folder
- [ ] Verified folder structure
- [ ] Tested in development
- [ ] Checked browser console for success
- [ ] Tested face detection working
- [ ] Committed models to git
- [ ] Ready for production

---

## 🎉 Done!

Your AI models are set up! Now you can use:

```typescript
import { SmartProctoring } from "@/components/exam/smart-proctoring";

<SmartProctoring
  onCheatingDetected={handleCheating}
  isActive={examStarted}
/>
```

🤖 AI-powered cheating detection is ready!
