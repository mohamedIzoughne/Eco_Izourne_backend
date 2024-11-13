const Product = require('../models/product')

const { put, del } = require('@vercel/blob')

const uploadToBlob = async (files) => {
  if (!files || files.length === 0) {
    throw new Error('Files are required')
  }

  try {
    const uploadPromises = files.map((file) => {
      return put(file.originalname, file.buffer, {
        access: 'public',
        addRandomSuffix: true,
        contentType: file.mimetype,
      })
    })

    const uploadResults = await Promise.all(uploadPromises)
    const urls = uploadResults.map((result) => result.url)

    console.log('The urls:', urls)

    return urls
  } catch (error) {
    console.error('Error uploading to blob:', error)
    throw error
  }
}
async function addProduct(req, res, next) {
  const { title, description, price, category, state, brand } = req.body
  const parsedCategory = JSON.parse(category)

  try {
    console.log(req.body.imageURl)
    const images = await uploadToBlob(req.files)

    console.log(images)
    let imageURL = images[0]
    if (!imageURL) {
      imageURL = '/images/default.png'
    }

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
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      const error = new Error('Product not found')
      error.statusCode = 404
      throw error
    }

    if (
      product.imageURL &&
      product.imageURL.includes('public.blob.vercel-storage.com')
    ) {
      const urlParts = product.imageURL.split('/')
      const fileName = urlParts[urlParts.length - 1]
      await del(fileName)
    }
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        if (imageUrl.includes('public.blob.vercel-storage.com')) {
          const urlParts = imageUrl.split('/')
          const fileName = urlParts[urlParts.length - 1]
          await del(fileName)
        }
      }
    }
    let imageURL = '/images/default.png'

    console.log('The files', req.files)
    if (req.files && req.files.length > 0) {
      const images = await uploadToBlob(req.files)
      imageURL = images[0]
    }

    product.title = title
    product.description = description
    product.price = price

    product.imageURL = imageURL
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
    const product = await Product.findById(id)

    if (product) {
      if (
        product.imageURL &&
        product.imageURL.includes('public.blob.vercel-storage.com')
      ) {
        const urlParts = product.imageURL.split('/')
        const fileName = urlParts[urlParts.length - 1]
        await del(fileName)
      }
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          if (imageUrl.includes('public.blob.vercel-storage.com')) {
            const urlParts = imageUrl.split('/')
            const fileName = urlParts[urlParts.length - 1]
            await del(fileName)
          }
        }
      }
    }
    await Product.deleteOne({ _id: req.params.id })
    return res.status(200).json({ message: 'Product deleted' })
  } catch (err) {
    console.log(err)
    next(err)
  }
}
module.exports = { addProduct, removeProduct, updateProduct }
