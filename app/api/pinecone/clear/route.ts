import { NextRequest, NextResponse } from 'next/server';
import { clearPineconeNamespace } from '../../../../lib/initPinecone';

// This endpoint is for clearing the Pinecone namespace (admin/dev use)
export async function POST(request: NextRequest) {
  try {
    // Check for API key or admin authorization
    // Note: In a production app, you should use proper authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Clear the namespace
    const result = await clearPineconeNamespace();
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Pinecone namespace cleared successfully'
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error clearing Pinecone namespace:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}