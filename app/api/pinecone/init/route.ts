import { NextRequest, NextResponse } from 'next/server';
import { initPineconeIndex } from '../../../../lib/initPinecone';

// This endpoint is for initializing the Pinecone index (admin use)
export async function GET(request: NextRequest) {
  try {
    // Check for API key or admin authorization
    // Note: In a production app, you should use proper authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Initialize Pinecone
    const result = await initPineconeIndex();
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Pinecone index initialized successfully',
        stats: result.stats
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error initializing Pinecone:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 