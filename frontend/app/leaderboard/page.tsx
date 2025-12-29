"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Trophy, Medal, Award } from 'lucide-react'

interface LeaderboardEntry {
  user: string
  score: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const res = await axios.get('http://localhost:5000/leaderboard/api/v1/leaderboard')
        
        if (res.data?.success && Array.isArray(res.data?.data)) {
          // Sort by score descending
          const sorted = [...res.data.data].sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score)
          setLeaderboard(sorted)
        } else {
          setLeaderboard(res.data?.data || [])
        }
        setError(null)
      } catch (err: any) {
        console.error('Error fetching leaderboard:', err)
        setError(err.response?.data?.message || 'Failed to load leaderboard')
        setLeaderboard([])
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />
    return <span className="text-gray-500 font-bold w-6 text-center">{index + 1}</span>
  }

  const getRankColor = (index: number) => {
    if (index === 0) return 'bg-yellow-500/10 border-yellow-500/30'
    if (index === 1) return 'bg-gray-400/10 border-gray-400/30'
    if (index === 2) return 'bg-amber-600/10 border-amber-600/30'
    return 'bg-elevated border-borderZ'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-textSecondary">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg text-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-danger text-lg mb-2">Error</p>
          <p className="text-textSecondary">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-textSecondary">Top performers on AlgoQuest</p>
        </motion.div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-textSecondary">No leaderboard data available.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={`${entry.user}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl border p-6 flex items-center justify-between ${getRankColor(index)} hover:scale-[1.02] transition-transform`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12">
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{entry.user}</h3>
                    <p className="text-textSecondary text-sm">Rank #{index + 1}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-primary">{entry.score}</span>
                  <span className="text-textSecondary text-sm">points</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

