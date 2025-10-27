"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Clock, 
  Calendar, 
  BookOpen, 
  ArrowRight,
  CheckCircle,
  XCircle,
  User,
  LogOut
} from "lucide-react";
import Link from "next/link";

// Mock data for available exams
const mockExams = [
  {
    id: "1",
    title: "Computer Networks - Midterm",
    subject: "Computer Science",
    topic: "Computer Networks",
    duration: 60,
    questions: 10,
    difficulty: "Medium",
    scheduledDate: "2025-10-30",
    status: "upcoming" as const,
  },
  {
    id: "2",
    title: "Data Structures Final",
    subject: "Computer Science",
    topic: "Data Structures",
    duration: 90,
    questions: 15,
    difficulty: "Hard",
    scheduledDate: "2025-11-05",
    status: "upcoming" as const,
  },
  {
    id: "3",
    title: "Calculus Quiz",
    subject: "Mathematics",
    topic: "Calculus",
    duration: 30,
    questions: 5,
    difficulty: "Easy",
    scheduledDate: "2025-10-25",
    status: "completed" as const,
    score: 85,
  },
];

// Mock student data
const studentData = {
  name: "Alice Johnson",
  usn: "1AB21CS001",
  semester: "5",
  email: "alice.johnson@gmail.com",
};

export function StudentDashboard() {
  const [exams] = useState(mockExams);

  const upcomingExams = exams.filter(exam => exam.status === "upcoming");
  const completedExams = exams.filter(exam => exam.status === "completed");

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Medium": return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
      case "Hard": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-xl border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-headline bg-gradient-to-r from-primary via-blue-600 to-accent bg-clip-text text-transparent">
                  AssessAI
                </h1>
                <p className="text-xs text-muted-foreground">Student Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-sm">{studentData.name}</p>
                <p className="text-xs text-muted-foreground">{studentData.usn}</p>
              </div>
              <Button variant="ghost" size="icon" title="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-headline mb-2">
            Welcome back, {studentData.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-muted-foreground">
            Here are your upcoming exams and results
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming Exams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">{upcomingExams.length}</p>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Exams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">{completedExams.length}</p>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">
                  {completedExams.length > 0 
                    ? Math.round(completedExams.reduce((acc, exam) => acc + (exam.score || 0), 0) / completedExams.length)
                    : 0}%
                </p>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Exams */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Upcoming Exams
          </h3>
          {upcomingExams.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming exams at the moment</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingExams.map((exam) => (
                <Card 
                  key={exam.id} 
                  className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-headline mb-2 group-hover:text-primary transition-colors">
                          {exam.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-sm">
                          <BookOpen className="h-4 w-4" />
                          {exam.subject} • {exam.topic}
                        </CardDescription>
                      </div>
                      <Badge className={getDifficultyColor(exam.difficulty)}>
                        {exam.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{exam.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{exam.questions} questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                        <Calendar className="h-4 w-4" />
                        <span>Scheduled: {new Date(exam.scheduledDate).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                    <Link href={`/exam/${exam.id}`}>
                      <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold shadow-lg hover:shadow-xl transition-all group">
                        Start Exam
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Completed Exams */}
        <div>
          <h3 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Completed Exams
          </h3>
          {completedExams.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No completed exams yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedExams.map((exam) => (
                <Card 
                  key={exam.id} 
                  className="hover:shadow-lg transition-shadow border-2"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-headline mb-2">
                          {exam.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-sm">
                          <BookOpen className="h-4 w-4" />
                          {exam.subject} • {exam.topic}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Your Score</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {exam.score}%
                        </p>
                      </div>
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(exam.scheduledDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{exam.questions} questions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
