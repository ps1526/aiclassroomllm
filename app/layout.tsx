import React from 'react'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hardware Documentation Chatbot',
  description: 'Chat with your hardware documentation using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className="container mx-auto py-6 px-4">
          {children}
        </main>
      </body>
    </html>
  )
} 