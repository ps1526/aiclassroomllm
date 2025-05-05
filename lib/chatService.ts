import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchDocuments } from './documentProcessor';
import { llmConfig, validateConfig } from './config';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(llmConfig.apiKey);

/**
 * Generate response using Google's Gemini API
 */
async function generateGeminiResponse(prompt: string, history: any[] = []): Promise<string> {
  try {
    // Check if configuration is valid
    const isConfigValid = validateConfig();
    if (!isConfigValid) {
      console.warn('⚠️ Running with invalid configuration. Some features may not work properly.');
    }
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: llmConfig.modelName,
      generationConfig: {
        temperature: llmConfig.temperature,
        topP: llmConfig.topP,
        topK: llmConfig.topK,
        maxOutputTokens: llmConfig.maxOutputTokens,
      },
    });
    
    // Format chat history for Gemini
    const formattedHistory = history.map(msg => {
      return {
        role: msg.isUser ? 'user' : 'model',
        parts: [{ text: msg.content }],
      };
    });
    
    // Create a chat session
    const chat = model.startChat({
      history: formattedHistory,
    });
    
    // Send the message
    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating response with Gemini:', error);
    return "I encountered an error while generating a response. Please check your API key and try again.";
  }
}

/**
 * Generate a response to a user query based on relevant documents
 * 
 * In a production environment, this would:
 * 1. Retrieve relevant documents from the vector store
 * 2. Construct a prompt with the documents as context
 * 3. Generate a response using the LLM
 */
export async function generateResponse(query: string, chatHistory: any[] = []) {
  try {
    // 1. Retrieve relevant documents
    const relevantDocs = await searchDocuments(query, 3);
    
    // 2. Build context from relevant documents
    const context = relevantDocs.length > 0
      ? relevantDocs.map(doc => doc.pageContent).join('\n\n')
      : "No relevant documentation found.";
    
    // 3. Create prompt with context
    const prompt = `
You are a hardware documentation assistant. Answer the following question based ONLY on the context information provided below. 
If you don't know the answer based on the provided context, say "I don't have enough information to answer that question."

Context information:
${context}

Question: ${query}
`;
    
    // 4. Generate response with Gemini API
    const response = await generateGeminiResponse(prompt, chatHistory);
    
    // Return the response and sources
    return {
      content: response,
      sources: relevantDocs.map(doc => ({
        title: doc.metadata.source || 'Unknown',
        page: doc.metadata.page || 'N/A',
        content: doc.pageContent.substring(0, 150) + '...',
      })),
    };
    
  } catch (error) {
    console.error('Error generating response:', error);
    return { 
      content: 'I encountered an error while trying to answer your question. Please try again.',
      sources: []
    };
  }
} 