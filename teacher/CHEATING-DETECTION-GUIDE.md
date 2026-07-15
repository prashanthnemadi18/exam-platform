# Advanced Cheating Detection Guide

## 🎯 Overview

This guide explains **how to detect cheating behaviors** during online exams using AI-powered facial analysis.

---

## 🚀 What We Built: Smart Proctoring System

###

 **Component**: `smart-proctoring.tsx`

### ✅ Cheating Behaviors Detected:

1. **No Face Detection** ⚠️
   - Student leaves camera view
   - Looks down at phone/notes
   - Covers camera

2. **Multiple Faces** 🚫
   - Another person helping
   - Multiple students sharing exam
   - Someone else taking exam

3. **Identity Verification** 👤
   - Different person takes over
   - Face swapping detected
   - Person switching

4. **Gaze Tracking** 👁️
   - Looking left/right (at notes)
   - Looking down (at phone)
   - Looking up (thinking vs cheating)
   - Eyes off screen repeatedly

5. **Emotion Analysis** 😠
   - Suspicious emotions (angry, fearful)
   - Stress patterns
   - Unusual facial expressions

6. **Head Position** 🔄
   - Head turned away from screen
   - Extreme angles (reading notes)
   - Unusual postures

7. **Object Detection** 📱
   - Phone near face
   - Hand covering face
   - Objects blocking view

---

## 🧠 AI Technologies Used

### 1. **Face-API.js** (Current Implementation)

**What it does**:
- Detects faces in video
- Recognizes facial landmarks (68 points)
- Analyzes emotions (7 types)
- Creates face descriptors for identity

**Features**:
```javascript
✅ Face Detection - Find faces in frame
✅ Face Landmarks - 68 facial points
✅ Face Recognition - Identity verification
✅ Emotion Detection - 7 emotions
   - Happy, Sad, Angry, Fearful
   - Disgusted, Surprised, Neutral
```

**How it works**:
```
1. Capture reference face at exam start
2. Every 2 seconds: analyze current frame
3. Compare with reference (identity check)
4. Detect emotions and gaze direction
5. Track suspicious behaviors
6. Calculate suspicion score (0-100%)
7. Trigger violations when threshold met
```

---

## 📊 Cheating Detection Logic

### 1. **No Face Detection**
```typescript
if (numFaces === 0) {
  noFaceWarnings++;
  suspicionLevel += 10;
  
  if (noFaceWarnings >= 3) {
    terminateExam("Student left camera view");
  }
}
```

**Triggers**:
- 3 consecutive detections with no face
- Total suspicion increase: 30%

### 2. **Multiple Faces**
```typescript
if (numFaces > 1) {
  multipleFaceWarnings++;
  suspicionLevel += 25;
  
  if (multipleFaceWarnings >= 2) {
    terminateExam(`${numFaces} people detected`);
  }
}
```

**Triggers**:
- 2 detections with multiple faces
- Total suspicion increase: 50%

### 3. **Identity Verification**
```typescript
const distance = faceapi.euclideanDistance(
  referenceDescriptor,  // Face at start
  currentDescriptor     // Face now
);

if (distance > 0.6) {
  terminateExam("Different person detected");
}
```

**How it works**:
- Captures face "fingerprint" at exam start
- Compares every frame to reference
- Distance < 0.6 = same person
- Distance > 0.6 = different person

### 4. **Gaze Tracking**
```typescript
const gazeDirection = analyzeGaze(landmarks);

if (gazeDirection.lookingAway) {
  lookingAwayCount++;
  suspicionLevel += 5;
  
  if (lookingAwayCount >= 5) {
    reportViolation("Looking away repeatedly");
  }
}
```

**Gaze Directions Detected**:
- ⬅️ Left (reading notes?)
- ➡️ Right (another screen?)
- ⬆️ Up (thinking or ceiling notes?)
- ⬇️ Down (phone or notes?)
- ✅ Center (focused on screen)

### 5. **Emotion Analysis**
```typescript
const dominantEmotion = getDominantEmotion(expressions);

if (['angry', 'fearful', 'disgusted'].includes(dominantEmotion)) {
  if (confidence > 0.7) {
    suspiciousEmotionCount++;
    suspicionLevel += 3;
  }
}
```

**Suspicious Emotions**:
- 😠 Angry (frustration, caught cheating?)
- 😨 Fearful (nervous, hiding something?)
- 🤢 Disgusted (reaction to being caught?)

