import { useEffect, useState } from 'react'

const CHAR_INTERVAL_MS = 25
const LINE_STAGGER_MS = 100

// Révèle une liste de lignes en cascade façon "typewriter" (~25ms/caractère,
// chaque ligne démarre ~100ms après la précédente) — journal de boot
// Hero/Sidebar (US-013 / DESIGN_PROPOSAL_V2 §2). Hook maison, aucune
// dépendance. Tant que `active` est faux, renvoie des lignes vides (état de
// repos identique entre SSR et premier rendu client, `active` ne devenant
// vrai qu'après montage via un effet).
const useTypewriterLines = (lines: string[], active: boolean): string[] => {
  const [displayedLines, setDisplayedLines] = useState<string[]>(() =>
    lines.map(() => '')
  )

  useEffect(() => {
    if (!active) {
      setDisplayedLines(lines.map(() => ''))
      return undefined
    }

    const startTime = performance.now()
    const intervalId = window.setInterval(() => {
      const elapsed = performance.now() - startTime
      let allRevealed = true

      const next = lines.map((line, index) => {
        const lineElapsed = elapsed - index * LINE_STAGGER_MS
        if (lineElapsed <= 0) {
          allRevealed = false
          return ''
        }
        const charCount = Math.min(
          line.length,
          Math.floor(lineElapsed / CHAR_INTERVAL_MS)
        )
        if (charCount < line.length) {
          allRevealed = false
        }
        return line.slice(0, charCount)
      })

      setDisplayedLines(next)
      if (allRevealed) {
        window.clearInterval(intervalId)
      }
    }, CHAR_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [active, lines])

  return displayedLines
}

// Exposée pour que l'appelant (Sidebar) puisse dériver la durée totale du
// journal de boot (délai avant de révéler le reste du contenu) à partir des
// MÊMES constantes de cadence — pas de valeur dupliquée/désynchronisable.
export const getTypewriterDurationMs = (lines: string[]): number =>
  lines.reduce(
    (max, line, index) =>
      Math.max(max, index * LINE_STAGGER_MS + line.length * CHAR_INTERVAL_MS),
    0
  )

export default useTypewriterLines
