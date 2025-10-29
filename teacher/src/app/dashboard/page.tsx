"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, FileText, Trophy, Activity, BarChart3, Plus } from "lucide-react";
import { GenerateLinkButton } from "@/components/dashboard/generate-link-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    <div className="space-y-8 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-headline bg-gradient-to-r from-amber-700 via-orange-600 to-teal-700 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Welcome back, here&apos;s your command center.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={loadData}
            disabled={isRefreshing}
            variant="outline"
            className="border-amber-300 text-amber-800 hover:bg-amber-50 font-semibold hover-lift"
          >
            <Activity className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          <GenerateLinkButton />
          <Button asChild className="antique-gradient hover:opacity-90 text-white font-semibold shadow-lg hover-lift">
            <Link href="/dashboard/create-exam">
              <Plus className="mr-2 h-4 w-4" />
              Create Exam
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="antique-card border-l-4 border-l-amber-600 hover-lift animate-scale-in group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-amber-900">
              Total Students
            </CardTitle>
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl group-hover:scale-110 transition-transform shadow-md">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
              {totalStudents}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              students registered on the platform
            </p>
          </CardContent>
        </Card>
        
        <Card className="antique-card border-l-4 border-l-blue-600 hover-lift animate-scale-in group overflow-hidden relative" style={{animationDelay: '0.1s'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-amber-900">
              Exams Conducted
            </CardTitle>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform shadow-md">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-blue-600">{examsConducted}</div>
            <p className="text-sm text-gray-600 mt-2">
              in total across all subjects
            </p>
          </CardContent>
        </Card>
        
        <Card className="antique-card border-l-4 border-l-teal-600 hover-lift animate-scale-in group overflow-hidden relative" style={{animationDelay: '0.2s'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-teal-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-amber-900">Top Scorer</CardTitle>
            <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl group-hover:scale-110 transition-transform shadow-md">
              <Trophy className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-teal-600">{topScorer.studentName}</div>
            <p className="text-sm text-gray-600 mt-2">
              {topScorer.percentage > 0 ? `with a score of ${Math.round((topScorer.score / topScorer.totalQuestions) * 100)}%` : 'Waiting for submissions'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <Card className="antique-card animate-slide-up hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-amber-900 text-2xl">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md">
                <Activity className="h-5 w-5 text-white" />
              </div>
              Activity Feed
            </CardTitle>
            <CardDescription className="text-gray-600">
              A log of recent important events and system activities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-50/50 hover:bg-amber-100/50 transition-all border border-amber-200/50 hover:border-amber-300 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 group-hover:scale-110 transition-transform shadow-md">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900">New Exam Created</p>
                  <p className="text-sm text-gray-600 mt-1">&quot;Computer Networks - Midterm&quot; was created. <span className="text-amber-700 font-semibold">2 hours ago.</span></p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-teal-50/50 hover:bg-teal-100/50 transition-all border border-teal-200/50 hover:border-teal-300 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 group-hover:scale-110 transition-transform shadow-md">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900">5 New Students Registered</p>
                  <p className="text-sm text-gray-600 mt-1">A new batch of students joined from the registration link. <span className="text-teal-700 font-semibold">1 day ago.</span></p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50/50 hover:bg-blue-100/50 transition-all border border-blue-200/50 hover:border-blue-300 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:scale-110 transition-transform shadow-md">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900">Analysis Complete</p>
                  <p className="text-sm text-gray-600 mt-1">Performance analysis for &quot;Data Structures - Test 1&quot; is ready. <span className="text-blue-700 font-semibold">3 days ago.</span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
