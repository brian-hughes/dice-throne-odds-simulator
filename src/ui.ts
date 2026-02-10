import type { Hero, Face, Ability, AbilityCondition } from './heroes'
import { simulate } from './odds'

export function createApp(root: HTMLElement) {
  root.innerHTML = ''

  const header = document.createElement('h1')
  header.textContent = 'Dice Throne Roll Simulator'
  root.appendChild(header)

  const controls = document.createElement('div')
  controls.className = 'controls'
  root.appendChild(controls)

  const heroSelect = document.createElement('select')
  heroSelect.id = 'hero-select'
  controls.appendChild(heroSelect)

  const heroInfo = document.createElement('div')
  heroInfo.id = 'hero-info'
  root.appendChild(heroInfo)

  const diceArea = document.createElement('div')
  diceArea.id = 'dice-area'
  root.appendChild(diceArea)

  const rollBtn = document.createElement('button')
  rollBtn.textContent = 'Run 10000 Trials'
  rollBtn.className = 'roll-button'
  root.appendChild(rollBtn)

  const results = document.createElement('div')
  results.id = 'results'
  root.appendChild(results)

  return { heroSelect, heroInfo, diceArea, rollBtn, results }
}

export function populateHeroOptions(select: HTMLSelectElement, heroes: Hero[]) {
  select.innerHTML = ''
  const opt = document.createElement('option')
  opt.value = ''
  opt.textContent = '-- Select Hero --'
  select.appendChild(opt)
  heroes.forEach(h => {
    const o = document.createElement('option')
    o.value = h.id
    o.textContent = h.name
    select.appendChild(o)
  })
}

export function renderHeroInfo(container: HTMLElement, hero?: Hero) {
  container.innerHTML = ''
  if (!hero) return
  const title = document.createElement('h2')
  title.textContent = hero.name
  container.appendChild(title)
  const p = document.createElement('p')
  p.textContent = `Die faces: ${hero.customDieFaces.join(', ')}`
  container.appendChild(p)
}

export function renderDiceControls(container: HTMLElement, hero?: Hero) {
  container.innerHTML = ''
  const title = document.createElement('h2')
  title.textContent = 'Five Dice'
  container.appendChild(title)

  if (!hero) {
    const note = document.createElement('p')
    note.textContent = 'Select a hero first.'
    container.appendChild(note)
    return
  }

  const diceRow = document.createElement('div')
  diceRow.className = 'dice-row'

  // Each die: selected die number (1-6) or null for random
  const selected: Array<number | null> = [null, null, null, null, null]

  for (let d = 0; d < 5; d++) {
    const dieBox = document.createElement('div')
    dieBox.className = 'die-box'

    const dieLabel = document.createElement('div')
    dieLabel.className = 'die-label'
    dieLabel.textContent = `Die ${d + 1}`
    dieBox.appendChild(dieLabel)

    const faceButtons = document.createElement('div')
    faceButtons.className = 'face-buttons'

    // Random toggle
    const randomBtn = document.createElement('button')
    randomBtn.textContent = 'Random'
    randomBtn.className = 'random-btn active'
    faceButtons.appendChild(randomBtn)

    randomBtn.onclick = () => {
      selected[d] = null
      updateDieUI()
    }

    // Die numbers 1-6
    for (let num = 1; num <= 6; num++) {
      const btn = document.createElement('button')
      btn.textContent = String(num)
      btn.title = `Face: ${hero.customDieFaces[num - 1]}`
      btn.className = 'face-btn'
      btn.onclick = () => {
        selected[d] = num
        updateDieUI()
      }
      faceButtons.appendChild(btn)
    }

    dieBox.appendChild(faceButtons)
    diceRow.appendChild(dieBox)

    function updateDieUI() {
      faceButtons.querySelectorAll('button').forEach(b => b.classList.remove('active'))
      if (selected[d] === null) randomBtn.classList.add('active')
      else randomBtn.classList.remove('active')
      faceButtons.querySelectorAll('.face-btn').forEach((b: Element) => {
        const el = b as HTMLButtonElement
        if (parseInt(el.textContent!) === selected[d]) el.classList.add('active')
        else el.classList.remove('active')
      })
    }
  }

  container.appendChild(diceRow)

  // Return a function to read current selection
  return () => selected.slice()
}

export function renderResults(container: HTMLElement, results: { ability: Ability, probability: number, activations: number }[]) {
  container.innerHTML = ''
  const title = document.createElement('h2')
  title.textContent = 'Results (10000 Trials)'
  container.appendChild(title)

  if (results.length === 0) {
    const empty = document.createElement('p')
    empty.textContent = 'No abilities to display.'
    container.appendChild(empty)
    return
  }

  // sort by highest probability first
  const sorted = results.slice().sort((a, b) => b.probability - a.probability)

  const table = document.createElement('table')
  table.className = 'results-table'

  // Header row
  const headerRow = document.createElement('tr')
  const headers = ['Ability Name', 'Result', 'Required Rolls', 'Description' ]
  headers.forEach(h => {
    const th = document.createElement('th')
    th.textContent = h
    headerRow.appendChild(th)
  })
  table.appendChild(headerRow)

  // Data rows (sorted by probability desc)
  sorted.forEach(r => {
    const row = document.createElement('tr')

    // Ability name
    const nameCell = document.createElement('td')
    nameCell.textContent = r.ability.name
    row.appendChild(nameCell)

    // Result
    const resultCell = document.createElement('td')
    resultCell.textContent = `${(r.probability * 100).toFixed(2)}%`
    row.appendChild(resultCell)

    // Required rolls
    const requiredCell = document.createElement('td')
    requiredCell.textContent = formatRequiredRolls(r.ability.condition)
    row.appendChild(requiredCell)

    // Description
    const descCell = document.createElement('td')
    descCell.textContent = r.ability.condition.description || '—'
    row.appendChild(descCell)

    table.appendChild(row)
  })

  container.appendChild(table)
}

function formatRequiredRolls(condition: AbilityCondition): string {
  if (condition.straightType === 'smallStraight') {
    return 'Small Straight'
  }
  if (condition.straightType === 'largeStraight') {
    return 'Large Straight'
  }

  if (condition.requiredFaces) {
    const faces = Object.entries(condition.requiredFaces)
      .map(([face, count]) => `${count}× ${face}`)
      .join(', ')
    return faces
  }

  if (condition.anyOfFaces && condition.anyOfFaces.length > 0) {
    return `Any of: ${condition.anyOfFaces.join(', ')}`
  }

  return '—'
}
