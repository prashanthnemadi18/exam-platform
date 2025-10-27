"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockStudents, mockExamResults } from "@/lib/mock-data";
import { Users, FileText, Trophy, Activity, CheckCircle, BarChart3, Plus } from "lucide-react";
import { GenerateLinkButton } from "@/components/dashboard/generate-link-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [realStudents, setRealStudents] = useState<any[]>([]);
  const [realExams, setRealExams] = useState<any[]>([]);
  const [realSubmissions, setRealSubmissions] = useState<any[]>([]);

  useEffect(() => {
    // Load real data from storage
    if (typeof window !== 'undefined') {
      const { getStudents, getExams, getSubmissions } = require('@/lib/storage');
      setRealStudents(getStudents());
      setRealExams(getExams());
      setRealSubmissions(getSubmissions());
    }
  }, []);

  // Combine real and mock data
  const allStudents = [...realStudents, ...mockStudents];
  const totalStudents = allStudents.length;
  const examsConducted = realExams.length + 5; // real + mock
  const topScorer = mockExamResults.reduce((prev, current) =>
    prev.score > current.score ? prev : current
  );
  const recentRegistrations = allStudents.slice(-5).reverse();

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, here&apos;s a summary of your activities.
          </p>
        </div>
        <div className="flex gap-3">
          <GenerateLinkButton />
          <Button asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <Link href="/dashboard/create-exam">
              <Plus className="mr-2 h-4 w-4" />
              Create Exam
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {totalStudents}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              students registered on the platform
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Exams Conducted
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{examsConducted}</div>
            <p className="text-xs text-muted-foreground mt-1">
              in total across all subjects
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Scorer</CardTitle>
            <div className="p-2 bg-accent/10 rounded-full">
              <Trophy className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{topScorer.studentName}</div>
            <p className="text-xs text-muted-foreground mt-1">
              with a score of {topScorer.percentage}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Recent Registrations
            </CardTitle>
            <CardDescription>
              The latest students who have registered.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Semester</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRegistrations.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {student.usn}
                      </div>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell className="text-right">{student.semester}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Activity Feed
            </CardTitle>
             <CardDescription>
              A log of recent important events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">New Exam Created</p>
                  <p className="text-sm text-muted-foreground">&quot;Computer Networks - Midterm&quot; was created. <span className="font-medium">2 hours ago.</span></p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">5 New Students Registered</p>
                  <p className="text-sm text-muted-foreground">A new batch of students joined from the registration link. <span className="font-medium">1 day ago.</span></p>
                </div>
              </div>
               <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Analysis Complete</p>
                  <p className="text-sm text-muted-foreground">Performance analysis for &quot;Data Structures - Test 1&quot; is ready. <span className="font-medium">3 days ago.</span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
