"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, AlertTriangle, Eye, Brain, Users, UserX, Angry, Frown } from "lucide-react";
import * as faceapi from 'face-api.js';

interface SmartProctoringProps {
  onCheatingDetected: (reason: string, severity: 'low' | 'medium' | 'high') => void;
  isActive: boolean;
}

interface CheatingBehavior {
  type: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export function SmartProctoring({ onCheatingDetected, isActive }: SmartProctoringProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelsLoadingProgress, setModelsLoadingProgress] = useState(0);
  const [currentAnalysis, setCurrentAnalysis] = useState<string>("Initializing...");
  
  // Detection states
  const [faceCount, setFaceCount] = useState(0);
  const [currentEmotion, setCurrentEmotion] = useState<string>("");
  const [gazeDirection, setGazeDirection] = useState<string>("center");
  const [phoneDetected, setPhoneDetected] = useState(false);
  
  // Cheating tracking
  const [behaviors, setBehaviors] = useState<CheatingBehavior[]>([]);
  const [suspicionLevel, setSuspicionLevel] = useState(0); // 0-100
  
  // Warnings
  const [noFaceCount, setNoFaceCount] = useState(0);
  const [multipleFaceCount, setMultipleFaceCount] = useState(0);
  const [lookingAwayCount, setLookingAwayCount] = useState(0);
  const [suspiciousEmotionCount, setSuspiciousEmotionCount] = useState(0);
  
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const referenceDescriptorRef = useRef<Float32Array | null>(null);

