// index.js
import scrape from './scraper.mjs'
import createReservations from './reservations.js'

const initUrl = process.argv[2]

createReservations(await scrape(initUrl))
