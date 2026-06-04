'use client'

import { useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { cube } from '@/lib/theme'
import RubiksCube from './RubiksCube'

type Shape = {
  top: string
  left?: string
  right?: string
  size: number
  color: string
  filled?: boolean
  parallax: number // px of vertical drift across the full scroll
  rotate: number // deg of rotation across the full scroll
  depth: number // px the shape shifts in response to the cursor
}

const shapes: Shape[] = [
  { top: '12%', left: '6%', size: 48, color: cube.red, parallax: -160, rotate: 180, depth: 55 },
  { top: '24%', right: '10%', size: 32, color: cube.green, filled: true, parallax: -90, rotate: -140, depth: 30 },
  { top: '64%', left: '12%', size: 40, color: cube.yellow, filled: true, parallax: -220, rotate: 120, depth: 42 },
  { top: '78%', right: '14%', size: 54, color: cube.blue, parallax: -120, rotate: 200, depth: 60 },
  { top: '46%', left: '46%', size: 28, color: cube.orange, filled: true, parallax: -300, rotate: -180, depth: 24 },
  { top: '88%', left: '40%', size: 36, color: cube.red, parallax: -70, rotate: 160, depth: 38 },
  { top: '36%', left: '22%', size: 24, color: cube.blue, filled: true, parallax: -260, rotate: -220, depth: 20 },
]

function ParallaxSquare({
  s,
  progress,
  mx,
  my,
}: {
  s: Shape
  progress: MotionValue<number>
  mx: MotionValue<number>
  my: MotionValue<number>
}) {
  // Outer layer: scroll-driven drift + rotation.
  const y = useTransform(progress, [0, 1], [0, s.parallax])
  const rotate = useTransform(progress, [0, 1], [0, s.rotate])
  // Inner layer: cursor-driven shift + tilt (reacts to mouse anywhere on the page).
  const cx = useTransform(mx, [-0.5, 0.5], [-s.depth, s.depth])
  const cy = useTransform(my, [-0.5, 0.5], [-s.depth, s.depth])
  const crot = useTransform(mx, [-0.5, 0.5], [-16, 16])

  return (
    <motion.div
      style={{
        y,
        rotate,
        top: s.top,
        left: s.left,
        right: s.right,
        width: s.size,
        height: s.size,
        willChange: 'transform',
      }}
      className="absolute"
    >
      <motion.div
        style={{
          x: cx,
          y: cy,
          rotate: crot,
          width: '100%',
          height: '100%',
          background: s.filled ? s.color : 'transparent',
          border: s.filled ? 'none' : `2.5px solid ${s.color}`,
          opacity: 0.5,
          willChange: 'transform',
        }}
        className="rounded-md"
      />
    </motion.div>
  )
}

function MiniGrid({
  top,
  left,
  right,
  colors,
  progress,
  parallax,
  depth,
  mx,
  my,
}: {
  top: string
  left?: string
  right?: string
  colors: string[]
  progress: MotionValue<number>
  parallax: number
  depth: number
  mx: MotionValue<number>
  my: MotionValue<number>
}) {
  const y = useTransform(progress, [0, 1], [0, parallax])
  const rotate = useTransform(progress, [0, 1], [0, 90])
  const cx = useTransform(mx, [-0.5, 0.5], [-depth, depth])
  const cy = useTransform(my, [-0.5, 0.5], [-depth, depth])
  const crot = useTransform(mx, [-0.5, 0.5], [-20, 20])

  return (
    <motion.div
      style={{ y, rotate, top, left, right, width: 56, height: 56, willChange: 'transform' }}
      className="absolute"
    >
      <motion.div
        style={{ x: cx, y: cy, rotate: crot, background: '#1c1c20', willChange: 'transform' }}
        className="w-full h-full grid grid-cols-3 grid-rows-3 gap-1 p-1 rounded-md shadow-md opacity-80"
      >
        {colors.map((c, i) => (
          <div key={i} style={{ background: c, borderRadius: 2 }} />
        ))}
      </motion.div>
    </motion.div>
  )
}

export default function GeometricBackground() {
  const { scrollYProgress } = useScroll()
  // Smooth the raw scroll value so parallax glides instead of stepping per scroll event.
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 24, mass: 0.4 })

  // Normalized cursor position (-0.5..0.5 from viewport center), springed for smooth motion.
  const rawMx = useMotionValue(0)
  const rawMy = useMotionValue(0)
  const mx = useSpring(rawMx, { stiffness: 90, damping: 20, mass: 0.5 })
  const my = useSpring(rawMy, { stiffness: 90, damping: 20, mass: 0.5 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      rawMx.set(e.clientX / window.innerWidth - 0.5)
      rawMy.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [rawMx, rawMy])

  // The big cube drifts toward the cursor. Use a plain 2D translate (NOT rotateX/Y):
  // a 3D rotation on this wrapper would flatten against the cube's own preserve-3d
  // context and make the faces layer/tear.
  const cubeX = useTransform(mx, [-0.5, 0.5], [-26, 26])
  const cubeY = useTransform(my, [-0.5, 0.5], [-18, 18])

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      // Promote the whole backdrop to its own GPU layer to avoid tearing as content scrolls over it.
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
    >
      {/* Large cube anchored top-right. Idle-spins via CSS; drifts toward the cursor. */}
      <motion.div
        style={{ x: cubeX, y: cubeY, willChange: 'transform' }}
        className="absolute -top-16 -right-20 opacity-[0.32] hidden sm:block"
      >
        <RubiksCube size={300} />
      </motion.div>

      {/* Soft color glows (static, lighter blur to reduce repaint cost) */}
      <div
        className="absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-2xl opacity-[0.10]"
        style={{ background: cube.blue, transform: 'translateZ(0)' }}
      />
      <div
        className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full blur-2xl opacity-[0.10]"
        style={{ background: cube.orange, transform: 'translateZ(0)' }}
      />

      {/* Drifting square tiles */}
      {shapes.map((s, i) => (
        <ParallaxSquare key={i} s={s} progress={progress} mx={mx} my={my} />
      ))}

      {/* Mini cube-face grids */}
      <MiniGrid
        top="18%"
        left="38%"
        progress={progress}
        parallax={-180}
        depth={46}
        mx={mx}
        my={my}
        colors={[cube.red, cube.red, cube.blue, cube.green, cube.yellow, cube.green, cube.orange, cube.white, cube.blue]}
      />
      <MiniGrid
        top="70%"
        right="32%"
        progress={progress}
        parallax={-110}
        depth={34}
        mx={mx}
        my={my}
        colors={[cube.green, cube.yellow, cube.orange, cube.white, cube.blue, cube.red, cube.yellow, cube.green, cube.orange]}
      />
    </div>
  )
}
