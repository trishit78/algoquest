import './globals.css'
import React from 'react'
import { Toaster } from "@/components/ui/toaster"
import Header from '../components/Header'
import ConditionalFooter from '../components/ConditionalFooter'

export const metadata = {
  title: 'AlgoQuest',
  description: 'A Modern, Fast, LeetCode-Style Code Submission Platform'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-white antialiased">
        <Header />
        <main className="mt-4">{children}</main>
        <ConditionalFooter />
        <Toaster />
      </body>
    </html>
  )
}
