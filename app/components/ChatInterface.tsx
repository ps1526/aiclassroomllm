'use client';

import React, { useState, useRef, useEffect, FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';

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

export default function ChatInterface() {
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

  const handleSubmit = async (e: FormEvent) => {
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
        // Handle error
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
    <div className="flex flex-col h-[80vh] max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <h2 className="text-2xl font-bold mb-2">Hardware Documentation Assistant</h2>
              <p>Ask questions about your hardware documents</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.isUser ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <ReactMarkdown className="prose">
                  {message.content}
                </ReactMarkdown>
              </div>
              
              {!message.isUser && message.sources && message.sources.length > 0 && (
                <div className="mt-2">
                  <button
                    onClick={() => toggleSources(message.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {showSources[message.id] ? 'Hide sources' : 'Show sources'}
                  </button>
                  
                  {showSources[message.id] && (
                    <div className="mt-2 text-sm text-gray-600 border rounded p-2 bg-gray-50">
                      <h4 className="font-bold mb-1">Sources:</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {message.sources.map((source, index) => (
                          <li key={index}>
                            <p className="font-semibold">{source.title} (Page: {source.page})</p>
                            <p className="text-gray-500">{source.content}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your hardware documentation..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
} 