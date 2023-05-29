//VRx45k5tBYyL4zbg
//prazualkarki
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const Connection = (username, password) => {
  const URL = `mongodb+srv://${username}:${password}@library.jo5cvx7.mongodb.net/?retryWrites=true&w=majority`

  mongoose
    .connect(URL)
    .then(() => {
      console.log('database connected succesfully')
    })
    .catch((error) => {
      console.log(error)
    })
}

module.exports = Connection
