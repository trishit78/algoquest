'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://source.unsplash.com/random/2400x1600?coding,programming"
            alt="Coding background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              A Modern, Fast, LeetCode-Style<br />
              Code Submission Platform
            </h1>
            <p className="text-xl text-textSecondary max-w-2xl mx-auto">
              Practice problems, submit code, and view real-time evaluations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Link
                href="/login"
                className="px-8 py-3 rounded-xl bg-primary hover:bg-primaryHover text-white font-semibold transition-colors duration-200"
              >
                Get Started
              </Link>
              <Link
                href="/problems"
                className="px-8 py-3 rounded-xl border border-borderZ text-textSecondary hover:text-white hover:border-white/50 font-semibold transition-all duration-200"
              >
                Browse Problems
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-20 bg-bg">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-xl bg-elevated p-8 border border-borderZ hover:border-primary/50 transition-colors duration-200"
            >
              <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Problem Library</h3>
              <p className="text-textSecondary">Curated problems across difficulties to help you master algorithms and data structures.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl bg-elevated p-8 border border-borderZ hover:border-primary/50 transition-colors duration-200"
            >
              <div className="w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Code Execution</h3>
              <p className="text-textSecondary">Run code quickly in isolated containers with instant feedback on your solutions.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-xl bg-elevated p-8 border border-borderZ hover:border-primary/50 transition-colors duration-200"
            >
              <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Evaluation</h3>
              <p className="text-textSecondary">See live results, console output, and detailed feedback as your code runs.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
