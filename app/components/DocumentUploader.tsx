'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function DocumentUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    setMessage('');
    setError('');

    try {
      const file = acceptedFiles[0];
      
      if (!file) {
        setError('No file selected');
        return;
      }
      
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setError('Only PDF files are supported');
        return;
      }
      
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
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Upload Hardware Documentation</h2>
      
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
        `}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-lg">Drop the PDF here...</p>
        ) : (
          <div>
            <p className="text-lg mb-2">Drag and drop a PDF file here, or click to select a file</p>
            <p className="text-sm text-gray-500">Only PDF files are accepted</p>
          </div>
        )}
      </div>
      
      {isUploading && (
        <div className="mt-4 text-center">
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