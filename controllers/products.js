const Product = require('../models/product')

async function getProducts(req, res, next) {
  try {
    const products = await Product.find()

    res.status(200).json(products)
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