  // Load Face-API models
  useEffect(() => {
    if (!isActive) return;

    async function loadModels() {
      try {
        console.log('🤖 Loading AI models for smart proctoring...');
        setCurrentAnalysis("Loading AI models...");
        
        const MODEL_URL = '/models'; // Models should be in public/models folder
        
        // Load multiple models for comprehensive analysis
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);

        setModelLoaded(true);
        setModelsLoadingProgress(100);
        setCurrentAnalysis("AI models loaded successfully");
        console.log('✅ All AI models loaded successfully');
      } catch (error) {
        console.error('❌ Failed to load AI models:', error);
        setCurrentAnalysis("Failed to load AI models");
        // Fallback: Continue without advanced features
      }
    }

    loadModels();
  }, [isActive]);

  // Start camera
  useEffect(() => {
    if (!isActive) return;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user"
          },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraEnabled(true);
          setCurrentAnalysis("Camera active - Monitoring started");
        }
      } catch (error: any) {
        console.error("Camera error:", error);
        onCheatingDetected("Camera access denied or not available", 'high');
      }
    }

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, onCheatingDetected]);

  // Capture reference face (first detection)
  useEffect(() => {
    if (!cameraEnabled || !modelLoaded || referenceDescriptorRef.current) return;

    const captureReference = async () => {
      if (!videoRef.current) return;

      try {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          referenceDescriptorRef.current = detection.descriptor;
          console.log('✅ Reference face captured for identity verification');
          setCurrentAnalysis("Identity captured - Monitoring active");
        }
      } catch (error) {
        console.error('Failed to capture reference face:', error);
      }
    };

    setTimeout(captureReference, 3000); // Capture after 3 seconds
  }, [cameraEnabled, modelLoaded]);

  // Main detection loop
  useEffect(() => {
    if (!cameraEnabled || !isActive || !modelLoaded) return;

    detectionIntervalRef.current = setInterval(() => {
      performSmartAnalysis();
    }, 2000); // Analyze every 2 seconds

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraEnabled, isActive, modelLoaded]);

  // Smart Analysis Function
  const performSmartAnalysis = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    try {
      // Detect all faces with landmarks, expressions, and descriptors
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptors();

      const numFaces = detections.length;
      setFaceCount(numFaces);

      // Clear and prepare canvas
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);
      canvas.width = displaySize.width;
      canvas.height = displaySize.height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      // 1. NO FACE DETECTED
      if (numFaces === 0) {
        handleNoFaceDetected();
        return;
      }

      // 2. MULTIPLE FACES DETECTED
      if (numFaces > 1) {
        handleMultipleFaces(numFaces);
        drawDetections(canvas, detections, displaySize);
        return;
      }

      // 3. SINGLE FACE - DETAILED ANALYSIS
      const detection = detections[0];
      
      // Draw visualization
      drawDetections(canvas, [detection], displaySize);

      // A. Identity Verification
      if (referenceDescriptorRef.current) {
        const distance = faceapi.euclideanDistance(
          referenceDescriptorRef.current,
          detection.descriptor
        );
        
        if (distance > 0.6) {
          addBehavior('identity_change', 'high', 'Different person detected!');
          onCheatingDetected('Different person detected in camera', 'high');
        }
      }

      // B. Emotion Analysis
      const expressions = detection.expressions;
      const dominantExpression = Object.entries(expressions).reduce((a, b) => 
        expressions[a[0] as keyof typeof expressions] > expressions[b[0] as keyof typeof expressions] ? a : b
      );
      
      setCurrentEmotion(dominantExpression[0]);
      
      // Detect suspicious emotions
      if (['angry', 'fearful', 'disgusted'].includes(dominantExpression[0]) && dominantExpression[1] > 0.7) {
        handleSuspiciousEmotion(dominantExpression[0]);
      }

      // C. Gaze Direction Analysis
      const landmarks = detection.landmarks;
      const gazeAnalysis = analyzeGaze(landmarks);
      setGazeDirection(gazeAnalysis.direction);
      
      if (gazeAnalysis.lookingAway) {
        handleLookingAway(gazeAnalysis.direction);
      }

      // D. Phone/Object Detection (based on hand position near face)
      const handNearFace = detectHandNearFace(landmarks);
      if (handNearFace) {
        setPhoneDetected(true);
        addBehavior('phone_detected', 'high', 'Object near face - possible phone');
        onCheatingDetected('Possible phone or object detected near face', 'high');
      } else {
        setPhoneDetected(false);
      }

      // E. Head Position Analysis
      const headPose = analyzeHeadPose(landmarks);
      if (Math.abs(headPose.yaw) > 45) {
        addBehavior('head_turned', 'medium', `Head turned ${headPose.yaw > 0 ? 'right' : 'left'}`);
      }

      // Update analysis status
      setCurrentAnalysis(`✓ Monitoring: ${dominantExpression[0]} | ${gazeAnalysis.direction} | Suspicion: ${suspicionLevel}%`);

    } catch (error) {
      console.error('Analysis error:', error);
    }
  };

  // Helper: Handle no face detected
  const handleNoFaceDetected = () => {
    setNoFaceCount(prev => {
      const newCount = prev + 1;
      addBehavior('no_face', 'medium', `No face detected (${newCount} times)`);
      
      if (newCount >= 3) {
        onCheatingDetected('Student left camera view multiple times', 'high');
      }
      
      return newCount;
    });
    
    increaseSuspicion(10);
    setCurrentAnalysis('⚠️ No face detected!');
  };

  // Helper: Handle multiple faces
  const handleMultipleFaces = (count: number) => {
    setMultipleFaceCount(prev => {
      const newCount = prev + 1;
      addBehavior('multiple_faces', 'high', `${count} people detected`);
      
      if (newCount >= 2) {
        onCheatingDetected(`Multiple people detected (${count} faces)`, 'high');
      }
      
      return newCount;
    });
    
    increaseSuspicion(25);
    setCurrentAnalysis(`🚫 ${count} faces detected!`);
  };

  // Helper: Handle looking away
  const handleLookingAway = (direction: string) => {
    setLookingAwayCount(prev => {
      const newCount = prev + 1;
      
      if (newCount >= 5) {
        addBehavior('looking_away', 'medium', `Looking ${direction} repeatedly`);
        onCheatingDetected(`Student looking away from screen repeatedly (${direction})`, 'medium');
      }
      
      return newCount;
    });
    
    increaseSuspicion(5);
  };

  // Helper: Handle suspicious emotion
  const handleSuspiciousEmotion = (emotion: string) => {
    setSuspiciousEmotionCount(prev => {
      const newCount = prev + 1;
      
      if (newCount >= 3) {
        addBehavior('suspicious_emotion', 'low', `Unusual emotion: ${emotion}`);
      }
      
      return newCount;
    });
    
    increaseSuspicion(3);
  };

  // Analyze gaze direction
  const analyzeGaze = (landmarks: faceapi.FaceLandmarks68) => {
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const nose = landmarks.getNose();
    
    // Calculate eye center
    const eyeCenterX = (leftEye[0].x + rightEye[3].x) / 2;
    const noseTipX = nose[3].x;
    
    const offset = eyeCenterX - noseTipX;
    
    let direction = 'center';
    let lookingAway = false;
    
    if (offset > 15) {
      direction = 'left';
      lookingAway = true;
    } else if (offset < -15) {
      direction = 'right';
      lookingAway = true;
    }
    
    // Check vertical gaze
    const eyeCenterY = (leftEye[0].y + rightEye[3].y) / 2;
    const noseTipY = nose[3].y;
    const verticalOffset = eyeCenterY - noseTipY;
    
    if (verticalOffset > 10) {
      direction = 'down';
      lookingAway = true;
    } else if (verticalOffset < -10) {
      direction = 'up';
      lookingAway = true;
    }
    
    return { direction, lookingAway };
  };

  // Analyze head pose
  const analyzeHeadPose = (landmarks: faceapi.FaceLandmarks68) => {
    const nose = landmarks.getNose();
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    
    const eyeWidth = Math.abs(rightEye[3].x - leftEye[0].x);
    const faceWidth = 200; // approximate
    
    const yaw = ((eyeWidth - faceWidth) / faceWidth) * 90;
    
    return { yaw, pitch: 0, roll: 0 };
  };

  // Detect hand near face
  const detectHandNearFace = (landmarks: faceapi.FaceLandmarks68): boolean => {
    // This is a simplified detection
    // In production, use pose detection or hand tracking
    const jaw = landmarks.getJawOutline();
    const mouth = landmarks.getMouth();
    
    // Check if jaw or mouth landmarks are occluded (rough approximation)
    return false; // Placeholder - needs proper hand detection
  };

  // Draw detections on canvas
  const drawDetections = (
    canvas: HTMLCanvasElement,
    detections: faceapi.WithFaceExpressions<faceapi.WithFaceLandmarks<faceapi.WithFaceDescriptor<faceapi.DetectSingleFaceResult>>>[], 
    displaySize: { width: number; height: number }
  ) => {
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    resizedDetections.forEach((detection, index) => {
      const box = detection.detection.box;
      
      // Determine color based on number of faces and suspicion
      let color = '#10b981'; // Green
      if (detections.length > 1) {
        color = '#ef4444'; // Red
      } else if (suspicionLevel > 50) {
        color = '#f59e0b'; // Orange
      }
      
      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
      
      // Draw label
      ctx.fillStyle = color;
      ctx.font = 'bold 16px Arial';
      const label = detections.length === 1 
        ? `Candidate (${Math.round((1 - suspicionLevel/100) * 100)}% confidence)`
        : `Person ${index + 1}`;
      ctx.fillText(label, box.x, box.y - 10);
      
      // Draw landmarks
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      
      // Draw emotion
      if (detection.expressions) {
        const expressions = detection.expressions;
        const dominant = Object.entries(expressions).reduce((a, b) => 
          expressions[a[0] as keyof typeof expressions] > expressions[b[0] as keyof typeof expressions] ? a : b
        );
        
        ctx.fillStyle = color;
        ctx.font = '14px Arial';
        ctx.fillText(
          `${dominant[0]}: ${Math.round(dominant[1] * 100)}%`,
          box.x,
          box.y + box.height + 20
        );
      }
    });
  };

  // Add behavior to tracking
  const addBehavior = (type: string, severity: 'low' | 'medium' | 'high', description: string) => {
    const newBehavior: CheatingBehavior = {
      type,
      timestamp: new Date(),
      severity,
      description
    };
    
    setBehaviors(prev => [...prev.slice(-9), newBehavior]); // Keep last 10
  };

  // Increase suspicion level
  const increaseSuspicion = (amount: number) => {
    setSuspicionLevel(prev => Math.min(100, prev + amount));
  };

  if (!isActive) return null;

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-purple-500 overflow-hidden w-96">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Brain className="h-5 w-5" />
            <span className="text-sm font-bold">Smart AI Proctoring</span>
          </div>
          {cameraEnabled ? (
            <Camera className="h-5 w-5 text-green-300" />
          ) : (
            <CameraOff className="h-5 w-5 text-red-300" />
          )}
        </div>

        {/* Video Feed */}
        <div className="relative bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover"
          />
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          
          {/* Status Overlay */}
          <div className="absolute bottom-2 left-2 right-2 space-y-1">
            {!modelLoaded && (
              <div className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Loading AI: {modelsLoadingProgress}%</span>
                </div>
              </div>
            )}
            
            {modelLoaded && faceCount === 0 && (
              <div className="bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <UserX className="h-3 w-3" />
                <span>No face!</span>
              </div>
            )}
            
            {modelLoaded && faceCount > 1 && (
              <div className="bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{faceCount} people!</span>
              </div>
            )}
            
            {modelLoaded && faceCount === 1 && (
              <div className={`text-white text-xs px-2 py-1 rounded flex items-center gap-1 ${
                suspicionLevel > 50 ? 'bg-orange-600' : 'bg-green-600'
              }`}>
                <Eye className="h-3 w-3" />
                <span>{currentEmotion || 'neutral'} | {gazeDirection}</span>
              </div>
            )}
          </div>
        </div>

        {/* Suspicion Meter */}
        <div className="p-3 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold">Suspicion Level</span>
            <span className={`text-xs font-bold ${
              suspicionLevel > 70 ? 'text-red-600' : 
              suspicionLevel > 40 ? 'text-orange-600' : 
              'text-green-600'
            }`}>{suspicionLevel}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                suspicionLevel > 70 ? 'bg-red-600' : 
                suspicionLevel > 40 ? 'bg-orange-600' : 
                'bg-green-600'
              }`}
              style={{ width: `${suspicionLevel}%` }}
            />
          </div>
        </div>

        {/* Warnings */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border-t border-amber-200">
          <div className="text-xs space-y-1">
            {noFaceCount > 0 && (
              <div className="flex items-center gap-1 text-amber-800 dark:text-amber-200">
                <AlertTriangle className="h-3 w-3" />
                <span>No face: {noFaceCount}/3</span>
              </div>
            )}
            {multipleFaceCount > 0 && (
              <div className="flex items-center gap-1 text-red-800 dark:text-red-200">
                <Users className="h-3 w-3" />
                <span>Multiple faces: {multipleFaceCount}/2</span>
              </div>
            )}
            {lookingAwayCount > 0 && (
              <div className="flex items-center gap-1 text-orange-800 dark:text-orange-200">
                <Eye className="h-3 w-3" />
                <span>Looking away: {lookingAwayCount}/5</span>
              </div>
            )}
            {phoneDetected && (
              <div className="flex items-center gap-1 text-red-800 dark:text-red-200">
                <AlertTriangle className="h-3 w-3" />
                <span>Object detected near face!</span>
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="p-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {currentAnalysis}
          </p>
        </div>
      </div>
    </div>
  );
}
