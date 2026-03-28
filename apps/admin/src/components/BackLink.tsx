'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export function BackLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={`text-sm text-text-muted hover:text-brand-primary inline-flex items-center gap-1 ${className}`}
    >
      <ChevronLeft className="size-4 shrink-0 stroke-[2]" aria-hidden />
      {children}
    </Link>
  )
}
