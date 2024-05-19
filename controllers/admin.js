const Product = require('../models/product')
async function addProduct(req, res, next) {
  const { title, description, price, category, state, brand } = req.body
  const parsedCategory = JSON.parse(category)
  let imageURL = req.files[0]?.path
  if (!imageURL) {
    imageURL = '/images/default.png'
  }
  const images = req.files.map((file) => file?.path)

  try {
    const product = new Product({
      title,
      description,
      price,
      imageURL,
      category: parsedCategory,
      state,
      images,
      brand,
    })
    await product.save()
    return res.status(201).json(product)
  } catch (err) {
    next(err)
  }
}

async function updateProduct(req, res, next) {
  const { title, description, price, category, state, brand } = req.body
  const parsedCategory = JSON.parse(category)
  let imageUrl = req.file?.path

  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      const error = new Error('Product not found')
      error.statusCode = 404
      throw error
    }
    product.title = title
    product.description = description
    product.price = price
    if (imageUrl) {
      product.imageURL = imageUrl
    }
    product.category = parsedCategory
    product.state = state
    product.brand = brand
    await product.save()
    return res.status(201).json(product)
  } catch (err) {
    next(err)
  }
}

async function removeProduct(req, res, next) {
  const { id } = req.params
  console.log(id)
  try {
    await Product.deleteOne({ _id: req.params.id })
    return res.status(200).json({ message: 'Product deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { addProduct, removeProduct, updateProduct }
