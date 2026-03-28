"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Subjects", href: "#subjects" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Courses", href: "#courses" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F7F5]/95 backdrop-blur-sm border-b border-[#E5E0D8]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/icon.png"
            width={32}
            height={32}
            alt="Parikshanam"
            className="rounded-lg"
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
              className="text-sm text-[#6B7280] hover:text-[#1B3A6E] transition-colors"
              style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <a
            href="#download"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E8720C] text-white text-sm border-b-4 border-[#A04F08] hover:bg-[#d4640a] active:translate-y-[2px] active:border-b-2 transition-all select-none"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            Download App
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg text-[#374151] hover:bg-[#E5E0D8] transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#E5E0D8] bg-[#F9F7F5] px-6 py-5 flex flex-col gap-5">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm text-[#374151] font-medium"
              style={{ fontFamily: "var(--font-roboto-var)" }}
            >
              {label}
            </a>
          ))}
          <a
            href="#download"
            onClick={() => setOpen(false)}
            className="text-center py-3 rounded-xl bg-[#E8720C] text-white text-sm border-b-4 border-[#A04F08]"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            Download App
          </a>
        </div>
      )}
    </header>
  );
}
