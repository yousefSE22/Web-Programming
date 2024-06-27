import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const accessToken = process.env.TOKEN
const routing = express.Router()
const grouptId = process.env.GROUPID

// for groups
routing.get('/projects', async (req, res) => {
  let data = await fetch(`https://gitlab.lnu.se/api/v4/groups/${grouptId}/projects/?private_token=${accessToken}`)
  data = await data.json()
  res.json(data)
})

// fetching project ID

routing.get('/projects/:projecId', async (req, res) => {
  const projectID = req.params.projecId
  let data = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectID}/?private_token=${accessToken}`)
  data = await data.json()
  res.json(data)
})

// fetching issues from the project

routing.get('/issues/:projectId', async (req, res) => {
  const projectID = req.params.projectId
  let data = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectID}/issues/?private_token=${accessToken}`)
  data = await data.json()
  res.json(data)
})

export default routing
