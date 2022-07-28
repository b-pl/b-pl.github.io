import SlotsGame from "./SlotsGame.js"

const runScript = () => {
  const slotsGame = new SlotsGame()
  slotsGame.init()
}

window.addEventListener('load', runScript)