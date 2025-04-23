// src/validations/userValidations.ts

import { check } from 'express-validator';

// Validation rules for user registration
export const registerValidation = [
  check('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ max: 50 }).withMessage('Name cannot be more than 50 characters.'),

  check('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(), // Converts email to lowercase

  check('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),

  // Optional: Add password confirmation
  check('passwordConfirmation')
     .if(check('password').exists({ checkFalsy: true })) // Only run if password is provided
     .notEmpty().withMessage('Password confirmation is required.')
     .custom((value, { req }) => {
         if (value !== req.body.password) {
             throw new Error('Passwords do not match.');
         }
         return true; // Indicates the validation passed
     }),

  // Optional: Validate role if provided, otherwise it defaults
  check('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Invalid role specified.')
];

// Validation rules for user login
export const loginValidation = [
  check('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  check('password')
    .notEmpty().withMessage('Password is required.')
];

// Validation rules for updating user profile (name, email)
export const updateProfileValidation = [
  check('name')
    .optional() // Name is optional for update
    .trim()
    .notEmpty().withMessage('Name cannot be empty if provided.')
    .isLength({ max: 50 }).withMessage('Name cannot be more than 50 characters.'),

  check('email')
    .optional() // Email is optional for update
    .trim()
    .isEmail().withMessage('Please provide a valid email address if updating.')
    .normalizeEmail()
];

// Validation rules for resetting password (requires new password)
export const resetPasswordValidation = [
  check('password')
    .notEmpty().withMessage('New password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),

  // Optional: Add password confirmation for reset
  check('passwordConfirmation')
     .if(check('password').exists({ checkFalsy: true })) // Only run if password is provided
     .notEmpty().withMessage('Password confirmation is required.')
     .custom((value, { req }) => {
         if (value !== req.body.password) {
             throw new Error('Passwords do not match.');
         }
         return true;
     }),
];

// Optional: Validation for the forgot password request itself (just needs email)
export const forgotPasswordValidation = [
    check('email')
        .trim()
        .notEmpty().withMessage('Email is required to request a password reset.')
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail(),
];

// Optional: Validation rules for Admin updating a user
export const adminUpdateUserValidation = [
    check('name')
        .optional()
        .trim()
        .notEmpty().withMessage('Name cannot be empty if provided.')
        .isLength({ max: 50 }).withMessage('Name cannot be more than 50 characters.'),

    check('email')
        .optional()
        .trim()
        .isEmail().withMessage('Please provide a valid email address if updating.')
        .normalizeEmail(),

    check('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Invalid role specified.')
];