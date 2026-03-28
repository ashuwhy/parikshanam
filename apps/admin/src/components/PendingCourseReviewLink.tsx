'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function PendingCourseReviewLink({ courseId }: { courseId: string }) {
  return (
    <Link
      href={`/courses/${courseId}`}
      className="inline-flex items-center gap-1 text-xs text-brand-primary font-medium hover:underline shrink-0"
    >
      Review
      <ArrowRight className="size-3.5 shrink-0 stroke-[2]" aria-hidden />
    </Link>
  )
}
