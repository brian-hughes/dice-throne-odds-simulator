import type { Hero, Ability, Face } from './heroes'
import { TRIALS } from './constants'

export interface AbilityResult {
  ability: Ability
  activations: number
  probability: number
}

export interface SimulationResult {
  results: AbilityResult[]
  initialRolls?: number[][] // [trial][die] = die value
}

// Roll a standard D6 (1-6)
export function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1
}

// Map die number (1-6) to its face string for the hero
export function dieNumberToFace(dieNum: number, hero: Hero): Face {
  return hero.customDieFaces[dieNum - 1]
}

// Fixed dice array: either a die number (1-6) or null meaning random this roll
export function simulate(hero: Hero, fixedDice: Array<number | null>, trials = TRIALS, sixItEnabled = false, enableLogging = false, soWildEnabled = false, twiceAsWildEnabled = false): SimulationResult {
  const results: Map<string, number> = new Map()
  hero.abilities.forEach(a => results.set(a.name, 0))

  const initialRolls: number[][] = enableLogging ? [] : []

  for (let t = 0; t < trials; t++) {
    const rolledNumbers: number[] = []
    for (let i = 0; i < 5; i++) {
      const fixed = fixedDice[i]
      if (fixed !== null && fixed !== undefined) rolledNumbers.push(fixed)
      else rolledNumbers.push(rollDie())
    }

    // Log initial rolls if enabled
    if (enableLogging) {
      initialRolls.push([...rolledNumbers])
    }

    // Convert die numbers to face strings
    const rolledFaces: Face[] = rolledNumbers.map(n => dieNumberToFace(n, hero))

    // Evaluate each ability
    hero.abilities.forEach(a => {
      let activated = checkAbilityActivated(a, rolledFaces, rolledNumbers)

      // Check Six-It variants: swap each die to 6 one at a time
      if (!activated && sixItEnabled) {
        for (let dieIdx = 0; dieIdx < 5; dieIdx++) {
          const modifiedNumbers = [...rolledNumbers]
          modifiedNumbers[dieIdx] = 6
          const modifiedFaces = modifiedNumbers.map(n => dieNumberToFace(n, hero))
          if (checkAbilityActivated(a, modifiedFaces, modifiedNumbers)) {
            activated = true
            break
          }
        }
      }

      // Check So Wild: swap 1 die to any value (1-6)
      if (!activated && soWildEnabled) {
        for (let dieIdx = 0; dieIdx < 5; dieIdx++) {
          for (let newVal = 1; newVal <= 6; newVal++) {
            const modifiedNumbers = [...rolledNumbers]
            modifiedNumbers[dieIdx] = newVal
            const modifiedFaces = modifiedNumbers.map(n => dieNumberToFace(n, hero))
            if (checkAbilityActivated(a, modifiedFaces, modifiedNumbers)) {
              activated = true
              break
            }
          }
          if (activated) break
        }
      }

      // Check Twice as Wild: swap 2 dice to any values (1-6)
      if (!activated && twiceAsWildEnabled) {
        for (let die1 = 0; die1 < 5; die1++) {
          for (let die2 = die1 + 1; die2 < 5; die2++) {
            for (let val1 = 1; val1 <= 6; val1++) {
              for (let val2 = 1; val2 <= 6; val2++) {
                const modifiedNumbers = [...rolledNumbers]
                modifiedNumbers[die1] = val1
                modifiedNumbers[die2] = val2
                const modifiedFaces = modifiedNumbers.map(n => dieNumberToFace(n, hero))
                if (checkAbilityActivated(a, modifiedFaces, modifiedNumbers)) {
                  activated = true
                  break
                }
              }
              if (activated) break
            }
            if (activated) break
          }
          if (activated) break
        }
      }

      if (activated) {
        results.set(a.name, (results.get(a.name) || 0) + 1)
      }
    })
  }

  const out: AbilityResult[] = []
  hero.abilities.forEach(a => {
    const activates = results.get(a.name) || 0
    out.push({ ability: a, activations: activates, probability: activates / trials })
  })
  return { results: out, initialRolls: enableLogging ? initialRolls : undefined }
}

function checkAbilityActivated(ability: Ability, rolledFaces: Face[], rolledNumbers?: number[]): boolean {
  const cond = ability.condition
  if (!cond) return false

  // 1) straightType: check for small or large straights
  if (cond.straightType && rolledNumbers) {
    if (cond.straightType === 'smallStraight') return isSmallStraight(rolledNumbers)
    if (cond.straightType === 'largeStraight') return isLargeStraight(rolledNumbers)
  }

  // 2) requiredFaces: map of face -> minimum required count (all must be satisfied)
  if (cond.requiredFaces) {
    for (const [face, needed] of Object.entries(cond.requiredFaces)) {
      const count = rolledFaces.filter(f => f === face).length
      if (count < (needed ?? 0)) return false
    }
    return true
  }

  // 3) anyOfFaces: activate if any of the listed faces appears at least once
  if (cond.anyOfFaces && cond.anyOfFaces.length > 0) {
    return rolledFaces.some(f => cond.anyOfFaces!.includes(f))
  }

  // Backwards-compatible checks
  if (cond.face && cond.count) {
    const count = rolledFaces.filter(f => f === cond.face).length
    return count >= cond.count
  }

  if (cond.value !== undefined) {
    const valStr = String(cond.value)
    return rolledFaces.some(f => f === valStr)
  }

  if (cond.face) {
    return rolledFaces.some(f => f === cond.face)
  }

  return false
}

// Check if rolled die numbers contain a small straight (4 consecutive numbers)
function isSmallStraight(rolledNumbers: number[]): boolean {
  const sorted = [...new Set(rolledNumbers)].sort((a, b) => a - b)
  const straights = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]]
  return straights.some(straight => straight.every(n => sorted.includes(n)))
}

// Check if rolled die numbers contain a large straight (5 consecutive numbers)
function isLargeStraight(rolledNumbers: number[]): boolean {
  const sorted = [...new Set(rolledNumbers)].sort((a, b) => a - b)
  const straights = [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]]
  return straights.some(straight => straight.every(n => sorted.includes(n)))
}
