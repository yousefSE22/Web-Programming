// User Controller
import { UserModel } from '../model/user.mjs'
export const UserController = {}

// Registering function
UserController.register = async (req, res, next) => {
  const user = await UserModel.register(req.body)

  if (user instanceof Error) {
    const errorData = JSON.parse(user.message)
    req.session.flashMessage = errorData.message
    res.status(errorData.status).redirect('/register')
    return
  }

  req.session.flashMessage = 'User registered successfuly. Log in to use the application'
  next()
}

// login function
UserController.login = async (req, res, next) => {
  const user = await UserModel.login(req.body)

  if (user instanceof Error) {
    req.session.flashMessage = user.message
    next()
    return
  }

  const sessionUser = {
    id: user.id,
    name: user.firstName + ' ' + user.lastName,
    username: user.username,
    email: user.email
  }

  req.session.user = sessionUser
  req.session.flashMessage = 'You are now logged in!'
  next()
}

UserController.getUser = async (id) => {
  try {
    const user = await UserModel.getUser(id)
    return user
  } catch (err) {
    return new Error(JSON.stringify({ status: 500, message: 'Server Error' }))
  }
}

UserController.getAuthorName = async (id) => {
  return await UserModel.getAuthorName(id)
}

// add a snippet to specific user
UserController.addSnippet = async (userId, snippetId) => {
  const adding = await UserModel.addSnippet(userId, snippetId)
  if (adding instanceof Error) {
    return new Error(JSON.stringify({ status: 500, message: 'Server Error' }))
  }
}

// Remove the existing snippet from yser array
UserController.removeSnippet = async (userId, snippetId) => {
  const remove = await UserModel.removeSnippet(userId, snippetId)
  if (remove instanceof Error) {
    return remove
  }
}
