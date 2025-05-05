/**
 * Application configuration
 * 
 * This file centralizes access to environment variables and configuration settings.
 * In development, use a .env.local file in the project root.
 */

// LLM Configuration (Google Gemini)
export const llmConfig = {
  // Google Gemini API key
  apiKey: process.env.GOOGLE_API_KEY || '',
  
  // Model settings
  modelName: process.env.GEMINI_MODEL_NAME || 'gemini-pro',
  
  // Generation parameters
  temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.2'),
  topP: parseFloat(process.env.GEMINI_TOP_P || '0.8'),
  topK: parseInt(process.env.GEMINI_TOP_K || '40'),
  maxOutputTokens: parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS || '1024'),
  
  // Embedding model
  embeddingModel: process.env.GEMINI_EMBEDDING_MODEL || 'embedding-001',
}

// Vector Database Configuration (Pinecone)
export const vectorDbConfig = {
  // Pinecone API key
  apiKey: process.env.PINECONE_API_KEY || '',
  
  // Pinecone index name
  indexName: process.env.PINECONE_INDEX_NAME || 'hardware-docs',
  
  // Namespace for documents in the index
  namespace: process.env.PINECONE_NAMESPACE || 'hardware-documentation',
}

// Document Processing Configuration
export const documentConfig = {
  // Maximum file size in bytes (default: 10MB)
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
  
  // Supported file types
  supportedTypes: ['application/pdf'],
  
  // Chunking settings
  chunkSize: parseInt(process.env.CHUNK_SIZE || '1000'),
  chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || '200'),
}

// Feature flags
export const featureFlags = {
  enableTracing: process.env.ENABLE_TRACING === 'true',
  debugMode: process.env.DEBUG_MODE === 'true',
}

// Validate critical configuration
export function validateConfig() {
  const missingVars: string[] = [];
  
  if (!llmConfig.apiKey) missingVars.push('GOOGLE_API_KEY');
  if (!vectorDbConfig.apiKey) missingVars.push('PINECONE_API_KEY');
  
  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Some features may not work correctly. Please check your .env.local file.');
    return false;
  }
  
  return true;
} 