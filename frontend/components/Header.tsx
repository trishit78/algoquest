'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for token on mount
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      setIsAuthenticated(!!token)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="w-full border-b border-borderZ bg-elevated sticky top-0 z-50 backdrop-blur-sm bg-elevated/95">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-white hover:text-primary transition-colors">
          AlgoQuest
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/problems"
            className="text-textSecondary hover:text-white transition-colors"
          >
            Problems
          </Link>
          
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-textSecondary hover:text-white transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-textSecondary hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primaryHover text-white font-medium transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
