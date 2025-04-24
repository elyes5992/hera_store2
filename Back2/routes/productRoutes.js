// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadProductImages } = require('../middleware/uploadMiddleware');

// Public routes
router.route('/').get(getProducts);
router.route('/top').get(getTopProducts);
router.route('/:id').get(getProductById);

// Protected routes (require login)
router.route('/:id/reviews').post(protect, createProductReview);

// Admin routes
router
  .route('/')
  .post(protect, admin, uploadProductImages, createProduct);
router
  .route('/:id')
  .put(protect, admin, uploadProductImages, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/upload').post(protect, admin, uploadProductImages);

module.exports = router;