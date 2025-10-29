"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, FileText, Trophy, TrendingUp, RefreshCw } from "lucide-react";

export default function AnalyticsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [studentsRes, examsRes, submissionsRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/exams'),
        fetch('/api/submissions'),
      ]);

      const studentsData = await studentsRes.json();
      const examsData = await examsRes.json();
      const submissionsData = await submissionsRes.json();

      setStudents(studentsData);
      setExams(examsData);
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalStudents = students.length;
  const totalExams = exams.length;
  const totalSubmissions = submissions.length;
  const averageScore = submissions.length > 0
    ? Math.round(submissions.reduce((acc, sub) => acc + (sub.score / sub.totalQuestions * 100), 0) / submissions.length)
    : 0;

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-headline bg-gradient-to-r from-amber-700 via-orange-600 to-teal-700 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Real-time student performance and exam analytics
          </p>
        </div>
        <Button onClick={loadData} disabled={isLoading} variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-50">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="antique-card border-l-4 border-l-amber-600 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-amber-900">Total Students</CardTitle>
            <Users className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">{totalStudents}</div>
            <p className="text-xs text-gray-600 mt-1">Registered students</p>
          </CardContent>
        </Card>

        <Card className="antique-card border-l-4 border-l-blue-600 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-amber-900">Total Exams</CardTitle>
            <FileText className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalExams}</div>
            <p className="text-xs text-gray-600 mt-1">Created exams</p>
          </CardContent>
        </Card>

        <Card className="antique-card border-l-4 border-l-teal-600 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-amber-900">Submissions</CardTitle>
            <Trophy className="h-5 w-5 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600">{totalSubmissions}</div>
            <p className="text-xs text-gray-600 mt-1">Completed exams</p>
          </CardContent>
        </Card>

        <Card className="antique-card border-l-4 border-l-green-600 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-amber-900">Average Score</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{averageScore}%</div>
            <p className="text-xs text-gray-600 mt-1">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card className="antique-card">
        <CardHeader>
          <CardTitle className="text-2xl text-amber-900">Recent Exam Submissions</CardTitle>
          <CardDescription className="text-gray-600">Latest student exam results</CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No submissions yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-amber-900">Student</TableHead>
                  <TableHead className="text-amber-900">USN</TableHead>
                  <TableHead className="text-amber-900">Exam</TableHead>
                  <TableHead className="text-amber-900">Score</TableHead>
                  <TableHead className="text-amber-900">Percentage</TableHead>
                  <TableHead className="text-amber-900">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.slice(0, 10).map((submission) => {
                  const percentage = Math.round((submission.score / submission.totalQuestions) * 100);
                  return (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium text-gray-900">{submission.studentName}</TableCell>
                      <TableCell className="text-gray-700">{submission.studentUSN}</TableCell>
                      <TableCell className="text-gray-700">{submission.examId}</TableCell>
                      <TableCell className="text-gray-700">{submission.score}/{submission.totalQuestions}</TableCell>
                      <TableCell>
                        <span className={`font-bold ${percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {percentage}%
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-700">{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Registered Students */}
      <Card className="antique-card">
        <CardHeader>
          <CardTitle className="text-2xl text-amber-900">Registered Students</CardTitle>
          <CardDescription className="text-gray-600">All students registered on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No students registered yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-amber-900">Name</TableHead>
                  <TableHead className="text-amber-900">USN</TableHead>
                  <TableHead className="text-amber-900">Email</TableHead>
                  <TableHead className="text-amber-900">Semester</TableHead>
                  <TableHead className="text-amber-900">Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium text-gray-900">{student.name}</TableCell>
                    <TableCell className="text-gray-700">{student.usn}</TableCell>
                    <TableCell className="text-gray-700">{student.email}</TableCell>
                    <TableCell className="text-gray-700">{student.semester}</TableCell>
                    <TableCell className="text-gray-700">{new Date(student.registeredAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
