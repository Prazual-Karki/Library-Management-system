const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  // photo: {
  //   type: String,
  //   data: Buffer,
  //   contentType: String,
  // },
})

module.exports = mongoose.model('users', userSchema)
