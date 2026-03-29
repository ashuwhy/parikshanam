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
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-full bg-white border-r border-[#E5E0D8] px-4 py-6">
      {/* Logo Section */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 mb-8">
        <div className="size-8 rounded-lg bg-brand-navy flex items-center justify-center shadow-sm">
          <Hexagon className="size-5 text-white stroke-[2.5]" aria-hidden />
        </div>
        <div className="flex flex-col">
          <span
            className="text-[1.1rem] leading-tight text-brand-navy"
            style={{ fontFamily: 'var(--font-nunito-var)', fontWeight: 900 }}
          >
            Parikshanam
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-primary font-black -mt-0.5">
            Admin
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        <p className="px-3 text-[10px] uppercase tracking-widest text-text-muted font-bold mb-2">
          Management
        </p>
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                active
                  ? 'bg-brand-primary/10 text-brand-primary'
                  : 'text-text-muted hover:text-brand-navy hover:bg-surface-subtle'
              }`}
              style={{ fontFamily: 'var(--font-nunito-var)', fontWeight: active ? 800 : 700 }}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.5 : 2}
                className={active ? 'text-brand-primary' : 'text-text-muted'}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div className="pt-4 border-t border-ui-border">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors group"
          style={{ fontFamily: 'var(--font-nunito-var)', fontWeight: 700 }}
        >
          <LogOut size={18} strokeWidth={2} className="group-hover:text-red-600" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
