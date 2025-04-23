// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import User, { IUser } from '../models/userModule';

// Import type declarations
import '../types/express';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  // Check for token in cookies or Authorization header
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    // Find user by id
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Add user to request object with proper type assertion
    req.user = {
      id: (user._id as any).toString(),
      name: user.name,
      role: user.role,
      email: user.email
    };
    next();
  } catch (error) {
    return next(new AppError('Not authorized to access this route', 401));
  }
};

// Role-based authorization
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not found', 404));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`Role (${req.user.role}) is not authorized to access this route`, 403)
      );
    }
    next();
  };
}; 