import React from 'react'

export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl bg-elevated p-4 border border-borderZ ${className}`}>{children}</div>
}
