const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const express = require('express')
const cors = require('cors')

const bodyParser = require('body-parser')
const path = require('path')

const Routes = require('./routes')
const Connection = require('./db')

const app = express()
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const port = process.env.PORT || 8081

Connection(username, password)

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/', Routes)

//static files for production
app.use(express.static(path.join(__dirname, './Client/build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './Client/build/index.html'))
})

app.listen(port, () =>
  console.log(`Server is running successfully on PORT ${port}`)
)
