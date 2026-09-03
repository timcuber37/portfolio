'use client'

import { motion } from 'framer-motion'
import { Briefcase, GraduationCap } from 'lucide-react'
import { SectionLabel } from './About'
import { ink, accentAt } from '@/lib/theme'
import type { ParsedExperience } from '@/lib/data'

export default function Experience({
  experience,
  settings,
}: {
  experience: ParsedExperience[]
  settings: Record<string, string>
}) {
  const work = experience.filter((e) => e.type === 'work')
  const education = experience.filter((e) => e.type === 'education')

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel color={ink.orange}>Experience</SectionLabel>
          <h2 className="text-3xl font-bold text-zinc-900 mt-2 mb-12">
            {settings.experienceHeading ?? 'Work & Education'}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <TimelineColumn
            label="Work Experience"
            icon={Briefcase}
            items={work}
            color={ink.blue}
          />
          <TimelineColumn
            label="Education"
            icon={GraduationCap}
            items={education}
            color={ink.green}
          />
        </div>
      </div>
    </section>
  )
}

function TimelineColumn({
  label,
  icon: Icon,
  items,
  color,
}: {
  label: string
  icon: React.ElementType
  items: ParsedExperience[]
  color: string
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Icon size={16} style={{ color }} />
        <span className="text-sm font-semibold text-zinc-700">{label}</span>
      </div>
      <div className="space-y-6">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative pl-4 border-l-2 border-zinc-200"
          >
            <div
              className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-white"
              style={{ backgroundColor: accentAt(i) }}
            />
            <p className="text-sm font-medium text-zinc-900">{item.title}</p>
            <p className="text-xs text-zinc-600 mt-0.5">{item.company}</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {item.startDate} — {item.endDate ?? 'Present'} · {item.location}
            </p>
            {item.gpa && (
              <p className="text-xs text-zinc-600 mt-1">
                <span className="font-medium text-zinc-700">GPA</span>{' '}
                <span style={{ color }}>{item.gpa}</span>
              </p>
            )}
            {item.bullets.length > 0 && (
              <ul className="mt-2 space-y-1">
                {item.bullets.map((b, j) =>
                  // A bullet ending in ':' introduces the lines under it
                  // ("Relevant Coursework:"), so it renders as a flush label
                  // with no marker of its own.
                  b.trimEnd().endsWith(':') ? (
                    <li
                      key={j}
                      className="text-xs font-medium text-zinc-700 leading-relaxed pt-1 first:pt-0"
                    >
                      {b}
                    </li>
                  ) : (
                    <li
                      key={j}
                      className="text-xs text-zinc-600 leading-relaxed flex items-start gap-2"
                    >
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                      {b}
                    </li>
                  )
                )}
              </ul>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
