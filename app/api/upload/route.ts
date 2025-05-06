import { NextRequest, NextResponse } from 'next/server';

// Document uploads have been disabled
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Document uploads have been disabled' 
    }, 
    { status: 403 }
  );
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}; 