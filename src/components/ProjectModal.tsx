'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, ExternalLink, ZoomIn, Maximize2 } from 'lucide-react'
import { GithubIcon } from './SocialIcons'
import Lightbox from './Lightbox'
import { highlightText } from './HighlightedText'
import { accentAt } from '@/lib/theme'
import { useBodyScrollLock } from '@/lib/useBodyScrollLock'
import { toMediaList, mediaLabel, youtubeEmbed } from '@/lib/media'
import type { ParsedProject } from '@/lib/data'

export default function ProjectModal({
  project,
  accent,
  open,
  onClose,
}: {
  project: ParsedProject
  accent: string
  open: boolean
  onClose: () => void
}) {
  const media = toMediaList(project.screenshots)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const techColor = new Map(project.tech.map((t, i) => [t.toLowerCase(), accentAt(i)]))
  const colorFor = (kw: string) => techColor.get(kw.toLowerCase()) ?? accent

  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      // Let the lightbox own Esc while it's open.
      if (e.key === 'Escape' && lightboxIndex === null) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, lightboxIndex, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] overflow-y-auto bg-zinc-950/70 backdrop-blur-sm flex justify-center items-start p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl my-auto"
              style={{ borderTop: `4px solid ${accent}` }}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-zinc-700 hover:bg-zinc-100 shadow-md ring-1 ring-zinc-200 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="p-6 sm:p-8">
                {/* Header */}
                <h3 className="text-2xl font-bold text-zinc-900 pr-10">{project.title}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Calendar size={12} />
                    {project.startDate}
                    {project.endDate ? ` — ${project.endDate}` : ' — Present'}
                  </span>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80"
                      style={{ color: accent }}
                    >
                      <GithubIcon size={13} /> Source
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80"
                      style={{ color: accent }}
                    >
                      <ExternalLink size={13} /> Live demo
                    </a>
                  )}
                </div>

                {/* Media — images open the lightbox on click; players stay inline
                    and get an explicit expand button, so their own controls work. */}
                {media.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {media.map((item, i) =>
                      item.kind === 'image' ? (
                        <button
                          key={item.src}
                          type="button"
                          onClick={() => setLightboxIndex(i)}
                          className="group relative block w-full overflow-hidden rounded-lg ring-1 ring-zinc-200 cursor-zoom-in"
                        >
                          <img
                            src={item.src}
                            alt={mediaLabel(item, project.title, i)}
                            className="w-full h-auto"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-zinc-900/0 group-hover:bg-zinc-900/20 transition-colors">
                            <ZoomIn
                              size={26}
                              className="text-white opacity-0 group-hover:opacity-100 drop-shadow transition-opacity"
                            />
                          </span>
                        </button>
                      ) : (
                        <div
                          key={item.src}
                          className="relative w-full overflow-hidden rounded-lg ring-1 ring-zinc-200 bg-black"
                        >
                          {item.kind === 'video' ? (
                            <video
                              src={item.src}
                              controls
                              playsInline
                              preload="metadata"
                              aria-label={mediaLabel(item, project.title, i)}
                              className="w-full h-auto block"
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <iframe
                              src={youtubeEmbed(item.id)}
                              title={mediaLabel(item, project.title, i)}
                              loading="lazy"
                              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full aspect-video block"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => setLightboxIndex(i)}
                            aria-label={`Expand ${mediaLabel(item, project.title, i)}`}
                            className="absolute top-2 right-2 p-1.5 rounded-md bg-zinc-900/70 text-white hover:bg-zinc-900/90 transition-colors"
                          >
                            <Maximize2 size={14} />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Description */}
                <p className="mt-6 text-sm leading-relaxed text-zinc-600">
                  {highlightText(project.description, project.tech, colorFor)}
                </p>

                {/* All bullets */}
                {project.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {project.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-zinc-600 leading-relaxed"
                      >
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: accent }}
                        />
                        <span>{highlightText(b, project.tech, colorFor)}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tech */}
                <div className="flex flex-wrap gap-1.5 mt-6">
                  {project.tech.map((t, i) => {
                    const color = accentAt(i)
                    return (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 text-xs rounded"
                        style={{ color, backgroundColor: `${color}14`, border: `1px solid ${color}33` }}
                      >
                        {t}
                      </span>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Lightbox
        items={media}
        index={lightboxIndex}
        title={project.title}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>,
    document.body
  )
}
