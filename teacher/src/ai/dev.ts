// This file is only for development with Genkit
// Not needed for production build
if (process.env.NODE_ENV === 'development') {
    import('@/ai/flows/generate-exam-questions');
    import('@/ai/flows/analyze-student-performance');
    import('@/ai/flows/provide-ai-chatbot-support');
}