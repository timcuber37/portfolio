'use client'

import { motion } from 'framer-motion'
import { SectionLabel } from './About'
import { ink, accentAt } from '@/lib/theme'
import type { ParsedSkill } from '@/lib/data'

export default function Skills({
  skills,
  settings,
}: {
  skills: ParsedSkill[]
  settings: Record<string, string>
}) {
  const grouped = skills.reduce<Record<string, string[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill.name)
    return acc
  }, {})

  return (
    <section id="skills" className="py-24 px-6 bg-zinc-100/50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel color={ink.green}>Skills</SectionLabel>
          <h2 className="text-3xl font-bold text-zinc-900 mt-2 mb-10">
            {settings.skillsHeading ?? 'Technologies I work with'}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-8">
          {Object.entries(grouped).map(([category, items], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((skill, j) => {
                  const color = accentAt(i + j)
                  return (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.1, y: -3, backgroundColor: color, color: '#ffffff' }}
                      transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                      className="px-3 py-1 text-sm rounded-md cursor-default bg-white shadow-sm"
                      style={{
                        color,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      {skill}
                    </motion.span>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
