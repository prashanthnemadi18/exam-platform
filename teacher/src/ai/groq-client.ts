/**
 * Groq AI Client - Ultra-fast AI inference
 * Uses Groq's lightning-fast LPU inference for real-time question generation
 * Get your free API key from: https://console.groq.com
 */

import Groq from 'groq-sdk';

export interface GroqQuestionParams {
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

export async function generateQuestionsWithGroq(
  params: GroqQuestionParams
): Promise<GeneratedQuestion[]> {
  const apiKey = process.env.GROQ_API_KEY || (process.env.NODE_ENV !== 'production' ? process.env.NEXT_PUBLIC_GROQ_API_KEY : '');
  
  if (!apiKey) {
    throw new Error('Groq API key not configured');
  }

  const groq = new Groq({ apiKey });

  const prompt = createDetailedPrompt(params);
  
  try {
    console.log('⚡ Generating REAL-TIME questions with Groq (Ultra-Fast)...');
    console.log('📝 Request:', {
      subject: params.subject,
      topic: params.topic,
      difficulty: params.difficulty,
      type: params.questionType,
      count: params.numberOfQuestions
    });
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator who creates high-quality exam questions. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile', // Fast and capable model
      temperature: 0.9,
      max_tokens: 8000,
      top_p: 0.95,
      response_format: { type: 'json_object' }
    });
    
    const responseText = completion.choices[0]?.message?.content || '';
    
    console.log('📥 Received response from Groq');
    
    const questions = parseGroqResponse(responseText, params);
    
    if (questions.length === 0) {
      throw new Error('No valid questions parsed from Groq response');
    }
    
    console.log(`✅ Successfully generated ${questions.length} UNIQUE real-time questions with Groq`);
    return questions;
  } catch (error: any) {
    console.error('❌ Groq error:', error);
    const msg = String(error?.message || '').toLowerCase();
    
    if (msg.includes('api_key') || msg.includes('unauthorized') || msg.includes('authentication')) {
      throw new Error('Groq API key invalid. Get a free key from https://console.groq.com');
    }
    if (msg.includes('rate_limit') || msg.includes('quota')) {
      throw new Error('Groq rate limit exceeded. Please wait a moment and try again.');
    }
    if (msg.includes('model')) {
      throw new Error('Groq model not available. Please try again.');
    }
    
    throw error;
  }
}

function createDetailedPrompt(params: GroqQuestionParams): string {
  const { subject, topic, difficulty, questionType, numberOfQuestions } = params;
  
  const timestamp = new Date().toISOString();
  const randomSeed = Math.random().toString(36).substring(7);
  
  let questionFormat = '';
  let exampleFormat = '';
  let specificInstructions = '';
  
  if (questionType === 'MCQ') {
    questionFormat = 'Multiple Choice Questions with 4 options each';
    exampleFormat = `{
  "questionText": "What is the time complexity of binary search?",
  "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"],
  "correctAnswer": "O(log n)",
  "explanation": "Binary search divides the search space in half with each comparison, resulting in logarithmic time complexity."
}`;
    specificInstructions = `
- Create 4 distinct options for each question
- Make distractors plausible but clearly incorrect
- Ensure only ONE correct answer per question
- Vary the position of correct answers`;
  } else if (questionType === 'True/False') {
    questionFormat = 'True/False Questions';
    exampleFormat = `{
  "questionText": "Arrays have fixed size in most programming languages.",
  "options": ["True", "False"],
  "correctAnswer": "True",
  "explanation": "In most languages like Java and C, arrays are allocated with fixed size and cannot be resized."
}`;
    specificInstructions = `
- Mix True and False answers
- Make statements clear and unambiguous
- Test important concepts`;
  } else {
    questionFormat = 'Fill in the Blank Questions';
    exampleFormat = `{
  "questionText": "The time complexity of bubble sort is _____.",
  "correctAnswer": "O(n²)",
  "explanation": "Bubble sort uses nested loops, resulting in quadratic time complexity."
}`;
    specificInstructions = `
- Place the blank at a meaningful position
- Ensure the answer is specific and unambiguous`;
  }

  let difficultyGuidance = '';
  if (difficulty === 'Easy') {
    difficultyGuidance = 'Focus on fundamental concepts and definitions';
  } else if (difficulty === 'Medium') {
    difficultyGuidance = 'Test application of concepts and problem-solving';
  } else {
    difficultyGuidance = 'Test deep understanding and critical thinking';
  }

  return `Generate exactly ${numberOfQuestions} UNIQUE ${questionFormat} about "${topic}" in ${subject}.

Generation ID: ${randomSeed} at ${timestamp}

REQUIREMENTS:
- Difficulty: ${difficulty} (${difficultyGuidance})
- Each question must test a DIFFERENT aspect
- NO repetition allowed${specificInstructions}
- EVERY question MUST have a detailed explanation (2-3 sentences)

OUTPUT FORMAT: Return a JSON object with a "questions" array:
{
  "questions": [
    ${exampleFormat},
    ... (${numberOfQuestions} total)
  ]
}

CRITICAL RULES:
1. Return ONLY valid JSON
2. Each question must be 100% unique
3. Generate exactly ${numberOfQuestions} questions
4. All questions relevant to "${topic}" in ${subject}
5. Include meaningful explanations for each answer
6. Use simple text (avoid special characters that break JSON)

Generate ${numberOfQuestions} unique questions NOW:`;
}

