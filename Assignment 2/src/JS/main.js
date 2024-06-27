import Timerclass from './timer.js'
document.addEventListener('DOMContentLoaded', function () {
  // Event listeners
  document.getElementById('startGameButton').addEventListener('click', startGame)
  document.getElementById('submitAnswerButton').addEventListener('click', submitAnswer)
  document.getElementById('restartGameButton').addEventListener('click', restartGame)
  document.getElementById('highScoreLink').addEventListener('click', showHighScores)
  document.getElementById('nickname').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      startGame()
    }
  })
})

// Variables to keep track of game state
let currentQuestionId
let timer
let score = 0
let startTime

/**
 * Start the game by getting the user's nickname.
 */
function startGame () {
  const nickname = document.getElementById('nickname').value
  if (!nickname) {
    alert('Please enter a nickname to start the game.')
    return
  }

  // Initialize the question ID to 0
  currentQuestionId = 0

  // Record the start time
  startTime = new Date()

  // Hide start container and show quiz container
  document.getElementById('startContainer').style.display = 'none'
  document.getElementById('quizContainer').style.display = 'block'
  document.getElementById('nickname').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      startGame()
    }
  })

  // Start the quiz with the first question
  getNextQuestion()
}

/**
 * Fetch the next question from the server.
 */
function getNextQuestion () {
  // Increment the question ID
  currentQuestionId++

  // Fetch the next question from the server
  fetch(`https://courselab.lnu.se/quiz/question/${currentQuestionId}`)
    .then(response => response.json())
    .then(question => displayQuestion(question))
}

/**
 * Display the question and options to the user.
 * @param {object} question - The question object from the server.
 */
function displayQuestion (question) {
  // Update the current question ID
  currentQuestionId = question.id

  // Display the question
  document.getElementById('questionContainer').innerHTML = `<h2>${question.question}</h2>`

  // Check if the question has alternatives
  if (question.alternatives) {
    // Display radio buttons for multiple-choice question
    document.getElementById('optionsContainer').innerHTML = Object.entries(question.alternatives)
      .map(([key, value]) => `
                <input type="radio" name="answer" value="${key}" id="${key}">
                <label for="${key}">${value}</label><br>
            `)
      .join('')
  } else {
    // Display input for text question
    document.getElementById('optionsContainer').innerHTML = `
            <input type="text" id="textAnswer" placeholder="Your answer">
        `
    const enterkey = document.getElementById('textAnswer')
    enterkey.addEventListener('keypress', function (i) {
      if (i.key === 'Enter') {
        submitAnswer()
      }
    })
  }

  // Start the timer
  startTimer()
}

/**
 * Submit the user's answer to the server.
 */
function submitAnswer () {
  let answer

  // Check if the question is a text question
  const textAnswerInput = document.getElementById('textAnswer')
  if (textAnswerInput) {
    // Get the text answer from the input field
    answer = textAnswerInput.value.trim()
  } else {
    // Get the selected answer from radio buttons
    const selectedAnswer = document.querySelector('input[name="answer"]:checked')

    if (!selectedAnswer) {
      alert('Please select an answer.')
      return
    }

    answer = selectedAnswer.value
  }

  // Stop the timer
  timer.stop()

  // Send the answer to the server
  sendAnswer(currentQuestionId, answer)
    .then(response => handleAnswerResponse(response)).catch(error => {
      if (error.message === 'Incorrect answer') {
        // Stop the timer and show game over message for incorrect answer
        clearInterval(timer)
        gameOver('Wrong answer, game over.')
      } else {
        console.error('Error submitting answer:', error)
      }
    })
}

/**
 * Handle the server's response to the user's answer.
 * @param {object} response - The server response.
 */
function handleAnswerResponse (response) {
  // Update the score and display result message
  if (response.correct) {
    score++
  } else {
    document.getElementById('optionsContainer').innerHTML += '<p class="wrong-answer">Wrong Answer!</p>'
  }

  // Check if the quiz is over
  if (!response.nextURL) {
    // If there are no more questions, it means the user has completed the quiz
    gameOver('Congrats, You win! Good work.')
    showResult(response) // Pass the response object to showResult
  } else {
    // Fetch the next question using the provided nextURL
    fetch(response.nextURL)
      .then(response => response.json())
      .then(nextQuestion => displayQuestion(nextQuestion))
  }
}

