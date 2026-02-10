export type Face = string

export interface AbilityCondition {
  // A map of face -> minimum count required. Example: { "CLAW": 3, "SWORD": 2 }
  // NOTE: Either use face-based conditions OR number-based conditions, not both
  requiredFaces?: Record<Face, number>

  // Match if any of these faces appear at least once. Example: ["2","3","4"]
  anyOfFaces?: Face[]

  // Die number-based conditions (never combined with face conditions)
  // 'smallStraight': requires 1,2,3,4 or 2,3,4,5 or 3,4,5,6
  // 'largeStraight': requires 1,2,3,4,5 or 2,3,4,5,6
  straightType?: 'smallStraight' | 'largeStraight'

  // Backwards-compatible shortcuts (still supported):
  // - face + count -> requiredFaces
  // - value -> anyOfFaces with numeric face strings
  face?: Face
  value?: number
  count?: number

  description?: string
}

export interface Ability {
  name: string
  condition: AbilityCondition
}

export interface Hero {
  id: string
  name: string
  color?: string
  // 6-element array: index 0 = die face 1, index 1 = die face 2, etc.
  // Each element is a face string like '1', '2', 'CLAW', 'SWORD', etc.
  customDieFaces: [Face, Face, Face, Face, Face, Face]
  abilities: Ability[]
}

// 60+ hero stubs. Fill in `customDieFaces` and `abilities` for each hero as needed.
export const heroes: Hero[] = [
  {
    id: 'jean_grey', name: 'Jean Grey', color: '#8B0000', customDieFaces: ['ASTRAL', 'ASTRAL', 'ASTRAL', 'CONTROL', 'CONTROL', 'PHOENIX'],
    abilities: [
      { name: 'MIND ATTACK', condition: { requiredFaces: { 'ASTRAL': 3 }, description: 'Core Ability' } },
      { name: 'PSYCHIC MULTIPLIER', condition: { requiredFaces: { 'CONTROL': 3 }, description: 'Core Ability' } },
      { name: 'OCCLUSION', condition: { requiredFaces: { 'ASTRAL': 1, 'CONTROL': 2, 'PHOENIX': 1 }, description: 'Core Ability' } },
      { name: 'ASTRAL COMBAT (SMALL STRAIGHT)', condition: { straightType: 'smallStraight', description: 'Core Ability' } },
      { name: 'ASTRAL COMBAT (LARGE STRAIGHT)', condition: { straightType: 'largeStraight', description: 'Core Ability' } },
      { name: 'TELEKINETIC BLAST', condition: { requiredFaces: { 'ASTRAL': 3, 'PHOENIX': 2 }, description: 'Core Ability' } },
      { name: 'FIREBIRD', condition: { requiredFaces: { 'PHOENIX': 4 }, description: 'Core Ability' } },
      { name: 'ONE TRUE PHOENIX', condition: { requiredFaces: { 'PHOENIX': 5 }, description: 'Core Ability' } },
      { name: 'PSIONIC JOLT', condition: { requiredFaces: { 'ASTRAL': 2, 'PHOENIX': 2 }, description: 'Upgrade ability' } },
      { name: 'ESSENSE', condition: { requiredFaces: { 'PHOENIX': 3 }, description: 'Upgrade ability' } },
      { name: 'SUPER OCCLUSION', condition: { requiredFaces: { 'ASTRAL': 1, 'CONTROL': 3, 'PHOENIX': 1 }, description: 'Upgrade ability' } },
      { name: 'PSYCHIC MULTIPLICITY', condition: { requiredFaces: { 'CONTROL': 5 }, description: 'Upgrade ability' } },
    ],
  },
  {
    id: 'rogue', name: 'Rogue', color: '#2F4F4F', customDieFaces: ['TOUCH', 'TOUCH', 'TOUCH', 'SOAR', 'SOAR', 'ION'],
    abilities: [
      { name: 'BRAWL', condition: { requiredFaces: { 'TOUCH': 3 }, description: 'Core ability' } },
      { name: 'SASS', condition: { requiredFaces: { 'TOUCH': 2, 'ION': 2 }, description: 'Core ability' } },
      { name: 'LEACH', condition: { requiredFaces: { 'TOUCH': 1, 'SOAR': 3 }, description: 'Core ability' } },
      { name: 'ABSORPTION (SMALL STRAIGHT)', condition: { straightType: 'smallStraight', description: 'Core ability' } },
      { name: 'ABSORPTION (LARGE STRAIGHT)', condition: { straightType: 'largeStraight', description: 'Core ability' } },
      { name: 'SKYBOUND', condition: { requiredFaces: { 'SOAR': 2, 'ION': 2 }, description: 'Core ability' } },
      { name: 'INFLUENTIAL', condition: { requiredFaces: { 'ION': 4 }, description: 'Core ability' } },
      { name: 'HIGH ALTITUDE', condition: { requiredFaces: { 'ION': 5 }, description: 'Core ability' } },
      { name: 'UNDERDOG', condition: { requiredFaces: { 'TOUCH': 3, 'ION': 2 }, description: 'Upgrade ability' } },
      { name: 'TO THE CLOUDS', condition: { requiredFaces: { 'SOAR': 3, 'ION': 2 }, description: 'Upgrade ability' } },
      { name: 'RECIPROCATE', condition: { requiredFaces: { 'ION': 3 }, description: 'Upgrade ability' } },
    ],
  },
]
