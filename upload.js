const multer = require('multer')

const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: (request, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage }).single('photo')
module.exports = upload
