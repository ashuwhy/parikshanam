'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/dashboard', label: '📊 Dashboard' },
  { href: '/courses', label: '📚 Courses' },
  { href: '/students', label: '👨‍🎓 Students' },
  { href: '/teachers', label: '👨‍🏫 Teachers' },
  { href: '/purchases', label: '💳 Purchases' },
  { href: '/settings', label: '⚙️ Settings' },
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
        <span className="inline-block bg-brand-primary text-white text-xs font-bold px-2 py-1 rounded-md">
          ⬡ ADMIN
        </span>
        <p className="text-white font-[family-name:var(--font-nunito-var)] font-black text-sm mt-2">
          Parikshanam
        </p>
      </div>

      <nav className="flex-1 py-2">
        <p className="px-4 text-white/50 text-[10px] uppercase tracking-widest mb-2">Platform</p>
        {NAV.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`block px-4 py-2 text-sm ${
                active
                  ? 'bg-white/10 border-l-4 border-brand-primary text-white font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={handleSignOut}
        className="m-4 text-white/50 text-xs hover:text-white/80 text-left"
      >
        Sign out
      </button>
    </aside>
  )
}
