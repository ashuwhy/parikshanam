'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'

export function CoursesNewLink() {
  return (
    <Link
      href="/courses/new"
      className="btn-press-motion inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-brand-primary text-white text-sm font-bold px-4 py-2 shadow-[0_4px_0_0_#a04f08] hover:bg-[#d4640a] active:translate-y-[3px] motion-reduce:active:translate-y-0 active:shadow-[0_1px_0_0_#a04f08]"
    >
      <Plus className="size-4 shrink-0 stroke-[2]" aria-hidden />
      New course
    </Link>
  )
}
