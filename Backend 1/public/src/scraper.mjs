// scraper.mjs
import fetch from 'node-fetch'
import parser from 'node-html-parser'

/**
 * Scrapes the given URL, extracts data, and performs necessary operations.
 * @param {string} url - The starting URL
 * @returns {object} The collected and organized data containing calendar, movies, and dinner information.
 * @throws {Error} Throws an error
 */
async function scrape (url) {
  const extractedData = await extract(url, 'links')
  const links = extractedData[0]
  const names = extractedData[1]
  console.log('\x1b[32m', 'Scraping Started...', '\x1b[0m')

  const data = {}
  for (let index = 0; index < links.length; index++) {
    const caseSwitch = names[index].toLowerCase()
    switch (caseSwitch.toLowerCase()) {
      case 'calendar':
        data.calendar = await calendarScraper(links[index], 'Days Available')
        break

      case 'thecinema!':
        data.movies = await cinemaScraper(links[index], 'show times')
        break

      case "zeke'sbar!":
        data.dinner = await barScraper(links[index], names[index])
        break
      default:
        console.log(caseSwitch)
        break
    }
  }
  return data
}

/**
 * Fetch HTML content from the specified URL and parse it.
 * @param {string} url - The URL to fetch HTML content from.
 * @returns {object} The parsed HTML document.
 */
async function fetchHTML (url) {
  const website = await fetch(url)
  const doc = await website.text()
  return parser.parse(doc)
}

/**
 * Extract links and names from the HTML content of the specified URL.
 * @param {string} url - The URL to extract data from.
 * @param {string} name - The name of the data being extracted.
 * @returns {Array} An array containing extracted links and names.
 */
async function extract (url, name) {
  process.stdout.write('\x1b[33mScraping:' + name + '..............')

  const rootUrl = await fetchHTML(url)
  const anch = rootUrl.querySelectorAll('a')
  const links = anch.map((element) => element.rawAttrs)
  const names = anch.map((element) => element.textContent)

  for (let index = 0; index < links.length; index++) {
    links[index] = links[index].replace('href="', '')
    links[index] = links[index].replace('"', '')
    names[index] = names[index].split('\n').join('')
    names[index] = names[index].split(' ').join('')
  }
  return [links, names]
}

/**
 * Scrape calendar data from the specified URL.
 * @param {string} url - The URL to scrape calendar data from.
 * @param {string} name - The name of the calendar data.
 * @returns {object} An object containing scraped calendar data.
 */
async function calendarScraper (url, name) {
  const extractedData = await extract(url, name)
  const linkes = extractedData[0]
  const names = extractedData[1]
  console.log('\x1b[34m', 'OK!', '\x1b[0m')

  const calendar = {}

  for (let index = 0; index < linkes.length; index++) {
    calendar[names[index]] = await individualCalendarData(url + linkes[index], names[index])
  }
  return calendar
}

/**
 * Extract individual calendar data from the specified URL.
 * @param {string} url - The URL to fetch individual calendar data from.
 * @returns {object} An object containing extracted individual calendar data.
 */
async function individualCalendarData (url) {
  const str = await fetch(url)
  const txt = await str.text()
  const root = parser.parse(txt)
  const table = root.querySelector('table')

  const heads = table.querySelectorAll('th')

  const days = heads.map((element) => element.textContent)

  const columns = table.querySelectorAll('td').map((element) => element.textContent)

  const individualCalendar = {}
  const regex = /[^a-zA-Z0-9]/g
  for (let i = 0; i < days.length; i++) {
    if (regex.test(columns[i])) { continue }
    individualCalendar[days[i]] = columns[i].toLowerCase()
  }

  return individualCalendar
}

/**
 * Scrape cinema show times from the specified URL.
 * @param {string} url - URL to fetch cinema show times from.
 * @returns {object} An object containing scraped cinema show time data.
 */
