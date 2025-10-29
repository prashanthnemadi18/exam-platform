'use server';

/**
 * @fileOverview AI flow for generating exam questions using OpenAI or Google AI
 * Automatically uses the best available AI provider
 */

import { generateQuestions, getAvailableAIProvider } from '@/ai/unified-ai';
import { z } from 'zod';

const GenerateExamQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate exam questions.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe('The difficulty level of the questions.'),
  questionType: z.enum(['MCQ', 'True/False', 'Fill in the Blanks']).describe('The type of questions to generate.'),
  numberOfQuestions: z.number().min(1).max(20).describe('The number of questions to generate.'),
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

    // Generate questions using unified AI
    const questions = await generateQuestions({
      subject: actualSubject,
      topic: actualTopic,
      difficulty: validatedInput.difficulty,
      questionType: validatedInput.questionType,
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
  const { topic, questionType, numberOfQuestions } = input;
  
  const questions = [];
  
  for (let i = 0; i < numberOfQuestions; i++) {
    if (questionType === 'MCQ') {
      questions.push({
        questionText: `Question ${i + 1}: What is an important concept related to ${topic}?`,
        options: [
          `Key concept A about ${topic}`,
          `Key concept B about ${topic}`,
          `Key concept C about ${topic}`,
          `Key concept D about ${topic}`,
        ],
        correctAnswer: `Key concept A about ${topic}`,
        explanation: `This is the correct answer for ${topic}`,
      });
    } else if (questionType === 'True/False') {
      questions.push({
        questionText: `Statement ${i + 1}: ${topic} is an important concept in this subject.`,
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: `This statement about ${topic} is true`,
      });
    } else {
      questions.push({
        questionText: `Fill in the blank ${i + 1}: The main purpose of ${topic} is _____.`,
        correctAnswer: 'to solve problems',
        explanation: `This is the correct answer for ${topic}`,
      });
    }
  }
  
  return questions;
}
