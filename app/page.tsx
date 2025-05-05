'use client';

import React, { useState, useRef, useEffect } from 'react';

// Document Uploader Component
function DocumentUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported');
      return;
    }
    
    setIsUploading(true);
    setMessage('');
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setMessage(result.message);
      } else {
        setError(result.error || 'Failed to upload document');
      }
    } catch (err) {
      setError('Error uploading document. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Upload Hardware Documentation</h2>
      
      <div className="flex flex-col">
        <label htmlFor="file-upload" className="mb-2">
          Select a PDF file to upload:
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isUploading}
          className="border p-2 rounded"
        />
      </div>
      
      {isUploading && (
        <div className="mt-4">
          <p className="text-blue-600">Uploading and processing document...</p>
        </div>
      )}
      
      {message && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

// Chat Interface Component
function ChatInterface() {
  type Message = {
    id: string;
    content: string;
    isUser: boolean;
    sources?: Array<{
      title: string;
      page: string;
      content: string;
    }>;
  };

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSources, setShowSources] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: query,
      isUser: true,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          history: messages.map(msg => ({
            content: msg.content,
            isUser: msg.isUser,
          })),
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: result.response,
          isUser: false,
          sources: result.sources,
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: result.error || 'Something went wrong. Please try again.',
          isUser: false,
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'An error occurred while processing your request. Please try again.',
        isUser: false,
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSources = (messageId: string) => {
    setShowSources(prev => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  return (
    <div className="h-[60vh] flex flex-col border rounded-lg bg-white shadow-sm">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p>Ask questions about your hardware documentation</p>
              <p className="text-sm mt-2">Try asking about audio interfaces, cables, or hardware setup</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col">
                <div className={`chat-message ${message.isUser ? 'user-message' : 'ai-message'}`}>
                  {message.content}
                </div>
                
                {!message.isUser && message.sources && message.sources.length > 0 && (
                  <div className="ml-2 mt-1">
                    <button
                      onClick={() => toggleSources(message.id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {showSources[message.id] ? 'Hide sources' : 'Show sources'}
                    </button>
                    
                    {showSources[message.id] && (
                      <div className="mt-2">
                        <h4 className="text-sm font-bold">Sources:</h4>
                        {message.sources.map((source, index) => (
                          <div key={index} className="source-item">
                            <p className="font-semibold">{source.title} (Page: {source.page})</p>
                            <p className="text-gray-500">{source.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your hardware documentation..."
            className="flex-1 border rounded px-3 py-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Main Page Component
export default function HomePage() {
  const [showUploader, setShowUploader] = useState(false);
  
  return (
    <div className="space-y-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Hardware Documentation Chatbot</h1>
        <p className="text-gray-600 mb-4">
          Ask questions about your hardware documentation using AI
        </p>
        
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800"
        >
          {showUploader ? 'Hide Document Uploader' : 'Upload Documentation'}
        </button>
      </header>
      
      {showUploader && <DocumentUploader />}
      
      <ChatInterface />
    </div>
  );
} 