async function cinemaScraper (url) {
  const data = {}
  const doc = await fetchHTML(url)
  process.stdout.write('\x1b[33mScraping: ' + 'Show Times..............')

  const choice = doc.querySelectorAll('select')

  const names = {}
  const id = {}

  for (let index = 0; index < choice.length; index++) {
    let options = choice[index].querySelectorAll('option')
    options = options.slice(1, options.length)
    names[choice[index].attributes.name] = options.map((element) => element.textContent)
    id[choice[index].attributes.name] = options.map((element) => element.attributes.value)
  }

  for (let i = 0; i < names.movie.length; i++) {
    for (const j of names.day) {
      const time = await getMoviesTime(url, id.day[names.day.indexOf(j)], id.movie[i])
      if (time.length === 0) { continue } else {
        if (!data[j]) {
          data[j] = {}
        }
        if (!data[j][names.movie[i]]) {
          data[j][names.movie[i]] = time
        }
      }
    }
  }
  console.log('\x1b[34m', 'OK!', '\x1b[0m')
  return data
}

/**
 * Get movie times for a specific day and movie from the provided URL.
 * @param {string} url - The base URL for fetching movie times.
 * @param {string} day - The day for which movie times are to be retrieved.
 * @param {string} movie - The specific movie for which times are to be fetched.
 * @returns {Array} An array containing retrieved movie times.
 */
async function getMoviesTime (url, day, movie) {
  const fetched = await fetch(url + '/check?day=' + day + '&movie=' + movie)
  const data = await fetched.json()

  const retrievedData = []
  for (let index = 0; index < data.length; index++) {
    if (data[index].status === 1) {
      retrievedData.push(data[index].time)
    }
  }
  return retrievedData
}

/**
 * Get cinema show times for a specific day and movie from the provided URL.
 * @param {string} url - The URL to fetch cinema show times data.
 * @returns {Array} An array of cinema show times for the specified day and movie.
 */
async function barScraper (url) {
  const username = 'zeke'
  const password = 'coys'
  process.stdout.write('\x1b[33mScraping: ' + 'reservations.............. ')

  const doc = await fetchHTML(url)
  let action = doc.querySelector('form').getAttribute('action')
  action = url + action.split('./').join('')

  const loggingIn = {
    method: 'POST',
    redirect: 'manual',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${username}&password=${password}&submit=login`
  }

  const result = await fetch(action, loggingIn)
  const link = result.headers.get('location')
  const cookie = result.headers.get('set-cookie')

  const request = await fetch(link, { headers: { Cookie: cookie } })
  const txt = await request.text()
  const root = parser.parse(txt)
  const inputs = root.querySelectorAll('input')

  const data = []
  for (const element of inputs) {
    if (element.attributes.type === 'radio') {
      data.push(element.attributes.value)
    }
  }
  console.log('\x1b[34m', 'OK!', '\x1b[0m')
  return reservation(data)
}

/**
 * Function and store reservations data for a specific day.
 * @param {Array} day - An array of reservation data for a specific day.
 * @returns {object} An object containing processed reservations data.
 */
async function reservation (day) {
  const data = {}
  for (const index of day) {
    const day = index.substring(0, 3)
    const startTime = index.substring(3, 5) + ':00'
    const endTime = index.substring(5, 7) + ':00'

    switch (day) {
      case 'fri':
        if (data.Friday === undefined) {
          data.Friday = []
          data.Friday.push(startTime + ' - ' + endTime)
        } else {
          data.Friday.push(startTime + ' - ' + endTime)
        }
        break
      case 'sat':
        if (data.Saturday === undefined) {
          data.Saturday = []
          data.Saturday.push(startTime + ' - ' + endTime)
        } else {
          data.Saturday.push(startTime + ' - ' + endTime)
        }
        break
      case 'sun':
        if (data.Sunday === undefined) {
          data.Sunday = []
          data.Sunday.push(startTime + ' - ' + endTime)
        } else {
          data.Sunday.push(startTime + ' - ' + endTime)
        }
        break
      default:
        break
    }
  }

  return data
}

export default scrape
