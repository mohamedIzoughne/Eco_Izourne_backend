const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  category: {
    type: {
      imageURL: String,
      name: String,
    },
    required: false,
  },
  state: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
  brand: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Product', productSchema)
