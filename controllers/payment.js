

async function getCheckout(req, res, next) {
    const { cartItems } = req.body
    let total = 0

    cartItems.forEach(item => {
        total += item.price * item.quantity
    })

    try {
      const products = await Product.find()
      res.status(200).json(products)
    } catch (err) {
      next(err)
    }
}