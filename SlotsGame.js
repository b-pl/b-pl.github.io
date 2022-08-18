class SlotsGame {
  constructor() {
    this.reels = this.#generateReels()
    this.settings = {
      multipliers: {
        0: '1',
        1: '3',
        2: '5',
        4: '10'
      },
      stakes: [
        0.25,
        0.50,
        1.00,
        2.00,
        5.00,
        10.00
      ],
      game: {
        stake: undefined,
        balance: localStorage.getItem('balance') ? localStorage.getItem('balance') : 100
      }
    }
  }

  #setSettings() {
    return this.#setStake(localStorage.getItem('stake') && this.settings.stakes.find(el => el == localStorage.getItem('stake')) ? localStorage.getItem('stake') : 0.25)
  }

  #setBalance(amount) {
    return this.settings.game.balance = amount
  }

  getBalance() {
    return parseFloat(this.settings.game.balance).toFixed(2)
  }

  #setStake(stake) {
    return this.settings.game.stake = stake
  }

  getStake() {
    return parseFloat(this.settings.game.stake).toFixed(2)
  }

  #generateReels() {
    const array_1 = [0, 1, 2, 0, 1, 2, 0, 1, 2, 4, 4];
    const array_2 = [0, 1, 2, 0, 1, 2, 0, 1, 2, 4, 4];
    const array_3 = [0, 1, 2, 0, 1, 2, 0, 1, 2, 4, 4];
    const reels = {
      first: array_1.sort((a, b) => 0.5 - Math.random()),
      second: array_2.sort((a, b) => 0.5 - Math.random()),
      third: array_3.sort((a, b) => 0.5 - Math.random())
    }
  
    return reels
  }

  // Set is vertival line (reel) in which numbers are laid
  #generateSets(reels) {
    let sets = []
    let max = 9
    const min = 0
    let copyReels = JSON.parse(JSON.stringify(reels))
    
  
    for (const reel in copyReels) {
      let set = []
      for (let i = 0; i < 3; i++) {
        let randomIndex = Math.floor(Math.random() * (max - min + 1) ) + min;
        set.push(copyReels[reel][randomIndex])
        copyReels[reel].splice(randomIndex, 1)
        max--
      }
      sets.push(set)
    }
  
    return sets
  }

  #setSymbolsPositions(sets) {
    const positions_1 = [0, 1, 2];
    const positions_2 = [0, 1, 2];
    const positions_3 = [0, 1, 2];
    const positions = [positions_1.sort((a, b) => 0.5 - Math.random()),
                        positions_2.sort((a, b) => 0.5 - Math.random()), 
                        positions_3.sort((a, b) => 0.5 - Math.random())
                      ]
  
    let finalResults = []
    for (const set of sets) {
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

  // #fillSlots(results) {
  //   for (let i = 0; i < 9; i++) {
  //     document.querySelector(`#slot-${i}`).textContent = results[i]
  //   }
  // }

  #fillSlots(results) {
    const images = {
      0: '/gfx/apple.png',
      1: '/gfx/cherry.png',
      2: '/gfx/lemon.png',
      4: '/gfx/seven.png'
    }

    for (let i = 0; i < 9; i++) {
      let img = document.createElement('img')
      img.setAttribute('src', images[results[i]])
      document.querySelector(`#slot-${i}`).textContent = ''
      document.querySelector(`#slot-${i}`).appendChild(img)
    }
  }

  spin() {
    // const reels = this.#generateReels()
    let stake = this.getStake()
    let currentBalance = this.getBalance()
    let afterBalance = currentBalance - stake
    if (afterBalance < 0) {
      return this.#createMessage({content: 'Not enough cash'})
    }
      
    console.log(`SPIN - stake = ${stake} current = ${currentBalance} after = ${afterBalance}`)
    this.#setBalance(afterBalance)
    this.showBalance()

    const sets = this.#generateSets(this.reels)
    const results = this.#setSymbolsPositions(sets).join().split(',')
    this.#fillSlots(results)

    this.#isWon(results)
  }

  // Winning lines
  // 0 3 6
  // 1 4 7
  // 2 5 8
  #isWon(results) {
    let lines = {
      isWon: false,
      winningNumbers: [],
      first: {
        isWon: false,
        winningNumber: undefined
      },
      second: {
        isWon: false,
        winningNumber: undefined
      },
      third: {
        isWon: false,
        winningNumber: undefined
      }
    }
    console.log(results)

    if (results[0] === results[3] && results[0] === results[6]) {
    console.log(results[0] + ' ' + results[3] + ' ' + results[6])
      lines.first.isWon = true
      lines.first.winningNumber = results[0]
      lines.isWon = true
      lines.winningNumbers.push(results[0])
    }

    if (results[1] === results[4] && results[1] === results[7]) {
      lines.second.isWon = true
      lines.second.winningNumber = results[1]
      lines.isWon = true
      lines.winningNumbers.push(results[1])
    }

    if (results[2] === results[5] && results[2] === results[8]) {
      lines.third.isWon = true
      lines.third.winningNumber = results[2]
      lines.isWon = true
      lines.winningNumbers.push(results[2])
    }

    console.log(lines)

    if (!lines.isWon) {
      console.log('not won')
      return false
    } else {
      let stake = this.getStake()
      let winnings = 0
      for (const number of lines.winningNumbers) {
        winnings += this.settings.multipliers[number] * stake
      }

      let balance = parseFloat(this.getBalance())
      balance += parseFloat(winnings)
      this.#setBalance(balance)
      // alert(`winnings = ${winnings}; typeof = ${typeof(winnings)}; balance = ${balance}; typeof = ${typeof(balance)}`)
      this.showBalance()
    }

    return true
  }

  showBalance() {
    document.querySelector('.balance__element--amount').textContent = this.getBalance()
  }

  showStake() {
    document.querySelector('.slots__button--currentStake').textContent = this.getStake()
  }

  #saveDataToLocalStorage() {
    localStorage.setItem('balance', this.getBalance())
    localStorage.setItem('stake', this.getStake())
  }

  #handleStakeIncrease() {
    let currentStake = this.getStake()
    let currentIndex = this.settings.stakes.findIndex(el => el == currentStake)
    if (this.settings.stakes[currentIndex + 1] === undefined)
      return false
    
    return this.#setStake(this.settings.stakes[currentIndex + 1])
  }

  #handleStakeDecrease() {
    let currentStake = this.getStake()
    let currentIndex = this.settings.stakes.findIndex(el => el == currentStake)
    if (this.settings.stakes[currentIndex - 1] === undefined)
      return false
    
    return this.#setStake(this.settings.stakes[currentIndex - 1])
  }

  // options = {
  //   bg_color,
  //   text_color,
  //   timeout,
  //   content
  // }
  #createMessage(options) {
    console.log(options)
    const template = document.querySelector('#template_message')
    const clone = template.content.cloneNode(true)
    const content = clone.querySelector('.template_content')

    clone.childNodes[1].id = 'info_message'
    // console.log(clone.childNodes[1])
    clone.childNodes[1].style.backgroundColor = options.bg_color != undefined ? options.bg_color : 'blue'
    clone.childNodes[1].style.color = options.text_color != undefined ? options.text_color : 'white'
    content.textContent = options.content

    document.querySelector('.container').appendChild(clone)

    const time = options.timeout != undefined ? options.timeout : '5000'
    setTimeout(() => {
      document.querySelector('#info_message').classList.add('--visible')
    }, 50)

    setTimeout(() => {
      document.querySelector('#info_message').classList.remove('--visible')
    }, time)

    setTimeout(() => {
      document.querySelector('#info_message').remove()
    }, time + 400)
  }

  createListeners() {
    document.querySelector('.slots__button--spin').addEventListener('click', () => this.spin())
    document.querySelector('.slots__button--increaseStake').addEventListener('click', () => {
      this.#handleStakeIncrease()
      this.showStake()
    })
    document.querySelector('.slots__button--decraseStake').addEventListener('click', () => {
      this.#handleStakeDecrease()
      this.showStake()
    })
    window.addEventListener('beforeunload', () => this.#saveDataToLocalStorage())
  }

  init() {
    this.#setSettings()
    this.#saveDataToLocalStorage()
    this.createListeners()
    this.showBalance()
    this.showStake()

    // DEBUG
    window.setStake = (stake) => {
      this._setStake(stake)
    }
    window.setBalance = (balance) => {
      this._setBalance(balance)
      let newB = this.getBalance()
      document.querySelector('.balance__element--amount').textContent = newB
    }
  }

  // DEBUG
  _setStake(stake) {
    this.settings.game.stake = stake
  }

  _setBalance(balance) {
    this.#setBalance(balance)
  }

  test() {
    let tab = []
    let equal = 0
    let bigprize = 0
    let small = 0
    let medium = 0
    let high = 0
    for (let i = 0; i < 1000; i++) {
      const reels = _generateReels()
      const sets = _generateSets(reels)
      const results = _setSymbolsPositions(sets).join().split(',')
      tab.push(results)
      // ALL WINS
      if (results[0] === results[3] && results[0] === results[6]) {
        equal++
      }
      if (results[1] === results[4] && results[1] === results[7]) {
        equal++
      } 
      if (results[2] === results[5] && results[2] === results[8]) {
        equal++
      }

      // BIG PRIZE
      if (results[0] === '4' && results[0] === results[3] && results[0] === results[6]) {
        bigprize++
      }
      if (results[1] === '4' && results[1] === results[4] && results[1] === results[7]) {
        bigprize++
      }
      if (results[2] === '4' && results[2] === results[5] && results[2] === results[8]) {
        bigprize++
      }

      // SMALL PRIZE
      if (results[0] === '1' && results[0] === results[3] && results[0] === results[6]) {
        small++
      }
      if (results[1] === '1' && results[1] === results[4] && results[1] === results[7]) {
        small++
      }
      if (results[2] === '1' && results[2] === results[5] && results[2] === results[8]) {
        small++
      }

      // MEDIUM PRIZE
      if (results[0] === '2' && results[0] === results[3] && results[0] === results[6]) {
        medium++
      }
      if (results[1] === '2' && results[1] === results[4] && results[1] === results[7]) {
        medium++
      }
      if (results[2] === '2' && results[2] === results[5] && results[2] === results[8]) {
        medium++
      }

      // HIGH PRIZE
      if (results[0] === '0' && results[0] === results[3] && results[0] === results[6]) {
        high++
      }
      if (results[1] === '0' && results[1] === results[4] && results[1] === results[7]) {
        high++
      }
      if (results[2] === '0' && results[2] === results[5] && results[2] === results[8]) {
        high++
      }
    }
    let equalPercentage = (equal / 1000) * 100
    let bigprizePercentage = (bigprize / 1000) * 100
    let smallPercentage = (small / 1000) * 100
    let mediumPercentage = (medium / 1000) * 100
    let highPercentage = (high / 1000) * 100
    // console.log(tab)
    console.log({equal})
    console.log({equalPercentage})
    console.log({bigprize})
    console.log({bigprizePercentage})
    console.log({small})
    console.log({smallPercentage})
    console.log({medium})
    console.log({mediumPercentage})
    console.log({high})
    console.log({highPercentage})
  }
}

export default SlotsGame