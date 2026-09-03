'use client'

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useBodyScrollLock } from '@/lib/useBodyScrollLock'
import { mediaLabel, youtubeEmbed, type MediaItem } from '@/lib/media'

export default function Lightbox({
  items,
  index,
  title,
  onClose,
  onNavigate,
}: {
  items: MediaItem[]
  index: number | null
  title: string
  onClose: () => void
  onNavigate: (next: number) => void
}) {
  const open = index !== null

  const go = useCallback(
    (dir: number) => {
      if (index === null) return
      onNavigate((index + dir + items.length) % items.length)
    },
    [index, items.length, onNavigate]
  )

  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      // A focused player owns the arrow keys for seeking; don't navigate under it.
      if ((e.target as HTMLElement | null)?.tagName === 'VIDEO') return
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go, onClose])

  if (typeof document === 'undefined') return null

  const item = index === null ? null : items[index]

  return createPortal(
    <AnimatePresence>
      {open && index !== null && item && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-zinc-800 hover:bg-white shadow-lg transition-colors"
          >
            <X size={20} />
          </button>

          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  go(-1)
                }}
                aria-label="Previous"
                className="absolute left-3 sm:left-6 p-2 rounded-full bg-white/90 text-zinc-800 hover:bg-white shadow-lg transition-colors"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  go(1)
                }}
                aria-label="Next"
                className="absolute right-3 sm:right-6 p-2 rounded-full bg-white/90 text-zinc-800 hover:bg-white shadow-lg transition-colors"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <motion.div
            key={index}
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {item.kind === 'image' && (
              <img
                src={item.src}
                alt={mediaLabel(item, title, index)}
                className="max-h-[80vh] max-w-[90vw] w-auto h-auto rounded-lg shadow-2xl ring-1 ring-white/10"
              />
            )}

            {item.kind === 'video' && (
              // autoPlay is honored here because opening the lightbox is a click.
              <video
                src={item.src}
                controls
                autoPlay
                playsInline
                aria-label={mediaLabel(item, title, index)}
                className="max-h-[80vh] max-w-[90vw] w-auto h-auto rounded-lg shadow-2xl ring-1 ring-white/10 bg-black"
              >
                Your browser does not support the video tag.
              </video>
            )}

            {item.kind === 'youtube' && (
              <iframe
                src={youtubeEmbed(item.id, true)}
                title={mediaLabel(item, title, index)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-[90vw] max-w-4xl max-h-[80vh] aspect-video rounded-lg shadow-2xl ring-1 ring-white/10 bg-black"
              />
            )}

            <div className="text-xs text-zinc-300">
              {title} · {index + 1} / {items.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
