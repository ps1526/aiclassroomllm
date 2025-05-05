import { Pinecone } from '@pinecone-database/pinecone';
import { vectorDbConfig } from './config';

/**
 * Initialize and check the Pinecone index
 * This function verifies that the index exists and creates it if it doesn't
 */
export async function initPineconeIndex() {
  try {
    console.log('Initializing Pinecone...');
    
    const pinecone = new Pinecone({
      apiKey: vectorDbConfig.apiKey,
    });
    
    // List all indexes
    const indexes = await pinecone.listIndexes();
    
    // Check if our index already exists
    const indexExists = indexes.indexes?.some(index => index.name === vectorDbConfig.indexName) || false;
    
    if (!indexExists) {
      console.log(`Index "${vectorDbConfig.indexName}" does not exist. Creating index...`);
      
      // Create a new index with appropriate dimensions for Gemini embeddings
      await pinecone.createIndex({
        name: vectorDbConfig.indexName,
        dimension: 768, // Dimension for Gemini embedding-001 model
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      
      console.log(`Index "${vectorDbConfig.indexName}" created successfully.`);
      
      // Wait for the index to be ready
      await new Promise(resolve => setTimeout(resolve, 30000));
    } else {
      console.log(`Index "${vectorDbConfig.indexName}" already exists.`);
    }
    
    // Get index statistics
    const index = pinecone.Index(vectorDbConfig.indexName);
    const stats = await index.describeIndexStats();
    
    console.log('Pinecone index stats:', stats);
    
    return { success: true, stats };
  } catch (error) {
    console.error('Error initializing Pinecone:', error);
    return { 
      success: false, 
      error: `Failed to initialize Pinecone: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

/**
 * Clear all vectors from the Pinecone index namespace
 * Useful for development and testing
 */
export async function clearPineconeNamespace() {
  try {
    console.log(`Clearing vectors from namespace "${vectorDbConfig.namespace}"...`);
    
    const pinecone = new Pinecone({
      apiKey: vectorDbConfig.apiKey,
    });
    
    const index = pinecone.Index(vectorDbConfig.indexName);
    
    // Delete all vectors in the namespace
    await index.namespace(vectorDbConfig.namespace).deleteAll();
    
    console.log('Namespace cleared successfully.');
    
    return { success: true };
  } catch (error) {
    console.error('Error clearing namespace:', error);
    return { 
      success: false, 
      error: `Failed to clear namespace: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
} 