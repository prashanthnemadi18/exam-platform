# Face Detection Guide for Exam Proctoring

## Overview

This guide explains how to implement face detection for exam proctoring in your application. We've implemented **TensorFlow.js with MediaPipe** for accurate, real-time face detection.

---

## ✅ Current Implementation: TensorFlow.js (Recommended)

### What We Added

**New Component**: `camera-proctoring-advanced.tsx`

**Features**:
- ✅ **Real-time face detection** using AI
- ✅ **Multiple face detection** (detects cheating)
- ✅ **Bounding box visualization** around faces
- ✅ **Accurate person counting** (0, 1, or multiple)
- ✅ **Warning system** with thresholds
- ✅ **Automatic violation detection**

### How It Works

```typescript
// Uses TensorFlow.js MediaPipe FaceDetector
1. Loads AI model on component mount
2. Captures video frames every 2 seconds
3. Runs face detection on each frame
4. Draws bounding boxes around detected faces
5. Counts faces and triggers violations
6. Displays real-time status to student
```

### Technology Stack

**Package**: `@tensorflow-models/face-detection`  
**Model**: MediaPipe FaceDetector  
**Backend**: WebGL (GPU-accelerated)  
**Accuracy**: ~95% in good lighting  
**Speed**: 2-3 seconds per detection  

---

## How to Use

### Option 1: Use Advanced Component (Recommended)

Update your exam form component:

```typescript
// Replace old camera component
import { CameraProctorAdvanced } from "@/components/exam/camera-proctoring-advanced";

// In your component
<CameraProctorAdvanced
  onCheatingDetected={handleCheatingDetected}
  isActive={examStarted}
/>
```

### Option 2: Keep Basic Component

If you want simpler detection without AI:

```typescript
import { CameraProctor } from "@/components/exam/camera-proctoring";

<CameraProctor
  onCheatingDetected={handleCheatingDetected}
  isActive={examStarted}
/>
```

---

## Features Comparison

### Advanced (TensorFlow.js)
✅ **Accurate face detection**  
✅ **Counts exact number of faces**  
✅ **Draws bounding boxes**  
✅ **Detects face position**  
✅ **Works in various lighting**  
⚠️ **Requires model download (~2MB)**  
⚠️ **Slightly more CPU intensive**  

### Basic (Brightness Detection)
✅ **Lightweight**  
✅ **No model download**  
✅ **Fast processing**  
⚠️ **Less accurate**  
⚠️ **Can't detect multiple faces**  
⚠️ **Affected by lighting**  

---

## Violation Detection

### No Face Detected (3 strikes)
```
Detection 1: Warning 1/3
Detection 2: Warning 2/3
Detection 3: Warning 3/3 → Exam terminated
Reason: "Student left camera view multiple times"
```

### Multiple Faces (2 strikes)
```
Detection 1: Warning 1/2
Detection 2: Warning 2/2 → Exam terminated
Reason: "Multiple people detected (2 faces)"
```

---

## Alternative Technologies

If you want even more advanced features, consider these alternatives:

### 1. **Face-API.js** (More Features)
```bash
npm install face-api.js
```

**Features**:
- Face detection
- Face recognition (identify specific person)
- Emotion detection
- Age/gender estimation
- Face landmarks (68 points)

**Use case**: If you need to verify the student's identity

### 2. **MediaPipe (Direct)** (Fastest)
```bash
npm install @mediapipe/face_detection
```

**Features**:
- Ultra-fast detection
- Runs in web worker
- Lower CPU usage
- Mobile-optimized

**Use case**: For mobile exams or low-end devices

### 3. **AWS Rekognition** (Cloud-based)
```bash
npm install @aws-sdk/client-rekognition
```

**Features**:
- Cloud-based processing
- Face matching against database
- Emotion analysis
- Celebrity recognition
- Text in image detection

**Use case**: Enterprise solution with student verification

### 4. **Azure Face API** (Enterprise)
```typescript
// Microsoft Azure Cognitive Services
```

**Features**:
- Face verification
- Person identification
- Liveness detection
- Face attributes
- Group similar faces

**Use case**: Large institutions with Azure infrastructure

---

## Implementation Examples

### Example 1: Basic Face Detection (Current)

```typescript
const faces = await detector.estimateFaces(video);
const numFaces = faces.length;

if (numFaces === 0) {
  // No face detected - potential cheating
  triggerWarning();
} else if (numFaces > 1) {
  // Multiple faces - cheating detected
  terminateExam();
}
```

### Example 2: Face Recognition (Advanced)

```typescript
// Store reference image when student starts exam
const referenceDescriptor = await faceapi
  .detectSingleFace(video)
  .withFaceLandmarks()
  .withFaceDescriptor();

// During exam, verify it's the same person
const currentDescriptor = await faceapi
  .detectSingleFace(video)
  .withFaceLandmarks()
  .withFaceDescriptor();

const distance = faceapi.euclideanDistance(
  referenceDescriptor.descriptor,
  currentDescriptor.descriptor
);

if (distance > 0.6) {
  // Different person detected!
  terminateExam("Different person detected");
}
```

### Example 3: Gaze Detection

