'use server';

/**
 * @fileOverview AI flow for providing chatbot support to users
 * Handles general questions about the platform, features, and usage
 */

import { generateChatResponse, getAvailableAIProvider } from '@/ai/unified-ai';
import { z } from 'zod';

const ProvideAIChatbotSupportInputSchema = z.object({
  query: z.string().describe('The user\'s question or message to the chatbot.'),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ).optional().describe('Previous conversation context for maintaining continuity.'),
});

export type ProvideAIChatbotSupportInput = z.infer<typeof ProvideAIChatbotSupportInputSchema>;

const ProvideAIChatbotSupportOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response to the user\'s query.'),
  provider: z.string().optional().describe('The AI provider used for generating the response.'),
});

export type ProvideAIChatbotSupportOutput = z.infer<typeof ProvideAIChatbotSupportOutputSchema>;

export async function provideAIChatbotSupport(input: ProvideAIChatbotSupportInput): Promise<ProvideAIChatbotSupportOutput> {
  try {
    // Validate input
    const validatedInput = ProvideAIChatbotSupportInputSchema.parse(input);
    
    // Check which AI provider is available
    const provider = getAvailableAIProvider();
    
    if (provider === 'none') {
      console.warn('⚠️ No AI provider configured for chatbot');
      return {
        response: generateFallbackResponse(validatedInput.query),
        provider: 'fallback',
      };
    }

    console.log(`🤖 Generating chatbot response with ${provider.toUpperCase()}...`);

    // System prompt for the chatbot
    const systemPrompt = `You are a helpful AI assistant for AssessAI, an online examination platform. Your role is to help teachers and students with:

1. Creating and managing exams
2. Understanding platform features (AI question generation, anti-cheating measures, analytics)
3. Troubleshooting common issues
4. Explaining student performance metrics
5. Providing tips for effective exam creation

Platform features you can help with:
- AI-powered question generation (MCQ, True/False, Fill in the Blanks)
- Real-time exam taking with anti-cheating measures (tab switching detection, copy prevention)
- Student performance analytics and reports
- PDF export of question papers and submissions
- Student management and exam link sharing

Be concise, friendly, and helpful. If you don't know something specific about the platform, be honest about it and offer general guidance.`;

    // Generate response using unified AI
    const response = await generateChatResponse({
      systemPrompt,
      userMessage: validatedInput.query,
      conversationHistory: validatedInput.conversationHistory,
    });

    if (!response) {
      console.warn('⚠️ AI returned no response, using fallback');
      return {
        response: generateFallbackResponse(validatedInput.query),
        provider: 'fallback',
      };
    }

    console.log(`✅ Successfully generated chatbot response`);

    return {
      response,
      provider,
    };
  } catch (error) {
    console.error('❌ Error generating chatbot response:', error);
    
    // Return fallback response on error
    return {
      response: generateFallbackResponse(input.query),
      provider: 'fallback',
    };
  }
}

function generateFallbackResponse(query: string): string {
  const queryLower = query.toLowerCase();

  // Pattern matching for common queries
  if (queryLower.includes('create') && (queryLower.includes('exam') || queryLower.includes('test'))) {
    return `To create an exam:

1. Navigate to the "Create Exam" section from the dashboard
2. Fill in the exam details (title, subject, duration)
3. Choose your question generation preferences (topic, difficulty, type)
4. Let our AI generate questions or add your own
5. Review and save your exam
6. Generate a unique link to share with students

The AI can help generate MCQs, True/False, and Fill in the Blanks questions automatically!`;
  }

  if (queryLower.includes('student') && queryLower.includes('performance')) {
    return `You can view student performance in the Analytics section:

• Overall class performance metrics
• Individual student scores and grades
• Question-wise analysis
• Time-based trends
• Export detailed reports as PDF

The analytics dashboard provides insights to help you identify areas where students need more support.`;
  }

  if (queryLower.includes('anti') || queryLower.includes('cheat') || queryLower.includes('prevent')) {
    return `AssessAI includes several anti-cheating features:

✓ Tab switching detection - tracks when students leave the exam window
✓ Copy/paste prevention - blocks content copying during exams
✓ Time tracking - monitors exam duration and submission times
✓ Browser lock - prevents certain actions during the exam

These measures help ensure exam integrity while maintaining a fair testing environment.`;
  }

  if (queryLower.includes('ai') && (queryLower.includes('question') || queryLower.includes('generate'))) {
    return `Our AI question generation uses advanced language models to create high-quality questions:

• Supports multiple question types (MCQ, True/False, Fill in the Blanks)
• Adjustable difficulty levels (Easy, Medium, Hard)
• Topic-specific content generation
• Automatic answer key generation
• Fallback system ensures questions are always generated

The system uses Google Gemini AI when available, with a free AI fallback to ensure reliability.`;
  }

  if (queryLower.includes('link') || queryLower.includes('share')) {
    return `To share an exam with students:

1. Create and save your exam
2. Click "Generate Link" next to the exam in your dashboard
3. Copy the unique exam link
4. Share the link with your students via email, LMS, or messaging

Students can access the exam using just this link - no registration required for them!`;
  }

  if (queryLower.includes('pdf') || queryLower.includes('export') || queryLower.includes('download')) {
    return `You can export PDFs for:

• Question papers - clean, formatted exam sheets
• Student submissions - includes answers and scores
• Performance reports - detailed analytics

Just look for the PDF export button in the exam details or submissions section.`;
  }

  if (queryLower.includes('help') || queryLower.includes('how') || queryLower.includes('what')) {
    return `I can help you with:

• Creating and managing exams
• Understanding AI question generation
• Viewing student performance and analytics
• Using anti-cheating features
• Sharing exams with students
• Exporting PDFs and reports
• Troubleshooting common issues

What would you like to know more about?`;
  }

  // Default response
  return `Thank you for your question! I'm here to help you with:\n\n• Exam creation and management\n• AI question generation features\n• Student performance tracking\n• Platform features and best practices\n\nCould you please provide more details about what you'd like to know? For example:\n- "How do I create an exam?"\n- "What anti-cheating features are available?"\n- "How can I view student performance?"\n\nFeel free to ask anything about using AssessAI!`;
}
