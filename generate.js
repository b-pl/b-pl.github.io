const _generateReels = () => {
  const array_1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const array_2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const array_3 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const reels = {
    first: array_1.sort((a, b) => 0.5 - Math.random()),
    second: array_2.sort((a, b) => 0.5 - Math.random()),
    third: array_3.sort((a, b) => 0.5 - Math.random())
  }
  
  return reels
}

const _generateSets = (reels) => {
  let sets = []
  let max = 9
  const min = 0

  for (const reel in reels) {
    let set = []
    for (let i = 0; i < 3; i++) {
      let randomIndex = Math.floor(Math.random() * (max - min + 1) ) + min;
      set.push(reels[reel][randomIndex])
      reels[reel].splice(randomIndex, 1)
      max--
    }
    sets.push(set)
  }

  return sets
}

const _setSymbolsPositions = (sets) => {
  const positions_1 = [0, 1, 2];
  const positions_2 = [0, 1, 2];
  const positions_3 = [0, 1, 2];
  const positions = [positions_1.sort((a, b) => 0.5 - Math.random()),
                      positions_2.sort((a, b) => 0.5 - Math.random()), 
                      positions_3.sort((a, b) => 0.5 - Math.random())
                    ]

  let finalResults = []
  for (set of sets) {
    let result = []
    let j = 0
    for (let i = 0; i < 3; i++) {
      result[positions[j][i]] = set[i]
    }
    j++
    finalResults.push(result)
  }

  return finalResults
}

const _fillSlots = (results) => {
  for (let i = 0; i < 9; i++) {
    document.querySelector(`#slot-${i}`).textContent = results[i]
  }
}

// Init na onload
const init = () => {
  const reels = _generateReels()
  const sets = _generateSets(reels)
  const results = _setSymbolsPositions(sets).join().split(',')
  _fillSlots(results)
}

init()
document.querySelector('.slots__button').addEventListener('click', init)