const express = require('express')
const router = express.Router()
const { getProducts, getSimilar } = require('../controllers/products')

router.get('/products', getProducts)
router.get('/similar/:id', getSimilar)
module.exports = router
