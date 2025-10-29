"use client";

import { useState, useEffect } from "react";
import { ExamForm } from "@/components/exam/exam-form";
import { StudentLogin } from "@/components/exam/student-login";
import { GraduationCap, Clock } from "lucide-react";
import { useParams } from "next/navigation";

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

  useEffect(() => {
    // Fetch exam data
    async function fetchExam() {
      try {
        const response = await fetch(`/api/exams`);
        const exams = await response.json();
        const exam = exams.find((e: any) => e.id === examId);
        
        if (exam) {
          setExamData(exam);
          setTimeRemaining(exam.duration * 60); // Convert minutes to seconds
        }
      } catch (error) {
        console.error('Error fetching exam:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (!studentData || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [studentData, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogin = (data: StudentData) => {
    setStudentData(data);
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
            <div className="text-sm text-muted-foreground">
              <p className="font-bold">{studentData.name}</p>
              <p>{studentData.usn}</p>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExamForm 
          examId={examId} 
          studentData={studentData}
          examData={examData}
          timeRemaining={timeRemaining}
        />
      </main>
    </div>
  );
}
