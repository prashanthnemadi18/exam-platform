import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
});

export interface QuestionGenerationParams {
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

export async function generateQuestionsWithOpenAI(
  params: QuestionGenerationParams
): Promise<GeneratedQuestion[]> {
  const { subject, topic, difficulty, questionType, numberOfQuestions } = params;

  const systemPrompt = `You are an expert teacher and exam creator. Generate high-quality, accurate, and educational exam questions.`;

  const userPrompt = `Generate exactly ${numberOfQuestions} ${questionType} questions about "${topic}" in the subject "${subject}".

Requirements:
- Difficulty Level: ${difficulty}
- Question Type: ${questionType}
- All questions MUST be specifically about: "${topic}" in "${subject}"
- Questions should be clear, unambiguous, and test real knowledge
- For MCQ: Provide 4 options with one correct answer
- For True/False: Provide a statement with correct answer
- For Fill in the Blanks: Use _____ for the blank and provide the correct answer

Return ONLY a valid JSON array with this exact structure:
[
  {
    "questionText": "Your question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Brief explanation why this is correct"
  }
]

For True/False, use options: ["True", "False"]
For Fill in the Blanks, omit options array.

Generate ${numberOfQuestions} questions now:`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || '[]';
    
    // Clean up the response
    let cleanedResponse = responseText.trim();
    
    // Remove markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
    }

    // Parse the JSON
    const questions = JSON.parse(cleanedResponse);
    
    if (!Array.isArray(questions)) {
      throw new Error('Response is not an array');
    }

    return questions.slice(0, numberOfQuestions);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate questions with OpenAI');
  }
}

export async function isOpenAIConfigured(): Promise<boolean> {
  return !!(process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY);
}
