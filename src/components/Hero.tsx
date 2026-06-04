'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Download } from 'lucide-react'
import Image from 'next/image'
import { GithubIcon, LinkedinIcon } from './SocialIcons'
import { cube, accentAt } from '@/lib/theme'

const DEFAULT_ROLES = [
  'Full Stack Software Engineer',
  'CS Graduate Student',
  'Rubik\'s Cube Competitor',
]

export default function Hero({ settings }: { settings: Record<string, string> }) {
  // Rotating roles are editable via the `heroRoles` setting (one per line).
  const roles = useMemo(() => {
    const parsed = (settings.heroRoles ?? '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    return parsed.length ? parsed : DEFAULT_ROLES
  }, [settings.heroRoles])

  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = roles[roleIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60)
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setRoleIndex((i) => (i + 1) % roles.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, deleting, roleIndex])

  const handleResumeDownload = async () => {
    await fetch('/api/resume/download', { method: 'POST' })
    window.open('/resume.pdf', '_blank')
  }

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 pt-16">
      <div className="max-w-5xl mx-auto w-full flex flex-col-reverse sm:flex-row items-center gap-12">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: accentAt(roleIndex) }}
          >
            Welcome
          </p>
          <h1 className="cube-gradient-text text-5xl sm:text-7xl font-bold tracking-tight leading-[1.15] pb-2 mb-4">
            {settings.name ?? 'Timothy Yang'}
          </h1>
          <div className="h-10 flex items-center mb-8">
            <span className="text-xl sm:text-2xl text-zinc-700 font-light">
              {displayed}
              <span
                className="inline-block w-0.5 h-6 ml-0.5 animate-pulse align-middle"
                style={{ backgroundColor: accentAt(roleIndex) }}
              />
            </span>
          </div>

          <p className="text-zinc-600 max-w-xl text-base leading-relaxed mb-10">
            {settings.bio ??
              'Building robust full-stack applications with a focus on clean architecture, scalable systems, and thoughtful user experiences.'}
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <motion.button
              onClick={handleResumeDownload}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-md shadow-lg"
              style={{
                background: `linear-gradient(100deg, ${cube.blue}, ${cube.green})`,
                boxShadow: `0 10px 28px -10px ${cube.blue}`,
              }}
            >
              <Download size={15} />
              Download Resume
            </motion.button>
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 border border-zinc-300 hover:border-zinc-400 bg-white text-zinc-700 hover:text-zinc-900 text-sm font-medium rounded-md transition-colors"
            >
              View My Work
            </motion.a>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={settings.github ?? 'https://github.com/timcuber37'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <GithubIcon size={20} />
            </a>
            <a
              href={settings.linkedin ?? 'https://linkedin.com/in/timyang37'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <LinkedinIcon size={20} />
            </a>
          </div>
        </motion.div>

        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative w-56 h-56 sm:w-72 sm:h-72">
            {/* Animated conic cube-color ring */}
            <div className="cube-ring absolute inset-0 rounded-full" />
            <div className="absolute inset-[6px] rounded-full overflow-hidden bg-white shadow-xl transform-gpu [backface-visibility:hidden]">
              <Image
                src="/headshot.png"
                alt={settings.name ?? 'Timothy Yang'}
                fill
                sizes="(min-width: 640px) 288px, 224px"
                className="object-cover"
                priority
              />
            </div>

            {/* Draggable cube tiles — grab and toss them, they snap back */}
            <CubeTile color={cube.red} baseRotate={12} className="-top-3 -right-2 w-8 h-8" />
            <CubeTile color={cube.green} baseRotate={45} className="top-1/2 -right-5 w-6 h-6" />
            <CubeTile color={cube.yellow} baseRotate={-12} className="-bottom-2 -left-3 w-7 h-7" />
            <CubeTile color={cube.blue} baseRotate={24} className="-top-4 left-8 w-5 h-5" />
            <CubeTile color={cube.orange} baseRotate={-20} className="-bottom-3 right-10 w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <a href="#about" aria-label="Scroll down">
            <ArrowDown size={20} className="animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// A small draggable cube tile: drag to fling it (snaps back), hover for a quarter-turn.
function CubeTile({
  color,
  baseRotate,
  className,
}: {
  color: string
  baseRotate: number
  className: string
}) {
  return (
    <motion.div
      drag
      dragSnapToOrigin
      dragElastic={0.6}
      whileHover={{ scale: 1.35, rotate: baseRotate + 90 }}
      whileTap={{ scale: 0.85 }}
      whileDrag={{ scale: 1.18, zIndex: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      style={{ background: color, rotate: baseRotate }}
      className={`absolute rounded-md shadow-lg cursor-grab active:cursor-grabbing ${className}`}
    />
  )
}
