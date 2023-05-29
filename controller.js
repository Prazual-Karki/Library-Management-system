const User = require('./models/userSchema')
const Book = require('./models/bookSchema')
const bcrypt = require('bcryptjs')
const Jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const jwtKey = process.env.JWT_KEY

//for registering  users
const userSignUp = async (request, response) => {
  try {
    const exist = await User.findOne({ email: request.body.email })
    if (exist) {
      return response.status(200).json('User already exist with this email')
    } else {
      const user = new User({
        username: request.body.username,
        email: request.body.email,
        password: request.body.password,
      })

      if (!user.username || !user.email || !user.password) {
        return response.status(401).json('please fill out the empty field')
      } else {
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err
            user.password = hash
            user.save().then((user) => {
              const payload = {
                id: user.id,
                email: user.email,
              }

              //generate jsonwebtoken for authentication
              Jwt.sign(payload, jwtKey, (err, token) => {
                if (err) {
                  response
                    .status(401)
                    .json('something went wrong in authentictaion')
                }
                const { _id, username, email } = user
                response
                  .status(200)
                  .json({ user: { _id, username, email }, auth: token })
              })
            })
          })
        })
      }
    }
  } catch (error) {
    return response.status(400).json(error)
  }
}
//for logging users
const userLogIn = async (request, response) => {
  const email = request.body.email
  const password = request.body.password

  try {
    if (email && password) {
      const user = await User.findOne({ email })
      if (user) {
        bcrypt.compare(password, user.password).then((isMatch) => {
          if (isMatch) {
            const payload = {
              id: user.id,
              email: user.email,
            }
            Jwt.sign(payload, jwtKey, (err, token) => {
              if (err) {
                response
                  .status(500)
                  .json('something went wrong in token generation')
              }
              const { _id, username, email } = user
              response
                .status(200)
                .json({ user: { _id, username, email }, auth: token })
            })
          } else {
            return response.status(200).json('password incorrect')
          }
        })
      } else {
        return response.status(200).json('email not found')
      }
    } else {
      return response.status(400).json('email and password required')
    }
  } catch (error) {
    return response.status(400).json(error)
  }
}

//adding book to the system
const addBook = async (request, response) => {
  try {
    const exist = await Book.findOne({ photo: request.file.path })
    if (exist) {
      return response.status(200).json('book already exist')
    } else {
      const book = new Book({
        bookName: request.body.bookName,
        author: request.body.author,
        genre: request.body.genre,
        photo: request.file.path,
        userId: request.body.userId,
        description: request.body.description,
      })
      if (
        !book.bookName ||
        !book.author ||
        !book.genre ||
        !book.photo ||
        !book.userId
      ) {
        return response.status(401).json('please fill out the empty field')
      } else {
        let bookDetail = await book.save()
        return response.status(201).json(bookDetail)
      }
    }
  } catch (error) {
    // console.log(error)
    return response.status(400).json(error)
  }
}

//get books uploaded by a single user
const getBooksByUserId = async (request, response) => {
  try {
    const books = await Book.find({ userId: request.params.id })
    if (books.length > 0) {
      return response.status(200).json(books)
    } else {
      return response.status(200).json('no books found')
    }
  } catch (error) {
    return response.status(400).json(error)
  }
}

//update book details by book id
const updateBookById = async (request, response) => {
  try {
    const book = await Book.findById(request.params.id)
    if (!book) return response.status(404).json('book not found')

    const photo = request.file ? request.file.path : request.body.photo
    const { bookName, author, genre, description } = request.body
    await Book.findByIdAndUpdate(
      request.params.id,
      { bookName, author, genre, photo, description },
      { new: true }
    )
    response.status(200).json('book updated succesfully')
  } catch (error) {
    return response.status(400).json(error)
  }
}

//to delete one book with book id
const deleteSinglebook = async (request, response) => {
  try {
    const book = await Book.findById(request.params.id)
    if (!book) return response.status(404).json('book not found')
    const deleteSuccess = await Book.deleteOne({ _id: request.params.id })
    if (deleteSuccess) {
      return response.status(200).json('book deleted succesfully')
    } else {
      response.status(404).json('cannot delete book...')
    }
  } catch (error) {
    return response.status(400).json(error)
  }
}

//get all books
const getAllbooks = async (request, response) => {
  try {
    const books = await Book.find()
    if (books.length > 0) {
      return response.status(200).json(books)
    } else {
      return response.status(400).json('no books found')
    }
  } catch (error) {
    return response.status(400).json(error)
  }
}

//search books by name,author and genre key as params
const searchbooks = async (request, response) => {
  try {
    const searchbooks = await Book.find({
      $or: [
        { bookName: { $regex: request.params.key } },
        { author: { $regex: request.params.key } },
        { genre: { $regex: request.params.key } },
      ],
    })
    return response.status(200).json(searchbooks)
  } catch (error) {
    return response.status(400).json(error)
  }
}
const getBookDetailById = async (request, response) => {
  try {
    const bookDetails = await Book.findOne({ _id: request.params.id })

    if (bookDetails) {
      return response.status(200).json(bookDetails)
    } else {
      return response.status(404).json('book not found')
    }
  } catch (error) {
    console.log(error)
    // return response.status(400).json(error)
  }
}
module.exports = {
  userSignUp,
  userLogIn,
  addBook,
  getBooksByUserId,
  updateBookById,
  deleteSinglebook,
  getAllbooks,
  searchbooks,
  getBookDetailById,
}
