// src/routes/productRoutes.ts
import express from 'express';
import { 
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  uploadProductImages
} from '../controllers/productController';
import { protect, authorize } from '../Middlerware/auth';
import { upload } from '../Middlerware/fileUploads';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/top', getTopProducts);
router.get('/:id', getProductById);

// Protected routes
router.post('/:id/reviews', protect, createProductReview);

// Admin routes
router.post('/', protect, authorize('admin'), createProduct);
router.post(
  '/upload', 
  protect, 
  authorize('admin'), 
  upload.array('images', 5), 
  uploadProductImages
);

router.route('/:id')
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

export default router;