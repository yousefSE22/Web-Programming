import { validate as uuidValidator } from 'uuid'
export const validator = {
  register: (req, res, next) => {
    const { firstName, lastName, username, email, password } = req.body

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).render('register', { user: null, flashMessage: 'Please fill in all fields', info: req.body })
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (!email.match(emailRegex)) {
      return res.status(400).render('register', { user: null, flashMessage: 'Please enter a valid email address', info: req.body })
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).render('register', { user: null, flashMessage: 'Invalid password', info: req.body })
    }

    next()
  },

  login: (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).render('login', { flashMessage: 'Please enter both username and password' }, req.body)
    }

    next()
  },

  createSnippet: (req, res, next) => {
    const user = req.session.user || null
    const { title, snippet, language, description, private: isPrivate } = req.body

    if (!user) {
      return res.status(403).render('login', { flashMessage: 'Please login to create snippets', user, snippets: [req.body] })
    }

    if (!uuidValidator(user.id)) {
      return res.status(401).render('login', { flashMessage: 'Invalid credentials', user, snippets: [req.body] })
    }

    if (!title || !snippet || !language || !description) {
      return res.status(400).render('createSnippet', { flashMessage: 'Please fill in all fields', user, snippets: [req.body] })
    }

    req.body.isPublic = !isPrivate
    next()
  },

  isLoggedIn: (req, res, next) => {
    const user = req.session.user || null
    if (!user) {
      return res.status(403).render('login', { flashMessage: 'Please login to continue', user })
    }

    next()
  },

  isOkToRegister: (req, res, next) => {
    if (req.session.user) {
      return res.status(400).render('home', { flashMessage: 'You are already logged in', user: req.session.user })
    }

    next()
  },

  validateId: (req, res, next) => {
    const id = req.params.id
    if (!uuidValidator(id)) {
      req.session.flashMessage = 'Invalid ID'
      return res.status(400).redirect('/snippet')
    }

    next()
  },

  validateUserSnippet: (req, res, next) => {
    const user = req.session.user
    const snippet = req.session.snippets

    if (user.id !== snippet[0].createdBy) {
      req.session.flashMessage = 'You are not allowed to edit this snippet'
      return res.status(401).redirect('/snippet')
    }

    next()
  },

  validateIsPublic: (req, res, next) => {
    const snippet = req.session.snippets

    if (!snippet[0].isPublic && (!req.session.user || req.session.user.id !== snippet[0].createdBy)) {
      req.session.flashMessage = 'Invalid Snippet ID'
      return res.status(404).redirect('/snippet')
    }

    next()
  }
}
