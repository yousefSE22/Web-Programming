import express from 'express'
import websocket from '../model/websocket.mjs'
import fetching from '../router/fetching.mjs'

const mainRouting = express.Router()

mainRouting.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'src/html' })
})

mainRouting.get('/home', (req, res) => {
  res.sendFile('/index.html', { root: 'src/html' })
})

mainRouting.post('/webhooks', async (req, res) => {
  res.status(200).send('OK')
  websocket.notify('message', req.body)
  console.log(req.body.object_kind)
})
mainRouting.use('/get', fetching)

export default mainRouting
