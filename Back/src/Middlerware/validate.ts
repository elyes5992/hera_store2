// src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from './errorHandler';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }

    // Format validation errors
    const extractedErrors: Record<string, string> = {};
    errors.array().forEach(err => {
      if (err.type === 'field' && err.path && err.msg) {
        extractedErrors[err.path] = err.msg;
      }
    });

    return next(new AppError('Validation failed', 400, extractedErrors));
  };
};