import { NextRequest, NextResponse } from 'next/server';
import { processDocument } from '../../../lib/documentProcessor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Check if the file is a PDF
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }
    
    // Process the document
    const result = await processDocument(file);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Failed to process the document' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully processed ${result.count} chunks from ${file.name}` 
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Increase payload size limit for file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}; 