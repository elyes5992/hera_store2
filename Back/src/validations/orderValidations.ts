// src/validations/orderValidations.ts
import { body } from 'express-validator';

export const createOrderValidation = [
  body('orderItems')
    .isArray()
    .withMessage('Order items must be an array')
    .notEmpty()
    .withMessage('Order items cannot be empty'),
  
  body('orderItems.*.product')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('orderItems.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  
  body('shippingAddress.address')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  
  body('shippingAddress.city')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('shippingAddress.postalCode')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),
  
  body('shippingAddress.country')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  
  body('paymentMethod')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Payment method is required'),
  
  body('itemsPrice')
    .isNumeric()
    .withMessage('Items price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Items price must be greater than or equal to 0'),
  
  body('taxPrice')
    .isNumeric()
    .withMessage('Tax price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Tax price must be greater than or equal to 0'),
  
  body('shippingPrice')
    .isNumeric()
    .withMessage('Shipping price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Shipping price must be greater than or equal to 0'),
  
  body('totalPrice')
    .isNumeric()
    .withMessage('Total price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Total price must be greater than or equal to 0')
];