/**
 * Show the final result to the user.
 * @param {boolean} quizCompleted - Indicates whether the quiz was successfully completed.
 */
function showResult (quizCompleted) {
  const timeTakenContainer = document.getElementById('timeTaken')
  const highScoreLink = document.getElementById('highScoreLink')
  const resultContainer = document.getElementById('resultContainer')
  const endTime = new Date()
  const totalTime = Math.floor((endTime - startTime) / 1000) // Convert to seconds

  timeTakenContainer.textContent = `Time taken: ${totalTime}s`

  if (quizCompleted) {
    // Save the high score only if the quiz was successfully completed
    saveHighScore()
  }
  highScoreLink.style.display = 'block'
  // Display restart button
  resultContainer.style.display = 'block'

  // Hide test container
  document.getElementById('quizContainer').style.display = 'none'
}

/**
 *
 */
function saveHighScore () {
  // Fetch existing high scores from Web Storage
  const highScores = JSON.parse(localStorage.getItem('highScores')) || []

  // Calculate the total time taken
  const endTime = new Date()
  const totalTime = Math.floor((endTime - startTime) / 1000) // Convert to seconds

  // Add the current player's score
  const nickname = document.getElementById('nickname').value
  highScores.push({
    nickname,
    score,
    time: totalTime
  })

  // Save the updated high scores to Web Storage
  localStorage.setItem('highScores', JSON.stringify(highScores))
}

/**
 * Start the timer and update the UI.
 */
function startTimer () {
  const timerCallback = (timeLeft) => {
    document.getElementById('time').textContent = timeLeft

    if (timeLeft <= 0) {
      // If time runs out, submit an empty answer to end the game
      gameOver('Time is up! Game over.')
    }
  }

  // Create a new instance of the Timer class
  timer = new Timerclass(timerCallback, 11000)

  // Start the timer
  timer.start()
}

/**
 * Restart the game by resetting variables and UI.
 */
function restartGame () {
  // Reset variables and UI
  currentQuestionId = null
  score = 0
  document.getElementById('startContainer').style.display = 'block'
  document.getElementById('quizContainer').style.display = 'none'
  document.getElementById('resultContainer').style.display = 'none'
  document.getElementById('highScoreLink').style.display = 'none'
  document.getElementById('nickname').value = ''
  clearInterval(timer) // Clear the timer
}

/**
 * Show high scores.
 */
function showHighScores () {
  // Fetch high scores from Web Storage
  const highScores = JSON.parse(localStorage.getItem('highScores')) || []

  highScores.sort((a, b) => a.time - b.time) // Sort by time (ascending)

  // Display only the top 5 high scores in a table
  const tableContainer = document.getElementById('highscore')
  const table = document.createElement('table')
  table.innerHTML = `
        <thead>
            <tr>
                <th>Rank</th>
                <th>Nickname</th>
                <th>Time Taken (s)</th>
            </tr>
        </thead>
        <tbody>
            ${highScores.slice(0, 5).map((entry, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${entry.nickname}</td>
                    <td>${entry.time}</td>
                </tr>
            `).join('')}
        </tbody>
    `

  // Replace the content of the high score container with the table
  tableContainer.innerHTML = ''
  tableContainer.appendChild(table)
}

/**
 * Send the user's answer to the server.
 * @param {number} questionId - The ID of the question.
 * @param {string} answer - The user's answer.
 * @returns {Promise<object>} A promise that resolves with the server response.
 */
async function sendAnswer (questionId, answer) {
  const response = await fetch(`https://courselab.lnu.se/quiz/answer/${questionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      answer
    })
  })

  if (!response.ok && response.status === 400) {
    // Answer is incorrect
    throw new Error('Incorrect answer')
  }

  return await response.json()
}

/**
 * Handles the end of the game.
 * @param {string} message - The message to be displayed as the game over message.
 */
function gameOver (message) {
  clearInterval(timer)
  document.getElementById('resultMessage').textContent = message // Display the game over message
  showResult()
}
