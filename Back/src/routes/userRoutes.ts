// src/routes/userRoutes.ts (updated)
import express from 'express';
import { 
  register, 
  login, 
  logout, 
  getProfile, 
  updateProfile,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userControllers';
import { protect, authorize } from '../Middlerware/auth';
import { validate } from '../Middlerware/validate';
import { 
  registerValidation, 
  loginValidation, 
  updateProfileValidation, 
  resetPasswordValidation 
} from '../validations/userValidations';

const router = express.Router();

// Public routes
router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.post('/logout', logout);
