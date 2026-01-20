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
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  AlertTriangle,
  Sparkles,
  Trophy,
  BarChart as BarChartIcon,
} from "lucide-react";
import {
  mockExamResults,
  mockMarksDistribution,
} from "@/lib/mock-data";
import { useEffect, useState } from "react";
type AnalyzeStudentPerformanceOutput = {
  overallPerformance: string;
  strengths: string[];
  weaknesses: string[];
  suggestedImprovements: string;
};

export function PerformanceAnalytics() {
  const [analysis, setAnalysis] = useState<AnalyzeStudentPerformanceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const topPerformers = mockExamResults
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  useEffect(() => {
    // Simulate AI analysis with mock data
    const mockAnalysis: AnalyzeStudentPerformanceOutput = {
      overallPerformance: "The class performed well overall with an average score of 78%. Most students demonstrated a strong understanding of core concepts.",
      strengths: [
        "Strong grasp of fundamental concepts",
        "Good problem-solving skills",
        "Excellent performance in practical questions"
      ],
      weaknesses: [
        "Need improvement in advanced topics",
        "Time management during exam",
        "Attention to detail in calculations"
      ],
      suggestedImprovements: "Focus on advanced topics through additional practice sessions. Conduct mock tests to improve time management. Provide detailed feedback on calculation errors."
    };

    setAnalysis(mockAnalysis);
    setIsLoading(false);
  }, []);

  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChartIcon className="text-primary" />Marks Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMarksDistribution.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">{item.students} students</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(item.students / Math.max(...mockMarksDistribution.map(d => d.students))) * 100}%`,
                      backgroundColor: item.fill
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Trophy className="text-accent" />Top Performers</CardTitle>
          <CardDescription>Ranking of the top 5 students in the latest exam.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPerformers.map((result) => (
                <TableRow key={result.studentId}>
                  <TableCell>
                    <Badge variant={result.rank <= 3 ? "default" : "secondary"}>
                      {result.rank}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{result.studentName}</TableCell>
                  <TableCell className="text-right">{result.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary" />AI Analysis</CardTitle>
          <CardDescription>AI-generated insights and suggestions based on exam performance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading analysis...</p>
          ) : analysis ? (
            <>
              <div>
                <h3 className="font-semibold mb-2">Overall Performance</h3>
                <p className="text-sm text-muted-foreground">{analysis.overallPerformance}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2"><Lightbulb className="text-green-500" />Strengths</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {analysis.strengths.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="text-orange-500" />Weaknesses</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {analysis.weaknesses.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Suggested Improvements</h3>
                <p className="text-sm text-muted-foreground">{analysis.suggestedImprovements}</p>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
