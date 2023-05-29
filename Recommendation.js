const Book = require('./models/bookSchema')
const natural = require('natural')
const { Matrix } = require('ml-matrix')

const getRecommendedbooks = async (request, response) => {
  try {
    function cosineSimilarity(a, b) {
      const matA = new Matrix([a])
      const matB = new Matrix([b])

      const dotbook = matA.mmul(matB.transpose()).get(0, 0)
      const normA = matA.norm()
      const normB = matB.norm()
      const similarity = dotbook / (normA * normB)

      return similarity
    }
    const bookId = request.params.id
    const threshold = 0.2
    if (bookId) {
      //retrieve searched book
      const searchedBook = await Book.findById(bookId)

      // Find all available books
      const books = await Book.find()

      const recommendedbooks = []

      for (let i = 0; i < books.length; i++) {
        const book1 = books[i]

        // let similarityScore = 0

        const array2 = [book1.bookName, book1.author, book1.genre]
        const array1 = [
          searchedBook.bookName,
          searchedBook.author,
          searchedBook.genre,
        ]
        const allWords = [...new Set([...array1, ...array2])]
        const tfidf = new natural.TfIdf()
        tfidf.addDocument(array1)
        tfidf.addDocument(array2)
        const vector1 = allWords.map((word) => tfidf.tfidf(word, 0)) // 0 index document
        const vector2 = allWords.map((word) => tfidf.tfidf(word, 1))

        // Calculate similarity scores for each available book
        const similarity = cosineSimilarity(vector1, vector2)
        // console.log(similarity)
        if (similarity >= threshold) {
          recommendedbooks.push({
            book1,
            similarity,
          })
        }
      }

      recommendedbooks.sort((a, b) => b.similarity - a.similarity)
      if (recommendedbooks.length == 0) {
        return response.status(200).json('no recommend')
      } else {
        return response
          .status(200)
          .json(recommendedbooks.map((item) => item.book1))
      }
    } else {
      return response.status(400).json('provide user id')
    }
  } catch (error) {
    console.log(error)
    // return response.status(400).json({ error: error })
  }
}

module.exports = { getRecommendedbooks }
