'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// Wraps content in a card that tilts in 3D toward the cursor.
// Scale is managed manually (not via whileHover) so it can be force-reset on
// click — otherwise, when a modal mounts over the card without the pointer
// moving, the browser never fires mouseleave and the card stays tilted/scaled.
export default function Tilt({
  children,
  className = '',
  max = 7,
}: {
  children: React.ReactNode
  className?: string
  max?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const lift = useMotionValue(1)

  const spring = { stiffness: 220, damping: 18, mass: 0.4 }
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [`${max}deg`, `-${max}deg`]), spring)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [`-${max}deg`, `${max}deg`]), spring)
  const scale = useSpring(lift, spring)

  function handleMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
    lift.set(1.02)
  }

  function reset() {
    px.set(0)
    py.set(0)
    lift.set(1)
  }

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => lift.set(1.02)}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      // Flatten on click so the card doesn't stay tilted behind an opening modal.
      onPointerDown={reset}
      style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
