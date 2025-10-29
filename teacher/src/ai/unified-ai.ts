/**
 * Unified AI Client - Supports both OpenAI and Google AI
 * Automatically falls back to available provider
 */

import { generateQuestionsWithOpenAI, QuestionGenerationParams, GeneratedQuestion } from './openai-client';
import { ai as googleAI } from './genkit';

export interface AIQuestionParams {
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionType: 'MCQ' | 'True/False' | 'Fill in the Blanks';
  numberOfQuestions: number;
}

export async function generateQuestions(params: AIQuestionParams): Promise<GeneratedQuestion[]> {
  // Try OpenAI first
  if (process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    try {
      console.log('🤖 Using OpenAI for question generation...');
      const questions = await generateQuestionsWithOpenAI(params);
      console.log('✅ OpenAI generated', questions.length, 'questions');
      return questions;
    } catch (error) {
      console.error('❌ OpenAI failed:', error);
      console.log('🔄 Falling back to Google AI...');
    }
  }

  // Try Google AI as fallback
  if (process.env.GOOGLE_GENAI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY) {
    try {
      console.log('🤖 Using Google AI for question generation...');
      const prompt = createGoogleAIPrompt(params);
      const response = await googleAI.chat(prompt);
      const questions = parseGoogleAIResponse(response, params);
      console.log('✅ Google AI generated', questions.length, 'questions');
      return questions;
    } catch (error) {
      console.error('❌ Google AI failed:', error);
    }
  }

  // If both fail, throw error
  throw new Error('No AI provider configured. Please add OPENAI_API_KEY or GOOGLE_GENAI_API_KEY to your .env.local file');
}

function createGoogleAIPrompt(params: AIQuestionParams): string {
  return `Generate exactly ${params.numberOfQuestions} ${params.questionType} questions about "${params.topic}" in the subject "${params.subject}".

Requirements:
- Difficulty Level: ${params.difficulty}
- Question Type: ${params.questionType}
- All questions MUST be specifically about: "${params.topic}" in "${params.subject}"

Return ONLY a valid JSON array:
[
  {
    "questionText": "Your question?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "explanation": "Why this is correct"
  }
]`;
}

function parseGoogleAIResponse(response: string, params: AIQuestionParams): GeneratedQuestion[] {
  try {
    let cleaned = response.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```\n?/g, '');
    }
    
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : parsed.questions || [];
  } catch (error) {
    console.error('Failed to parse Google AI response:', error);
    return [];
  }
}

export function getAvailableAIProvider(): 'openai' | 'google' | 'none' {
  if (process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    return 'openai';
  }
  if (process.env.GOOGLE_GENAI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY) {
    return 'google';
  }
  return 'none';
}
