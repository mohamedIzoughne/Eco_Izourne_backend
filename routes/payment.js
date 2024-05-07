


const router = require('express').Router()
const {getCheckout} = require('../controllers/payment')
router.get('/checkout', getCheckout)

router.post()