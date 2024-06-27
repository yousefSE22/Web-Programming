/* eslint-disable no-unused-vars */
import * as chat from './chat.js'
import * as mem from './memory-game.js'
import * as cus from './custom-app.js'

let zIndexCounter = 1
const temp = document.querySelectorAll('.icon')

temp[0].addEventListener('click', () => {
  mem.openMemoryGame()
})

temp[1].addEventListener('click', () => {
  chat.openChat()
})

temp[2].addEventListener('click', () => {
  cus.openCustomApp()
})
/**
 * Creates and opens a new window with the specified title, content, and application ID.
 * @param {string} title - The title of the window.
 * @param {string} content - The HTML content of the window.
 * @param {string} appId - The application ID for the window.
 * @returns {HTMLElement} - The created window element.
 */
export function createAndOpenWindow (title, content, appId) {
  const newWindow = document.createElement('div')
  newWindow.className = 'window'
  newWindow.classList.add(appId)
  newWindow.style.zIndex = zIndexCounter++
  newWindow.innerHTML = `
        <div class="window-header">
            <span class="title">${title}</span>
            <span class="close-btn" onclick="closeWindow(this)">X</span>
        </div>
        <div class="window-content">
            ${content}
        </div>
    `

  document.getElementById('desktop').appendChild(newWindow)
  const leftOffset = 50 + (zIndexCounter - 1) * 20
  const topOffset = 50 + (zIndexCounter - 1) * 20

  newWindow.style.left = leftOffset + 'px'
  newWindow.style.top = topOffset + 'px'

  makeDraggable(newWindow)
  newWindow.querySelector('.close-btn').addEventListener('click', () => newWindow.remove())
  return newWindow
}

// Drag and drop functionality
let active = false
let currentX
let currentY
let initialX
let initialY

document.querySelectorAll('.window-header').forEach(header => {
  header.addEventListener('mousedown', (e) => {
    active = true
    initialX = e.clientX
    initialY = e.clientY
  })

  header.addEventListener('mouseup', () => {
    active = false
  })

  header.addEventListener('mousemove', (e) => {
    if (active) {
      e.preventDefault()
      currentX = initialX - e.clientX
      currentY = initialY - e.clientY
      initialX = e.clientX
      initialY = e.clientY

      const window = header.closest('.window')
      const rect = window.getBoundingClientRect()

      window.style.top = (window.offsetTop - currentY) + 'px'
      window.style.left = (window.offsetLeft - currentX) + 'px'

      // Keep the window within the desktop bounds
      if (rect.top < 0) {
        window.style.top = 0 + 'px'
      }
      if (rect.left < 0) {
        window.style.left = 0 + 'px'
      }
      if (rect.bottom > window.innerHeight) {
        window.style.top = (window.innerHeight - rect.height) + 'px'
      }
      if (rect.right > window.innerWidth) {
        window.style.left = (window.innerWidth - rect.width) + 'px'
      }
    }
  })
})

/**
 * Makes an HTML element draggable.
 * @param {HTMLElement} elem - The HTML element to make draggable.
 */
function makeDraggable (elem) {
  let pos1 = 0
  let pos2 = 0
  let pos3 = 0
  let pos4 = 0

  const bringToFront = () => {
    // Bring the element to the front by increasing its zIndex
    elem.style.zIndex = zIndexCounter++
  }

  const dragMouseDown = (e) => {
    e = e || window.event
    e.preventDefault()

    // Call bringToFront to bring the window to the front when clicked
    bringToFront()

    // Get the initial mouse cursor position
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    document.onmousemove = elementDrag
  }

  if (elem.querySelector('.title-bar')) {
    // If .title-bar exists, bind the drag to this element
    elem.querySelector('.title-bar').onmousedown = dragMouseDown
  } else {
    // Otherwise, the whole element is draggable
    elem.onmousedown = dragMouseDown
  }

  const elementDrag = (e) => {
    e = e || window.event
    e.preventDefault()

    // Calculate the new cursor position
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY

    // Set the element's new position with vertical boundary constraints
    let newTop = elem.offsetTop - pos2
    let newLeft = elem.offsetLeft - pos1

    // Prevent dragging off the left or right of the screen
    if (newLeft < 0) newLeft = 0
    if (newLeft + elem.offsetWidth > window.innerWidth) {
      newLeft = window.innerWidth - elem.offsetWidth
    }

    // Prevent dragging below a certain vertical point (e.g., above the page bottom)
    const maxTop = window.innerHeight - elem.offsetHeight
    if (newTop > maxTop) newTop = maxTop
    const minTop = 0

    // Ensure that the new top position is within the bounds of the desktop
    if (newTop < minTop) {
      newTop = minTop
    } else if (newTop > maxTop) {
      newTop = maxTop
    }

    elem.style.top = newTop + 'px'
    elem.style.left = newLeft + 'px'
  }

  const closeDragElement = () => {
    // Stop moving when the mouse button is released
    document.onmouseup = null
    document.onmousemove = null
  }
}

/**
 * Closes a window by hiding it based on the provided window ID.
 * @param {string} windowId - The ID of the window to be closed.
 */
export function closeWindow (windowId) {
  const windowElement = document.getElementById(windowId)
  if (windowElement) {
    windowElement.style.display = 'none'
  } else {
    console.error(`Element with ID ${windowId} not found.`)
  }
}
