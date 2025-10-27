'use server';

/**
 * @fileOverview AI flow for generating exam questions based on a given topic or PDF content.
 *
 * generateExamQuestions - A function that takes a topic or PDF content and generates exam questions.
 * GenerateExamQuestionsInput - The input type for the generateExamQuestions function.
 * GenerateExamQuestionsOutput - The return type for the generateExamQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateExamQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate exam questions.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe('The difficulty level of the questions.'),
  questionType: z.enum(['MCQ', 'True/False', 'Fill in the Blanks']).describe('The type of questions to generate.'),
  numberOfQuestions: z.number().min(1).max(20).describe('The number of questions to generate.'),
});

export type GenerateExamQuestionsInput = z.infer<typeof GenerateExamQuestionsInputSchema>;

const GenerateExamQuestionsOutputSchema = z.object({
  questions: z.array(
    z.object({
      questionText: z.string().describe('The text of the generated question.'),
      options: z.array(z.string()).optional().describe('The options for the question, if applicable (e.g., for MCQs).'),
      correctAnswer: z.string().optional().describe('The correct answer to the question.'),
    })
  ).describe('An array of generated exam questions.'),
});

export type GenerateExamQuestionsOutput = z.infer<typeof GenerateExamQuestionsOutputSchema>;

export async function generateExamQuestions(input: GenerateExamQuestionsInput): Promise<GenerateExamQuestionsOutput> {
  try {
    // Validate input
    const validatedInput = GenerateExamQuestionsInputSchema.parse(input);
    
    // Create prompt for the AI
    const prompt = `You are an expert teacher creating an exam for your students.

Generate ${validatedInput.numberOfQuestions} exam questions based on the following criteria:

Topic: ${validatedInput.topic}
Difficulty: ${validatedInput.difficulty}
Question Type: ${validatedInput.questionType}

The questions should be unique and non-duplicate.

Output the questions in a JSON format, including the question text, options (if applicable), and correct answer.

Make sure the output is a valid JSON.
Here's an example of how to output the questions:
{
  "questions": [
    {
      "questionText": "What is the capital of France?",
      "options": ["Berlin", "Paris", "London", "Rome"],
      "correctAnswer": "Paris"
    },
    {
      "questionText": "True or False: The Earth is flat.",
      "options": ["True", "False"],
      "correctAnswer": "False"
    },
    {
      "questionText": "____ is the first planet in our solar system.",
      "correctAnswer": "Mercury"
    }
  ]
}`;

    // Get response from AI
    const response = await ai.chat(prompt);
    
    // Try to parse the JSON response
    try {
      const parsed = JSON.parse(response);
      return GenerateExamQuestionsOutputSchema.parse(parsed);
    } catch (parseError) {
      // If parsing fails, return a default structure
      console.error('Error parsing AI response:', parseError);
      return {
        questions: [{
          questionText: `Sample question about ${validatedInput.topic}`,
          options: validatedInput.questionType === 'MCQ' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
          correctAnswer: 'Option A'
        }]
      };
    }
  } catch (error) {
    console.error('Error generating exam questions:', error);
    throw error;
  }
}
