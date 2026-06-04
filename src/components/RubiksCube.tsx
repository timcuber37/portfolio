'use client'

import { useEffect, useMemo, useRef } from 'react'
import { cube } from '@/lib/theme'

// A CSS-3D Rubik's cube built from 26 individual cubies that performs real
// layer turns (F/B/U/D/L/R-style 90° rotations) on a loop. Each turn is baked
// into the cubies' positions + orientations afterward, so it stays a coherent,
// solvable cube exactly like the real thing.

type Vec = [number, number, number]
type Mat = number[][] // 3x3

// Each face of a cubie: its local rotation, the axis/direction of its outward
// normal (used to decide if it's an exterior, colored face), and its color.
const FACES = [
  { t: 'rotateY(90deg)', axis: 0, dir: 1, color: cube.blue },
  { t: 'rotateY(-90deg)', axis: 0, dir: -1, color: cube.green },
  { t: 'rotateX(-90deg)', axis: 1, dir: 1, color: cube.white },
  { t: 'rotateX(90deg)', axis: 1, dir: -1, color: cube.yellow },
  { t: '', axis: 2, dir: 1, color: cube.red },
  { t: 'rotateY(180deg)', axis: 2, dir: -1, color: cube.orange },
] as const

const BODY = '#0c0c0e'

function matVec(m: Mat, v: Vec): Vec {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ]
}

function matMul(a: Mat, b: Mat): Mat {
  const r: Mat = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) r[i][j] += a[i][k] * b[k][j]
  return r
}

// Standard right-hand rotation matrix (matches CSS rotate3d) for 90° multiples.
function rotMat(axis: number, angleRad: number): Mat {
  const c = Math.round(Math.cos(angleRad))
  const s = Math.round(Math.sin(angleRad))
  if (axis === 0) return [[1, 0, 0], [0, c, -s], [0, s, c]]
  if (axis === 1) return [[c, 0, s], [0, 1, 0], [-s, 0, c]]
  return [[c, -s, 0], [s, c, 0], [0, 0, 1]]
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

export default function RubiksCube({ size = 200, className = '' }: { size?: number; className?: string }) {
  const cubieSize = size * 0.3
  const gap = size * 0.32 // center-to-center spacing between cubies

  // Static render model: one entry per cubie (skipping the hidden core).
  const cubies = useMemo(() => {
    const list: { pos: Vec }[] = []
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue
          list.push({ pos: [x, y, z] })
        }
    return list
  }, [])

  const els = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Mutable per-cubie state (position + orientation) that turns mutate.
    const states = cubies.map((c) => ({
      pos: [...c.pos] as Vec,
      rot: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] as Mat,
    }))

    const resting = (i: number) => {
      const { pos, rot } = states[i]
      const m = `matrix3d(${rot[0][0]},${rot[1][0]},${rot[2][0]},0,${rot[0][1]},${rot[1][1]},${rot[2][1]},0,${rot[0][2]},${rot[1][2]},${rot[2][2]},0,0,0,0,1)`
      return `translate3d(${pos[0] * gap}px,${pos[1] * gap}px,${pos[2] * gap}px) ${m}`
    }

    const setRest = (i: number) => {
      const el = els.current[i]
      if (el) el.style.transform = resting(i)
    }

    states.forEach((_, i) => setRest(i))

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    let raf = 0
    let timer: ReturnType<typeof setTimeout>
    const axisVecs = ['1,0,0', '0,1,0', '0,0,1']

    type Move = { axis: number; layer: number; dir: number }
    const history: Move[] = [] // applied scramble moves; replayed inverted to solve
    let phase: 'scramble' | 'solve' = 'scramble'
    let scrambleLen = 9 + Math.floor(Math.random() * 7) // 9–15 turns per cycle
    const duration = 520

    // Animate one 90° layer turn, bake it, then invoke `after`.
    const animateMove = (move: Move, after: () => void) => {
      const { axis, layer, dir } = move
      const affected = states.map((s, i) => (s.pos[axis] === layer ? i : -1)).filter((i) => i >= 0)
      const start = performance.now()

      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const angle = dir * 90 * easeInOut(t)
        for (const i of affected) {
          const el = els.current[i]
          if (el) el.style.transform = `rotate3d(${axisVecs[axis]},${angle}deg) ${resting(i)}`
        }
        if (t < 1) {
          raf = requestAnimationFrame(frame)
        } else {
          const R = rotMat(axis, (dir * Math.PI) / 2)
          for (const i of affected) {
            states[i].pos = matVec(R, states[i].pos).map(Math.round) as Vec
            states[i].rot = matMul(R, states[i].rot)
            setRest(i)
          }
          after()
        }
      }
      raf = requestAnimationFrame(frame)
    }

    const randomMove = (): Move => {
      const last = history[history.length - 1]
      let m: Move
      do {
        m = { axis: Math.floor(Math.random() * 3), layer: Math.random() < 0.5 ? -1 : 1, dir: Math.random() < 0.5 ? 1 : -1 }
        // Avoid immediately undoing the previous turn (keeps the scramble moving).
      } while (last && m.axis === last.axis && m.layer === last.layer && m.dir === -last.dir)
      return m
    }

    const next = () => {
      if (phase === 'scramble') {
        if (history.length < scrambleLen) {
          const move = randomMove()
          history.push(move)
          animateMove(move, () => {
            timer = setTimeout(next, 240)
          })
        } else {
          phase = 'solve'
          timer = setTimeout(next, 700) // pause on the scrambled cube
        }
      } else {
        const last = history.pop()
        if (last) {
          // Inverse of the last scramble turn — same layer, opposite direction.
          animateMove({ axis: last.axis, layer: last.layer, dir: -last.dir }, () => {
            timer = setTimeout(next, 200)
          })
        } else {
          phase = 'scramble'
          scrambleLen = 9 + Math.floor(Math.random() * 7)
          timer = setTimeout(next, 1500) // admire the solved cube
        }
      }
    }

    timer = setTimeout(next, 800)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [cubies, gap])

  return (
    <div className={className} style={{ width: size, height: size, perspective: size * 4 }}>
      <div
        className="cube-3d"
        style={{
          position: 'relative',
          width: size,
          height: size,
          transformStyle: 'preserve-3d',
          animation: 'spin-3d 22s linear infinite',
        }}
      >
        {cubies.map((c, i) => (
          <div
            key={i}
            ref={(el) => {
              els.current[i] = el
            }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: cubieSize,
              height: cubieSize,
              marginLeft: -cubieSize / 2,
              marginTop: -cubieSize / 2,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
              // Initial solved placement (the effect takes over after mount).
              transform: `translate3d(${c.pos[0] * gap}px, ${c.pos[1] * gap}px, ${c.pos[2] * gap}px)`,
            }}
          >
            {FACES.map((f, fi) => {
              const exterior = c.pos[f.axis] === f.dir
              return (
                <div
                  key={fi}
                  style={{
                    position: 'absolute',
                    width: cubieSize,
                    height: cubieSize,
                    background: BODY,
                    transform: `${f.t} translateZ(${cubieSize / 2}px)`,
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {exterior && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: cubieSize * 0.08,
                        borderRadius: cubieSize * 0.14,
                        background: f.color,
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
