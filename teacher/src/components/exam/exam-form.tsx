"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockExamQuestions } from "@/lib/mock-data";

interface ExamFormProps {
  examId: string;
  studentData?: {
    name: string;
    usn: string;
    email: string;
  };
  examData?: {
    questions: any[];
    teacherId?: string;
  };
  timeRemaining?: number;
  isTerminated?: boolean;
  onSubmitStart?: () => void;
  tabSwitchCount?: number;
  cameraViolations?: number;
  terminationReason?: string;
}

export function ExamForm({ examId, studentData, examData, timeRemaining, isTerminated, onSubmitStart, tabSwitchCount, cameraViolations, terminationReason }: ExamFormProps) {
  const questions = examData?.questions || mockExamQuestions.questions;

  // Dynamically create the Zod schema based on the questions
  const schemaShape = questions.reduce((acc, q, index) => {
    acc[`q_${index}`] = z.string().min(1, { message: "Please select an answer." });
    return acc;
  }, {} as Record<string, z.ZodString>);
  
  const formSchema = z.object(schemaShape);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Notify parent component that submission has started (stops the timer)
    if (onSubmitStart) {
      onSubmitStart();
    }
    
    setIsLoading(true);
    
    try {
      // Calculate score
      let score = 0;
      const answers = Object.entries(values).map(([key, answer], index) => {
        const question = questions[index];
        const isCorrect = answer === question.correctAnswer;
        if (isCorrect) score++;
        return {
          questionIndex: index,
          answer,
          isCorrect,
        };
      });

      // Get teacher ID from exam data
      const teacherId = examData?.teacherId || null;

      // Submit to API
      const submission = {
        examId,
        studentId: studentData?.usn || 'unknown',
        studentName: studentData?.name || 'Unknown',
        studentUSN: studentData?.usn || 'Unknown',
        studentEmail: studentData?.email || 'unknown@email.com',
        answers,
        score,
        totalQuestions: questions.length,
        submittedAt: new Date().toISOString(),
        wasTerminated: isTerminated || false,
        timeRemaining: timeRemaining || 0,
        tabSwitchCount: tabSwitchCount || 0,
        cameraViolations: cameraViolations || 0,
        terminationReason: terminationReason || '',
        cheatingDetected: (tabSwitchCount || 0) > 0 || (cameraViolations || 0) > 0,
        teacherId: teacherId,
      };

      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });

      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting exam:', error);
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center space-y-4 py-16">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h3 className="text-2xl font-bold font-headline">
            {isTerminated && timeRemaining === 0 
              ? "Time's Up! Exam Auto-Submitted" 
              : isTerminated 
              ? "Exam Auto-Submitted" 
              : "Exam Submitted!"}
          </h3>
          <p className="text-muted-foreground">
            {isTerminated && timeRemaining === 0
              ? "Your exam time has expired and your responses were automatically submitted."
              : isTerminated 
              ? "Your exam was automatically submitted due to policy violations. Your responses have been recorded."
              : "Your responses have been recorded. You can now close this window."
            }
          </p>
          {isTerminated && timeRemaining !== 0 && (
            <p className="text-sm text-destructive">
              Note: This submission was flagged for review due to detected cheating attempts.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Exam Questions</CardTitle>
        <CardDescription>Please answer all questions to the best of your ability.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            {questions.map((q, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`q_${index}` as any}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-bold">
                      Q{index + 1}: {q.questionText}
                    </FormLabel>
                    <FormControl>
                      {q.options ? (
                         <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          {q.options.map((option: string, i: number) => (
                            <FormItem key={i} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={option} />
                              </FormControl>
                              <FormLabel className="font-normal">{option}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      ) : (
                        <Input placeholder="Your answer..." {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            
            <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Exam
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
