// controllers/productController.js
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  
  // Build query from request parameters
  const keyword = req.query.keyword 
    ? { name: { $regex: req.query.keyword, $options: 'i' } } 
    : {};
  
  const category = req.query.category ? { category: req.query.category } : {};
  
  const priceRange = {};
  if (req.query.minPrice) priceRange.$gte = Number(req.query.minPrice);
  if (req.query.maxPrice) priceRange.$lte = Number(req.query.maxPrice);
  
  const price = Object.keys(priceRange).length > 0 ? { price: priceRange } : {};
  
  // Combine all query parameters
  const query = { ...keyword, ...category, ...price };
  
  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 4;
  
  const products = await Product.find({})
    .sort({ rating: -1 })
    .limit(limit);
  
  res.json(products);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // Create a product with default values
  const product = new Product({
    name: req.body.name || 'Sample Product',
    price: req.body.price || 0,
    user: req.user._id, // Admin user
    imageUrl: req.body.imageUrl || '/uploads/sample.jpg',
    category: req.body.category || 'Sample Category',
    countInStock: req.body.countInStock || 0,
    numReviews: 0,
    description: req.body.description || 'Sample description',
    tags: req.body.tags || [],
    discountPercentage: req.body.discountPercentage || 0,
  });

  // If there are uploaded images, add them
  if (req.files && req.files.length > 0) {
    product.imageUrl = req.files[0].path.replace(/\\/g, '/');
    product.images = req.files.map(file => file.path.replace(/\\/g, '/'));
  }

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    category,
    countInStock,
    discountPercentage,
    tags,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;
    product.discountPercentage = discountPercentage || product.discountPercentage;
    
    if (tags) product.tags = tags;

    // If there are uploaded images, update them
    if (req.files && req.files.length > 0) {
      product.imageUrl = req.files[0].path.replace(/\\/g, '/');
      product.images = req.files.map(file => file.path.replace(/\\/g, '/'));
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    
    // Recalculate average rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};