**Normal Emotions**:
- 😐 Neutral (focused)
- 😊 Happy (confident)
- 😮 Surprised (difficult question)

### 6. **Head Pose Analysis**
```typescript
const headPose = analyzeHeadPose(landmarks);

if (Math.abs(headPose.yaw) > 45) {
  // Head turned more than 45 degrees
  reportBehavior("Head turned away", "medium");
}
```

**Head Angles**:
- Yaw: Left/Right rotation
- Pitch: Up/Down tilt  
- Roll: Side tilt

### 7. **Suspicion Scoring System**
```typescript
let suspicionLevel = 0;

// Violations add to suspicion:
noFace         → +10%
multipleFaces  → +25%
lookingAway    → +5%
phonDetected   → +20%
wrongPerson    → +100% (instant termination)

// Thresholds:
0-40%   = Green (Normal behavior)
41-70%  = Orange (Suspicious)
71-100% = Red (High risk)
```

---

## 🎥 How to Use

### Step 1: Download AI Models

Face-API requires model files. Download them:

```bash
# Create models folder
mkdir public/models

# Download from:
https://github.com/justadudewhohacks/face-api.js/tree/master/weights
```

**Required Models**:
- tiny_face_detector_model-weights_manifest.json
- tiny_face_detector_model-shard1
- face_landmark_68_model-weights_manifest.json
- face_landmark_68_model-shard1
- face_recognition_model-weights_manifest.json
- face_recognition_model-shard1
- face_expression_model-weights_manifest.json
- face_expression_model-shard1

### Step 2: Use Smart Proctoring Component

```typescript
import { SmartProctoring } from "@/components/exam/smart-proctoring";

function ExamPage() {
  const handleCheatingDetected = (
    reason: string, 
    severity: 'low' | 'medium' | 'high'
  ) => {
    if (severity === 'high') {
      terminateExam(reason);
    } else {
      warnStudent(reason);
    }
  };

  return (
    <SmartProctoring
      onCheatingDetected={handleCheatingDetected}
      isActive={examInProgress}
    />
  );
}
```

### Step 3: Handle Violations

```typescript
const terminateExam = (reason: string) => {
  // Stop exam
  setExamTerminated(true);
  
  // Save violation to database
  saveViolation({
    studentId,
    examId,
    reason,
    timestamp: new Date(),
    severity: 'high'
  });
  
  // Show message to student
  alert(`Exam terminated: ${reason}`);
  
  // Redirect or lock screen
  router.push('/exam/terminated');
};
```

---

## 📈 Advanced Features You Can Add

### 1. **Screen Recording**
```typescript
// Record screen activity
const screenStream = await navigator.mediaDevices.getDisplayMedia({
  video: { mediaSource: 'screen' }
});

const recorder = new MediaRecorder(screenStream);
recorder.start();
```

### 2. **Tab Switching Detection**
```typescript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    tabSwitchCount++;
    
    if (tabSwitchCount >= 3) {
      terminateExam("Switched tabs multiple times");
    }
  }
});
```

### 3. **Copy-Paste Detection**
```typescript
document.addEventListener('paste', (e) => {
  e.preventDefault();
  warnStudent("Pasting is not allowed");
  violationCount++;
});
```

### 4. **Right-Click Detection**
```typescript
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  warnStudent("Right-click is disabled");
});
```

### 5. **Browser Back/Forward Detection**
```typescript
window.addEventListener('popstate', () => {
  warnStudent("Navigation is disabled during exam");
  window.history.pushState(null, '', window.location.href);
});
```

### 6. **Audio Analysis**
```typescript
// Detect if student is talking (getting help)
const audioContext = new AudioContext();
const analyzer = audioContext.createAnalyser();

// Analyze audio levels
if (audioLevel > threshold) {
  warnStudent("Please remain silent during exam");
}
```

### 7. **Eye Tracking**
```typescript
// Track eye movements (requires special library)
import { EyeTracker } from 'webgazer';

const gaze = await EyeTracker.getCurrentPrediction();

if (gaze.x < 0 || gaze.x > screenWidth) {
  warnStudent("Please focus on the screen");
}
```

### 8. **AI-Powered Behavior Analysis**
```typescript
// Use Groq/GPT to analyze behavior patterns
const behaviorAnalysis = await analyzeWithAI({
  emotions: emotionHistory,
  gazePatterns: gazeHistory,
  violations: violationHistory
});

if (behaviorAnalysis.cheatingLikelihood > 0.8) {
  reportSuspiciousBehavior();
}
```