function parseGroqResponse(text: string, params: GroqQuestionParams): GeneratedQuestion[] {
  try {
    let cleaned = text.trim();
    
    // Remove markdown if present
    if (cleaned.includes('```json')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (cleaned.includes('```')) {
      cleaned = cleaned.replace(/```\n?/g, '');
    }
    
    cleaned = cleaned.trim();
    
    // Parse JSON
    const parsed = JSON.parse(cleaned);
    const questionsArray = parsed.questions || (Array.isArray(parsed) ? parsed : []);
    
    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
      console.error('No questions array found in Groq response');
      return [];
    }
    
    // Validate and format questions
    const questions: GeneratedQuestion[] = questionsArray.map((q: any, index: number) => {
      const question: GeneratedQuestion = {
        questionText: q.questionText || q.question || q.text || '',
        correctAnswer: q.correctAnswer || q.answer || q.correct || '',
        explanation: q.explanation || q.reason || `Correct answer for question ${index + 1}`,
      };
      
      // Add options for MCQ and True/False
      if (params.questionType === 'MCQ' || params.questionType === 'True/False') {
        question.options = q.options || q.choices || [];
        
        if (params.questionType === 'True/False' && (!question.options || question.options.length !== 2)) {
          question.options = ['True', 'False'];
        }
      }
      
      return question;
    });
    
    // Filter out invalid questions
    const validQuestions = questions.filter(q => {
      const hasText = q.questionText && q.questionText.length > 10;
      const hasAnswer = q.correctAnswer && q.correctAnswer.length > 0;
      const hasOptions = (params.questionType === 'MCQ' || params.questionType === 'True/False') 
        ? (q.options && q.options.length > 0)
        : true;
      
      return hasText && hasAnswer && hasOptions;
    });
    
    console.log(`✅ Parsed ${validQuestions.length} valid questions from Groq response`);
    
    return validQuestions;
  } catch (error) {
    console.error('❌ Failed to parse Groq response:', error);
    console.error('Response text (first 500 chars):', text.substring(0, 500));
    return [];
  }
}

export async function generateChatWithGroq(params: {
  systemPrompt: string;
  userMessage: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY || (process.env.NODE_ENV !== 'production' ? process.env.NEXT_PUBLIC_GROQ_API_KEY : '');
  
  if (!apiKey) {
    throw new Error('Groq API key not configured');
  }

  const groq = new Groq({ apiKey });

  const messages: any[] = [
    { role: 'system', content: params.systemPrompt }
  ];

  // Add conversation history
  if (params.conversationHistory) {
    messages.push(...params.conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    })));
  }

  // Add current user message
  messages.push({ role: 'user', content: params.userMessage });

  const completion = await groq.chat.completions.create({
    messages,
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 0.9,
  });

  return completion.choices[0]?.message?.content || '';
}

export function isGroqAvailable(): boolean {
  const apiKey = process.env.GROQ_API_KEY || (process.env.NODE_ENV !== 'production' ? process.env.NEXT_PUBLIC_GROQ_API_KEY : '');
  const isAvailable = !!apiKey && apiKey.length > 30;
  
  if (isAvailable) {
    console.log('✅ Groq is available and configured');
  } else {
    console.log('⚠️ Groq not available - API key not configured');
  }
  
  return isAvailable;
}
