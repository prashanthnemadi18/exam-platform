"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, AlertTriangle, Eye, Users, UserX } from "lucide-react";
import * as tf from '@tensorflow/tfjs';
import * as faceDetection from '@tensorflow-models/face-detection';

interface CameraProctorAdvancedProps {
  onCheatingDetected: (reason: string) => void;
  isActive: boolean;
}

export function CameraProctorAdvanced({ onCheatingDetected, isActive }: CameraProctorAdvancedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [faceCount, setFaceCount] = useState(0);
  const [noFaceWarnings, setNoFaceWarnings] = useState(0);
  const [multipleFaceWarnings, setMultipleFaceWarnings] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);
  const detectorRef = useRef<faceDetection.FaceDetector | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize TensorFlow.js and load face detection model
  useEffect(() => {
    if (!isActive) return;

    async function initializeFaceDetection() {
      try {
        console.log('🤖 Loading face detection model...');
        
        // Set TensorFlow backend
        await tf.setBackend('webgl');
        await tf.ready();

        // Load MediaPipe FaceDetector (fast and accurate)
        const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
        const detectorConfig: faceDetection.MediaPipeFaceDetectorTfjsModelConfig = {
          runtime: 'tfjs',
          maxFaces: 5, // Detect up to 5 faces
          detectorModelUrl: undefined,
        };

        const detector = await faceDetection.createDetector(model, detectorConfig);
        detectorRef.current = detector;
        setModelLoaded(true);
        console.log('✅ Face detection model loaded successfully');
      } catch (error) {
        console.error('❌ Failed to load face detection model:', error);
        setModelLoaded(false);
      }
    }

    initializeFaceDetection();

    return () => {
      // Cleanup
      if (detectorRef.current) {
        detectorRef.current = null;
      }
    };
  }, [isActive]);

  // Start camera
  useEffect(() => {
    if (!isActive) return;

    const video = videoRef.current;

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

        if (video) {
          video.srcObject = stream;
          setCameraEnabled(true);
          setCameraError("");
        }
      } catch (error: any) {
        console.error("Camera access error:", error);
        
        let errorMsg = "Camera access denied. Please enable camera to continue the exam.";
        
        if (error.name === 'NotAllowedError') {
          errorMsg = "Camera access was denied. Exam will be terminated.";
        } else if (error.name === 'NotFoundError') {
          errorMsg = "No camera found. Exam will be terminated.";
        } else if (error.name === 'NotReadableError') {
          errorMsg = "Camera is in use by another app. Exam will be terminated.";
        }
        
        setCameraError(errorMsg);
        onCheatingDetected("Camera access denied or not available");
      }
    }

    startCamera();

    return () => {
      // Cleanup: stop camera
      if (video?.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, onCheatingDetected]);

  // Face detection loop
  useEffect(() => {
    if (!cameraEnabled || !isActive || !modelLoaded) return;

    detectionIntervalRef.current = setInterval(() => {
      detectFaces();
    }, 2000); // Check every 2 seconds

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraEnabled, isActive, modelLoaded]);

  const detectFaces = async () => {
    if (!videoRef.current || !canvasRef.current || !detectorRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    try {
      // Detect faces in the video frame
      const faces = await detectorRef.current.estimateFaces(video, {
        flipHorizontal: false
      });

      const numFaces = faces.length;
      setFaceCount(numFaces);

      // Draw on canvas for visualization
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Draw bounding boxes around detected faces
      faces.forEach((face) => {
        const box = face.box;
        
        // Determine color based on number of faces
        const strokeColor = numFaces === 1 ? '#10b981' : numFaces > 1 ? '#ef4444' : '#f59e0b';
        
        context.strokeStyle = strokeColor;
        context.lineWidth = 3;
        context.strokeRect(box.xMin, box.yMin, box.width, box.height);

        // Draw label
        context.fillStyle = strokeColor;
        context.font = '16px Arial';
        context.fillText(
          numFaces === 1 ? 'Candidate' : `Person ${faces.indexOf(face) + 1}`,
          box.xMin,
          box.yMin - 5
        );
      });

      // Check violations
      if (numFaces === 0) {
        // No face detected
        setNoFaceWarnings(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            onCheatingDetected("Student left the camera view multiple times (no face detected)");
          }
          return newCount;
        });
      } else if (numFaces > 1) {
        // Multiple faces detected
        setMultipleFaceWarnings(prev => {
          const newCount = prev + 1;
          if (newCount >= 2) {
            onCheatingDetected(`Multiple people detected in camera view (${numFaces} faces)`);
          }
          return newCount;
        });
      } else {
        // Exactly 1 face - all good, reset warnings gradually
        setNoFaceWarnings(prev => Math.max(0, prev - 1));
      }

    } catch (error) {
      console.error('Face detection error:', error);
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-purple-500 overflow-hidden w-80">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-bold">AI Proctoring Active</span>
          </div>
          {cameraEnabled ? (
            <Camera className="h-4 w-4 text-green-300" />
          ) : (
            <CameraOff className="h-4 w-4 text-red-300" />
          )}
        </div>

        {/* Video Feed */}
        <div className="relative bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-56 object-cover"
          />
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          
          {/* Status Overlay */}
          <div className="absolute bottom-2 left-2 right-2 space-y-1">
            {!modelLoaded && (
              <div className="bg-yellow-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Loading AI model...</span>
              </div>
            )}
            
            {modelLoaded && faceCount === 0 && (
              <div className="bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <UserX className="h-3 w-3" />
                <span>No face detected!</span>
              </div>
            )}
            
            {modelLoaded && faceCount > 1 && (
              <div className="bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{faceCount} faces detected!</span>
              </div>
            )}
            
            {modelLoaded && faceCount === 1 && (
              <div className="bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <Camera className="h-3 w-3" />
                <span>✓ Monitoring active - 1 face</span>
              </div>
            )}
          </div>
        </div>

        {/* Warnings */}
        {(noFaceWarnings > 0 || multipleFaceWarnings > 0) && (
          <div className="p-2 bg-amber-50 dark:bg-amber-950/20 border-t border-amber-200">
            <div className="text-xs space-y-1">
              {noFaceWarnings > 0 && (
                <div className="text-amber-800 dark:text-amber-200 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>No face warnings: {noFaceWarnings}/3</span>
                </div>
              )}
              {multipleFaceWarnings > 0 && (
                <div className="text-red-800 dark:text-red-200 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Multiple faces: {multipleFaceWarnings}/2</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {cameraError && (
          <div className="p-2 bg-red-50 dark:bg-red-950/20 border-t border-red-200">
            <p className="text-xs text-red-800 dark:text-red-200">{cameraError}</p>
          </div>
        )}

        {/* Info */}
        <div className="p-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            🤖 AI-powered face detection monitoring
          </p>
        </div>
      </div>
    </div>
  );
}