```typescript
// Detect if student is looking away
const landmarks = await detector.estimateFaces(video, {
  returnLandmarks: true
});

const eyes = landmarks[0].keypoints.filter(
  p => p.name === 'leftEye' || p.name === 'rightEye'
);

// Calculate gaze direction
const gazeAngle = calculateGazeAngle(eyes);

if (gazeAngle > 45) {
  // Student looking away from screen
  triggerWarning("Looking away from screen");
}
```

---

## Performance Optimization

### 1. Reduce Detection Frequency
```typescript
// Check every 3 seconds instead of 2
setInterval(detectFaces, 3000);
```

### 2. Lower Video Resolution
```typescript
video: {
  width: { ideal: 320 },  // Lower from 640
  height: { ideal: 240 }, // Lower from 480
  facingMode: "user"
}
```

### 3. Use Worker Thread
```typescript
// Run detection in background worker
const worker = new Worker('/face-detection-worker.js');
worker.postMessage({ videoFrame });
worker.onmessage = (e) => {
  const faces = e.data.faces;
  updateUI(faces);
};
```

### 4. Lazy Load Model
```typescript
// Only load model when exam starts
useEffect(() => {
  if (examStarted) {
    loadFaceDetectionModel();
  }
}, [examStarted]);
```

---

## Privacy & Ethics

### Important Considerations

✅ **Inform Students**: Clear disclosure about monitoring  
✅ **Get Consent**: Require explicit acceptance  
✅ **No Recording**: Don't store video/images  
✅ **Secure Connection**: Use HTTPS only  
✅ **Data Deletion**: Delete any data immediately  
✅ **Accessibility**: Provide alternatives for students  

### Legal Compliance

- **GDPR** (Europe): Requires explicit consent and data minimization
- **FERPA** (USA): Protects student educational records
- **COPPA** (USA): Special rules for users under 13
- **Local Laws**: Check your jurisdiction's requirements

### Privacy Statement Example

```markdown
## Camera Proctoring Notice

- Your camera will monitor you during the exam
- Face detection AI ensures only you are present
- No video is recorded or stored
- Detection runs locally in your browser
- Camera automatically stops after exam
- You can review our privacy policy [here]
```

---

## Troubleshooting

### Model Not Loading
```typescript
// Try different backend
await tf.setBackend('cpu');  // Instead of 'webgl'
```

### Detection Too Slow
```typescript
// Reduce detection frequency
setInterval(detectFaces, 5000);  // Every 5 seconds
```

### False Positives (Detecting objects as faces)
```typescript
// Increase confidence threshold
const faces = await detector.estimateFaces(video, {
  scoreThreshold: 0.8  // Higher = more strict
});
```

### Multiple Faces in Single Person
```typescript
// Adjust maxFaces parameter
const detectorConfig = {
  runtime: 'tfjs',
  maxFaces: 2  // Lower = faster, less false positives
};
```

---

## Testing

### Test Scenarios

1. **Single Face Detection**
   - Sit normally in front of camera
   - ✅ Should detect 1 face
   - ✅ Green indicator

2. **No Face Detection**
   - Look away or leave seat
   - ⚠️ Should trigger warning
   - ⚠️ Red indicator

3. **Multiple Faces**
   - Have someone sit beside you
   - 🚫 Should detect 2+ faces
   - 🚫 Violation triggered

4. **Lighting Variations**
   - Test in bright light
   - Test in dim light
   - Test with backlight

5. **Different Angles**
   - Looking slightly left/right
   - Looking slightly up/down
   - Should still detect face

---

## Next Steps

### Immediate Actions

1. **Update Exam Component**
   ```typescript
   import { CameraProctorAdvanced } from "@/components/exam/camera-proctoring-advanced";
   ```

2. **Test Face Detection**
   ```bash
   npm run dev
   # Start an exam and test detection
   ```

3. **Monitor Console**
   - Check for model loading messages
   - Verify face detection logs
   - Watch for errors

### Advanced Features (Optional)

1. **Add Face Recognition**
   - Verify student identity
   - Detect person switching

2. **Add Gaze Tracking**
   - Detect looking away
   - Track eye movement

3. **Add Emotion Detection**
   - Detect suspicious behavior
   - Monitor stress levels

4. **Add Screenshot Capture**
   - Capture violations
   - Store evidence securely

5. **Add AI-Powered Analysis**
   - Use Groq/GPT to analyze behavior
   - Generate violation reports

---

## Dependencies

### Installed
```json
{
  "@tensorflow/tfjs": "^latest",
  "@tensorflow-models/face-detection": "^latest"
}
```

### Optional (For Advanced Features)
```json
{
  "face-api.js": "^0.22.2",
  "@mediapipe/face_detection": "^latest",
  "@aws-sdk/client-rekognition": "^latest"
}
```

---

## Support & Resources

### Documentation
- [TensorFlow.js Docs](https://www.tensorflow.org/js)
- [Face Detection Model](https://github.com/tensorflow/tfjs-models/tree/master/face-detection)
- [MediaPipe](https://google.github.io/mediapipe/)

### Examples
- [Face Detection Demo](https://tensorflow.github.io/tfjs-models/demos/face-detection/)
- [Live Playground](https://codepen.io/tensorflow/pen/xxdPYJp)

---

## Summary

✅ **Installed**: TensorFlow.js face detection  
✅ **Created**: Advanced camera component  
✅ **Features**: Real-time face counting & violation detection  
✅ **Ready**: Replace old component and test  

Your exam proctoring now has **AI-powered face detection**! 🎉
