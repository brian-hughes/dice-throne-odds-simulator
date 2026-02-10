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
    id: 'artificer', name: 'Artificer', color: '#8B0000', customDieFaces: ['WRENCH', 'WRENCH', 'WRENCH', 'GEAR', 'GEAR', 'BOLT'],
    abilities: [
      { name: 'SPANNER STRIKE', condition: { requiredFaces: { 'WRENCH': 3 }, description: 'Core' } },
      { name: 'SCHEMATICS', condition: { requiredFaces: { 'GEAR': 3, 'BOLT': 1 }, description: 'Core' } },
      { name: 'EUREKA', condition: { requiredFaces: { 'WRENCH': 2, 'GEAR': 3 }, description: 'Core' } },
      { name: 'JOLT', condition: { straightType: 'smallStraight', description: 'Core' } },
      { name: 'ZAPPPP!', condition: { straightType: 'largeStraight', description: 'Core' } },
      { name: 'OVERCLOCK', condition: { requiredFaces: { 'BOLT': 4 }, description: 'Core' } },
      { name: 'MAXIMUM POWER', condition: { requiredFaces: { 'BOLT': 5 }, description: 'Core' } },
      { name: 'POWER UP', condition: { requiredFaces: { 'BOLT': 3 }, description: 'Upgrade' } },
      { name: 'NUTS N\' BOLTS', condition: { requiredFaces: { 'WRENCH': 3, 'BOLT': 1 }, description: 'Upgrade' } },
      { name: 'SWARMING BOTS', condition: { requiredFaces: { 'WRENCH': 1, 'GEAR': 2, 'BOLT': 1 }, description: 'Upgrade' } },
      { name: 'SCRATCH BUILT', condition: { requiredFaces: { 'WRENCH': 2, 'GEAR': 2 }, description: 'Upgrade' } },
    ],
  },
  {
    id: 'jean_grey', name: 'Jean Grey', color: '#8B0000', customDieFaces: ['ASTRAL', 'ASTRAL', 'ASTRAL', 'CONTROL', 'CONTROL', 'PHOENIX'],
    abilities: [
      { name: 'MIND ATTACK', condition: { requiredFaces: { 'ASTRAL': 3 }, description: 'Core' } },
      { name: 'PSYCHIC MULTIPLIER', condition: { requiredFaces: { 'CONTROL': 3 }, description: 'Core' } },
      { name: 'OCCLUSION', condition: { requiredFaces: { 'ASTRAL': 1, 'CONTROL': 2, 'PHOENIX': 1 }, description: 'Core' } },
      { name: 'ASTRAL COMBAT (SMALL STRAIGHT)', condition: { straightType: 'smallStraight', description: 'Core' } },
      { name: 'ASTRAL COMBAT (LARGE STRAIGHT)', condition: { straightType: 'largeStraight', description: 'Core' } },
      { name: 'TELEKINETIC BLAST', condition: { requiredFaces: { 'ASTRAL': 3, 'PHOENIX': 2 }, description: 'Core' } },
      { name: 'FIREBIRD', condition: { requiredFaces: { 'PHOENIX': 4 }, description: 'Core' } },
      { name: 'ONE TRUE PHOENIX', condition: { requiredFaces: { 'PHOENIX': 5 }, description: 'Core' } },
      { name: 'PSIONIC JOLT', condition: { requiredFaces: { 'ASTRAL': 2, 'PHOENIX': 2 }, description: 'Upgrade' } },
      { name: 'ESSENSE', condition: { requiredFaces: { 'PHOENIX': 3 }, description: 'Upgrade' } },
      { name: 'SUPER OCCLUSION', condition: { requiredFaces: { 'ASTRAL': 1, 'CONTROL': 3, 'PHOENIX': 1 }, description: 'Upgrade' } },
      { name: 'PSYCHIC MULTIPLICITY', condition: { requiredFaces: { 'CONTROL': 5 }, description: 'Upgrade' } },
    ],
  },
  {
    id: 'pirate', name: 'Cursed Pirate', color: '#000000', customDieFaces: ['CUTLASS', 'CUTLASS', 'CUTLASS', 'BOOTY', 'BOOTY', 'SKULL'],
    abilities: [
      { name: 'CUTLASS STRIKE', condition: { requiredFaces: { 'CUTLASS': 3 }, description: 'Core' } },
      { name: 'X MARKS THE SPOT', condition: { requiredFaces: { 'BOOTY': 3 }, description: 'Core' } },
      { name: 'WALK THE PLANK', condition: { requiredFaces: { 'CUTLASS': 1, 'BOOTY': 2, 'SKULL': 1}, description: 'Core' } },
      { name: 'LIGHT THE FUSE (SMALL STRAIGHT)', condition: { straightType: 'smallStraight', description: 'Core' } },
      { name: 'LIGHT THE FUSE (LARGE STRAIGHT)', condition: { straightType: 'largeStraight', description: 'Core' } },
      { name: 'SHIVER ME TIMBERS', condition: { requiredFaces: { 'CUTLASS': 1, 'SKULL': 3 }, description: 'Core' } },
      { name: 'BLACK SPOT', condition: { requiredFaces: { 'SKULL': 4 }, description: 'Core' } },
      { name: 'PIRATES TOUCH!', condition: { requiredFaces: { 'SKULL': 5 }, description: 'Core' } },
    ],
  },  
  {
    id: 'pirate_2', name: 'Cursed Pirate (Flipped)', color: '#000000', customDieFaces: ['CUTLASS', 'CUTLASS', 'CUTLASS', 'BOOTY', 'BOOTY', 'SKULL'],
    abilities: [
      { name: 'SOUL CUTLASS', condition: { requiredFaces: { 'CUTLASS': 3 }, description: 'Core' } },
      { name: 'DREAD MARK', condition: { requiredFaces: { 'BOOTY': 3 }, description: 'Core' } },
      { name: 'ABYSSAL WALK', condition: { requiredFaces: { 'CUTLASS': 1, 'BOOTY': 2, 'SKULL': 1}, description: 'Core' } },
      { name: 'THAR SHE BLOWS (SMALL STRAIGHT)', condition: { straightType: 'smallStraight', description: 'Core' } },
      { name: 'THAR SHE BLOWS (LARGE STRAIGHT)', condition: { straightType: 'largeStraight', description: 'Core' } },
      { name: 'THE SHIVERING', condition: { requiredFaces: { 'CUTLASS': 1, 'SKULL': 3 }, description: 'Core' } },
      { name: 'BLACK SOUL', condition: { requiredFaces: { 'SKULL': 4 }, description: 'Core' } },
      { name: 'CURSED TOUCH!', condition: { requiredFaces: { 'SKULL': 5 }, description: 'Core' } },
    ],
  },

  {
    id: 'rogue', name: 'Rogue', color: '#2F4F4F', customDieFaces: ['TOUCH', 'TOUCH', 'TOUCH', 'SOAR', 'SOAR', 'ION'],
    abilities: [
      { name: 'BRAWL', condition: { requiredFaces: { 'TOUCH': 3 }, description: 'Core' } },
      { name: 'SASS', condition: { requiredFaces: { 'TOUCH': 2, 'ION': 2 }, description: 'Core' } },
      { name: 'LEACH', condition: { requiredFaces: { 'TOUCH': 1, 'SOAR': 3 }, description: 'Core' } },
      { name: 'ABSORPTION (SMALL STRAIGHT)', condition: { straightType: 'smallStraight', description: 'Core' } },
      { name: 'ABSORPTION (LARGE STRAIGHT)', condition: { straightType: 'largeStraight', description: 'Core' } },
      { name: 'SKYBOUND', condition: { requiredFaces: { 'SOAR': 2, 'ION': 2 }, description: 'Core' } },
      { name: 'INFLUENTIAL', condition: { requiredFaces: { 'ION': 4 }, description: 'Core' } },
      { name: 'HIGH ALTITUDE', condition: { requiredFaces: { 'ION': 5 }, description: 'Core' } },
      { name: 'UNDERDOG', condition: { requiredFaces: { 'TOUCH': 3, 'ION': 2 }, description: 'Upgrade' } },
      { name: 'TO THE CLOUDS', condition: { requiredFaces: { 'SOAR': 3, 'ION': 2 }, description: 'Upgrade' } },
      { name: 'RECIPROCATE', condition: { requiredFaces: { 'ION': 3 }, description: 'Upgrade' } },
    ],
  },
]
