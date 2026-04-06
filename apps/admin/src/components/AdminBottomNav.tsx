'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Activity,
  Bell,
  BookOpen,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Settings,
} from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'Home', Icon: LayoutDashboard },
  { href: '/courses', label: 'Courses', Icon: BookOpen },
  { href: '/students', label: 'Students', Icon: GraduationCap },
  { href: '/purchases', label: 'Sales', Icon: CreditCard },
  { href: '/notifications', label: 'Notify', Icon: Bell },
  { href: '/activity', label: 'Activity', Icon: Activity },
  { href: '/settings', label: 'Settings', Icon: Settings },
]

export function AdminBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E0D8] flex pb-safe supports-[backdrop-filter]:bg-white/95 supports-[backdrop-filter]:backdrop-blur-sm">
      {NAV.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors ${
              active ? 'text-brand-primary' : 'text-text-muted'
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-nunito-var)', fontWeight: active ? 800 : 700 }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
