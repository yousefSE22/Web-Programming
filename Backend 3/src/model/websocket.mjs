import { Server } from 'socket.io'
const webSocket = {}

webSocket.io = null
webSocket.init = (httpServer) => {
  if (webSocket.io) {
    return
  }
  webSocket.io = new Server(httpServer, { cors: { origin: '*', methods: ['GET', 'POST'] } })
  webSocket.io.on('connecting', (socket) => {
  })
}

webSocket.getSocket = () => {
  return webSocket.io
}

webSocket.notify = (event, data) => {
  webSocket.io.emit(event, data)
}

export default webSocket
