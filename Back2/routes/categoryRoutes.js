// backend/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/categoryController');

// Import middleware
// Ensure you are exporting both protect and admin from your middleware file
const { protect, admin } = require('../middleware/authMiddleware');

// --- Define Routes ---

// GET all categories (Public or Protected - adjust as needed)
router.route('/').get(getCategories);
// If GET needs auth: router.route('/').get(protect, getCategories);

// POST a new category (Admin only)
router.route('/').post(protect, admin, createCategory);

// DELETE a category (Admin only)
router.route('/:id').delete(protect, admin, deleteCategory);

module.exports = router;