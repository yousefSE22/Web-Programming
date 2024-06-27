/**
 * Generates and displays reservations recommendations based on collected data.
 * @param {object} collectedData - The collected data from calendars, cinema, and bar open tables.
 * @throws {Error} Throws error
 */
export default function createReservations (collectedData) {
  console.log()
  console.log('Reservations Recommendations:')
  console.log('.............................')

  const days = {}
  const calendar = collectedData.calendar

  for (const index in calendar) {
    for (const j in calendar[index]) {
      if (days[j] === undefined) {
        days[j] = 1
      } else {
        days[j] += 1
      }
    }
  }

  const days2 = []
  for (const index in days) {
    if (days[index] === 3) {
      days2.push(index)
    }
  }

  if (days2.length === 0) {
    console.log('No possible reservations found')
  } else {
    for (const day of days2) {
      let possiblity = true
      const movies = {}
      const dinner = []

      if (collectedData.movies[day] === undefined) {
        possiblity = false
      } else {
        for (const index in collectedData.movies[day]) {
          movies[index] = collectedData.movies[day][index]
        }
      }

      if (collectedData.dinner[day] === undefined) {
        possiblity = false
      } else {
        for (const index in collectedData.dinner[day]) {
          dinner.push(collectedData.dinner[day][index])
        }
      }

      const reservationsPossible = []

      for (const movie in movies) {
        for (let i = 0; i < movies[movie].length; i++) {
          const movieTime = parseInt(movies[movie][i].split(':')[0])

          for (let j = 0; j < dinner.length; j++) {
            const dinnerTime = dinner[j].split(':')[0]

            if (dinnerTime - movieTime >= 2) {
              reservationsPossible.push([movie, movies[movie][i], dinner[j]])
            }
          }
        }
      }
      if (reservationsPossible.length === 0) {
        possiblity = false
      }
      if (possiblity === false) {
        console.log('No possible reservations on ' + day)
      } else {
        for (let i = 0; i < reservationsPossible.length; i++) {
          console.log('\x1b[35mOn ' + 'On ' + day + ' the movie ' + '"' + '\x1b[36m"' + reservationsPossible[i][0] + '"' + ' which starts at ' + reservationsPossible[i][1] + ' and there is a free table between ' +
                  '\x1b[33m' + reservationsPossible[i][2].split(' ').join('') + '\x1b[0m')
        }
      }
    }
  }
}
