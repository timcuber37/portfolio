import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Timothy Yang — Full Stack Software Engineer',
  description:
    'Portfolio of Timothy Yang, a full stack software engineer and CS graduate student at Southern Connecticut State University.',
  keywords: ['Timothy Yang', 'Full Stack Engineer', 'Software Engineer', 'React', 'Next.js', 'Python'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
