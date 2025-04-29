// backend/controllers/categoryController.js
const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');
const mongoose = require('mongoose'); // For ObjectId validation

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public (or Private/Admin if needed)
const getCategories = asyncHandler(async (req, res) => {
  // Optional: Add sorting, pagination if needed later
  const categories = await Category.find({}).sort({ name: 1 }); // Sort alphabetically by name
  res.status(200).json(categories);
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    res.status(400);
    throw new Error('Category name is required');
  }

  const categoryExists = await Category.findOne({ name: name.trim() });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({
    name: name.trim(),
    // Add other fields if your model has them
  });

  if (category) {
    res.status(201).json(category); // 201 Created
  } else {
    res.status(400);
    throw new Error('Invalid category data');
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      res.status(400);
      throw new Error('Invalid category ID format');
  }

  const category = await Category.findById(categoryId);

  if (category) {
    // Optional: Add checks here if needed (e.g., prevent deleting if products use it)
    // Example:
    // const productsUsingCategory = await Product.countDocuments({ category: categoryId });
    // if (productsUsingCategory > 0) {
    //   res.status(400);
    //   throw new Error('Cannot delete category with associated products.');
    // }

    await category.deleteOne(); // Or: await Category.deleteOne({ _id: categoryId });
    res.status(200).json({ message: 'Category removed successfully', id: categoryId });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
};