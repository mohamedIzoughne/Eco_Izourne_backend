const express = require('express')
const router = express.Router()
const {
  getProducts,
  getSimilar,
  getFilteredProducts,
  getProduct,
} = require('../controllers/products')

router.get('/products', getProducts)
router.get('/filtered-products', getFilteredProducts)
router.get('/products/similar/:id', getSimilar)
router.get('/products/:productId', getProduct)
module.exports = router
