const product = require('../models/product')
const Product = require('../models/product')
const mongoose = require('mongoose')

// async function getProducts(req, res, next) {
//   const pagesNum = parseInt(req.query.pagesNum || 1)
//   const page = parseInt(req.query.page || 1)
//   const chunkSize = parseInt(req.query.chunk || Infinity) * pagesNum
//   const skip = (page - 1) * chunkSize

//   try {
//     const products = await Product.find().skip(skip).limit(chunkSize)
//     const total = await Product.countDocuments()

//     res.status(200).json({ products, total })
//   } catch (err) {
//     next(err)
//   }
// }


async function getProducts(req, res, next) {
  // I don't know if I really should apply pagination or not
  // The thing is I also have multiple categories, which is something that will let me obliged to send requests every
  // time I change category, so What can I do with it ????

  const { minPrice, maxPrice, category, brand, searchTerm, sortBy } = req.query

  const pagesNum = parseInt(req.query.pagesNum || 1)
  const page = parseInt(req.query.page || 1)
  const chunkSize = parseInt(req.query.chunk || Infinity) * pagesNum
  const skip = (page - 1) * chunkSize

  // options
  let query = {}
  let sortByOptions = {}
  if (sortBy === 'price') {
    sortByOptions.price = 1
  } else if (sortBy === 'price-desc') {
    sortByOptions.price = -1
  } else if (sortBy === 'alphabet') {
    sortByOptions.title = 1
  } else if (sortBy === 'alphabet-desc') {
    sortByOptions.title = -1
  }

  console.log({ minPrice, maxPrice })

  if (minPrice && minPrice !== 'undefined') {
    query.price = { $gte: minPrice }
  }

  if (maxPrice && maxPrice !== 'undefined') {
    query.price = { ...query.price, $lte: maxPrice }
  }

  if (category && category !== 'undefined' && category !== 'All') {
    query['category.name'] = category
  }

  if (brand && brand !== 'undefined' && brand !== 'All') {
    query.brand = brand
  }

  if (searchTerm && searchTerm !== 'undefined') {
    const searchWords = searchTerm
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)

    if (searchWords.length > 0) {
      query.$or = [
        { title: { $regex: searchWords.join('|'), $options: 'i' } },
        { description: { $regex: searchWords.join('|'), $options: 'i' } },
        { brand: { $regex: searchWords.join('|'), $options: 'i' } },
        { 'category.name': { $regex: searchWords.join('|'), $options: 'i' } },
      ]
    }
  }

  try {
    const products = await Product.find(query)
      .sort(sortByOptions)
      .skip(skip)
      .limit(chunkSize)

    const total = await Product.countDocuments(query)

    res.status(200).json({ products, total })
  } catch (err) {
    next(err)
  }
}

async function getProduct(req, res, next) {
  const productId = req.params.productId
  console.log('The prod', productId)
  try {
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.status(200).json({ product })
  } catch (err) {
    next(err)
  }
}

async function getSimilar(req, res, next) {
  const id = req.params.id
  const category = req.query.cat

  console.log(id, category)
  try {
    const products = await Product.aggregate([
      {
        $match: {
          'category.name': { $regex: category, $options: 'i' },
          _id: { $ne: new mongoose.Types.ObjectId(id) },
        },
      },
      { $sample: { size: 4 } },
    ])

    // .sort({ $sample: 1 }) // randomized

    return res.status(200).json({ products })
  } catch (err) {
    next(err)
  }
}
async function getFilteredProducts(req, res, next) {
  const pagesNum = parseInt(req.query.pagesNum || 1)
  const page = parseInt(req.query.page || 1)
  const chunkSize = parseInt(req.query.chunk || Infinity) * pagesNum
  const skip = (page - 1) * chunkSize
  const { minPrice, maxPrice, category, brand, searchTerm } = req.body

  const query = {}

  if (minPrice && maxPrice) {
    query.price = { $gte: minPrice, $lte: maxPrice }
  } else if (minPrice) {
    query.price = { $gte: minPrice }
  } else if (maxPrice) {
    query.price = { $lte: maxPrice }
  }

  if (category) {
    query['category.name'] = category
  }

  if (brand) {
    query.brand = brand
  }

  if (searchTerm) {
    query.$or = [
      { ProductTitle: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
      { description: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
    ]
  }

  try {
    const products = await Product.find(query).skip(skip).limit(chunkSize)
    const total = await Product.countDocuments()

    res.status(200).json({ products, total })
  } catch (err) {
    next(err)
  }
}

module.exports = { getProducts, getSimilar, getFilteredProducts, getProduct }
