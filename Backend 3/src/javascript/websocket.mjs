/* eslint-disable no-undef */
// eslint-disable-next-line import/no-absolute-path
import '/socket.io/socket.io.js'
import main from './main.mjs'
const URL = 'http://localhost:3000'

main.createHome(true)

const Socket = {
  socket: null,
  init: async function () {
    if (this.socket === null) {
      try {
        this.socket = io(URL)
      } catch (error) {
        console.error('An error occured when connecting to the server', error)
      }
      this.socket.on('connect', () => {
        console.log('Successful connection to the server with the ID: ' + this.socket.id)
      })
    }
    return this.socket
  }
}

const socket = await Socket.init()
socket.on('connect', () => {
  sessionStorage.setItem('socketId', socket.id)
  console.log('Successful connection to the server with the ID: ' + socket.id)
})

socket.on('disconnect', () => {
  console.log('Server has been disconnected.')
})

socket.on('message', (message) => {
  const notification = document.getElementById('flashMessage')
  let messageTxt = ''

  switch (message.object_kind) {
    case 'issue':
      messageTxt = `A new update exists at the ${message.project.name} project. The update is related to this issue: ${message.object_attributes.title}`
      break
    case 'push':
      messageTxt = `A new project with the name ${message.project.name} was created`
      break
    case 'note':
      messageTxt = `A new comment exists in the ${message.project.name} project. The comment is related to this issue: ${message.issue.title}`
      break
    default:
      messageTxt = 'Message type is unkown'
  }
  notification.innerHTML = messageTxt
  notification.style.display = 'flex'
  setTimeout(() => {
    notification.style.display = 'none'
  }, 12000)
})

export default socket
