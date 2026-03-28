'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BookOpen,
  CreditCard,
  GraduationCap,
  Hexagon,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV: { href: string; label: string; Icon: typeof LayoutDashboard }[] = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/courses', label: 'Courses', Icon: BookOpen },
  { href: '/students', label: 'Students', Icon: GraduationCap },
  { href: '/teachers', label: 'Teachers', Icon: UserRound },
  { href: '/purchases', label: 'Purchases', Icon: CreditCard },
  { href: '/settings', label: 'Settings', Icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-52 min-h-screen bg-brand-navy flex flex-col flex-shrink-0">
      <div className="px-4 py-5">
        <span className="inline-flex items-center gap-1.5 bg-brand-primary text-white text-xs font-bold px-2 py-1 rounded-[var(--radius-control-sm)]">
          <Hexagon className="size-3.5 shrink-0 stroke-[2.5]" aria-hidden />
          ADMIN
        </span>
        <p className="text-white font-[family-name:var(--font-nunito-var)] font-black text-sm mt-2">
          Parikshanam
        </p>
      </div>

      <nav className="flex-1 py-2">
        <p className="px-4 text-white/50 text-[10px] uppercase tracking-widest mb-2">Platform</p>
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-4 py-2 text-sm ${
                active
                  ? 'bg-white/10 border-l-4 border-brand-primary text-white font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <Icon className="size-4 shrink-0 stroke-[2]" aria-hidden />
              {label}
            </Link>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={handleSignOut}
        className="m-4 flex items-center gap-2 text-white/50 text-xs hover:text-white/80 text-left btn-press-motion rounded-[var(--radius-control-sm)] px-1 py-1 -mx-1"
      >
        <LogOut className="size-3.5 shrink-0 stroke-[2]" aria-hidden />
        Sign out
      </button>
    </aside>
  )
}
