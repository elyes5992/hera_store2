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

  router.route('/upload').post(protect, admin, uploadProductImages, (req, res) => {
    if (req.files) {
      const uploadedFiles = req.files.map(file => file.path.replace(/\\/g, '/'));
      res.json({ 
        success: true,
        images: uploadedFiles,
        imageUrl: uploadedFiles[0] // For backward compatibility
      });
    } else {
      res.status(400).json({ success: false, message: 'No files uploaded' });
    }
  });

module.exports = router;