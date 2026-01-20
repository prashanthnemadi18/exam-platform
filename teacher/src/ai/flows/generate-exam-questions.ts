'use server';

/**
 * @fileOverview AI flow for generating exam questions using OpenAI or Google AI
 * Automatically uses the best available AI provider
 */

import { generateQuestions, getAvailableAIProvider } from '@/ai/unified-ai';
import { z } from 'zod';

const GenerateExamQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate exam questions.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Auto Mixed']).describe('The difficulty level of the questions.'),
  questionType: z.enum(['MCQ', 'True/False', 'Fill in the Blanks', 'Auto Mixed']).describe('The type of questions to generate.'),
  numberOfQuestions: z.number().min(1).max(180).describe('The number of questions to generate.'),
  subject: z.string().optional().describe('The subject area'),
});

export type GenerateExamQuestionsInput = z.infer<typeof GenerateExamQuestionsInputSchema>;

const GenerateExamQuestionsOutputSchema = z.object({
  questions: z.array(
    z.object({
      questionText: z.string().describe('The text of the generated question.'),
      options: z.array(z.string()).optional().describe('The options for the question, if applicable (e.g., for MCQs).'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
      explanation: z.string().optional().describe('Explanation for the correct answer.'),
    })
  ).describe('An array of generated exam questions.'),
  provider: z.string().optional().describe('The AI provider used'),
});

export type GenerateExamQuestionsOutput = z.infer<typeof GenerateExamQuestionsOutputSchema>;

export async function generateExamQuestions(input: GenerateExamQuestionsInput): Promise<GenerateExamQuestionsOutput> {
  try {
    // Validate input
    const validatedInput = GenerateExamQuestionsInputSchema.parse(input);
    
    // Check which AI provider is available
    const provider = getAvailableAIProvider();
    
    if (provider === 'none') {
      console.warn('⚠️ No AI provider configured');
      return {
        questions: generateFallbackQuestions(validatedInput),
        provider: 'fallback',
      };
    }

    console.log(`🤖 Generating questions with ${provider.toUpperCase()}...`);
    console.log('📝 Parameters:', {
      subject: validatedInput.subject || 'General',
      topic: validatedInput.topic,
      difficulty: validatedInput.difficulty,
      type: validatedInput.questionType,
      count: validatedInput.numberOfQuestions,
    });

    // Extract subject from topic if not provided
    const [subject, ...topicParts] = validatedInput.topic.split(' - ');
    const actualSubject = validatedInput.subject || subject;
    const actualTopic = topicParts.length > 0 ? topicParts.join(' - ') : validatedInput.topic;

    // Handle Auto Mixed options
    if (validatedInput.difficulty === 'Auto Mixed' || validatedInput.questionType === 'Auto Mixed') {
      const questions = await generateMixedQuestions({
        subject: actualSubject,
        topic: actualTopic,
        difficulty: validatedInput.difficulty,
        questionType: validatedInput.questionType,
        numberOfQuestions: validatedInput.numberOfQuestions,
      });
      
      return {
        questions,
        provider,
      };
    }

    // Generate questions using unified AI
    const questions = await generateQuestions({
      subject: actualSubject,
      topic: actualTopic,
      difficulty: validatedInput.difficulty as 'Easy' | 'Medium' | 'Hard',
      questionType: validatedInput.questionType as 'MCQ' | 'True/False' | 'Fill in the Blanks',
      numberOfQuestions: validatedInput.numberOfQuestions,
    });

    if (!questions || questions.length === 0) {
      console.warn('⚠️ AI returned no questions, using fallback');
      return {
        questions: generateFallbackQuestions(validatedInput),
        provider: 'fallback',
      };
    }

    console.log(`✅ Successfully generated ${questions.length} questions`);

    return {
      questions,
      provider,
    };
  } catch (error) {
    console.error('❌ Error generating exam questions:', error);
    
    // Return fallback questions on error
    return {
      questions: generateFallbackQuestions(input),
      provider: 'fallback',
    };
  }
}

function generateFallbackQuestions(input: GenerateExamQuestionsInput) {
  const { topic, questionType, numberOfQuestions, subject, difficulty } = input;
  
  // Handle Auto Mixed options
  if (questionType === 'Auto Mixed' || difficulty === 'Auto Mixed') {
    return generateMixedFallbackQuestions(input);
  }
  
  const questions = [];
  
  // Helper function to shuffle array
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Different question templates to ensure variety
  const mcqTemplates = [
    {
      q: `What is the primary purpose of ${topic}?`,
      opts: [`To understand core concepts`, `To memorize facts`, `To skip learning`, `To confuse students`],
      ans: `To understand core concepts`
    },
    {
      q: `Which statement best describes ${topic}?`,
      opts: [`A fundamental concept in ${subject || 'this subject'}`, `An optional topic`, `A deprecated method`, `An unrelated concept`],
      ans: `A fundamental concept in ${subject || 'this subject'}`
    },
    {
      q: `How does ${topic} contribute to ${subject || 'this field'}?`,
      opts: [`Provides essential knowledge`, `Has no contribution`, `Only historical value`, `Causes confusion`],
      ans: `Provides essential knowledge`
    },
    {
      q: `What is a key characteristic of ${topic}?`,
      opts: [`Important for understanding`, `Rarely used`, `Completely theoretical`, `Not relevant`],
      ans: `Important for understanding`
    },
    {
      q: `In the context of ${subject || 'this subject'}, ${topic} is:`,
      opts: [`A core concept`, `An advanced topic only`, `Not important`, `Outdated`],
      ans: `A core concept`
    },
    {
      q: `Why is ${topic} important in ${subject || 'this field'}?`,
      opts: [`It builds foundational knowledge`, `It's not important`, `It's optional`, `It's deprecated`],
      ans: `It builds foundational knowledge`
    },
    {
      q: `What role does ${topic} play?`,
      opts: [`Essential for learning`, `Minor role`, `No role`, `Confusing role`],
      ans: `Essential for learning`
    },
    {
      q: `Which of these applies to ${topic}?`,
      opts: [`Fundamental principle`, `Rarely mentioned`, `Not applicable`, `Historical only`],
      ans: `Fundamental principle`
    },
    {
      q: `The main application of ${topic} is:`,
      opts: [`Understanding ${subject || 'the subject'}`, `Memorization only`, `Not applicable`, `Testing only`],
      ans: `Understanding ${subject || 'the subject'}`
    },
    {
      q: `What makes ${topic} significant?`,
      opts: [`Core to ${subject || 'the field'}`, `Not significant`, `Only for experts`, `Outdated concept`],
      ans: `Core to ${subject || 'the field'}`
    }
  ];

  const tfTemplates = [
    { q: `${topic} is a fundamental concept in ${subject || 'this subject'}.`, ans: 'True' },
    { q: `Understanding ${topic} is essential for mastering ${subject || 'this field'}.`, ans: 'True' },
    { q: `${topic} plays a crucial role in ${subject || 'this area'}.`, ans: 'True' },
    { q: `Knowledge of ${topic} is required for ${subject || 'this subject'}.`, ans: 'True' },
    { q: `${topic} is one of the core principles of ${subject || 'this field'}.`, ans: 'True' },
    { q: `${topic} has no relevance to ${subject || 'this subject'}.`, ans: 'False' },
    { q: `${topic} is optional knowledge in ${subject || 'this field'}.`, ans: 'False' },
    { q: `${topic} is outdated and no longer used.`, ans: 'False' },
    { q: `Learning ${topic} provides no benefit.`, ans: 'False' },
    { q: `${topic} is only for advanced students.`, ans: 'False' }
  ];

  const fibTemplates = [
    { q: `The main purpose of ${topic} is _____.`, ans: `understanding ${subject || 'the subject'}` },
    { q: `${topic} is primarily used for _____.`, ans: `learning core concepts` },
    { q: `In ${subject || 'this field'}, ${topic} helps to _____.`, ans: `build knowledge` },
    { q: `The key principle of ${topic} is _____.`, ans: `fundamental understanding` },
    { q: `${topic} is essential for _____.`, ans: `mastering the subject` },
    { q: `Students learn ${topic} to _____.`, ans: `understand fundamentals` },
    { q: `The application of ${topic} involves _____.`, ans: `practical knowledge` },
    { q: `${topic} contributes to _____.`, ans: `overall understanding` },
    { q: `The significance of ${topic} lies in _____.`, ans: `its core principles` },
    { q: `Mastering ${topic} requires _____.`, ans: `dedicated study` }
  ];
  
  for (let i = 0; i < numberOfQuestions; i++) {
    if (questionType === 'MCQ') {
      const template = mcqTemplates[i % mcqTemplates.length];
      // Shuffle options to randomize correct answer position
      const shuffledOptions = shuffleArray(template.opts);
      questions.push({
        questionText: template.q,
        options: shuffledOptions,
        correctAnswer: template.ans, // Answer stays the same, but position changes
        explanation: `This is the correct answer based on ${topic} principles.`,
      });
    } else if (questionType === 'True/False') {
      const template = tfTemplates[i % tfTemplates.length];
      // Randomly swap True/False order
      const shouldSwap = Math.random() > 0.5;
      const options = shouldSwap ? ['False', 'True'] : ['True', 'False'];
      questions.push({
        questionText: template.q,
        options: options,
        correctAnswer: template.ans,
        explanation: `This statement about ${topic} is ${template.ans.toLowerCase()}.`,
      });
    } else {
      const template = fibTemplates[i % fibTemplates.length];
      questions.push({
        questionText: template.q,
        correctAnswer: template.ans,
        explanation: `This answer relates to ${topic} in ${subject || 'the subject'}.`,
      });
    }
  }
  
  return questions;
}

// Generate mixed questions when Auto Mixed is selected
async function generateMixedQuestions(params: {
  subject: string;
  topic: string;
  difficulty: string;
  questionType: string;
  numberOfQuestions: number;
}) {
  const { subject, topic, numberOfQuestions, difficulty, questionType } = params;
  const questions = [];
  
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
      // Use fallback for this question
      const fallback = generateSingleFallbackQuestion({
        topic,
        questionType: currentType,
        subject: subject || 'General',
        difficulty: currentDifficulty,
        index: i,
      });
      questions.push(fallback);
    }
  }
  
  return questions;
}

