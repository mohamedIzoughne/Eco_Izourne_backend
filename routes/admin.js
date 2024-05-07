const router = require('express').Router()
const {
  addProduct,
  removeProduct,
  updateProduct,
} = require('../controllers/admin')

router.post('/add-product', addProduct)
router.put('/update-product/:id', updateProduct)
router.delete('/remove-product/:id', removeProduct)

module.exports = router
