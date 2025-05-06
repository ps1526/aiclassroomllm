import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory log storage
const MAX_LOGS = 100;
const serverLogs: string[] = [];

// Log capture function
export function captureLog(message: string) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}`;
  
  serverLogs.push(formattedMessage);
  
  // Keep only the last MAX_LOGS entries
  if (serverLogs.length > MAX_LOGS) {
    serverLogs.shift();
  }
  
  // Still log to console
  console.log(formattedMessage);
}

export async function GET(request: NextRequest) {
  try {
    // Simple auth check for development
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json({ logs: serverLogs });
  } catch (error) {
    console.error('Error retrieving logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 