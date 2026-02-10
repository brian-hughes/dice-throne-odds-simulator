import type { Hero, Face, Ability, AbilityCondition } from './heroes'
import { simulate } from './odds'
import { TRIALS } from './constants'

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

  // Logging toggle
  const loggingLabel = document.createElement('label')
  loggingLabel.className = 'logging-toggle'
  const loggingCheckbox = document.createElement('input')
  loggingCheckbox.type = 'checkbox'
  loggingCheckbox.id = 'logging-toggle'
  loggingLabel.appendChild(loggingCheckbox)
  const loggingText = document.createElement('span')
  loggingText.textContent = 'Log Rolls'
  loggingLabel.appendChild(loggingText)
  controls.appendChild(loggingLabel)

  const heroInfo = document.createElement('div')
  heroInfo.id = 'hero-info'
  root.appendChild(heroInfo)

  const diceArea = document.createElement('div')
  diceArea.id = 'dice-area'
  root.appendChild(diceArea)

  const modifiersArea = document.createElement('div')
  modifiersArea.id = 'modifiers-area'
  root.appendChild(modifiersArea)

  const rollBtn = document.createElement('button')
  rollBtn.textContent = `Run ${TRIALS} Trials`
  rollBtn.className = 'roll-button'
  root.appendChild(rollBtn)

  const logsArea = document.createElement('div')
  logsArea.id = 'logs-area'
  root.appendChild(logsArea)

  const results = document.createElement('div')
  results.id = 'results'
  root.appendChild(results)

  return { heroSelect, heroInfo, diceArea, modifiersArea, rollBtn, logsArea, results, loggingCheckbox }
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

  // Display die faces with icons
  const facesContainer = document.createElement('div')
  facesContainer.className = 'hero-faces'

  hero.customDieFaces.forEach((face, idx) => {
    const faceItem = document.createElement('div')
    faceItem.className = 'hero-face-item'

    const dieIcon = document.createElement('div')
    dieIcon.className = `dice-icon dice-${idx + 1}`
    faceItem.appendChild(dieIcon)

    const faceLabel = document.createElement('span')
    faceLabel.className = 'hero-face-label'
    faceLabel.textContent = face
    faceItem.appendChild(faceLabel)

    facesContainer.appendChild(faceItem)
  })

  container.appendChild(facesContainer)
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
  title.textContent = `Results (${TRIALS} Trials)`
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

export function renderModifiers(container: HTMLElement): { sixItEnabled: () => boolean } {
  container.innerHTML = ''
  const title = document.createElement('h2')
  title.textContent = 'Dice Modifiers'
  container.appendChild(title)

  const modifiersBox = document.createElement('div')
  modifiersBox.className = 'modifiers-box'

  // Six-It toggle
  const sixItLabel = document.createElement('label')
  sixItLabel.className = 'modifier-toggle'

  const sixItCheckbox = document.createElement('input')
  sixItCheckbox.type = 'checkbox'
  sixItCheckbox.id = 'six-it-toggle'
  sixItLabel.appendChild(sixItCheckbox)

  const sixItText = document.createElement('span')
  sixItText.textContent = 'Six-It: Switch any one die to 6'
  sixItLabel.appendChild(sixItText)

  modifiersBox.appendChild(sixItLabel)
  container.appendChild(modifiersBox)

  return {
    sixItEnabled: () => sixItCheckbox.checked
  }
}

export function renderLogs(container: HTMLElement, initialRolls?: number[][]) {
  container.innerHTML = ''
  
  if (!initialRolls || initialRolls.length === 0) {
    return
  }

  const title = document.createElement('h2')
  title.textContent = 'Dice Rolls Log'
  container.appendChild(title)

  const logsBox = document.createElement('div')
  logsBox.className = 'logs-box'

  initialRolls.forEach((roll, idx) => {
    const line = document.createElement('div')
    line.className = 'log-line'
    line.textContent = `Trial ${idx + 1}: ${roll.join(', ')}`
    logsBox.appendChild(line)
  })

  container.appendChild(logsBox)
}

