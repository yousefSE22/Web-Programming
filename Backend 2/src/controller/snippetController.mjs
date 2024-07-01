import { SnippetModel } from '../model/snippet.mjs'
import { UserController } from './userController.mjs'
export const SnippetController = {}

// function to create a snippet
SnippetController.create = async (req, res) => {
  req.body.createdBy = req.session.user.id
  const snippets = await SnippetModel.create(req.body)

  if (snippets instanceof Error) {
    const errorData = JSON.parse(snippets.message)
    req.session.flashMessage = errorData.message
    res.status(errorData.status).redirect('/snippet')
    return
  }

  // add the snippet to user array
  const snippetadd = await UserController.addSnippet(req.session.user.id, snippets.id)

  if (snippetadd instanceof Error) {
    const errorData = JSON.parse(snippetadd.message)
    req.session.flashMessage = errorData.message
    res.status(errorData.status).redirect('/snippet')
    return
  }

  req.session.snippets = [snippets]
  req.session.flashMessage = 'New Snippet Created'
  res.redirect('/snippet/' + snippets.id)
}

// function to delete a snipet
SnippetController.delete = async (req, res) => {
  const deleted = await SnippetModel.delete(req.params.id)
  if (deleted instanceof Error) {
    const errorData = JSON.parse(deleted.message)
    res.session.flashMessage = errorData.message
    res.status(errorData.status).redirect('/snippet')
  }

  // remove the snippet from the user
  const user = await UserController.removeSnippet(req.session.user.id, req.params.id)

  if (user instanceof Error) {
    const errorData = JSON.parse(user.message)
    req.session.flashMessage = errorData.message
    res.status(errorData.status).redirect('/snippet')
    return
  }

  req.session.flashMessage = 'Snippet was deleted successfuly'
  res.status(204).end()
}

// function to edit a snippet
SnippetController.edit = async (req, res, next) => {
  req.body.id = req.params.id
  const edited = await SnippetModel.edit(req.params.id, req.body)
  if (edited instanceof Error) {
    const errorData = JSON.parse(edited.message)
    req.session.flashMessage = errorData.message
    res.status(errorData.status)
    res.send('error')
    return
  }

  req.session.flashMessage = 'Snippet was successfuly updated'
  req.session.snippets = edited

  res.status(200)
  res.send('ok')
}

// function to find all snippets
SnippetController.findAll = async (req, res, next) => {
  let snippets

  if (!req.session.user) {
    snippets = await SnippetModel.findAll()
  } else {
    const user = await UserController.getUser(req.session.user.id)
    if (user instanceof Error) {
      const errorData = JSON.parse(user.message)
      req.session.flashMessage = errorData.message
      res.status(errorData.status).redirect('/home')
      return
    }
    snippets = await SnippetModel.findAll(user)
  }

  if (snippets instanceof Error) {
    const errorData = JSON.parse(snippets.message)
    req.session.flashMessage = errorData.message
    res.status(errorData.status).redirect('/home')
    return
  }

  req.session.snippets = snippets
  next()
}

// function to find specific snippet
SnippetController.findOne = async (req, res, next) => {
  const snippet = await SnippetModel.findOne(req.params.id)

  if (snippet instanceof Error) {
    const errorData = JSON.parse(snippet.message)
    req.session.flashMessage = errorData.message
    res.status(errorData.status).redirect('/snippet')
    return
  }

  snippet.creator = await UserController.getAuthorName(snippet.createdBy)
  req.session.snippets = [snippet]
  next()
}
