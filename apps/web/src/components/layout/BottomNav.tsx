"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, Home, User } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Home", Icon: Home },
  { href: "/explore", label: "Explore", Icon: Compass },
  { href: "/my-courses", label: "My Courses", Icon: BookOpen },
  { href: "/profile", label: "Profile", Icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-[#E5E0D8] flex pb-safe">
      {NAV.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors ${
              active ? "text-[#E8720C]" : "text-[#9CA3AF]"
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: active ? 800 : 700 }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
