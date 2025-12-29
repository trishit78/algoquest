import React from 'react'
import Link from 'next/link'
import Badge from '../../components/Badge'
import Card from '../../components/Card'

async function fetchProblems() {
  try {
    const res = await fetch('http://localhost:4000/api/v1/problems', {
      cache: 'no-store',
    })
    if (!res.ok) {
      return { data: [], success: false }
    }
    const data = await res.json()
    // Backend returns { message, data, success }
    return data.data || []
  } catch (e) {
    console.error('Error fetching problems:', e)
    return []
  }
}

export default async function ProblemsPage() {
  const problems = await fetchProblems()

  return (
    <div className="min-h-screen px-8 py-10 bg-bg text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Problems</h1>
        <p className="text-textSecondary mb-8">Browse and solve coding challenges</p>
        <div className="mt-6 grid gap-4">
          {Array.isArray(problems) && problems.length > 0 ? (
            problems.map((p: any) => (
              <Link
                key={p.id || p._id}
                href={`/problems/${p.id || p._id}`}
                className="block rounded-xl bg-elevated p-6 border border-borderZ hover:border-primary/50 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {p.title || 'Untitled Problem'}
                  </h3>
                  <Badge
                    color={
                      p.difficulty?.toLowerCase() === 'easy'
                        ? 'green'
                        : p.difficulty?.toLowerCase() === 'hard'
                        ? 'red'
                        : 'yellow'
                    }
                  >
                    {p.difficulty || 'medium'}
                  </Badge>
                </div>
                <p className="text-textSecondary line-clamp-2">
                  {p.statement?.slice(0, 200) || 'No description available'}
                </p>
                <div className="mt-4 flex items-center text-sm text-textSecondary group-hover:text-primary transition-colors">
                  <span>View Problem</span>
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))
          ) : (
            <Card>
              <p className="text-textSecondary text-center py-8">No problems available. Check if the backend service is running.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
