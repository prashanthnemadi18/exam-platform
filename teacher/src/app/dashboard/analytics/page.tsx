"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, FileText, Trophy, TrendingUp, RefreshCw, AlertTriangle, Shield } from "lucide-react";

export default function AnalyticsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Get teacher ID from localStorage
      const teacherId = typeof window !== 'undefined' ? localStorage.getItem('teacherId') : null;
      
      if (!teacherId) {
        console.error('No teacherId found');
        setStudents([]);
        setExams([]);
        setSubmissions([]);
        setIsLoading(false);
        return;
      }

      const [studentsRes, examsRes, submissionsRes] = await Promise.all([
        fetch(`/api/students?teacherId=${teacherId}`, { cache: 'no-store' }),
        fetch(`/api/exams?teacherId=${teacherId}`, { cache: 'no-store' }),
        fetch(`/api/submissions?teacherId=${teacherId}`, { cache: 'no-store' }),
      ]);

      const studentsData = await studentsRes.json();
      const examsData = await examsRes.json();
      const submissionsData = await submissionsRes.json();

      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setExams(Array.isArray(examsData) ? examsData : []);
      setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
    } catch (error) {
      console.error('Error loading data:', error);
      setStudents([]);
      setExams([]);
      setSubmissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Auto-refresh every 15 seconds
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const totalStudents = students.length;
  const totalExams = exams.length;
  const totalSubmissions = submissions.length;
  const averageScore = submissions.length > 0
    ? Math.round(submissions.reduce((acc, sub) => acc + (sub.score / sub.totalQuestions * 100), 0) / submissions.length)
    : 0;
  
  // Cheating analytics
  const cheatingSubmissions = submissions.filter(s => s.cheatingDetected || s.wasTerminated || (s.tabSwitchCount && s.tabSwitchCount > 0));
  const cheatingPercentage = submissions.length > 0 ? Math.round((cheatingSubmissions.length / submissions.length) * 100) : 0;

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-headline bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Real-time student performance and exam analytics
          </p>
        </div>
        <Button onClick={loadData} disabled={isLoading} variant="outline" className="border-purple-300 text-purple-800 hover:bg-purple-50">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="modern-card border-l-4 border-l-purple-600 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-900">Total Students</CardTitle>
            <Users className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">{totalStudents}</div>
            <p className="text-xs text-gray-600 mt-1">Registered students</p>
          </CardContent>
        </Card>

        <Card className="modern-card border-l-4 border-l-cyan-600 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-900">Total Exams</CardTitle>
            <FileText className="h-5 w-5 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-600">{totalExams}</div>
            <p className="text-xs text-gray-600 mt-1">Created exams</p>
          </CardContent>
        </Card>

        <Card className="modern-card border-l-4 border-l-violet-600 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-900">Submissions</CardTitle>
            <Trophy className="h-5 w-5 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-violet-600">{totalSubmissions}</div>
            <p className="text-xs text-gray-600 mt-1">Completed exams</p>
          </CardContent>
        </Card>

        <Card className="modern-card border-l-4 border-l-emerald-600 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-900">Average Score</CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{averageScore}%</div>
            <p className="text-xs text-gray-600 mt-1">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Cheating Detection Analytics */}
      {cheatingSubmissions.length > 0 && (
        <Card className="modern-card border-l-4 border-l-red-600">
          <CardHeader>
            <CardTitle className="text-2xl text-red-900 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Cheating Detection Report
            </CardTitle>
            <CardDescription className="text-gray-600">
              Students flagged for suspicious activity during exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-900">Total Flagged Submissions</p>
                  <p className="text-3xl font-bold text-red-600">{cheatingSubmissions.length}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-900">Percentage of Total</p>
                  <p className="text-3xl font-bold text-red-600">{cheatingPercentage}%</p>
                </div>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow className="bg-red-50">
                  <TableHead className="text-red-900 font-semibold">Student</TableHead>
                  <TableHead className="text-red-900 font-semibold">USN</TableHead>
                  <TableHead className="text-red-900 font-semibold">Exam</TableHead>
                  <TableHead className="text-red-900 font-semibold">Tab Switches</TableHead>
                  <TableHead className="text-red-900 font-semibold">Status</TableHead>
                  <TableHead className="text-red-900 font-semibold">Score</TableHead>
                  <TableHead className="text-red-900 font-semibold">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cheatingSubmissions.map((submission) => {
                  const percentage = Math.round((submission.score / submission.totalQuestions) * 100);
                  const exam = exams.find(e => e.id === submission.examId);
                  return (
                    <TableRow key={submission.id} className="bg-red-50/50">
                      <TableCell className="font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          {submission.studentName}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">{submission.studentUSN}</TableCell>
                      <TableCell className="text-gray-700">{exam?.title || submission.examId}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                          {submission.tabSwitchCount || 0} switches
                        </span>
                      </TableCell>
                      <TableCell>
                        {submission.wasTerminated ? (
                          <span className="px-2 py-1 bg-red-600 text-white rounded-full text-xs font-semibold">
                            Auto-Submitted
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                            Flagged
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-gray-900">
                          {percentage}%
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-700">{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Recent Submissions */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-900">Recent Exam Submissions</CardTitle>
          <CardDescription className="text-gray-600">Latest student exam results</CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No submissions yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-purple-50">
                  <TableHead className="text-purple-900 font-semibold">Student</TableHead>
                  <TableHead className="text-purple-900 font-semibold">USN</TableHead>
                  <TableHead className="text-purple-900 font-semibold">Exam</TableHead>
                  <TableHead className="text-purple-900 font-semibold">Score</TableHead>
                  <TableHead className="text-purple-900 font-semibold">Percentage</TableHead>
                  <TableHead className="text-purple-900 font-semibold">Integrity</TableHead>
                  <TableHead className="text-purple-900 font-semibold">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.slice(0, 10).map((submission) => {
                  const percentage = Math.round((submission.score / submission.totalQuestions) * 100);
                  const hasCheating = submission.cheatingDetected || submission.wasTerminated || (submission.tabSwitchCount && submission.tabSwitchCount > 0);
                  const exam = exams.find(e => e.id === submission.examId);
                  return (
                    <TableRow key={submission.id} className={hasCheating ? "bg-red-50/30" : ""}>
                      <TableCell className="font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          {submission.studentName}
                          {hasCheating && <AlertTriangle className="h-4 w-4 text-red-600" />}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">{submission.studentUSN}</TableCell>
                      <TableCell className="text-gray-700">{exam?.title || submission.examId}</TableCell>
                      <TableCell className="text-gray-700">{submission.score}/{submission.totalQuestions}</TableCell>
                      <TableCell>
                        <span className={`font-bold ${percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {percentage}%
                        </span>
                      </TableCell>
                      <TableCell>
                        {hasCheating ? (
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                              ⚠️ Flagged
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-green-600">
                            <Shield className="h-4 w-4" />
                            <span className="text-xs font-semibold">Clean</span>
                          </div>
                        )}
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
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-900">Registered Students</CardTitle>
          <CardDescription className="text-gray-600">All students registered on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No students registered yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-purple-50">
                  <TableHead className="text-purple-900 font-semibold">Name</TableHead>
                  <TableHead className="text-purple-900 font-semibold">USN</TableHead>
                  <TableHead className="text-purple-900 font-semibold">Email</TableHead>
                  <TableHead className="text-purple-900 font-semibold">Semester</TableHead>
                  <TableHead className="text-purple-900 font-semibold">Registered</TableHead>
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
