// src/middleware/fileUpload.ts
import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Create unique file name with original extension
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});

// Check file type
const fileFilter = (req: Request, file: any, cb: multer.FileFilterCallback) => {
  // Allow only images
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  
  cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'));
};

// Initialize upload
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter
});