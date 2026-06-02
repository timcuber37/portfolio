'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { cube } from '@/lib/theme'

// Rainbow bar at the very top that tracks how far the page is scrolled.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  })

  return (
    <motion.div
      aria-hidden
      style={{
        scaleX,
        transformOrigin: 'left',
        background: `linear-gradient(90deg, ${cube.red}, ${cube.orange}, ${cube.yellow}, ${cube.green}, ${cube.blue})`,
      }}
      className="fixed top-0 left-0 right-0 h-1 z-[60]"
    />
  )
}
