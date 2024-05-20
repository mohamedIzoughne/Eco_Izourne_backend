const express = require('express')
const app = express()
const mongoose = require('mongoose')

const cors = require('cors')
const dotenv = require('dotenv')
const productRoutes = require('./routes/products')
const adminRoutes = require('./routes/admin')
const multer = require('multer')
const path = require('path')
dotenv.config()

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpg',
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
  ]
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    )
  },
})

app.use(express.json({ limit: '10mb' }))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array('imageURl')
)

app.use(cors())

// app.use('/payment', paymentRoutes)
app.use('/admin', adminRoutes)
app.use('/', productRoutes)

app.use((error, req, res, next) => {
  const message = error.message
  let status = error.statusCode
  if (!status) {
    status = 500
  }
  console.log(message)
  return res.status(status).json({ message })
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => console.log('Server started on port 3000'))
  })
  .catch((err) => {
    console.log(err)
  })
