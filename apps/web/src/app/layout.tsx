import type { Metadata } from "next";
import { Nunito, Roboto } from "next/font/google";
import "./globals.css";

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

import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Parikshanam — Coming Soon",
  description: "Exam prep for Grades 6–10. Coming soon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
