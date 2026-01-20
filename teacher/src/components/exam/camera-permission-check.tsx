"use client";

import { useState, useEffect } from "react";
import { Camera, AlertTriangle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface CameraPermissionCheckProps {
  onPermissionGranted: () => void;
  examTitle: string;
}

export function CameraPermissionCheck({ onPermissionGranted, examTitle }: CameraPermissionCheckProps) {
  const [permissionStatus, setPermissionStatus] = useState<"checking" | "prompt" | "denied" | "granted">("checking");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    checkCameraPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkCameraPermission = async () => {
    try {
      // Check if camera permission API is available
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        
        if (result.state === 'granted') {
          setPermissionStatus('granted');
          onPermissionGranted();
        } else if (result.state === 'denied') {
          setPermissionStatus('denied');
          setErrorMessage("Camera access is blocked. Please enable camera in your browser settings.");
        } else {
          setPermissionStatus('prompt');
        }
      } else {
        // Fallback: directly request camera access
        setPermissionStatus('prompt');
      }
    } catch (error) {
      console.error("Error checking camera permission:", error);
      setPermissionStatus('prompt');
    }
  };

  const requestCameraAccess = async () => {
    try {
      setPermissionStatus('checking');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        },
        audio: false
      });

      // Permission granted - stop the stream and proceed
      stream.getTracks().forEach(track => track.stop());
      setPermissionStatus('granted');
      
      // Small delay to show success message
      setTimeout(() => {
        onPermissionGranted();
      }, 1000);
      
    } catch (error: any) {
      console.error("Camera access error:", error);
      setPermissionStatus('denied');
      
      if (error.name === 'NotAllowedError') {
        setErrorMessage("Camera access was denied. You must allow camera access to take this exam.");
      } else if (error.name === 'NotFoundError') {
        setErrorMessage("No camera found on your device. A camera is required to take this exam.");
      } else if (error.name === 'NotReadableError') {
        setErrorMessage("Camera is already in use by another application. Please close other apps and try again.");
      } else {
        setErrorMessage("Unable to access camera. Please check your camera settings and try again.");
      }
    }
  };

  if (permissionStatus === 'checking') {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">Checking Camera Access...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }

  if (permissionStatus === 'granted') {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-green-600">Camera Access Granted!</h2>
          <p className="text-muted-foreground">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-red-200 dark:border-red-800 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-8 w-8" />
                <h2 className="text-2xl font-bold">Camera Access Required</h2>
              </div>
              <p className="text-red-100">You cannot take this exam without camera access</p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <Alert variant="destructive">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle className="text-lg font-bold">Access Denied</AlertTitle>
                <AlertDescription className="text-base">
                  {errorMessage}
                </AlertDescription>
              </Alert>

              {/* Exam Info */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3">Exam: {examTitle}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  This exam requires camera monitoring for proctoring purposes. Camera access is mandatory to ensure exam integrity.
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-3">📹 How to Enable Camera Access:</h4>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside">
                  <li>Look for the camera icon in your browser&apos;s address bar</li>
                  <li>Click on it and select Allow or Always allow</li>
                  <li>If you don&apos;t see the icon, go to your browser settings</li>
                  <li>Find Site Settings or Permissions</li>
                  <li>Locate Camera and allow access for this website</li>
                  <li>Refresh this page and try again</li>
                </ol>
              </div>

              {/* Browser-specific instructions */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-3">⚙️ Browser Settings:</h4>
                <div className="text-sm text-amber-800 dark:text-amber-200 space-y-2">
                  <p><strong>Chrome:</strong> Settings → Privacy and security → Site Settings → Camera</p>
                  <p><strong>Firefox:</strong> Settings → Privacy & Security → Permissions → Camera</p>
                  <p><strong>Edge:</strong> Settings → Cookies and site permissions → Camera</p>
                  <p><strong>Safari:</strong> Safari → Settings → Websites → Camera</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={requestCameraAccess}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="flex-1 font-semibold py-3"
                >
                  Refresh Page
                </Button>
              </div>

              {/* Warning */}
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>⚠️ Important:</strong> If you clicked Block or Don&apos;t allow this site, you must manually enable camera access in your browser settings before you can proceed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prompt state - ask user to grant permission
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-purple-200 dark:border-purple-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Camera className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Camera Access Required</h2>
            </div>
            <p className="text-purple-100">Enable your camera to start the exam</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Exam Info */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3">Exam: {examTitle}</h3>
              <p className="text-gray-700 dark:text-gray-300">
                This exam uses camera proctoring to ensure academic integrity. Your camera will monitor you throughout the exam.
              </p>
            </div>

            {/* What happens */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-3">📹 What to Expect:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <li>• Your browser will ask for camera permission</li>
                <li>• You must click &quot;Allow&quot; to proceed with the exam</li>
                <li>• Your face must be visible throughout the exam</li>
                <li>• The camera feed will be displayed in the corner of your screen</li>
                <li>• Violations will be detected and may result in exam termination</li>
              </ul>
            </div>

            {/* Important notice */}
            <Alert>
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="font-bold">Important Notice</AlertTitle>
              <AlertDescription>
                When your browser asks for camera permission, you MUST select:
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li><strong>Allow</strong> or <strong>Allow on this site</strong></li>
                </ul>
                <p className="mt-2 text-red-600 dark:text-red-400 font-semibold">
                  ❌ If you click Block or Don&apos;t allow, the exam will NOT open and you will need to manually enable camera access in your browser settings.
                </p>
              </AlertDescription>
            </Alert>

            {/* Privacy notice */}
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-bold text-green-900 dark:text-green-100 mb-2">🔒 Privacy & Security:</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                Your camera feed is only used for proctoring during the exam. No recordings are stored. 
                The camera will automatically turn off when you submit or complete the exam.
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Button
                onClick={requestCameraAccess}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold py-4 text-lg"
              >
                <Camera className="h-6 w-6 mr-2" />
                Enable Camera & Start Exam
              </Button>
            </div>

            {/* Help text */}
            <p className="text-center text-sm text-muted-foreground">
              By clicking the button above, your browser will prompt you for camera access. 
              Make sure to click &quot;Allow&quot; when prompted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
