"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";
import {
  Award,
  BookOpen,
  BookOpenCheck,
  Compass,
  Home,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

const NAV = [
  { href: "/dashboard", label: "Dashboard", Icon: Home },
  { href: "/explore", label: "Explore", Icon: Compass },
  { href: "/my-courses", label: "My Courses", Icon: BookOpen },
  { href: "/ysc", label: "YSC certificate", Icon: Award },
  { href: "/research-quiz", label: "Free quizzes", Icon: BookOpenCheck },
  { href: "/profile", label: "Profile", Icon: User },
];

function AppSidebarInner() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const handleSignOut = () => {
    void signOut("/");
  };

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-full bg-white border-r border-[#E5E0D8] px-4 py-6">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 mb-8">
        <Image src="/icon.png" width={32} height={32} alt="Parikshanam" className="rounded-lg" />
        <span
          className="text-[1.1rem] text-[#1B3A6E]"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
        >
          Parikshanam
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                active
                  ? "bg-[#E8720C]/10 text-[#E8720C]"
                  : "text-[#6B7280] hover:text-[#1B3A6E] hover:bg-[#F9F7F5]"
              }`}
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: active ? 800 : 700 }}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.5 : 2}
                color={active ? "#E8720C" : "#9CA3AF"}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="">
        {profile && (
          <div className="flex items-center gap-3 px-3 mb-3">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#E8720C] flex items-center justify-center text-white text-xs font-bold">
                {profile.full_name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm text-[#111827] truncate"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
              >
                {profile.full_name ?? "Student"}
              </p>
              <p className="text-xs text-[#9CA3AF] truncate" style={{ fontFamily: "var(--font-roboto-var)" }}>
                {profile.class_level_id ? `Class ${profile.class_level_id}` : ""}
              </p>
            </div>
          </div>
        )}
        <Button variant="sidebarSignOut" type="button" onClick={handleSignOut}>
          <LogOut size={16} strokeWidth={2} />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}

export const AppSidebar = memo(AppSidebarInner);
