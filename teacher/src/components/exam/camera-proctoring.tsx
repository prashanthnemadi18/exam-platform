"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, AlertTriangle, Eye } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CameraProctorProps {
  onCheatingDetected: (reason: string) => void;
  isActive: boolean;
}

export function CameraProctor({ onCheatingDetected, isActive }: CameraProctorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [faceDetected, setFaceDetected] = useState(true);
  const [multipleFacesDetected, setMultipleFacesDetected] = useState(false);
  const [noFaceWarnings, setNoFaceWarnings] = useState(0);
  const [multipleFaceWarnings, setMultipleFaceWarnings] = useState(0);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Face detection using basic motion/presence detection
  useEffect(() => {
    if (!cameraEnabled || !isActive) return;

    detectionIntervalRef.current = setInterval(() => {
      detectFace();
    }, 3000); // Check every 3 seconds

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraEnabled, isActive]);

  const detectFace = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for analysis
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Simple brightness-based presence detection
    let totalBrightness = 0;
    let pixelCount = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
      pixelCount++;
    }

    const avgBrightness = totalBrightness / pixelCount;

    // Check if someone is in front of camera (basic check)
    // If brightness is too low or too high, likely no face
    if (avgBrightness < 20 || avgBrightness > 240) {
      setFaceDetected(false);
      setNoFaceWarnings(prev => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          onCheatingDetected("Student left the camera view multiple times");
        }
        return newCount;
      });
    } else {
      setFaceDetected(true);
    }

    // Note: For production, integrate with TensorFlow.js FaceDetection API
    // or a proper face detection library for accurate multi-face detection
  };

  if (!isActive) return null;

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-purple-500 overflow-hidden w-64">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-bold">Proctoring Active</span>
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
            className="w-full h-48 object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Status Overlay */}
          <div className="absolute bottom-2 left-2 right-2">
            {!faceDetected && (
              <div className="bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Face not detected!</span>
              </div>
            )}
            {multipleFacesDetected && (
              <div className="bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1 mt-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Multiple faces detected!</span>
              </div>
            )}
            {faceDetected && !multipleFacesDetected && (
              <div className="bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <Camera className="h-3 w-3" />
                <span>Monitoring active</span>
              </div>
            )}
          </div>
        </div>

        {/* Warnings */}
        {(noFaceWarnings > 0 || multipleFaceWarnings > 0) && (
          <div className="p-2 bg-amber-50 dark:bg-amber-950/20 border-t border-amber-200">
            <div className="text-xs space-y-1">
              {noFaceWarnings > 0 && (
                <div className="text-amber-800 dark:text-amber-200">
                  ⚠️ No face warnings: {noFaceWarnings}/3
                </div>
              )}
              {multipleFaceWarnings > 0 && (
                <div className="text-red-800 dark:text-red-200">
                  ⚠️ Multiple faces: {multipleFaceWarnings}/2
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
            📹 Your exam session is being monitored
          </p>
        </div>
      </div>
    </div>
  );
}
