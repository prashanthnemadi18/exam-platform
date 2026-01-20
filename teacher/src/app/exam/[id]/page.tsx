
"use client";

import { useState, useEffect, useCallback } from "react";
import { ExamForm } from "@/components/exam/exam-form";
import { StudentLogin } from "@/components/exam/student-login";
import { CameraProctor } from "@/components/exam/camera-proctoring";
import { CameraPermissionCheck } from "@/components/exam/camera-permission-check";
import { GraduationCap, Clock, AlertTriangle } from "lucide-react";
import { useParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StudentData {
  name: string;
  usn: string;
  email: string;
}

interface ExamData {
  id: string;
  title: string;
  subject: string;
  duration: number;
  questions: any[];
}

export default function ExamPage() {
  const params = useParams();
  const examId = params.id as string;
  
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isExamTerminated, setIsExamTerminated] = useState(false);
  const [terminationReason, setTerminationReason] = useState("");
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState<any>(null);
  const [windowBlurCount, setWindowBlurCount] = useState(0);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [cameraViolations, setCameraViolations] = useState(0);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);

  useEffect(() => {
    // Fetch exam data
    async function fetchExam() {
      try {
        // Fetch specific exam by ID without teacher filtering (for student access)
        const response = await fetch(`/api/exams/${examId}`);
        
        if (response.ok) {
          const exam = await response.json();
          setExamData(exam);
          setTimeRemaining(exam.duration * 60); // Convert minutes to seconds
        } else {
          console.error('Exam not found');
        }
      } catch (error) {
        console.error('Error fetching exam:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchExam();
  }, [examId]);

  // Timer effect
  useEffect(() => {
    if (!studentData || timeRemaining <= 0 || isExamTerminated || isExamSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit when time expires
          setIsExamTerminated(true);
          setTerminationReason("Exam auto-submitted: Time limit reached");
          // Trigger auto-submit
          setTimeout(() => {
            const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (submitBtn) {
              submitBtn.click();
            }
          }, 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [studentData, timeRemaining, isExamTerminated, isExamSubmitted]);

  // Anti-cheating: Tab switch detection
  useEffect(() => {
    if (!studentData || isExamTerminated) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          console.warn(`⚠️ Tab switch detected! Count: ${newCount}`);
          
          // Auto-submit after 2 tab switches
          if (newCount >= 2) {
            setIsExamTerminated(true);
            setTerminationReason("Exam terminated: Multiple tab switches detected (cheating attempt)");
            // Trigger auto-submit
            const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (submitBtn) {
              submitBtn.click();
            }
          }
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [studentData, isExamTerminated]);

  // Anti-cheating: Window blur detection (switching to another application on laptop)
  useEffect(() => {
    if (!studentData || isExamTerminated) return;

    const handleWindowBlur = () => {
      setWindowBlurCount((prev) => {
        const newCount = prev + 1;
        console.warn(`⚠️ Window blur detected (switched to another app)! Count: ${newCount}`);
        
        // Count window blur as tab switch
        setTabSwitchCount((tabCount) => {
          const totalCount = tabCount + 1;
          
          if (totalCount >= 2) {
            setIsExamTerminated(true);
            setTerminationReason("Exam terminated: Switched to another application (cheating attempt)");
            // Trigger auto-submit
            setTimeout(() => {
              const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
              if (submitBtn) {
                submitBtn.click();
              }
            }, 100);
          }
          return totalCount;
        });
        
        return newCount;
      });
    };

    window.addEventListener("blur", handleWindowBlur);
    return () => window.removeEventListener("blur", handleWindowBlur);
  }, [studentData, isExamTerminated]);

  // Anti-cheating: Full-screen exit detection
  useEffect(() => {
    if (!studentData || isExamTerminated) return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        console.warn("⚠️ Exited full-screen mode!");
        // Give warning but don't auto-submit for full-screen exit
        // as it might be accidental
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [studentData, isExamTerminated]);

  // Anti-cheating: Idle time detection (no activity for too long)
  useEffect(() => {
    if (!studentData || isExamTerminated) return;

    const updateActivity = () => {
      setLastActivityTime(Date.now());
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity);
    });

    // Check for idle time every 30 seconds
    const idleCheckInterval = setInterval(() => {
      const idleTime = Date.now() - lastActivityTime;
      const idleMinutes = Math.floor(idleTime / 60000);
      
      // Warn if idle for more than 5 minutes
      if (idleMinutes >= 5) {
        console.warn(`⚠️ Student has been idle for ${idleMinutes} minutes`);
      }
    }, 30000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      clearInterval(idleCheckInterval);
    };
  }, [studentData, isExamTerminated, lastActivityTime]);

  // Anti-cheating: Prevent copy/paste
  useEffect(() => {
    if (!studentData || isExamTerminated) return;

    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      alert("⚠️ Copying is disabled during the exam!");
      setTabSwitchCount((prev) => prev + 0.5); // Half warning for copy attempt
    };

    const preventCut = (e: ClipboardEvent) => {
      e.preventDefault();
      alert("⚠️ Cutting is disabled during the exam!");
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      alert("⚠️ Right-click is disabled during the exam!");
    };

    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      // Prevent Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A, Ctrl+P, F12, Ctrl+Shift+I
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'x' || e.key === 'v' || e.key === 'a' || e.key === 'p')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I')
      ) {
        e.preventDefault();
        alert("⚠️ This action is disabled during the exam!");
      }
    };

    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCut);
    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", preventKeyboardShortcuts);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCut);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventKeyboardShortcuts);
    };
  }, [studentData, isExamTerminated]);

  // Anti-cheating: Prevent browser back button
  useEffect(() => {
    if (!studentData) return;

    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventBack);

    return () => window.removeEventListener("popstate", preventBack);
  }, [studentData]);

  // Camera proctoring violation handler
  const handleCameraViolation = useCallback((reason: string) => {
    setCameraViolations((prev) => {
      const newCount = prev + 1;
      console.warn(`⚠️ Camera violation detected: ${reason}. Count: ${newCount}`);
      
      // Auto-submit after 3 camera violations
      if (newCount >= 3) {
        setIsExamTerminated(true);
        setTerminationReason(`Exam terminated: ${reason}`);
        // Trigger auto-submit
        setTimeout(() => {
          const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
          if (submitBtn) {
            submitBtn.click();
          }
        }, 100);
      }
      return newCount;
    });
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogin = async (data: StudentData) => {
    // Verify student is registered
    try {
      // Fetch all students without teacher filtering (for student verification)
      const response = await fetch('/api/students?bypassTeacherFilter=true');
      const students = await response.json();
      
      console.log('🔍 Verifying student login...');
      console.log('📝 Student data entered:', data);
      console.log('👥 Total students in database:', students.length);
      
      // Check if student exists with matching details
      const registeredStudent = students.find((s: any) => 
        s.usn.toLowerCase() === data.usn.toLowerCase() &&
        s.name.toLowerCase() === data.name.toLowerCase() &&
        s.email.toLowerCase() === data.email.toLowerCase()
      );

      console.log('✅ Student found:', registeredStudent ? 'YES' : 'NO');

      if (!registeredStudent) {
        alert("❌ Access Denied: Your details don't match our registration records. Please register first or check your details.");
        return;
      }

      // Check if student has already submitted this exam
      const submissionsResponse = await fetch('/api/submissions?bypassTeacherFilter=true');
      const submissions = await submissionsResponse.json();
      
      const existingSubmission = submissions.find((sub: any) => 
        sub.examId === examId && 
        sub.studentUSN.toLowerCase() === data.usn.toLowerCase()
      );

      if (existingSubmission) {
        setAlreadySubmitted(existingSubmission);
        return;
      }

      // Student verified and hasn't taken exam yet, allow exam access
      setStudentData(data);
    } catch (error) {
      console.error('Error verifying student:', error);
      alert("❌ Error verifying student details. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading exam...</p>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Exam not found</p>
      </div>
    );
  }

  if (!studentData) {
    return <StudentLogin examTitle={examData.title} onLogin={handleLogin} />;
  }

  // Check camera permission before allowing exam access
  if (!cameraPermissionGranted) {
    return (
      <CameraPermissionCheck
        examTitle={examData.title}
        onPermissionGranted={() => setCameraPermissionGranted(true)}
      />
    );
  }

  // Show already submitted message
  if (alreadySubmitted) {
    const percentage = Math.round((alreadySubmitted.score / alreadySubmitted.totalQuestions) * 100);
    const passed = percentage >= 60;
    
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-red-200 dark:border-red-800 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-8 w-8" />
                <h2 className="text-2xl font-bold">Exam Already Submitted</h2>
              </div>
              <p className="text-red-100">You have already completed this exam</p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <Alert variant="destructive">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle className="text-lg font-bold">Access Denied</AlertTitle>
                <AlertDescription className="text-base">
                  Each student can only take an exam once. You have already submitted this exam and cannot retake it.
                </AlertDescription>
              </Alert>

              {/* Exam Info */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 space-y-3">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Exam Details:</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Exam Title:</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{examData.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Subject:</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{examData.subject}</p>
                  </div>
                </div>
              </div>

              {/* Previous Submission */}
              <div className={`rounded-lg p-6 space-y-3 ${passed ? 'bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800'}`}>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Your Previous Submission:</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Score:</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {alreadySubmitted.score}/{alreadySubmitted.totalQuestions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Percentage:</span>
                    <span className={`text-2xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${passed ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      {passed ? '✓ PASSED' : '✗ FAILED'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-300 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Submitted:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {new Date(alreadySubmitted.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  {alreadySubmitted.cheatingDetected && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-300 dark:border-gray-700">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="text-red-600 font-semibold">
                        ⚠️ Flagged for cheating ({alreadySubmitted.tabSwitchCount} tab switches)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">ℹ️ Important Information:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Your submission has been recorded and cannot be changed</li>
                  <li>• Contact your teacher if you believe this is an error</li>
                  <li>• Your results are available in your student dashboard</li>
                  <li>• This restriction ensures fair examination for all students</li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => window.close()}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold font-headline">{examData.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span className={`font-medium text-lg ${timeRemaining < 300 ? 'text-destructive' : ''}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            {tabSwitchCount > 0 && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Warnings: {tabSwitchCount}/2</span>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              <p className="font-bold">{studentData.name}</p>
              <p>{studentData.usn}</p>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isExamTerminated && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Exam Terminated</AlertTitle>
            <AlertDescription>{terminationReason}</AlertDescription>
          </Alert>
        )}
        
        {tabSwitchCount > 0 && tabSwitchCount < 2 && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Tab switching detected! You have {2 - tabSwitchCount} warning(s) left. 
              The exam will be auto-submitted if you switch tabs again.
            </AlertDescription>
          </Alert>
        )}

        {/* Camera Proctoring */}
        <CameraProctor 
          onCheatingDetected={handleCameraViolation}
          isActive={!isExamTerminated && !isExamSubmitted}
        />

        {/* Camera Violation Warning */}
        {cameraViolations > 0 && cameraViolations < 3 && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Camera Violation Detected!</AlertTitle>
            <AlertDescription>
              Camera monitoring violation! You have {3 - cameraViolations} warning(s) left. 
              The exam will be auto-submitted if violations continue.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-amber-600 dark:bg-amber-800 px-5 py-3">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Anti-Cheating Measures Active
            </h3>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Camera Monitoring */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                <span className="text-xl">📹</span>
                Camera Monitoring (Required)
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Your face must be clearly visible at all times. <strong className="text-red-600">Maximum 3 violations allowed</strong> - exam will auto-submit after that.
              </p>
            </div>

            {/* Tab Switching */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-orange-500">
              <h4 className="font-bold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-2">
                <span className="text-xl">🚫</span>
                Tab Switching Prohibited
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Do not switch tabs or windows during the exam. <strong className="text-orange-600">Maximum 2 warnings</strong> - third violation will auto-submit your exam.
              </p>
            </div>

            {/* Disabled Features */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                <span className="text-xl">🔒</span>
                Disabled Features
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Copy/Paste (Ctrl+C, Ctrl+V)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Right-click menu</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Browser back button</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Developer tools (F12)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Keyboard shortcuts</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Opening other windows</span>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border-l-4 border-green-500">
              <h4 className="font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                <span className="text-xl">✅</span>
                Best Practices for Students
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">1.</span>
                  <span><strong>Close all other applications</strong> before starting the exam</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">2.</span>
                  <span><strong>Disable notifications</strong> on your device to avoid distractions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">3.</span>
                  <span><strong>Use a single monitor</strong> - disconnect additional displays</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">4.</span>
                  <span><strong>Ensure stable internet</strong> connection throughout the exam</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">5.</span>
                  <span><strong>Keep your face visible</strong> to the camera at all times</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">6.</span>
                  <span><strong>Use laptop/desktop</strong> for best experience (not mobile)</span>
                </li>
              </ul>
            </div>

            {/* Warning Footer */}
            <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 border border-red-300 dark:border-red-700">
              <p className="text-sm text-red-800 dark:text-red-200 font-semibold text-center">
                ⚡ All activities are monitored and recorded. Your identity has been verified against registration.
              </p>
            </div>
          </div>
        </div>

        <ExamForm 
          examId={examId} 
          studentData={studentData}
          examData={examData}
          timeRemaining={timeRemaining}
          isTerminated={isExamTerminated}
          onSubmitStart={() => setIsExamSubmitted(true)}
          tabSwitchCount={tabSwitchCount}
          cameraViolations={cameraViolations}
          terminationReason={terminationReason}
        />
      </main>
    </div>
  );
}
