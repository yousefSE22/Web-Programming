/* eslint-disable no-unused-vars */
import * as app from './app.js'

export class MemoryGame {
  constructor () {
    this.cardSymbols = ['🐱', '🐶', '🐭', '🐰', '🐯', '🦁', '🐻', '🐷']
    this.totalPairs = this.cardSymbols.length
    this.matchedPairs = 0
    this.firstCard = null
    this.secondCard = null
    this.lockBoard = false
    this.startTime = null
    this.gridSizeRows = 4
    this.gridSizeColumns = 4
  }

  handleKeyPress (event, card) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.flipCard(card)
    } else if (event.key.startsWith('Arrow')) {
      this.moveFocus(event.key)
    }
  }

  moveFocus (key) {
    const cards = document.querySelectorAll('.card')
    const currentCard = document.activeElement

    let nextIndex

    switch (key) {
      case 'ArrowRight':
        nextIndex = Array.from(cards).indexOf(currentCard) + 1
        break
      case 'ArrowLeft':
        nextIndex = Array.from(cards).indexOf(currentCard) - 1
        break
      case 'ArrowDown':
        nextIndex = Array.from(cards).indexOf(currentCard) + this.gridSizeColumns
        break
      case 'ArrowUp':
        nextIndex = Array.from(cards).indexOf(currentCard) - this.gridSizeColumns
        break
    }

    this.setFocus(cards, nextIndex)
  }

  flipFocusedCard () {
    const focusedCard = document.querySelector('.card.focused')
    if (focusedCard) {
      this.flipCard(focusedCard)
    }
  }

  setFocus (cards, index) {
    if (index >= 0 && index < cards.length) {
      const focusedCard = cards[index]

      if (document.querySelector('.card.focused')) {
        document.querySelector('.card.focused').classList.remove('focused')
      }

      focusedCard.classList.add('focused')
      focusedCard.focus()
    }
  }

  setGridSize (rows, columns, buttonElement) {
    this.gridSizeRows = rows
    this.gridSizeColumns = columns
    this.totalPairs = (this.gridSizeRows * this.gridSizeColumns) / 2

    this.startMemoryGame(buttonElement)
  }

  isGameOver () {
    return this.matchedPairs === this.totalPairs
  }

  endMemoryGame () {
    const endTime = new Date()
    const totalTime = (endTime - this.startTime) / 1000

    alert(`Congratulations! You've completed the game in ${totalTime.toFixed(2)} seconds.`)
  }

  shuffle (array) {
    let currentIndex = array.length
    let randomIndex, tempValue

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--

      // Swap elements
      tempValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = tempValue
    }

    return array
  }

  resetBoard () {
    [this.firstCard, this.secondCard] = [null, null]
    this.lockBoard = false
  }

  startMemoryGame (buttonElement) {
    this.matchedPairs = 0
    this.startTime = new Date()
    const memoryGameWindow = buttonElement.closest('.window')
    const gridContainer = memoryGameWindow.querySelector('#memoryGameGrid')
    const cards = gridContainer.querySelectorAll('.card')

    cards.forEach((card, index) => {
      card.tabIndex = 0
      card.addEventListener('click', () => this.flipCard(card))
      card.addEventListener('keydown', (e) => this.handleKeyPress(e, card))
    })
    // Clear the existing grid
    gridContainer.innerHTML = ''

    // Generate a unique set of symbols for the current game
    const uniqueSymbols = [...new Set(this.shuffle(this.cardSymbols))]

    // Take only as many symbols as needed for the grid
    const selectedSymbols = uniqueSymbols.slice(0, this.totalPairs)

    // Duplicate the symbols to ensure pairs
    const shuffledSymbols = this.shuffle(selectedSymbols.concat(selectedSymbols))

    // Create cards and add them to the grid
    for (let i = 0; i < this.totalPairs * 2; i++) {
      const card = document.createElement('div')
      card.classList.add('card')
      card.dataset.symbol = shuffledSymbols[i]

      const cardContent = document.createElement('span')
      cardContent.classList.add('card-content')
      cardContent.innerText = '?'
      card.appendChild(cardContent)

      card.addEventListener('click', () => this.flipCard(card))
      card.addEventListener('keydown', (e) => this.handleKeyPress(e, card))

      card.tabIndex = 0 // Ensure cards are focusable

      gridContainer.appendChild(card)
    }

    // Focus the first card in the grid
    const firstCard = gridContainer.querySelector('.card')
    if (firstCard) {
      firstCard.focus()
    }

    // Set the grid size dynamically
    gridContainer.style.gridTemplateColumns = `repeat(${this.gridSizeColumns}, 1fr)`
    gridContainer.style.gridTemplateRows = `repeat(${this.gridSizeRows}, 1fr)`
  }

  flipCard (clickedCard) {
    if (this.lockBoard || clickedCard === this.firstCard) return

    clickedCard.classList.add('flipped')
    const cardContent = clickedCard.querySelector('.card-content')
    cardContent.innerText = clickedCard.dataset.symbol

    if (!this.firstCard) {
      this.firstCard = clickedCard
      return
    }

    this.secondCard = clickedCard
    this.checkForMatch()
  }

  disableCards () {
    this.firstCard.removeEventListener('click', () => this.flipCard(this.firstCard))
    this.secondCard.removeEventListener('click', () => this.flipCard(this.secondCard))
    this.resetBoard()
  }

  checkForMatch () {
    const isMatch = this.firstCard.dataset.symbol === this.secondCard.dataset.symbol

    if (isMatch) {
      this.disableCards()
      this.matchedPairs++

      if (this.isGameOver()) {
        this.endMemoryGame()
      }
    } else {
      this.unflipCards()
    }
  }

  unflipCards () {
    this.lockBoard = true

    setTimeout(() => {
      this.firstCard.classList.remove('flipped')
      this.secondCard.classList.remove('flipped')

      const firstCardContent = this.firstCard.querySelector('.card-content')
      const secondCardContent = this.secondCard.querySelector('.card-content')
      firstCardContent.innerText = '?'
      secondCardContent.innerText = '?'

      this.resetBoard()
    }, 1000)
  }

  restartMemoryGame (buttonElement) {
    const memoryGameWindow = buttonElement.closest('.window')
    this.startMemoryGame(memoryGameWindow)
  }
}

