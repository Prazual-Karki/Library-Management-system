const mongoose = require('mongoose')
const bookSchema = new mongoose.Schema({
  bookName: String,
  author: String,
  genre: String,

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },

  description: String,
  photo: String,
})

module.exports = mongoose.model('books', bookSchema)
