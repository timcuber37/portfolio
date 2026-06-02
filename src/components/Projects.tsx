'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ExternalLink, Calendar, Images, Maximize2 } from 'lucide-react'
import { GithubIcon } from './SocialIcons'
import { SectionLabel } from './About'
import Tilt from './Tilt'
import ProjectModal from './ProjectModal'
import { highlightText } from './HighlightedText'
import { ink, accentAt } from '@/lib/theme'
import type { ParsedProject } from '@/lib/data'

export default function Projects({ projects }: { projects: ParsedProject[] }) {
  const [filter, setFilter] = useState<string>('All')

  const allTags = ['All', ...Array.from(new Set(projects.flatMap((p) => p.tech)))]

  const filtered =
    filter === 'All' ? projects : projects.filter((p) => p.tech.includes(filter))

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel color={ink.blue}>Projects</SectionLabel>
          <h2 className="text-3xl font-bold text-zinc-900 mt-2 mb-4">Things I&apos;ve built</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {allTags.map((tag, i) => {
            const color = accentAt(i)
            const active = filter === tag
            return (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  active
                    ? 'shadow-sm'
                    : 'bg-white border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900'
                }`}
                style={active ? { color, borderColor: color, backgroundColor: `${color}1a` } : undefined}
              >
                {tag}
              </button>
            )
          })}
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              style={{ perspective: 1000 }}
            >
              <Tilt className="h-full">
                <ProjectCard project={project} index={i} />
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: ParsedProject; index: number }) {
  const accent = accentAt(index)
  // Map each tech keyword to a color so chips and highlighted words match.
  const techColor = new Map(project.tech.map((t, i) => [t.toLowerCase(), accentAt(i)]))
  const colorFor = (kw: string) => techColor.get(kw.toLowerCase()) ?? accent

  const shots = project.screenshots
  const [modalOpen, setModalOpen] = useState(false)

  // Links inside the card shouldn't trigger the expand-on-click.
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setModalOpen(true)
          }
        }}
        aria-label={`View details for ${project.title}`}
        className="group h-full w-full flex flex-col text-left bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
        style={{ borderTop: `3px solid ${accent}` }}
      >
        {shots.length > 0 && (
          <div className="mb-4">
            <div className="relative w-full aspect-video overflow-hidden rounded-lg ring-1 ring-zinc-200">
              <Image
                src={shots[0]}
                alt={`${project.title} screenshot`}
                fill
                sizes="(min-width: 640px) 45vw, 90vw"
                className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900/75 text-white text-[10px] font-medium">
                <Images size={11} />
                {shots.length}
              </span>
              <span className="absolute inset-0 flex items-center justify-center bg-zinc-900/0 group-hover:bg-zinc-900/25 transition-colors">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-zinc-800 text-xs font-medium opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all shadow-md">
                  <Maximize2 size={13} /> View details
                </span>
              </span>
            </div>

            {shots.length > 1 && (
              <div className="flex gap-1.5 mt-1.5">
                {shots.map((src, i) => (
                  <div
                    key={src}
                    className="relative h-10 flex-1 overflow-hidden rounded ring-1 ring-zinc-200"
                  >
                    <Image src={src} alt="" fill sizes="120px" className="object-cover object-top" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-zinc-900 text-base">{project.title}</h3>
          <div className="flex items-center gap-3 ml-3 shrink-0">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stop}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <GithubIcon size={16} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stop}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            )}
            <Maximize2
              size={15}
              className="text-zinc-300 group-hover:text-zinc-600 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-zinc-500 mb-3">
          <Calendar size={11} />
          <span>
            {project.startDate}
            {project.endDate ? ` — ${project.endDate}` : ' — Present'}
          </span>
        </div>

        <p className="text-zinc-600 text-sm leading-relaxed mb-4">
          <span>{highlightText(project.description, project.tech, colorFor)}</span>
        </p>

        <ul className="space-y-1.5 mb-5 flex-1">
          {project.bullets.slice(0, 3).map((bullet, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 leading-relaxed">
              <span
                className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                style={{ backgroundColor: accent }}
              />
              <span>{highlightText(bullet, project.tech, colorFor)}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {project.tech.map((t, i) => {
            const color = accentAt(i)
            return (
              <span
                key={t}
                className="px-2 py-0.5 text-xs rounded"
                style={{ color, backgroundColor: `${color}14`, border: `1px solid ${color}33` }}
              >
                {t}
              </span>
            )
          })}
        </div>
      </div>

      <ProjectModal
        project={project}
        accent={accent}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
