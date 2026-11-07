import { useEffect, useRef, useState } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*?/'
const CYCLE_INTERVAL_MS = 40
const STAGGER_MS = 40
const MIN_CYCLES = 3
const MAX_CYCLES = 4
const SCRAMBLABLE_PATTERN = /[a-zA-Z0-9]/

const randomGlyph = (): string =>
  GLYPHS[Math.floor(Math.random() * GLYPHS.length)]

const randomCycleCount = (): number =>
  MIN_CYCLES + Math.floor(Math.random() * (MAX_CYCLES - MIN_CYCLES + 1))

// Effet "scramble/decrypt" : chaque caractère alphanumérique cycle 3-4
// glyphes aléatoires (~40ms de cadence) avant de se figer sur le bon
// caractère, de gauche à droite (stagger ~40ms entre lettres) — décodage du
// nom au boot (US-013 / DESIGN_PROPOSAL_V2 §2). Hook maison, aucune
// dépendance. Ne démarre que lorsque `active` passe à `true` (déclenché par
// l'appelant, ex. au moment où l'élément devient réellement visible) ;
// renvoie `text` tel quel tant que `active` est faux — l'appelant ne doit
// jamais passer `active=true` sous `prefers-reduced-motion`.
const useScrambleText = (text: string, active: boolean): string => {
  const [display, setDisplay] = useState(text)
  const settleAtRef = useRef<number[]>([])

  useEffect(() => {
    if (!active) {
      setDisplay(text)
      return undefined
    }

    settleAtRef.current = text
      .split('')
      .map((char, index) =>
        SCRAMBLABLE_PATTERN.test(char)
          ? index * STAGGER_MS + randomCycleCount() * CYCLE_INTERVAL_MS
          : 0
      )

    const startTime = performance.now()
    const intervalId = window.setInterval(() => {
      const elapsed = performance.now() - startTime
      const settleAt = settleAtRef.current
      let allSettled = true

      const next = text
        .split('')
        .map((char, index) => {
          if (!SCRAMBLABLE_PATTERN.test(char)) {
            return char
          }
          if (elapsed >= settleAt[index]) {
            return char
          }
          allSettled = false
          return randomGlyph()
        })
        .join('')

      setDisplay(next)
      if (allSettled) {
        window.clearInterval(intervalId)
        setDisplay(text)
      }
    }, CYCLE_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [active, text])

  return display
}

export default useScrambleText
