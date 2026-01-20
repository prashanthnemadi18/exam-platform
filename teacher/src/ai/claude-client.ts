/**
 * Claude AI Client (Anthropic)
 * Supports Claude Sonnet 4.5 for question generation
 */

import Anthropic from '@anthropic-ai/sdk';

export interface ClaudeQuestionParams {
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionType: 'MCQ' | 'True/False' | 'Fill in the Blanks';
  numberOfQuestions: number;
}

export interface GeneratedQuestion {
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export async function generateQuestionsWithClaude(
  params: ClaudeQuestionParams
): Promise<GeneratedQuestion[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY || (process.env.NODE_ENV !== 'production' ? process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY : '');

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not found in environment variables');
  }

  const client = new Anthropic({
    apiKey: apiKey,
  });

  const prompt = createClaudePrompt(params);

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514', // Claude Sonnet 4.5
      max_tokens: 4096,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const questions = parseClaudeResponse(responseText, params);

    if (questions.length === 0) {
      throw new Error('No questions generated');
    }

    return questions;
  } catch (error) {
    console.error('Claude API Error:', error);
    throw error;
  }
}

function createClaudePrompt(params: ClaudeQuestionParams): string {
  const { subject, topic, difficulty, questionType, numberOfQuestions } = params;

  let questionFormat = '';
  
  if (questionType === 'MCQ') {
    questionFormat = `
{
  "questionText": "Your multiple choice question?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Option A",
  "explanation": "Brief explanation why this is correct"
}`;
  } else if (questionType === 'True/False') {
    questionFormat = `
{
  "questionText": "Your true/false statement",
  "options": ["True", "False"],
  "correctAnswer": "True",
  "explanation": "Brief explanation"
}`;
  } else {
    questionFormat = `
{
  "questionText": "Your question with a blank: The capital of France is _____.",
  "correctAnswer": "Paris",
  "explanation": "Brief explanation"
}`;
  }

  return `You are an expert educator creating exam questions.

Generate exactly ${numberOfQuestions} ${questionType} questions for an exam.

Subject: ${subject}
Topic: ${topic}
Difficulty Level: ${difficulty}
Question Type: ${questionType}

Requirements:
1. All questions MUST be specifically about "${topic}" in "${subject}"
2. Questions should be at ${difficulty} difficulty level
3. For MCQ: Provide 4 options with one correct answer
4. For True/False: Provide a statement with True or False answer
5. For Fill in the Blanks: Use _____ for the blank
6. Include brief explanations for correct answers
7. Make questions clear, unambiguous, and educational
8. Ensure variety in question content

Return ONLY a valid JSON array in this exact format:
[
  ${questionFormat}
]

Important: Return ONLY the JSON array, no additional text or markdown.`;
}

function parseClaudeResponse(
  response: string,
  params: ClaudeQuestionParams
): GeneratedQuestion[] {
  try {
    // Clean up the response
    let cleaned = response.trim();

    // Remove markdown code blocks if present
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```\n?/g, '');
    }

    // Parse JSON
    const parsed = JSON.parse(cleaned);
    const questions = Array.isArray(parsed) ? parsed : parsed.questions || [];

    // Validate and format questions
    return questions.map((q: any) => ({
      questionText: q.questionText || q.question || '',
      options: q.options || (params.questionType === 'True/False' ? ['True', 'False'] : []),
      correctAnswer: q.correctAnswer || q.answer || '',
      explanation: q.explanation || '',
    }));
  } catch (error) {
    console.error('Failed to parse Claude response:', error);
    console.error('Response was:', response);
    return [];
  }
}

export function isClaudeConfigured(): boolean {
  return !!(process.env.ANTHROPIC_API_KEY || (process.env.NODE_ENV !== 'production' ? process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY : ''));
}
