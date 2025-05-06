import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchDocuments } from './documentProcessor';
import { llmConfig, validateConfig } from './config';
import { captureLog } from '../app/api/logs/route';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(llmConfig.apiKey);

/**
 * Generate response using Google's Gemini API
 */
async function generateGeminiResponse(prompt: string, history: any[] = []): Promise<string> {
  try {
    captureLog(`Generating response with Gemini model: ${llmConfig.modelName}`);
    
    // Check if configuration is valid
    const isConfigValid = validateConfig();
    if (!isConfigValid) {
      captureLog('⚠️ Running with invalid configuration. Some features may not work properly.');
    }
    
    // Get the generative model
    captureLog(`Using model: ${llmConfig.modelName}`);
    
    // Ensure we're using a model that works with this API key
    const modelName = 'gemini-1.5-flash'; // Hardcoded to a known working model
    
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: llmConfig.temperature,
        topP: llmConfig.topP,
        topK: llmConfig.topK,
        maxOutputTokens: llmConfig.maxOutputTokens,
      },
    });
    
    captureLog(`Formed chat history with ${history.length} messages`);
    
    // Format chat history for Gemini
    const formattedHistory = history.map(msg => {
      return {
        role: msg.isUser ? 'user' : 'model',
        parts: [{ text: msg.content }],
      };
    });
    
    // Create a chat session
    captureLog(`Starting Gemini chat session`);
    const chat = model.startChat({
      history: formattedHistory,
    });
    
    // Send the message
    captureLog(`Sending message to Gemini (length: ${prompt.length} chars)`);
    
    try {
      const result = await chat.sendMessage(prompt);
      captureLog(`Received response from Gemini`);
      return result.response.text();
    } catch (sendError) {
      captureLog(`Error sending message to Gemini: ${sendError}`);
      
      // Fall back to direct content generation if chat fails
      captureLog(`Attempting fallback to direct content generation`);
      try {
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (fallbackError) {
        captureLog(`Fallback also failed: ${fallbackError}`);
        throw fallbackError;
      }
    }
  } catch (error) {
    captureLog(`Error generating response with Gemini: ${error}`);
    if (error instanceof Error) {
      captureLog(`Error message: ${error.message}`);
      captureLog(`Error name: ${error.name}`);
      captureLog(`Error stack: ${error.stack}`);
    }
    return "I encountered an error while generating a response. Please try again with a different query.";
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
    captureLog(`Starting RAG pipeline for query: ${query}`);
    const startTime = Date.now();
    
    // 1. Retrieve relevant documents
    captureLog(`Searching for relevant documents...`);
    const searchStartTime = Date.now();
    const relevantDocs = await searchDocuments(query, 3);
    const searchEndTime = Date.now();
    captureLog(`Document search completed in ${searchEndTime - searchStartTime}ms. Found ${relevantDocs.length} relevant documents.`);
    
    // 2. Build context from relevant documents
    const context = relevantDocs.length > 0
      ? relevantDocs.map(doc => doc.pageContent).join('\n\n')
      : "No relevant documentation found.";
    
    // 3. Create prompt with context and formatting instructions
    const prompt = `
You are a hardware documentation assistant. Answer the following question based ONLY on the context information provided below. 
If you don't know the answer based on the provided context, say "I don't have enough information to answer that question."

When formatting your response:
- Use markdown syntax for better readability (e.g., headings, lists, bold, etc.)
- If appropriate, structure your response with headings and subheadings using # and ##
- Use **bold** for key terms and important information
- Use numbered lists (1., 2., 3.) for sequential steps or instructions
- Use bullet points (- ) for related items or features
- Format code or technical specifications with \`code\` syntax
- Keep paragraphs concise and focused
- Add line breaks between paragraphs for readability

Context information:
${context}

Question: ${query}
`;
    
    // 4. Generate response with Gemini API
    captureLog(`Generating response with Gemini API...`);
    const llmStartTime = Date.now();
    const response = await generateGeminiResponse(prompt, chatHistory);
    const llmEndTime = Date.now();
    captureLog(`Response generation completed in ${llmEndTime - llmStartTime}ms.`);
    
    const endTime = Date.now();
    captureLog(`Total RAG pipeline completed in ${endTime - startTime}ms.`);
    
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
    captureLog(`Error generating response: ${error}`);
    return { 
      content: 'I encountered an error while trying to answer your question. Please try again.',
      sources: []
    };
  }
} 