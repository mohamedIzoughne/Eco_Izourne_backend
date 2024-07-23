const Product = require('../models/product')

async function getProducts(req, res, next) {
  // I don't know if I really should apply pagination or not
  // The thing is I also have multiple categories, which is something that will let me obliged to send requests every
  // time I change category, so What can I do with it ????
  const pagesNum = parseInt(req.query.pagesNum || 1)
  const page = parseInt(req.query.page || 1)
  const chunkSize = parseInt(req.query.chunk || Infinity) * pagesNum
  const skip = (page - 1) * chunkSize

  try {
    const products = await Product.find().skip(skip).limit(chunkSize)
    const total = await Product.countDocuments()

    res.status(200).json({ products, total })
  } catch (err) {
    next(err)
  }
}

async function getProducts(req, res, next) {
  console.log('----')
  // I don't know if I really should apply pagination or not
  // The thing is I also have multiple categories, which is something that will let me obliged to send requests every
  // time I change category, so What can I do with it ????

  const { minPrice, maxPrice, category, brand, searchTerm } = req.query

  // options: {minPrice, maxPrice, category, brand, searchTerm}
  const pagesNum = parseInt(req.query.pagesNum || 1)
  const page = parseInt(req.query.page || 1)
  const chunkSize = parseInt(req.query.chunk || Infinity) * pagesNum
  const skip = (page - 1) * chunkSize

  // options
  let query = {}

  if (minPrice && minPrice !== 'undefined') {
    query.price = { $gte: minPrice }
  }

  if (maxPrice && maxPrice !== 'undefined') {
    query.price = { $lte: maxPrice }
  }

  if (category) {
    query.category = category
  }

  if (brand) {
    query.brand = brand
  }

  if (searchTerm) {
    query.$or = [
      { ProductTitle: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
    ]
  }

  console.log(query)

  try {
    const products = await Product.find(query).skip(skip).limit(chunkSize)
    const total = await Product.countDocuments()

    res.status(200).json({ products, total })
  } catch (err) {
    next(err)
  }
}

async function getSimilar(req, res, next) {
  const id = req.params.id
  const category = req.query.cat
  try {
    let products = await Product.find({
      'category.name': category,
      _id: { $ne: id },
    })

    if (products.length > 4) {
      products = products.slice(0, 4)
    }

    return res.status(200).json(products)
  } catch (err) {
    next(err)
  }
}

module.exports = { getProducts, getSimilar }
