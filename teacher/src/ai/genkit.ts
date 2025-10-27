import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || '');

// Get the Gemini model
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const ai = {
  model,
  
  // Generate questions based on a topic
  generateQuestions: async (topic: string, count: number = 5) => {
    try {
      const prompt = `Generate ${count} multiple choice questions about ${topic}. 
      Format each question as JSON with: question, options (array of 4), correctAnswer (index 0-3), explanation.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      console.error('Error generating questions:', error);
      throw error;
    }
  },
  
  // Chat functionality
  chat: async (message: string) => {
    try {
      const result = await model.generateContent(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in chat:', error);
      throw error;
    }
  }
};
