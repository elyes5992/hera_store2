// src/controllers/productController.ts
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import Product from '../models/productModel';
import { AppError } from '../Middlerware/errorHandler';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    
    // Filtering
    let query: any = {};
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = parseFloat(req.query.minPrice as string);
      }
      if (req.query.maxPrice) {
        query.price.$lte = parseFloat(req.query.maxPrice as string);
      }
    }
    
    // Filter by featured
    if (req.query.featured) {
      query.featured = req.query.featured === 'true';
    }
    
    // Searching
    if (req.query.keyword) {
      query['name'] = {
        $regex: req.query.keyword as string,
        $options: 'i'
      };
    }
    
    // Execute query with pagination
    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .limit(limit)
      .skip(startIndex)
      .sort(req.query.sort ? String(req.query.sort) : '-createdAt');
    
    // Pagination result
    const pagination = {
      total: count,
      pages: Math.ceil(count / limit),
      page,
      limit
    };
    
    res.status(200).json({
      success: true,
      pagination,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    
    if (!product) {
      return next(new AppError(`Product not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return next(new AppError(`Product not found with id of ${req.params.id}`, 404));
    }
    
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return next(new AppError(`Product not found with id of ${req.params.id}`, 404));
    }
    
    await product.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rating, comment } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return next(new AppError(`Product not found with id of ${req.params.id}`, 404));
    }
    
    // Check if the user already reviewed the product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.id.toString()
    );
    
    if (alreadyReviewed) {
      return next(new AppError('Product already reviewed', 400));
    }
    
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: new mongoose.Types.ObjectId(req.user.id),
      createdAt: new Date()
    };
    
    product.reviews.push(review);
    product.calculateAverageRating();
    
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Review added'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    
    const products = await Product.find({})
      .sort({ averageRating: -1 })
      .limit(limit);
    
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product images
// @route   POST /api/products/upload
// @access  Private/Admin
export const uploadProductImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return next(new AppError('Please upload at least one image', 400));
    }
    
    const files = req.files as any[];
    const fileUrls = files.map(file => `/uploads/${file.filename}`);
    
    res.status(200).json({
      success: true,
      files: fileUrls
    });
  } catch (error) {
    next(error);
  }
};