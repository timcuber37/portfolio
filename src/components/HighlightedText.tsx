import type { ReactNode } from 'react'

// Splits text on the given keywords and wraps each match in a colored span.
// Plain function (no hooks) so it can be used by any client component.
export function highlightText(
  text: string,
  keywords: string[],
  colorFor: (kw: string) => string
): ReactNode {
  if (!keywords.length) return text
  // Longest first so a longer tag wins over a shorter prefix (e.g. "Next.js" over "Next").
  const escaped = [...keywords]
    .sort((a, b) => b.length - a.length)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  // Flank the match with letter/digit boundaries so a keyword isn't matched as a
  // substring of a larger word (e.g. "React" must not highlight inside "reactive").
  // Using [A-Za-z0-9] rather than \b keeps tags like "Next.js"/"C++"/"Fly.io" working,
  // since their '.'/'+'/'/' are not treated as word characters.
  const parts = text.split(new RegExp(`(?<![A-Za-z0-9])(${escaped.join('|')})(?![A-Za-z0-9])`, 'gi'))
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
