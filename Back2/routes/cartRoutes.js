// routes/cartRoutes.js
const express = require('express');
const router = express.Router();

// Import controller functions using require
const {
  getCart,
  addOrUpdateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController'); // Adjust path if needed, remove .js

// Import middleware using require
const { protect } = require('../middleware/authMiddleware'); // Adjust path if needed, remove .js

// --- Define Routes with Middleware Applied Per Route ---

// GET /api/cart - Get the logged-in user's cart
// DELETE /api/cart - Clear the logged-in user's cart
router.route('/')
  .get(protect, getCart)        // Add protect middleware before controller
  .delete(protect, clearCart);   // Add protect middleware before controller

// POST /api/cart/items - Add an item or update quantity for the logged-in user
router.route('/items')
  .post(protect, addOrUpdateCartItem); // Add protect middleware before controller

// DELETE /api/cart/items/:productId - Remove a specific item for the logged-in user
router.route('/items/:productId')
  .delete(protect, removeCartItem); // Add protect middleware before controller

// Export the router using module.exports
module.exports = router;