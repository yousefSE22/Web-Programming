// timer.js

export default class Timerclass {
  constructor (callback, duration) {
    this.callback = callback
    this.duration = duration
    this.intervalId = null
  }

  start () {
    let timeLeft = this.duration / 1000

    this.intervalId = setInterval(() => {
      this.callback(Math.floor(timeLeft))

      if (timeLeft <= 0) {
        this.stop()
      }

      timeLeft -= 0.1
    }, 100)
  }

  stop () {
    clearInterval(this.intervalId)
  }
}
