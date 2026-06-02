import { cube } from '@/lib/theme'

// A pure-CSS 3D Rubik's cube that slowly rotates. No JS / no client hooks needed.
const faces = [
  { transform: 'rotateY(0deg)', color: cube.red }, // front
  { transform: 'rotateY(180deg)', color: cube.orange }, // back
  { transform: 'rotateY(90deg)', color: cube.blue }, // right
  { transform: 'rotateY(-90deg)', color: cube.green }, // left
  { transform: 'rotateX(90deg)', color: cube.white }, // top
  { transform: 'rotateX(-90deg)', color: cube.yellow }, // bottom
]

export default function RubiksCube({
  size = 200,
  className = '',
}: {
  size?: number
  className?: string
}) {
  const half = size / 2

  return (
    <div
      className={className}
      style={{ width: size, height: size, perspective: size * 4 }}
    >
      <div
        className="cube-3d relative"
        style={{
          width: size,
          height: size,
          transformStyle: 'preserve-3d',
          animation: 'spin-3d 18s linear infinite',
        }}
      >
        {faces.map((face, i) => (
          <div
            key={i}
            className="absolute grid grid-cols-3 grid-rows-3"
            style={{
              width: size,
              height: size,
              transform: `${face.transform} translateZ(${half}px)`,
              gap: size * 0.04,
              padding: size * 0.04,
              background: '#0c0c0e',
              borderRadius: size * 0.06,
              backfaceVisibility: 'hidden',
            }}
          >
            {Array.from({ length: 9 }).map((_, j) => (
              <div
                key={j}
                style={{
                  background: face.color,
                  borderRadius: size * 0.03,
                  boxShadow: `inset 0 0 ${size * 0.03}px rgba(0,0,0,0.25)`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
