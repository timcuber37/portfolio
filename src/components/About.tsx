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
              "I'm Tim, a software engineer and computer science graduate student at Southern Connecticut State University. I enjoy making complicated systems feel simple and building software that people can actually use."}
          </p>
          <p>
            {settings.aboutPara2 ??
              'I like working across the whole product, from the database and API to the interface people use. I care less about collecting technologies than choosing the right one and making the pieces work well together.'}
          </p>
          <p>
            {settings.aboutPara3 ??
              "The habit behind all of this came from speedcubing: spot what slowed me down, break it into smaller parts, and try again. I bring the same approach to software."}
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
