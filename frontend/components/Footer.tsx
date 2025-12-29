import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full mt-20 py-12 border-t border-borderZ bg-elevated">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-white mb-3">AlgoQuest</h3>
            <p className="text-textSecondary text-sm">
              A modern code submission platform for practicing algorithms and data structures.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/problems" className="text-textSecondary hover:text-white transition-colors">
                  Problems
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-textSecondary hover:text-white transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-textSecondary hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-textSecondary text-sm border-t border-borderZ pt-8">
          © {new Date().getFullYear()} AlgoQuest. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
