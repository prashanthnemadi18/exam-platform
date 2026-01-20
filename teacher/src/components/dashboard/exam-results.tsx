"use client";

import { useState } from "react";
import { Download, FileText, Users, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Submission {
  id: string;
  studentName: string;
  studentUSN: string;
  score: number;
  totalQuestions: number;
  submittedAt: string;
  wasTerminated?: boolean;
  tabSwitchCount?: number;
  cheatingDetected?: boolean;
  terminationReason?: string;
}

interface ExamResultsProps {
  examId: string;
  examTitle: string;
  submissions: Submission[];
}

export function ExamResults({ examId, examTitle, submissions }: ExamResultsProps) {
  const [loadingPDF, setLoadingPDF] = useState<string | null>(null);
  const [loadingAllPDF, setLoadingAllPDF] = useState(false);
  const { toast } = useToast();

  const handleDownloadPDF = async (submissionId: string, studentName: string) => {
    setLoadingPDF(submissionId);
    try {
      const response = await fetch(`/api/submissions/${submissionId}/pdf`);
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${studentName.replace(/\s+/g, '_')}_Result.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "PDF Downloaded",
        description: `Result for ${studentName} has been downloaded.`,
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPDF(null);
    }
  };

  const handleDownloadAllPDF = async () => {
    setLoadingAllPDF(true);
    try {
      const response = await fetch(`/api/exams/${examId}/pdf`);
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${examTitle.replace(/\s+/g, '_')}_All_Results.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "PDF Downloaded",
        description: "All results have been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error downloading all PDFs:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingAllPDF(false);
    }
  };

  const sortedSubmissions = [...submissions].sort((a, b) => {
    const percentageA = (a.score / a.totalQuestions) * 100;
    const percentageB = (b.score / b.totalQuestions) * 100;
    return percentageB - percentageA;
  });

  const averageScore = submissions.length > 0
    ? submissions.reduce((sum, s) => sum + (s.score / s.totalQuestions) * 100, 0) / submissions.length
    : 0;

  const passedCount = submissions.filter(s => (s.score / s.totalQuestions) * 100 >= 60).length;
  const cheatingCount = submissions.filter(s => s.cheatingDetected || s.wasTerminated).length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {passedCount}/{submissions.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {submissions.length > 0 ? ((passedCount / submissions.length) * 100).toFixed(1) : 0}% passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cheating Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{cheatingCount}</div>
            <p className="text-xs text-muted-foreground">
              {submissions.length > 0 ? ((cheatingCount / submissions.length) * 100).toFixed(1) : 0}% flagged
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Results</CardTitle>
              <CardDescription>
                Detailed results for all students who submitted the exam
              </CardDescription>
            </div>
            <Button
              onClick={handleDownloadAllPDF}
              disabled={loadingAllPDF || submissions.length === 0}
            >
              {loadingAllPDF ? (
                <>
                  <Download className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download All Results
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No submissions yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>USN</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Anti-Cheat</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSubmissions.map((submission, index) => {
                  const percentage = (submission.score / submission.totalQuestions) * 100;
                  const passed = percentage >= 60;
                  const hasCheating = submission.cheatingDetected || submission.wasTerminated;
                  const tabSwitches = submission.tabSwitchCount || 0;

                  return (
                    <TableRow key={submission.id} className={hasCheating ? "bg-red-50 dark:bg-red-950/10" : ""}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {submission.studentName}
                          {hasCheating && (
                            <span className="inline-flex" title="Cheating detected">
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{submission.studentUSN}</TableCell>
                      <TableCell>
                        {submission.score}/{submission.totalQuestions}
                      </TableCell>
                      <TableCell>
                        <span className={passed ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                          {percentage.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {passed ? "Pass" : "Fail"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {hasCheating ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                ⚠️ Flagged
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {tabSwitches > 0 && (
                                <div className="flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Tab switches: {tabSwitches}
                                </div>
                              )}
                              {submission.wasTerminated && (
                                <div className="text-red-600 font-medium mt-1">
                                  Auto-submitted
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-green-600">
                            <Shield className="h-4 w-4" />
                            <span className="text-xs">Clean</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(submission.submittedAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadPDF(submission.id, submission.studentName)}
                          disabled={loadingPDF === submission.id}
                        >
                          {loadingPDF === submission.id ? (
                            <Download className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              PDF
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
