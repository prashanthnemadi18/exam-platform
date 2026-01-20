/**
 * Unified AI Client - Supports FREE AI and Premium providers
 * Automatically falls back to available provider
 */

import { generateQuestionsWithOpenAI, QuestionGenerationParams, GeneratedQuestion } from './openai-client';
import { generateQuestionsWithClaude } from './claude-client';
import { generateQuestionsWithFreeAI } from './free-ai-client';
import { generateQuestionsWithGoogleAI, isGoogleAIAvailable } from './google-ai-client';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIQuestionParams {
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Auto Mixed';
  questionType: 'MCQ' | 'True/False' | 'Fill in the Blanks' | 'Auto Mixed';
  numberOfQuestions: number;
}

export async function generateQuestions(params: AIQuestionParams): Promise<GeneratedQuestion[]> {
  console.log('🚀 Starting REAL-TIME question generation...');
  console.log('📝 Parameters:', params);
  
  // Handle Auto Mixed - distribute questions across types/difficulties
  if (params.difficulty === 'Auto Mixed' || params.questionType === 'Auto Mixed') {
    return generateMixedQuestions(params);
  }
  
  // Cast to non-Auto Mixed types for AI providers
  const normalizedParams = {
    ...params,
    difficulty: params.difficulty as 'Easy' | 'Medium' | 'Hard',
    questionType: params.questionType as 'MCQ' | 'True/False' | 'Fill in the Blanks',
  };
  
  // Try Google AI FIRST (if configured) - Best for real-time generation
  if (isGoogleAIAvailable()) {
    try {
      console.log('🤖 Using Google AI (Gemini Flash Latest) for REAL-TIME question generation...');
      const questions = await generateQuestionsWithGoogleAI(normalizedParams);
      if (questions && questions.length > 0) {
        console.log(`✅ SUCCESS! Google AI generated ${questions.length} UNIQUE real-time questions`);
        console.log('📊 Questions preview:', questions.slice(0, 2).map(q => q.questionText));
        return questions;
      } else {
        console.warn('⚠️ Google AI returned empty questions array');
      }
    } catch (error: any) {
      console.error('❌ Google AI failed:', error.message || error);
      console.error('Full error:', error);
    }
  } else {
    console.log('⚠️ Google AI not available - API key not configured');
  }

  // Try Claude Sonnet (if configured)
  if (process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY) {
    try {
      console.log('🤖 Trying Claude Sonnet for question generation...');
      const questions = await generateQuestionsWithClaude(normalizedParams);
      if (questions && questions.length > 0) {
        console.log(`✅ Claude generated ${questions.length} questions`);
        return questions;
      }
    } catch (error: any) {
      console.error('❌ Claude failed:', error.message || error);
    }
  }

  // Try OpenAI (if configured)
  if (process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    try {
      console.log('🤖 Trying OpenAI for question generation...');
      const questions = await generateQuestionsWithOpenAI(normalizedParams);
      if (questions && questions.length > 0) {
        console.log(`✅ OpenAI generated ${questions.length} questions`);
        return questions;
      }
    } catch (error: any) {
      console.error('❌ OpenAI failed:', error.message || error);
    }
  }

  // Try FREE AI (Hugging Face - no API key needed)
  try {
    console.log('🆓 Trying FREE AI for question generation...');
    const questions = await generateQuestionsWithFreeAI(normalizedParams);
    if (questions && questions.length > 0) {
      console.log(`✅ FREE AI generated ${questions.length} questions`);
      return questions;
    }
  } catch (error: any) {
    console.error('❌ FREE AI failed:', error.message || error);
  }

  // Final fallback - use smart question generator
  console.log('🔄 Using smart fallback generator...');
  return generateQuestionsWithFreeAI(normalizedParams);
}



export function getAvailableAIProvider(): 'claude' | 'openai' | 'google' | 'none' {
  if (process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY) {
    return 'claude';
  }
  if (process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    return 'openai';
  }
  if (process.env.GOOGLE_GENAI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY) {
    return 'google';
  }
  return 'none';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatParams {
  systemPrompt: string;
  userMessage: string;
  conversationHistory?: ChatMessage[];
}

export async function generateChatResponse(params: ChatParams): Promise<string> {
  console.log('🤖 Generating chat response...');
  
  // Try Google AI FIRST (if configured)
  if (isGoogleAIAvailable()) {
    try {
      console.log('🤖 Using Google AI for chat response...');
      const response = await generateChatWithGoogleAI(params);
      if (response) {
        console.log('✅ Google AI chat response generated');
        return response;
      }
    } catch (error: any) {
      console.error('❌ Google AI chat failed:', error.message || error);
    }
  }

  // If AI fails, return a default helpful response
  console.log('⚠️ Using fallback chat response');
  return "I'm here to help! However, I'm currently having trouble processing your request. Please try again or rephrase your question.";
}

async function generateChatWithGoogleAI(params: ChatParams): Promise<string> {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY || (process.env.NODE_ENV !== 'production' ? process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY : '');
  
  if (!apiKey) {
    throw new Error('Google AI API key not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-latest',
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048,
    }
  });

  // Build chat history
  const chat = model.startChat({
    history: params.conversationHistory?.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })) || [],
  });

  // Send user message with system prompt context
  const prompt = `${params.systemPrompt}\n\nUser: ${params.userMessage}`;
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  
  return response.text();
}

// Generate mixed questions when Auto Mixed is selected
async function generateMixedQuestions(params: AIQuestionParams): Promise<GeneratedQuestion[]> {
  const { subject, topic, numberOfQuestions, difficulty, questionType } = params;
  const questions: GeneratedQuestion[] = [];
  
  const difficulties: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];
  const types: ('MCQ' | 'True/False' | 'Fill in the Blanks')[] = ['MCQ', 'True/False', 'Fill in the Blanks'];
  
  // Distribute questions evenly across types/difficulties
  for (let i = 0; i < numberOfQuestions; i++) {
    const currentDifficulty = difficulty === 'Auto Mixed' 
      ? difficulties[i % difficulties.length]
      : difficulty as 'Easy' | 'Medium' | 'Hard';
    
    const currentType = questionType === 'Auto Mixed'
      ? types[i % types.length]
      : questionType as 'MCQ' | 'True/False' | 'Fill in the Blanks';
    
    try {
      const questionBatch = await generateQuestions({
        subject,
        topic,
        difficulty: currentDifficulty,
        questionType: currentType,
        numberOfQuestions: 1,
      });
      
      if (questionBatch && questionBatch.length > 0) {
        questions.push(questionBatch[0]);
      }
    } catch (error) {
      console.error('Error generating mixed question:', error);
    }
  }
  
  return questions;
}
