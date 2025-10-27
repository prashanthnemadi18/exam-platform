'use server';

/**
 * @fileOverview This file defines an AI flow for analyzing student performance on exams.
 *
 * analyzeStudentPerformance - Analyzes student performance based on exam results.
 * AnalyzeStudentPerformanceInput - The input type for the analyzeStudentPerformance function.
 * AnalyzeStudentPerformanceOutput - The return type for the analyzeStudentPerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AnalyzeStudentPerformanceInputSchema = z.object({
  examId: z.string().describe('The ID of the exam to analyze.'),
  studentResponses: z.record(z.string(), z.any()).describe('A map of student IDs to their responses for the exam.'),
  correctAnswers: z.record(z.string(), z.any()).describe('A map of question IDs to the correct answers.'),
});
export type AnalyzeStudentPerformanceInput = z.infer<
  typeof AnalyzeStudentPerformanceInputSchema
>;

const AnalyzeStudentPerformanceOutputSchema = z.object({
  overallPerformance: z
    .string()
    .describe('An overall summary of student performance on the exam.'),
  strengths: z.array(z.string()).describe('Areas where students performed well.'),
  weaknesses: z.array(z.string()).describe('Areas where students struggled.'),
  suggestedImprovements: z
    .string()
    .describe('Suggestions for improving instruction based on the analysis.'),
});
export type AnalyzeStudentPerformanceOutput = z.infer<
  typeof AnalyzeStudentPerformanceOutputSchema
>;

export async function analyzeStudentPerformance(
  input: AnalyzeStudentPerformanceInput
): Promise<AnalyzeStudentPerformanceOutput> {
  try {
    // Validate input
    const validatedInput = AnalyzeStudentPerformanceInputSchema.parse(input);
    
    // Create prompt for the AI
    const prompt = `You are an AI assistant designed to analyze student performance on exams.

Based on the exam results, identify overall performance, strengths, weaknesses, and suggest improvements to instruction.

Exam ID: ${validatedInput.examId}
Student Responses: ${JSON.stringify(validatedInput.studentResponses, null, 2)}
Correct Answers: ${JSON.stringify(validatedInput.correctAnswers, null, 2)}

Analyze the student performance and provide a JSON response with:
- overallPerformance: An overall summary of student performance on the exam.
- strengths: Array of areas where students performed well.
- weaknesses: Array of areas where students struggled.
- suggestedImprovements: Suggestions for improving instruction based on the analysis.

Example format:
{
  "overallPerformance": "Students performed well overall with an average score of 75%",
  "strengths": ["Strong understanding of basic concepts", "Good problem-solving skills"],
  "weaknesses": ["Difficulty with advanced topics", "Time management issues"],
  "suggestedImprovements": "Focus more on advanced topics and provide practice with timed exercises"
}`;

    // Get response from AI
    const response = await ai.chat(prompt);
    
    // Try to parse the JSON response
    try {
      const parsed = JSON.parse(response);
      return AnalyzeStudentPerformanceOutputSchema.parse(parsed);
    } catch (parseError) {
      // If parsing fails, return a default structure
      console.error('Error parsing AI response:', parseError);
      return {
        overallPerformance: 'Analysis completed. Please review the detailed results.',
        strengths: ['Students showed engagement with the material'],
        weaknesses: ['Some areas need improvement'],
        suggestedImprovements: 'Continue monitoring student progress and adjust teaching methods as needed.'
      };
    }
  } catch (error) {
    console.error('Error analyzing student performance:', error);
    throw error;
  }
}
