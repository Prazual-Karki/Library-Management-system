const Jwt = require('jsonwebtoken')

const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const jwtKey = process.env.JWT_KEY

const verifyTokenAuth = async (request, response, next) => {
  let token = request.headers['authorization']
  if (token) {
    token = token.split(' ')[1]

    //taking request token as input and verifying
    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        response.status(401).json({ result: 'please provide valid token' })
      } else {
        next()
      }
    })
  } else {
    response.status(403).json({ result: 'please enter token with header' })
  }
}

module.exports = { verifyTokenAuth }
