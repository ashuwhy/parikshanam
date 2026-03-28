"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button, buttonProps } from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Subjects", href: "#subjects" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Courses", href: "#courses" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { session, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = () => {
    void signOut("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F9F7F5]/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-[#E5E0D8]/60"
          : "bg-[#F9F7F5]/95 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <Image
            src="/icon.png"
            width={32}
            height={32}
            alt="Parikshanam"
            className="rounded-lg transition-transform group-hover:scale-105"
          />
          <span
            className="text-[1.2rem] text-[#1B3A6E]"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            Parikshanam
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="relative text-sm text-[#6B7280] hover:text-[#1B3A6E] transition-colors after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[#E8720C] after:rounded-full after:transition-all hover:after:w-full"
              style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-[#6B7280] hover:text-[#1B3A6E] transition-colors px-3 py-2 rounded-xl hover:bg-[#E5E0D8]/60"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
              >
                Dashboard
              </Link>
              <Button variant="dangerNav" type="button" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-[#6B7280] hover:text-[#1B3A6E] transition-colors px-3 py-2 rounded-xl hover:bg-[#E5E0D8]/60"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
              >
                Log In
              </Link>
              <Link href="/login" {...buttonProps("primaryNav")}>
                Start for Free →
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <Button variant="iconMenu" type="button" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile menu — animated slide */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-[#E5E0D8] bg-[#F9F7F5] px-6 py-5 flex flex-col gap-4">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm text-[#374151] hover:text-[#E8720C] transition-colors"
              style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
            >
              {label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2 border-t border-[#E5E0D8]">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  {...buttonProps("outlineNavCard")}
                >
                  Dashboard
                </Link>
                <Button
                  variant="dangerNavMobile"
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    handleSignOut();
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} {...buttonProps("outlineNavCard")}>
                  Log In
                </Link>
                <Link href="/login" onClick={() => setOpen(false)} {...buttonProps("primaryNavMobile")}>
                  Start for Free →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
