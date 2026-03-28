import type { Metadata } from 'next'
import { Nunito, Roboto } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  variable: '--font-nunito-var',
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
})

const roboto = Roboto({
  variable: '--font-roboto-var',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Parikshanam - Teacher Portal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${roboto.variable}`}>
      <body>{children}</body>
    </html>
  )
}
