import type { ReactNode } from 'react'

// Splits text on the given keywords and wraps each match in a colored span.
// Plain function (no hooks) so it can be used by any client component.
export function highlightText(
  text: string,
  keywords: string[],
  colorFor: (kw: string) => string
): ReactNode {
  if (!keywords.length) return text
  const escaped = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'))
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: colorFor(part), fontWeight: 500 }}>
        {part}
      </span>
    ) : (
      part
    )
  )
}