// Create instances of MemoryGame for each window
const memoryGameWindows = []

/**
 *
 */

/**
 *
 */
export function openMemoryGame () {
  const memoryGame = new MemoryGame()
  const memoryGameWindow = app.createAndOpenWindow('Memory Game', '', 'memory-game-app')
  memoryGameWindows.push(memoryGame)

  const memoryGameContent = `
    <div class="window-header">
      <span class="title">Memory Game</span>
      <span class="close-btn">X</span>
    </div>
    <div id="memoryGameGrid" class="memory-game-grid"></div>
    <button id="grid4x4">4x4 Grid</button>
    <button id="grid4x2">4x2 Grid</button>
    <button id="grid2x2">2x2 Grid</button>
  `

  memoryGameWindow.innerHTML = memoryGameContent

  const grid4x4Button = memoryGameWindow.querySelector('#grid4x4')
  const grid4x2Button = memoryGameWindow.querySelector('#grid4x2')
  const grid2x2Button = memoryGameWindow.querySelector('#grid2x2')

  grid4x4Button.addEventListener('click', () => memoryGame.setGridSize(4, 4, memoryGameWindow))
  grid4x2Button.addEventListener('click', () => memoryGame.setGridSize(4, 2, memoryGameWindow))
  grid2x2Button.addEventListener('click', () => memoryGame.setGridSize(2, 2, memoryGameWindow))

  // Add event listener to close button
  const closeButton = memoryGameWindow.querySelector('.close-btn')
  closeButton.addEventListener('click', () => closeWindow(memoryGameWindow))

  memoryGame.setGridSize(4, 4, memoryGameWindow)
}

/**
 * Closes the specified window by setting its display style to 'none'.
 * @param {HTMLElement} windowElement - The HTML element representing the window to be closed.
 * @returns {void}
 */
function closeWindow (windowElement) {
  if (windowElement) {
    windowElement.style.display = 'none'
  }
}
