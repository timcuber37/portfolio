'use client'

import { motion } from 'framer-motion'
import { SectionLabel } from './About'
import { accentAt } from '@/lib/theme'
import type { CustomSectionRow } from '@/lib/data'

// Renders admin-defined custom sections (label + heading + body paragraphs),
// styled to match the built-in sections. Body splits on blank lines into paragraphs.
export default function CustomSections({ sections }: { sections: CustomSectionRow[] }) {
  if (!sections.length) return null

  return (
    <>
      {sections.map((s, i) => (
        <section key={s.id} id={`section-${s.id}`} className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {s.label && <SectionLabel color={accentAt(i)}>{s.label}</SectionLabel>}
              {s.heading && (
                <h2 className="text-3xl font-bold text-zinc-900 mt-2 mb-6">{s.heading}</h2>
              )}
              <div className="space-y-4 text-zinc-600 leading-relaxed text-sm max-w-2xl">
                {s.body
                  .split(/\n{2,}/)
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
              </div>
            </motion.div>
          </div>
        </section>
      ))}
    </>
  )
}
