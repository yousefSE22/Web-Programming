import webSocket from '../model/websocket.mjs'
import http from 'http'
import mainRouting from '../router/mainRouting.mjs'
import cors from 'cors'
import loggar from 'morgan'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()
const app = express()

const httpServer = http.createServer(app)
webSocket.init(httpServer)

app.use('/socket.io-client', express.static('node_modules/socket.io-client/dist'))
app.use(cors({ origin: '*', credentials: true }))
app.use(loggar('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/css', express.static('src/css'))
app.use('/javascript', express.static('src/javascript'))
app.use('/html', express.static('src/html'))
app.use(express.static('public'))
app.use('/', mainRouting)

const port = process.env.PORT || 3000
const server = httpServer.listen(port, () => {
  console.log(`Server is running on ${port}`)
})

export default server
