import * as dotenv from 'dotenv'
// File to validate the access token
dotenv.config()
const validator = {}

validator.validateWebhook = (req, res, next) => {
  const token = req.headers['x-gitlab-token']
  const tokenNeeded = process.env.TOKEN
  if (token === tokenNeeded) {
    next()
  } else {
    res.status(403).send('Access Token is Invalid')
  }
}

export default validator
