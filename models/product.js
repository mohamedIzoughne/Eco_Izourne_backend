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

productSchema.index({ title: 'text', description: 'text' })
productSchema.index({ price: 1 })
productSchema.index({ 'category.name': 1 })
productSchema.index({ brand: 1 })

module.exports = mongoose.model('Product', productSchema)
