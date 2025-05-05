import { NextRequest, NextResponse } from 'next/server';
import { generateResponse } from '../../../lib/chatService';

// Simulated RAG response since we don't have actual dependencies installed
export async function POST(request: NextRequest) {
  try {
    const { query, history } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
    }
    
    // Generate response using our chatService
    const response = await generateResponse(query, history || []);
    
    return NextResponse.json({ 
      response: response.content,
      sources: response.sources
    });
  } catch (error) {
    console.error('Error generating chat response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 