---

## 🔧 Configuration

### Adjust Detection Sensitivity

```typescript
// In smart-proctoring.tsx

// Stricter detection
const NO_FACE_THRESHOLD = 2;        // Was 3
const MULTIPLE_FACE_THRESHOLD = 1;  // Was 2
const LOOKING_AWAY_THRESHOLD = 3;   // Was 5

// More lenient
const NO_FACE_THRESHOLD = 5;
const MULTIPLE_FACE_THRESHOLD = 3;
const LOOKING_AWAY_THRESHOLD = 10;
```

### Adjust Suspicion Thresholds

```typescript
// Low risk
if (suspicionLevel > 30) showWarning();
if (suspicionLevel > 60) increasedMonitoring();
if (suspicionLevel > 90) terminateExam();

// High risk  
if (suspicionLevel > 20) showWarning();
if (suspicionLevel > 40) increasedMonitoring();
if (suspicionLevel > 70) terminateExam();
```

---

## 📝 Example: Complete Cheating Report

```json
{
  "studentId": "ST12345",
  "examId": "EXAM789",
  "examTitle": "Calculus Final",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T10:45:32Z",
  "terminated": true,
  "terminationReason": "Multiple violations detected",
  "suspicionLevel": 85,
  "violations": [
    {
      "timestamp": "2024-01-15T10:15:23Z",
      "type": "no_face",
      "severity": "medium",
      "description": "No face detected",
      "count": 1
    },
    {
      "timestamp": "2024-01-15T10:23:45Z",
      "type": "looking_away",
      "severity": "low",
      "description": "Looking right",
      "count": 3
    },
    {
      "timestamp": "2024-01-15T10:35:12Z",
      "type": "multiple_faces",
      "severity": "high",
      "description": "2 faces detected",
      "count": 1
    },
    {
      "timestamp": "2024-01-15T10:45:32Z",
      "type": "identity_change",
      "severity": "high",
      "description": "Different person detected",
      "count": 1
    }
  ],
  "behaviorSummary": {
    "totalNoFaceEvents": 4,
    "totalMultipleFaceEvents": 2,
    "totalLookingAwayEvents": 8,
    "averageEmotion": "neutral",
    "suspiciousEmotions": 2,
    "finalSuspicionScore": 85
  }
}
```

---

## 🎯 Best Practices

### 1. **Clear Communication**
```markdown
Before exam:
- Inform students about proctoring
- Explain what behaviors are monitored
- Provide technical requirements
- Allow practice session
```

### 2. **Fair Warning System**
```typescript
// Give students chances to correct
1st violation → Warning message
2nd violation → Serious warning
3rd violation → Exam termination
```

### 3. **Technical Support**
```markdown
- Provide troubleshooting guide
- Offer pre-exam tech check
- Have backup plan for tech issues
- Allow appeals for false positives
```

### 4. **Privacy Protection**
```markdown
- Don't record video
- Process locally in browser
- Don't store facial data
- Clear data after exam
- Comply with GDPR/FERPA
```

---

## 🐛 Troubleshooting

### Models Not Loading
```bash
# Verify models are in public/models/
ls public/models/

# Check console for errors
# Download models from official repo
```

### False Positives
```typescript
// Adjust thresholds
const IDENTITY_THRESHOLD = 0.7;  // Was 0.6 (more lenient)
const EMOTION_CONFIDENCE = 0.8;  // Was 0.7 (stricter)
```

### Performance Issues
```typescript
// Reduce detection frequency
setInterval(analyze, 3000);  // Was 2000ms

// Lower video resolution
video: { width: 320, height: 240 }
```

---

## 📚 Summary

✅ **Installed**: face-api.js  
✅ **Created**: Smart proctoring component  
✅ **Detects**: 
- No face (student leaving)
- Multiple faces (getting help)
- Identity changes (person switching)
- Gaze direction (looking at notes)
- Suspicious emotions (nervous, angry)
- Head position (turned away)
- Objects near face (phone)

✅ **Features**:
- Real-time AI analysis
- Suspicion scoring (0-100%)
- Warning system
- Automatic termination
- Behavior tracking

🚀 **Ready to use!**

Download models → Use component → Test thoroughly → Deploy!
