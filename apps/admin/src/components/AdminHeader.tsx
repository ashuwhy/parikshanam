'use client'

import { Hexagon } from 'lucide-react'
import Link from 'next/link'

export function AdminHeader() {
  return (
    <header className="md:hidden sticky top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E0D8] px-5 py-4 flex items-center justify-between">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="size-8 rounded-lg bg-brand-navy flex items-center justify-center shadow-sm">
          <Hexagon className="size-5 text-white stroke-[2.5]" aria-hidden />
        </div>
        <div className="flex flex-col">
          <span
            className="text-base leading-tight text-brand-navy"
            style={{ fontFamily: 'var(--font-nunito-var)', fontWeight: 900 }}
          >
            Parikshanam
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-brand-primary font-black -mt-0.5">
            Admin
          </span>
        </div>
      </Link>
    </header>
  )
}
