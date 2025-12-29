import React from 'react'

export default function Badge({ children, color = 'gray' }: { children: React.ReactNode; color?: string }) {
  const base = 'px-3 py-1 rounded-full text-sm font-medium'
  const colorClass =
    color === 'green' ? 'bg-accent text-black' : color === 'red' ? 'bg-danger text-white' : 'bg-yellow-400 text-black'

  return <span className={`${base} ${colorClass}`}>{children}</span>
}
