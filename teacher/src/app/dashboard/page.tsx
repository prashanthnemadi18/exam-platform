"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, FileText, Trophy, Activity, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { TeacherProfileHeader } from "@/components/dashboard/teacher-profile-header";

// Helper function to calculate time ago
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

export default function DashboardPage() {
  const [realStudents, setRealStudents] = useState<any[]>([]);
  const [realExams, setRealExams] = useState<any[]>([]);
  const [realSubmissions, setRealSubmissions] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const { getStudents, getExams, getSubmissions } = await import('@/lib/storage');
      const [students, exams, submissions] = await Promise.all([
        getStudents(),
        getExams(),
        getSubmissions()
      ]);
      setRealStudents(students);
      setRealExams(exams);
      setRealSubmissions(submissions);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Use real data only
  const totalStudents = realStudents.length;
  const examsConducted = realExams.length;
  
  // Calculate top scorer from real submissions
  const topScorer = realSubmissions.length > 0
    ? realSubmissions.reduce((prev, current) => {
        const prevPercentage = (prev.score / prev.totalQuestions) * 100;
        const currentPercentage = (current.score / current.totalQuestions) * 100;
        return currentPercentage > prevPercentage ? current : prev;
      })
    : { studentName: 'No submissions yet', percentage: 0 };

  return (
    <div className="space-y-8 p-6 animate-fade-in relative">
      <TeacherProfileHeader />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-headline bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Welcome back, here&apos;s your command center.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="modern-card border-l-4 border-l-purple-600 hover-lift animate-scale-in group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-purple-900">
              Total Students
            </CardTitle>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl group-hover:scale-110 transition-transform shadow-md">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-violet-600 bg-clip-text text-transparent">
              {totalStudents}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              students registered on the platform
            </p>
          </CardContent>
        </Card>
        
        <Card className="modern-card border-l-4 border-l-cyan-600 hover-lift animate-scale-in group overflow-hidden relative" style={{animationDelay: '0.1s'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-purple-900">
              Exams Conducted
            </CardTitle>
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl group-hover:scale-110 transition-transform shadow-md">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-cyan-600">{examsConducted}</div>
            <p className="text-sm text-gray-600 mt-2">
              in total across all subjects
            </p>
          </CardContent>
        </Card>
        
        <Card className="modern-card border-l-4 border-l-emerald-600 hover-lift animate-scale-in group overflow-hidden relative" style={{animationDelay: '0.2s'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-purple-900">Top Scorer</CardTitle>
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl group-hover:scale-110 transition-transform shadow-md">
              <Trophy className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-emerald-600">{topScorer.studentName}</div>
            <p className="text-sm text-gray-600 mt-2">
              {topScorer.percentage > 0 ? `with a score of ${Math.round((topScorer.score / topScorer.totalQuestions) * 100)}%` : 'Waiting for submissions'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <Card className="modern-card animate-slide-up hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-purple-900 text-2xl">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg shadow-md">
                <Activity className="h-5 w-5 text-white" />
              </div>
              Activity Feed
            </CardTitle>
            <CardDescription className="text-gray-600">
              Recent activities and system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {realStudents.length === 0 && realExams.length === 0 && realSubmissions.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="inline-flex p-6 bg-purple-100 rounded-full">
                  <Activity className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">No Activity Yet</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Activities will appear here as students register, exams are created, and submissions are made.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Recent Students */}
                {realStudents.slice(0, 3).map((student, index) => {
                  const timeAgo = getTimeAgo(student.registeredAt);
                  return (
                    <div key={`student-${student.id}`} className="flex items-start gap-4 p-4 rounded-xl bg-cyan-50/50 hover:bg-cyan-100/50 transition-all border border-cyan-200/50 hover:border-cyan-300 group">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:scale-110 transition-transform shadow-md">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-purple-900">New Student Registered</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium text-gray-900">{student.name}</span> ({student.usn}) joined from the registration link. 
                          <span className="text-cyan-700 font-semibold ml-1">{timeAgo}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Recent Exams */}
                {realExams.slice(0, 2).map((exam, index) => {
                  const timeAgo = getTimeAgo(exam.createdAt);
                  return (
                    <div key={`exam-${exam.id}`} className="flex items-start gap-4 p-4 rounded-xl bg-purple-50/50 hover:bg-purple-100/50 transition-all border border-purple-200/50 hover:border-purple-300 group">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 group-hover:scale-110 transition-transform shadow-md">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-purple-900">New Exam Created</p>
                        <p className="text-sm text-gray-600 mt-1">
                          &quot;{exam.title}&quot; was created with {exam.numberOfQuestions} questions. 
                          <span className="text-purple-700 font-semibold ml-1">{timeAgo}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Recent Submissions */}
                {realSubmissions.slice(0, 2).map((submission, index) => {
                  const timeAgo = getTimeAgo(submission.submittedAt);
                  const percentage = Math.round((submission.score / submission.totalQuestions) * 100);
                  return (
                    <div key={`submission-${submission.id}`} className="flex items-start gap-4 p-4 rounded-xl bg-violet-50/50 hover:bg-violet-100/50 transition-all border border-violet-200/50 hover:border-violet-300 group">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 group-hover:scale-110 transition-transform shadow-md">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-purple-900">Exam Submitted</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium text-gray-900">{submission.studentName}</span> scored {percentage}% on an exam. 
                          <span className="text-violet-700 font-semibold ml-1">{timeAgo}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
