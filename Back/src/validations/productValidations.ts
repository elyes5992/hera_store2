// src/validations/productValidations.ts
import { body } from 'express-validator';

export const createProductValidation = [
  body('name')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Product name cannot exceed 100 characters'),
  
  body('description')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be greater than or equal to 0'),
  
  body('images')
    .isArray()
    .withMessage('Images must be an array')
    .notEmpty()
    .withMessage('At least one image is required'),
  
  body('category')
    .isMongoId()
    .withMessage('Invalid category ID'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a positive integer'),
  
  body('discountPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100')
];

export const createReviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Comment is required')
];