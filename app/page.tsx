'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

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
  }, [messages, isLoading]);

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

  // Format AI responses to automatically add structure
  const formatAIResponse = (content: string) => {
    // Only process if it's not already structured with markdown
    if (!content.includes('#') && !content.includes('-') && !content.includes('*') && !content.includes('\n\n')) {
      // Convert paragraphs (double newlines) to proper markdown paragraphs
      let formattedContent = content.replace(/\.\s+/g, '.\n\n');
      // Add bold to key phrases
      formattedContent = formattedContent.replace(/(^|\s)(Dante Controller|Dante Virtual Soundcard|Pro Tools|Pinecone|Gemini)(\s|$)/g, '$1**$2**$3');
      return formattedContent;
    }
    return content;
  };

  return (
    <div className="h-[80vh] flex flex-col border rounded-lg bg-white shadow-sm">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p>Ask questions about your hardware documentation</p>
              <p className="text-sm mt-2">Try asking about audio interfaces, cables, or hardware setup</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col">
                <div className={`chat-message ${message.isUser ? 'user-message' : 'ai-message'}`}>
                  {message.isUser ? (
                    <p>{message.content}</p>
                  ) : (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]} 
                      rehypePlugins={[rehypeHighlight]}
                    >
                      {formatAIResponse(message.content)}
                    </ReactMarkdown>
                  )}
                </div>
                
                {!message.isUser && message.sources && message.sources.length > 0 && (
                  <div className="ml-2 mt-1">
                    <button
                      onClick={() => toggleSources(message.id)}
                      className="text-sm text-blue-600 hover:underline flex items-center"
                    >
                      <span className="mr-1">{showSources[message.id] ? '▼' : '►'}</span> 
                      {showSources[message.id] ? 'Hide sources' : 'Show sources'} 
                      <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                        {message.sources.length}
                      </span>
                    </button>
                    
                    {showSources[message.id] && (
                      <div className="mt-2 space-y-2">
                        <h4 className="text-sm font-bold text-gray-700">Sources:</h4>
                        {message.sources.map((source, index) => (
                          <div key={index} className="source-item">
                            <div className="font-semibold text-blue-800">{source.title} {source.page !== 'N/A' && <span>(Page: {source.page})</span>}</div>
                            <p className="text-gray-600 mt-1 text-sm italic">{source.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex flex-col">
                <div className="chat-message ai-message">
                  <div className="flex items-center">
                    <div className="animate-pulse flex space-x-2 items-center">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="ml-2 text-gray-600">Generating response...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Hardware Documentation Chatbot</h1>
        <p className="text-gray-600 mb-4">
          Ask questions about your hardware documentation using AI
        </p>
      </header>
      
      <ChatInterface />
    </div>
  );
} 