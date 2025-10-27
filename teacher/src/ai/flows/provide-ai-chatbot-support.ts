'use server';

/**
 * @fileOverview An AI chatbot for students to answer questions about the exam,
 * provide guidance, and collect feedback.
 *
 * - provideAIChatbotSupport - A function that handles the chatbot interaction.
 * - AIChatbotSupportInput - The input type for the provideAIChatbotSupport function.
 * - AIChatbotSupportOutput - The return type for the provideAIChatbotSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AIChatbotSupportInputSchema = z.object({
  query: z.string().describe('The user query or question for the chatbot.'),
});
export type AIChatbotSupportInput = z.infer<typeof AIChatbotSupportInputSchema>;

const AIChatbotSupportOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user query.'),
});
export type AIChatbotSupportOutput = z.infer<typeof AIChatbotSupportOutputSchema>;

export async function provideAIChatbotSupport(input: AIChatbotSupportInput): Promise<AIChatbotSupportOutput> {
  try {
    // Validate input
    const validatedInput = AIChatbotSupportInputSchema.parse(input);
    
    // Create prompt for the AI
    const prompt = `You are an AI chatbot designed to assist students with their exams.

Your primary goals are to:
1. Answer questions related to the exam content, format, rules, and deadlines.
2. Provide guidance on study materials and effective learning strategies.
3. Collect student feedback on the exam and the chatbot's performance.

Please be friendly, helpful, and concise in your responses.

User Query: ${validatedInput.query}`;

    // Get response from AI
    const response = await ai.chat(prompt);
    
    return {
      response: response
    };
  } catch (error) {
    console.error('Error in AI chatbot support:', error);
    return {
      response: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.'
    };
  }
}
