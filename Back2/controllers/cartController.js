// controllers/cartController.js
const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel'); // Import Product model for validation
const mongoose = require('mongoose'); // Import mongoose if needed for validation

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate({
    path: 'items.productId', // Populate product details for each item
    select: 'name price imageUrl description stockCount discountPercentage category tags' // <-- ADD description and other fields you need
  });

  if (cart) {
    // Filter out items where product might no longer exist
    cart.items = cart.items.filter(item => item.productId);
    // Note: No need to save here unless filtering actually removed items,
    // but saving doesn't hurt if you want to ensure DB reflects the filtered state.
    // await cart.save();

    res.json(cart); // Send the populated cart
  } else {
    res.json({ _id: null, userId: req.user._id, items: [], createdAt: null, updatedAt: null });
  }
});

// @desc    Add or update item in cart
// @route   POST /api/cart/items
// @access  Private
const addOrUpdateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  // --- Input Validation ---
  if (!productId || quantity === undefined || quantity === null) {
    res.status(400); throw new Error('Missing productId or quantity');
  }
  const qty = Number(quantity);
   // Allow qty 0 for potential removal logic later if desired, but must be >= 0
  if (isNaN(qty) || qty < 0) {
     res.status(400); throw new Error('Quantity must be a non-negative number');
  }
  // ------------------------

  // --- Fetch Product and Calculate Price ---
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404); throw new Error('Product not found');
  }

  // Calculate the price to store (including potential discount)
  const priceToStore = (product.discountPercentage && product.discountPercentage > 0)
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  // Optional: Stock check
  // if (product.stockCount < qty) { ... }
  // ---------------------------------------

  let cart = await Cart.findOne({ userId });

  // If cart doesn't exist, create it (only if qty > 0)
  if (!cart) {
    if (qty > 0) {
        cart = await Cart.create({
            userId,
            items: [{ productId, quantity: qty, priceAtAdd: priceToStore }] // <-- Store priceAtAdd
        });
    } else {
         res.status(400); throw new Error('Cannot create cart with zero quantity.');
    }
  } else {
    // Cart exists, find item
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (existingItemIndex > -1) {
        // Item exists
        if (qty > 0) {
            // Update quantity and potentially price (optional: only update price if you want it to track changes)
            cart.items[existingItemIndex].quantity = qty;
            cart.items[existingItemIndex].priceAtAdd = priceToStore; // <-- Update priceAtAdd
        } else {
            // Quantity is 0, remove item
            cart.items.splice(existingItemIndex, 1);
        }
    } else {
        // Item doesn't exist, add it (only if qty > 0)
        if (qty > 0) {
            cart.items.push({ productId, quantity: qty, priceAtAdd: priceToStore }); // <-- Store priceAtAdd
        } else {
             console.log("Attempted to add new item with zero quantity. Ignoring.");
             // Or throw error
        }
    }
    await cart.save();
  }

  // Populate the updated cart before sending response
  const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'name price imageUrl description stockCount discountPercentage category tags' // <-- Use same fields as getCart
  });
  res.status(200).json(updatedCart);
});

// --- removeCartItem and clearCart remain the same ---
// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const productIdToRemove = req.params.productId;
  const userId = req.user._id;

  // --- VALIDATE productId (Optional but recommended) ---
  if (!mongoose.Types.ObjectId.isValid(productIdToRemove)) {
      res.status(400);
      throw new Error('Invalid product ID format');
  }
  // ----------------------------------------------------

  // --- FETCH THE CART FIRST ---
  const cart = await Cart.findOne({ userId }); // <--- This fetches the cart

  if (!cart) {
    // If the user somehow has no cart, there's nothing to remove from
    res.status(404);
    throw new Error('Cart not found');
  }
  // --- CART IS NOW DEFINED ---


  // --- Find the item within the cart ---
  const itemIndex = cart.items.findIndex(
    // Ensure comparison works with ObjectId objects
    (item) => item.productId.toString() === productIdToRemove
  );

  if (itemIndex > -1) {
    // Item found, remove it from the array
    cart.items.splice(itemIndex, 1);

    // --- SAVE THE UPDATED CART ---
    await cart.save(); // Save the changes to the database

    // --- POPULATE AND SEND RESPONSE ---
    // Re-populate the saved cart to send back the latest state with product details
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'name price imageUrl description stockCount discountPercentage category tags' // Ensure all needed fields are here
    });
    res.status(200).json(updatedCart); // Send the updated cart

  } else {
    // Item was not found in the cart
    console.log(`Item ${productIdToRemove} not found in cart ${cart._id} for user ${userId}. Sending current cart state.`);
    // Optionally send 404, but often better to just return the current cart state
    // res.status(404);
    // throw new Error('Item not found in cart');

    // Populate the existing cart (even though nothing changed) and send it back
     const currentPopulatedCart = await Cart.findById(cart._id).populate({
        path: 'items.productId',
        select: 'name price imageUrl description stockCount discountPercentage category tags'
     });
    res.status(200).json(currentPopulatedCart);

  }
});

const clearCart = asyncHandler(async (req, res) => {
    // ... (previous code for clearCart) ...
});


module.exports = {
  getCart,
  addOrUpdateCartItem,
  removeCartItem,
  clearCart,
};