'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Dummy login - just redirect to problems
    router.push('/problems')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-xl bg-elevated border border-borderZ"
      >
        <h2 className="text-3xl font-bold mb-2">Sign In</h2>
        <p className="text-textSecondary text-sm mb-6">No backend auth required - this is a demo</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-textSecondary mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 rounded-lg bg-bg border border-borderZ text-white placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-textSecondary mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full p-3 rounded-lg bg-bg border border-borderZ text-white placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-textSecondary mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 rounded-lg bg-bg border border-borderZ text-white placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primaryHover rounded-lg text-white font-semibold transition-colors duration-200 mt-6"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  )
}
