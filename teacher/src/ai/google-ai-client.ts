/**
 * Google AI Client - Real-time Question Generation
 * Uses Google's Gemini API for generating unique questions
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GoogleAIQuestionParams {
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

export async function generateQuestionsWithGoogleAI(
  params: GoogleAIQuestionParams
): Promise<GeneratedQuestion[]> {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY || (process.env.NODE_ENV !== 'production' ? process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY : '');
  
  if (!apiKey) {
    throw new Error('Google AI API key not configured');
  }

  // Validate API key format
  if (!apiKey.startsWith('AIza') || apiKey.length < 30) {
    throw new Error('Invalid Google AI API key format');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Use gemini-flash-latest (always points to latest stable Gemini Flash)
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-latest',
    generationConfig: {
      temperature: 0.9,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',  // Force JSON output
    }
  });

  const prompt = createDetailedPrompt(params);
  
  try {
    console.log('🤖 Generating REAL-TIME questions with Google AI Gemini Flash (Latest)...');
    console.log('📝 Request:', {
      subject: params.subject,
      topic: params.topic,
      difficulty: params.difficulty,
      type: params.questionType,
      count: params.numberOfQuestions
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📥 Received response from Google AI');
    
    const questions = parseGoogleAIResponse(text, params);
    
    if (questions.length === 0) {
      throw new Error('No valid questions parsed from AI response');
    }
    
    console.log(`✅ Successfully generated ${questions.length} UNIQUE real-time questions`);
    return questions;
  } catch (error: any) {
    console.error('❌ Google AI error:', error);
    const msg = String(error?.message || '').toLowerCase();
    if (msg.includes('not found') || msg.includes('not supported') || msg.includes('quota')) {
      try {
        // Fallback to gemini-flash-latest if primary model fails
        console.log('⚠️ Primary model failed, trying fallback: gemini-flash-latest');
        const fallback = genAI.getGenerativeModel({ 
          model: 'gemini-flash-latest',
          generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
          }
        });
        const result = await fallback.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const questions = parseGoogleAIResponse(text, params);
        if (questions.length > 0) {
          console.log('✅ Fallback to Gemini Flash Latest successful');
          return questions;
        }
      } catch (fallbackError) {
        console.error('❌ Fallback model also failed:', fallbackError);
      }
    }
    if (msg.includes('api_key_invalid') || msg.includes('permission_denied')) {
      throw new Error('Google AI key invalid or unauthorized. Use a valid key from https://aistudio.google.com/app/apikey');
    }
    if (msg.includes('quota_exceeded')) {
      throw new Error('Google AI quota exceeded. Please wait or upgrade your plan.');
    }
    if (msg.includes('safety')) {
      throw new Error('Content filtered by safety settings. Try different topic or difficulty.');
    }
    throw error;
  }
}

function createDetailedPrompt(params: GoogleAIQuestionParams): string {
  const { subject, topic, difficulty, questionType, numberOfQuestions } = params;
  
  // Add timestamp to ensure unique generation each time
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
  "explanation": "Binary search divides the search space in half with each comparison, eliminating half of the remaining elements. This results in a logarithmic time complexity of O(log n), making it much more efficient than linear search for sorted arrays."
}`;
    specificInstructions = `
- Create 4 distinct options for each question
- Make distractors (wrong answers) plausible but clearly incorrect
- Ensure only ONE correct answer per question
- Vary the position of correct answers (not always first or last)
- IMPORTANT: Provide a clear, detailed explanation (2-3 sentences) for why the correct answer is right`;
  } else if (questionType === 'True/False') {
    questionFormat = 'True/False Questions';
    exampleFormat = `{
  "questionText": "Arrays have fixed size in most programming languages.",
  "options": ["True", "False"],
  "correctAnswer": "True",
  "explanation": "In most programming languages like Java, C, and C++, arrays are allocated with a fixed size at creation time and cannot be resized. Dynamic arrays or lists (like ArrayList in Java or vector in C++) are separate data structures that provide resizable functionality."
}`;
    specificInstructions = `
- Mix True and False answers (don't make all True or all False)
- Make statements clear and unambiguous
- Test important concepts, not trivial facts
- IMPORTANT: Provide a clear, detailed explanation (2-3 sentences) for why the statement is true or false`;
  } else {
    questionFormat = 'Fill in the Blank Questions';
    exampleFormat = `{
  "questionText": "The time complexity of bubble sort is _____.",
  "correctAnswer": "O(n²)",
  "explanation": "Bubble sort uses two nested loops to compare and swap adjacent elements. The outer loop runs n times and the inner loop also runs up to n times, resulting in n × n = n² operations, giving it a quadratic time complexity of O(n²)."
}`;
    specificInstructions = `
- Place the blank at a meaningful position
- Ensure the answer is specific and unambiguous
- Test key concepts and terminology
- IMPORTANT: Provide a clear, detailed explanation (2-3 sentences) for why this is the correct answer`;
  }

  // Difficulty-specific guidance
  let difficultyGuidance = '';
  if (difficulty === 'Easy') {
    difficultyGuidance = `
- Focus on fundamental concepts and definitions
- Use straightforward language
- Test basic understanding and recall`;
  } else if (difficulty === 'Medium') {
    difficultyGuidance = `
- Test application of concepts
- Include some problem-solving
- Require understanding, not just memorization`;
  } else {
    difficultyGuidance = `
- Test deep understanding and analysis
- Include complex scenarios
- Require critical thinking and synthesis`;
  }

  return `You are an expert ${subject} teacher creating a REAL-TIME exam. This is generation #${randomSeed} at ${timestamp}.

🎯 CRITICAL TASK: Generate exactly ${numberOfQuestions} COMPLETELY UNIQUE and DIFFERENT ${questionFormat} about "${topic}" in ${subject}.

📋 REQUIREMENTS:
- Difficulty Level: ${difficulty}${difficultyGuidance}
- Subject: ${subject}
- Topic: ${topic}
- Each question MUST test a DIFFERENT aspect of ${topic}
- NO REPETITION or similar questions allowed
- Questions must be educational, clear, and specific${specificInstructions}

🎲 VARIETY REQUIREMENTS:
- Cover different subtopics within ${topic}
- Use different question styles and approaches
- Test various cognitive levels (recall, understanding, application, analysis)
- Ensure maximum diversity in content
- Each question should be completely distinct from others

EXPLANATION REQUIREMENTS (VERY IMPORTANT):
- EVERY question MUST include a detailed "explanation" field
- Explanations should be 2-3 sentences long
- Explain WHY the correct answer is right, not just what it is
- Include relevant concepts, reasoning, or context
- Make explanations educational and helpful for learning
- Use clear, simple language that students can understand
- CRITICAL JSON FORMATTING: In explanations, use single quotes (') instead of double quotes (")
- CRITICAL JSON FORMATTING: Keep explanations on a single line without line breaks
- CRITICAL JSON FORMATTING: Avoid backslashes and special characters that break JSON

📤 OUTPUT FORMAT: Return ONLY a valid JSON array with this exact structure:
[
  ${exampleFormat},
  ... (${numberOfQuestions} total questions)
]

⚠️ CRITICAL RULES:
1. Return ONLY the JSON array, no markdown, no explanations, no extra text
2. Each question must be 100% unique and test different concepts
3. Generate exactly ${numberOfQuestions} questions
4. Ensure all questions are relevant to "${topic}" in ${subject}
5. Make questions realistic and educational
6. DO NOT repeat or rephrase the same question
7. IMPORTANT: If using mathematical notation with backslashes (LaTeX), use simple text format instead (e.g., x^2 not $x^2$) OR ensure backslashes are properly escaped
8. Keep all JSON strings properly formatted and valid
9. MANDATORY: Every question MUST have a meaningful "explanation" field (2-3 sentences minimum)
10. JSON SAFETY: In all text fields (especially explanations), use single quotes instead of double quotes, avoid line breaks, and avoid backslashes
9. MANDATORY: Every question MUST have a meaningful "explanation" field (2-3 sentences minimum)

🚀 Generate ${numberOfQuestions} completely unique, real-time questions with detailed explanations NOW:`;
}

function parseGoogleAIResponse(text: string, params: GoogleAIQuestionParams): GeneratedQuestion[] {
  try {
    // Clean the response
    let cleaned = text.trim();
    
    // Remove markdown code blocks
    if (cleaned.includes('```json')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (cleaned.includes('```')) {
      cleaned = cleaned.replace(/```\n?/g, '');
    }
    
    // Remove any leading/trailing whitespace and newlines
    cleaned = cleaned.trim();
    
    // Try to extract JSON array if there's extra text
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }
    
    // Fix common JSON issues with LaTeX and mathematical expressions
    cleaned = cleaned
      // Fix LaTeX backslashes that break JSON
      .replace(/\\(pmod|mathbb|setminus|sqrt|frac|cdot|equiv|times|div)/g, '\\\\$1')
      // Fix other common LaTeX commands
      .replace(/\\([a-zA-Z]+)/g, (match, cmd) => {
        const latexCommands = ['pm', 'mp', 'leq', 'geq', 'neq', 'approx', 'infty', 'sum', 'prod', 'int', 'lim', 'sin', 'cos', 'tan', 'log', 'ln'];
        if (latexCommands.includes(cmd)) {
          return '\\\\' + cmd;
        }
        return match;
      })
      // Fix incomplete escape sequences at line breaks
      .replace(/\\\s*\n/g, '\\\\n')
      // Remove any trailing commas before closing brackets
      .replace(/,\s*([\]}])/g, '$1');
    
    // Parse JSON
    const parsed = JSON.parse(cleaned);
    const questionsArray = Array.isArray(parsed) ? parsed : (parsed.questions || []);
    
    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
      console.error('No questions array found in response');
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
        
        // Ensure True/False has correct options
        if (params.questionType === 'True/False' && (!question.options || question.options.length !== 2)) {
          question.options = ['True', 'False'];
        }
      }
      
      return question;
    });
    
    // Filter out invalid questions and validate
    const validQuestions = questions.filter(q => {
      const hasText = q.questionText && q.questionText.length > 10;
      const hasAnswer = q.correctAnswer && q.correctAnswer.length > 0;
      const hasOptions = (params.questionType === 'MCQ' || params.questionType === 'True/False') 
        ? (q.options && q.options.length > 0)
        : true;
      
      return hasText && hasAnswer && hasOptions;
    });
    
    console.log(`✅ Parsed ${validQuestions.length} valid questions from AI response`);
    
    return validQuestions;
  } catch (error) {
    console.error('❌ Failed to parse Google AI response:', error);
    console.error('Response text (first 500 chars):', text.substring(0, 500));
    
    // Try incremental parsing - extract valid questions one by one
    try {
      console.log('🔄 Attempting incremental question extraction...');
      const validQuestions: GeneratedQuestion[] = [];
      
      // Extract individual question objects using a more robust approach
      // Find all question objects by looking for balanced braces
      const questionObjects: string[] = [];
      let braceCount = 0;
      let currentObj = '';
      let inString = false;
      let escapeNext = false;
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (escapeNext) {
          currentObj += char;
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          currentObj += char;
          escapeNext = true;
          continue;
        }
        
        if (char === '"' && !escapeNext) {
          inString = !inString;
        }
        
        if (!inString) {
          if (char === '{') {
            if (braceCount === 0) {
              currentObj = '';
            }
            braceCount++;
          } else if (char === '}') {
            braceCount--;
            if (braceCount === 0 && currentObj.includes('questionText')) {
              currentObj += char;
              questionObjects.push(currentObj);
              currentObj = '';
              continue;
            }
          }
        }
        
        if (braceCount > 0) {
          currentObj += char;
        }
      }
      
      if (questionObjects.length > 0) {
        console.log(`Found ${questionObjects.length} potential question objects`);
        
        for (const objStr of questionObjects) {
          try {
            const q = JSON.parse(objStr);
            
            const question: GeneratedQuestion = {
              questionText: q.questionText || q.question || q.text || '',
              correctAnswer: q.correctAnswer || q.answer || q.correct || '',
              explanation: q.explanation || q.reason || 'Correct answer',
            };
            
            if (params.questionType === 'MCQ' || params.questionType === 'True/False') {
              question.options = q.options || q.choices || (params.questionType === 'True/False' ? ['True', 'False'] : []);
            }
            
            // Validate
            if (question.questionText.length > 10 && question.correctAnswer.length > 0) {
              validQuestions.push(question);
            }
          } catch (parseError) {
            // Skip invalid questions
            continue;
          }
        }
        
        if (validQuestions.length > 0) {
          console.log(`✅ Incremental parsing recovered ${validQuestions.length} questions`);
          return validQuestions;
        }
      }
    } catch (incrementalError) {
      console.error('❌ Incremental parsing failed:', incrementalError);
    }
    
    // Last resort: try aggressive cleanup
    try {
      console.log('🔄 Attempting aggressive JSON cleanup...');
      let cleaned = text.trim();
      
      // Remove markdown
      cleaned = cleaned.replace(/```(?:json)?\n?/g, '');
      
      // Extract JSON array
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('❌ No JSON array found in response');
        return [];
      }
      
      cleaned = jsonMatch[0];
      
      // More careful backslash handling
      cleaned = cleaned
        .replace(/\\(?!["\\/bfnrtu])/g, '\\\\')  // Escape backslashes that aren't valid JSON escapes
        .replace(/\\\\"/g, '\\"');  // Fix over-escaped quotes
      
      const parsed = JSON.parse(cleaned);
      const questionsArray = Array.isArray(parsed) ? parsed : (parsed.questions || []);
      
      if (Array.isArray(questionsArray) && questionsArray.length > 0) {
        const questions: GeneratedQuestion[] = questionsArray
          .map((q: any, index: number) => ({
            questionText: q.questionText || q.question || q.text || '',
            correctAnswer: q.correctAnswer || q.answer || q.correct || '',
            explanation: q.explanation || q.reason || `Correct answer for question ${index + 1}`,
            options: (params.questionType === 'MCQ' || params.questionType === 'True/False')
              ? (q.options || q.choices || (params.questionType === 'True/False' ? ['True', 'False'] : []))
              : undefined,
          }))
          .filter((q: GeneratedQuestion) => {
            const hasText = q.questionText && q.questionText.length > 10;
            const hasAnswer = q.correctAnswer && q.correctAnswer.length > 0;
            return hasText && hasAnswer;
          });
        
        if (questions.length > 0) {
          console.log(`✅ Aggressive cleanup succeeded: ${questions.length} questions recovered`);
          return questions;
        }
      }
    } catch (retryError) {
      console.error('❌ Aggressive cleanup also failed:', retryError);
    }
    
    return [];
  }
}

export function isGoogleAIAvailable(): boolean {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY || (process.env.NODE_ENV !== 'production' ? process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY : '');
  const isAvailable = !!apiKey && apiKey.length > 30 && apiKey.startsWith('AIza');
  
  if (isAvailable) {
    console.log('✅ Google AI is available and configured');
  } else {
    console.log('⚠️ Google AI not available:', {
      hasKey: !!apiKey,
      keyLength: apiKey?.length || 0,
      startsWithAIza: apiKey?.startsWith('AIza') || false
    });
  }
  
  return isAvailable;
}
