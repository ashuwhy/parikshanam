import type { Metadata } from "next";
import { Nunito, Roboto } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Parikshanam — Olympiad Prep for Grades 6–10",
  description:
    "Expert-crafted courses for Olympiad preparation. Video lessons, interactive quizzes, and progress tracking for students in Grades 6–10.",
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
            {children}
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
