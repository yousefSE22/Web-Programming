import express from 'express'
import logger from 'morgan'
import session from 'express-session'
import main from './router/main.mjs'
import { databaseController } from './controller/databaseController.mjs'

console.log('Connecting to MongoDB...')
try {
  await databaseController.connectDatabase()
} catch (err) {
  console.log('Error connecting to MongoDB', err)
}

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
  cookie: {
    maxAge: 1800000
  },
  resave: false,
  saveUninitialized: true,
  secret: 'keyboard cat'
}))

app.set('view engine', 'ejs')

app.use(logger('dev'))

app.set('views', 'src/views')

app.use('/css', express.static('src/css'))

app.use('/public', express.static('public'))
app.use('/', main)

const port = 3000
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
