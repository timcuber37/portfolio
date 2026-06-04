'use client'

import { motion } from 'framer-motion'
import { ink } from '@/lib/theme'

export default function About({ settings }: { settings: Record<string, string> }) {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel color={ink.red}>About</SectionLabel>
          <h2 className="text-3xl font-bold text-zinc-900 mt-2 mb-8">
            {settings.aboutHeading ?? 'A little about me'}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4 text-zinc-600 leading-relaxed text-sm max-w-2xl"
        >
          <p>
            {settings.bio ??
              "I'm a full stack software engineer and Computer Science graduate student at Southern Connecticut State University. I enjoy building real-world applications that solve meaningful problems."}
          </p>
          <p>
            {settings.aboutPara2 ??
              'My experience spans cloud infrastructure, AI-powered tools, and high-performance graphics — from deploying containerized apps on Fly.io and AWS to engineering GLSL shaders for real-time black hole simulations.'}
          </p>
          <p>
            {settings.aboutPara3 ??
              "Outside of code, I compete in Rubik's Cube events and am ranked in the top 100 in the United States for 3×3 average time through the World Cube Association."}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={`mailto:${settings.email ?? 'timcuber37@gmail.com'}`}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: ink.blue }}
            >
              {settings.email ?? 'timcuber37@gmail.com'}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function SectionLabel({
  children,
  color = ink.blue,
}: {
  children: React.ReactNode
  color?: string
}) {
  return (
    <span
      className="text-xs font-semibold tracking-widest uppercase"
      style={{ color }}
    >
      {children}
    </span>
  )
}
