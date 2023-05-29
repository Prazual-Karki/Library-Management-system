const express = require('express')
const router = express.Router()
const { verifyTokenAuth } = require('./auth')
const upload = require('./upload')
const {
  userSignUp,
  userLogIn,
  addBook,
  getBooksByUserId,
  updateBookById,
  deleteSinglebook,
  getAllbooks,
  searchbooks,
  getBookDetailById,
} = require('./controller')

const { getRecommendedbooks } = require('./Recommendation')
//for user routes
router.post('/signup', userSignUp)
router.post('/login', userLogIn)

//for books routes
router.get('/getAllBooks', getAllbooks)

router.post('/addBook', upload, addBook)
router.get('/getBooksByUserId/:id', verifyTokenAuth, getBooksByUserId)
router.put('/updateBookById/:id', upload, verifyTokenAuth, updateBookById)
router.get('/getBookDetailById/:id', getBookDetailById)

//delete book
router.delete('/deleteSingleBook/:id', verifyTokenAuth, deleteSinglebook)

router.get('/searchbooks/:key', searchbooks)
//for recommendation
router.get('/getRecommendedbooks/:id', getRecommendedbooks)

module.exports = router
