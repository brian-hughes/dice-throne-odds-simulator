import { heroes } from './heroes'
import { createApp, populateHeroOptions, renderHeroInfo, renderDiceControls, renderResults } from './ui'

const root = document.getElementById('app')!
const ui = createApp(root)
populateHeroOptions(ui.heroSelect, heroes)

let currentHero = undefined as any
let getSelectedDice: (() => Array<number | null>) | undefined

ui.heroSelect.onchange = () => {
  const id = (ui.heroSelect as HTMLSelectElement).value
  currentHero = heroes.find(h => h.id === id)
  renderHeroInfo(ui.heroInfo, currentHero)
  const getter = renderDiceControls(ui.diceArea, currentHero)
  getSelectedDice = getter as any
}

ui.rollBtn.onclick = async () => {
  ui.results.innerHTML = 'Running 10000 trials...'
  if (!currentHero) return
  const fixed = getSelectedDice ? getSelectedDice() : [null, null, null, null, null]
  // dynamic import simulate to avoid bundling order issues
  const mod = await import('./odds')
  const res = mod.simulate(currentHero, fixed, 10000)
  renderResults(ui.results, res)
}
