import { heroes } from './heroes'
import { createApp, populateHeroOptions, renderHeroInfo, renderDiceControls, renderResults, renderModifiers, renderLogs } from './ui'
import { TRIALS } from './constants'

const root = document.getElementById('app')!
const ui = createApp(root)
populateHeroOptions(ui.heroSelect, heroes)

let currentHero = undefined as any
let getSelectedDice: (() => Array<number | null>) | undefined
let getModifiers = () => ({ sixItEnabled: false })

ui.heroSelect.onchange = () => {
  const id = (ui.heroSelect as HTMLSelectElement).value
  currentHero = heroes.find(h => h.id === id)
  renderHeroInfo(ui.heroInfo, currentHero)
  const getter = renderDiceControls(ui.diceArea, currentHero)
  getSelectedDice = getter as any
  const mods = renderModifiers(ui.modifiersArea)
  getModifiers = () => ({ sixItEnabled: mods.sixItEnabled() })
}

ui.rollBtn.onclick = async () => {
  ui.results.innerHTML = `Running ${TRIALS} trials...`
  if (!currentHero) return
  const fixed = getSelectedDice ? getSelectedDice() : [null, null, null, null, null]
  const mods = getModifiers()
  const loggingEnabled = ui.loggingCheckbox.checked
  // dynamic import simulate to avoid bundling order issues
  const mod = await import('./odds')
  const res = mod.simulate(currentHero, fixed, TRIALS, mods.sixItEnabled, loggingEnabled)
  renderLogs(ui.logsArea, res.initialRolls)
  renderResults(ui.results, res.results)
}
