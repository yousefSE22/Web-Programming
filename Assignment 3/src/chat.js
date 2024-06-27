/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// chat.js

import * as app from './app.js'

console.log('Chat Application Logic')

/**
 *
 */
export function openChat () {
  const chatContent = `<div id="chatMessages"></div>
                         <input type="text" id="usernameInput" placeholder="Enter Name">
                         <input type="text" id="messageInput" placeholder="Enter message">
                         <button id="sendButton">Send</button>`

  const window = app.createAndOpenWindow('Chat', chatContent, 'chat-app')
  const sendButton = window.querySelector('#sendButton')

  sendButton.addEventListener('click', () => sendMessage(window))

  window.querySelector('#usernameInput').addEventListener('click', (e) => {
    e.target.focus()
  })

  window.querySelector('#messageInput').addEventListener('click', (e) => {
    e.target.focus()
  })
}
// WebSocket connection
const socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')
const apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'

// Event listener for when the WebSocket connection is opened
socket.addEventListener('open', (event) => {
  console.log('WebSocket connection opened:', event)
})

// Event listener for when a message is received from the server
socket.addEventListener('message', (event) => {
  const messageData = JSON.parse(event.data)
  displayMessage(messageData)
})

/**
 * Sends a message to the server using WebSocket.
 * @param {HTMLElement} chatWindow - The chat window element containing input fields.
 * @throws {Error} Throws an error if either username or message is not provided.
 * @returns {void}
 */
function sendMessage (chatWindow) {
  const usernameInput = chatWindow.querySelector('#usernameInput')
  const messageInput = chatWindow.querySelector('#messageInput')

  const username = usernameInput.value
  const messageText = messageInput.value

  if (!username || !messageText) {
    alert('Please enter both username and message.')
    return
  }

  const messageData = {
    type: 'message',
    data: messageText,
    username,
    channel: 'general',
    key: apiKey
  }

  socket.send(JSON.stringify(messageData))

  // Clear the message input
  messageInput.value = ''
}

/**
 * Displays a message in all open chat windows.
 * @param {object} messageData - The data object containing message details.
 */
function displayMessage (messageData) {
  const chatWindows = document.querySelectorAll('.chat-app')
  if (messageData.type === 'heartbeat') {
    return // Don't display heartbeat messages
  }

  chatWindows.forEach((window) => {
    const chatMessages = window.querySelector('#chatMessages')
    const messageElement = document.createElement('div')
    messageElement.innerHTML = `<strong>${messageData.username}:</strong> ${messageData.data}`
    chatMessages.appendChild(messageElement)
  })
}

/**
 * Closes the specified window.
 * @param {string} windowId - The ID of the window to be closed.
 */
export function closeWindow (windowId) {
  const windowElement = document.getElementById(windowId)
  if (windowElement) {
    windowElement.style.display = 'none'
  }
}
