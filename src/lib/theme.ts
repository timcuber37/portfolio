// Rubik's cube palette.
// `cube` = vibrant fills for geometry (cube faces, rings, glows, gradients).
// `ink`  = legibility-tuned variants for text/borders on a LIGHT background.
export const cube = {
  red: '#FF3B3B',
  orange: '#FF8C00',
  yellow: '#FFD500',
  green: '#00C853',
  blue: '#2979FF',
  white: '#FFFFFF',
} as const

export const ink = {
  red: '#E11D2A',
  orange: '#EA580C',
  amber: '#CA8A04',
  green: '#15A34A',
  blue: '#2563EB',
} as const

// Accents for cycling text/borders (readable on white).
export const cubeAccents = [ink.red, ink.orange, ink.amber, ink.green, ink.blue]

// Vibrant fills for cycling solid shapes.
export const cubeFills = [cube.red, cube.orange, cube.yellow, cube.green, cube.blue]

function wrap(i: number, len: number): number {
  return ((i % len) + len) % len
}

// Readable accent color for an item at a given index.
export function accentAt(i: number): string {
  return cubeAccents[wrap(i, cubeAccents.length)]
}

// Vibrant fill color for an item at a given index.
export function fillAt(i: number): string {
  return cubeFills[wrap(i, cubeFills.length)]
}
