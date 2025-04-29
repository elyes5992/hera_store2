// backend/models/categoryModel.js
const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      unique: true, // Prevent duplicate category names
      trim: true,   // Remove leading/trailing whitespace
    },
    // Optional: Add other fields like description, image, etc. if needed
    // description: {
    //   type: String,
    // },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Category', categorySchema);