// Generate mixed fallback questions
function generateMixedFallbackQuestions(input: GenerateExamQuestionsInput) {
  const { topic, questionType, numberOfQuestions, subject, difficulty } = input;
  const questions = [];
  
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const types = ['MCQ', 'True/False', 'Fill in the Blanks'];
  
  for (let i = 0; i < numberOfQuestions; i++) {
    const currentDifficulty = difficulty === 'Auto Mixed'
      ? difficulties[i % difficulties.length]
      : difficulty;
    
    const currentType = questionType === 'Auto Mixed'
      ? types[i % types.length]
      : questionType;
    
    const question = generateSingleFallbackQuestion({
      topic,
      questionType: currentType,
      subject: subject || 'General',
      difficulty: currentDifficulty,
      index: i,
    });
    
    questions.push(question);
  }
  
  return questions;
}

// Helper to generate a single fallback question
function generateSingleFallbackQuestion(params: {
  topic: string;
  questionType: string;
  subject: string;
  difficulty: string;
  index: number;
}) {
  const { topic, questionType, subject, difficulty, index } = params;
  
  // Helper function to shuffle array
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  const mcqTemplates = [
    {
      q: `What is the primary purpose of ${topic}?`,
      opts: [`To understand core concepts`, `To memorize facts`, `To skip learning`, `To confuse students`],
      ans: `To understand core concepts`
    },
    {
      q: `Which statement best describes ${topic}?`,
      opts: [`A fundamental concept in ${subject}`, `An optional topic`, `A deprecated method`, `An unrelated concept`],
      ans: `A fundamental concept in ${subject}`
    },
    {
      q: `How does ${topic} contribute to ${subject}?`,
      opts: [`Provides essential knowledge`, `Has no contribution`, `Only historical value`, `Causes confusion`],
      ans: `Provides essential knowledge`
    },
  ];

  const tfTemplates = [
    { q: `${topic} is a fundamental concept in ${subject}.`, ans: 'True' },
    { q: `Understanding ${topic} is essential for mastering ${subject}.`, ans: 'True' },
    { q: `${topic} has no relevance to ${subject}.`, ans: 'False' },
  ];

  const fibTemplates = [
    { q: `The main purpose of ${topic} is _____.`, ans: `understanding ${subject}` },
    { q: `${topic} is primarily used for _____.`, ans: `learning core concepts` },
    { q: `In ${subject}, ${topic} helps to _____.`, ans: `build knowledge` },
  ];
  
  if (questionType === 'MCQ') {
    const template = mcqTemplates[index % mcqTemplates.length];
    const shuffledOptions = shuffleArray(template.opts);
    return {
      questionText: template.q,
      options: shuffledOptions,
      correctAnswer: template.ans,
      explanation: `This is the correct answer based on ${topic} principles (${difficulty} level).`,
    };
  } else if (questionType === 'True/False') {
    const template = tfTemplates[index % tfTemplates.length];
    const shouldSwap = Math.random() > 0.5;
    const options = shouldSwap ? ['False', 'True'] : ['True', 'False'];
    return {
      questionText: template.q,
      options: options,
      correctAnswer: template.ans,
      explanation: `This statement about ${topic} is ${template.ans.toLowerCase()} (${difficulty} level).`,
    };
  } else {
    const template = fibTemplates[index % fibTemplates.length];
    return {
      questionText: template.q,
      correctAnswer: template.ans,
      explanation: `This answer relates to ${topic} in ${subject} (${difficulty} level).`,
    };
  }
}
