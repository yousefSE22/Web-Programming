/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Custom application logic goes here
import * as app from './app.js'

console.log('Custom App Logic')

/**
 *
 */
export function openCustomApp () {
  const customAppContent = `
    <div id="customAppContent"></div>
    <button id="randomQuoteButton">Show Random Quote</button>
  `

  const customAppWindow = app.createAndOpenWindow('Custom App', customAppContent, 'custom-app')

  // Add event listener to the button
  const randomQuoteButton = customAppWindow.querySelector('#randomQuoteButton')
  randomQuoteButton.addEventListener('click', () => displayRandomQuote(customAppWindow))

  // Call the function to generate and display a random quote
  displayRandomQuote(customAppWindow)
}

// Array of fun and inspirational quotes
const quotes = [
  "Believe you can and you're halfway there. -Theodore Roosevelt",
  'The only limit to our realization of tomorrow will be our doubts of today. -Franklin D. Roosevelt',
  "Don't watch the clock; do what it does. Keep going. -Sam Levenson",
  'Success is not final, failure is not fatal: It is the courage to continue that counts. -Winston Churchill',
  "Your time is limited, don't waste it living someone else's life. -Steve Jobs",
  'The only way to do great work is to love what you do. -Steve Jobs',
  'In the middle of difficulty lies opportunity. -Albert Einstein',
  'The future belongs to those who believe in the beauty of their dreams. -Eleanor Roosevelt'
]

/**
 * Displays a random quote in the specified window's content area.
 * @param {HTMLElement} buttonElement - The button element that triggered the action.
 */
export function displayRandomQuote (buttonElement) {
  const customAppWindow = buttonElement.closest('.window')
  const quoteContainer = customAppWindow.querySelector('#customAppContent')
  quoteContainer.innerHTML = '' // Clear previous content

  // Create a quote element
  const quoteElement = document.createElement('div')
  quoteElement.classList.add('quote')
  quoteElement.innerText = getRandomQuote()

  // Append elements to the quote container
  quoteContainer.appendChild(quoteElement)
}

/**
 * Gets a random quote from the 'quotes' array.
 * @returns {string} A randomly selected quote.
 */
export function getRandomQuote () {
  const randomIndex = Math.floor(Math.random() * quotes.length)
  return quotes[randomIndex]
}
