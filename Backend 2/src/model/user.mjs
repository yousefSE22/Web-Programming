import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

export const UserModel = {}

const userSchema = new mongoose.Schema({

  id: { type: String, required: true, unique: true },

  firstName: { type: String, required: true, toUpperCase: true },

  lastName: { type: String, required: true, toUpperCase: true },

  username: { type: String, required: true, unique: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  snippets: [{ type: String }]

}, { timestamps: true })

const User = mongoose.model('User', userSchema)

// Function to register a new user
UserModel.register = async (user) => {
  try {
    let reg = await User.findOne({ email: user.email })

    if (reg) {
      const errorData = { status: 409, message: 'Email has been registered before' }
      return new Error(JSON.stringify(errorData))
    }

    reg = await User.findOne({ username: user.username })
    if (reg) {
      const errorData = { status: 409, message: 'Username has beem registered before' }
      return new Error(JSON.stringify(errorData))
    }

    user.password = await bcrypt.hash(user.password, 12)

    let Tries = 10
    while (true) {
      user.id = uuidv4()
      reg = await User.findOne({ id: user.id })
      if (!reg) {
        break
      }
      if (Tries === 0) {
        const errorData = { status: 500, message: 'Server error' }
        return new Error(JSON.stringify(errorData))
      }
      Tries--
    }

    const newUser = new User(user)

    await newUser.save()
    return newUser
  } catch (err) {
    return new Error({ status: 500, message: 'Server Error' })
  }
}

// Function to login a User
UserModel.login = async (user) => {
  const existingUser = await User.findOne({ username: user.username })

  if (existingUser === null) {
    return new Error('User Does not exist')
  }

  const passwordMatch = await bcrypt.compare(user.password, existingUser.password)
  if (!passwordMatch) {
    return new Error('Incorrect Password')
  }

  return existingUser
}

UserModel.getAuthorName = async (id) => {
  try {
    const user = await User.findOne({ id })
    if (!user) {
      return 'Could not find creator'
    }
    return user.firstName + ' ' + user.lastName
  } catch (err) {
    return 'Could not find creator'
  }
}

UserModel.getUser = async (id) => {
  try {
    const user = await User.findOne({ id })
    if (!user) {
      const errorData = { status: 404, message: 'User could not be found' }
      return new Error(JSON.stringify(errorData))
    }
    return user
  } catch (err) {
    const errorData = { status: 500, message: 'Server Error' }
    return new Error(JSON.stringify(errorData))
  }
}

// Add new snippets to specific user array
UserModel.addSnippet = async (userId, snippetId) => {
  try {
    const user = await UserModel.getUser(userId)
    user.snippets.push(snippetId)
    await user.save()
    return true
  } catch (err) {
    const errorData = { status: 500, message: 'Server Error' }
    return new Error(JSON.stringify(errorData))
  }
}

// Remove snippets from specific user array
UserModel.removeSnippet = async (userId, snippetId) => {
  try {
    const user = await UserModel.getUser(userId)
    const index = user.snippets.indexOf(snippetId)
    if (index > -1) {
      user.snippets.splice(index, 1)
    }
    await user.save()
    return true
  } catch (err) {
    const errorData = { status: 500, message: 'Server Error' }
    return new Error(JSON.stringify(errorData))
  }
}
