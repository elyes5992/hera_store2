// models/Cart.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Reference for name, image, description etc.
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity cannot be less than 1.'],
      default: 1,
    },
    // ADDED: Store the price as it was when added to cart
    priceAtAdd: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative.']
    }
    // Note: We still don't store name/image/description here directly.
    // We populate productId to get those.
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;