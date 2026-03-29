import type { Metadata } from "next";
import { Nunito, Roboto } from "next/font/google";
import "./globals.css";

import { DoodleBackground } from "@/components/layout/DoodleBackground";
import { getSiteUrl } from "@/lib/site";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

const nunito = Nunito({
  variable: "--font-nunito-var",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
});

const roboto = Roboto({
  variable: "--font-roboto-var",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const site = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Parikshanam — Olympiad prep for Grades 6–10",
    template: "%s | Parikshanam",
  },
  description:
    "Master every Olympiad. Expert-crafted courses for Grades 6–10 — video lessons, interactive quizzes, and progress tracking.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Parikshanam",
    title: "Parikshanam — Olympiad prep for Grades 6–10",
    description:
      "Expert-crafted courses for Grades 6–10. Video lessons, quizzes, and progress tracking — join thousands of students.",
    images: [{ url: "/og/parikshanam-share.png", alt: "Parikshanam" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parikshanam — Olympiad prep for Grades 6–10",
    description:
      "Expert-crafted Olympiad courses for Grades 6–10. Video lessons, quizzes, and progress tracking.",
    images: ["/og/parikshanam-share.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${roboto.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-[#F9F7F5]">
        <QueryProvider>
          <AuthProvider>
            <div className="relative min-h-full">
              <DoodleBackground />
              <div className="relative z-10">{children}</div>
              <Toaster richColors position="top-right" />
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
