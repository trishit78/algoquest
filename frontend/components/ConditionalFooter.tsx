"use client"

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  
  // Hide footer on all problem pages including list and detail view
  const shouldHideFooter = pathname?.startsWith('/problems')

  if (shouldHideFooter) {
    return null
  }

  return <Footer />
}
