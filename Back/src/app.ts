// src/app.ts (updated with security)
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import path from 'path';
import { errorHandler } from './Middlerware/errorHandler';


// Import routes
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import categoryRoutes from './routes/categoryRoutes';


const app: Express = express(); 

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Security middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  })
);
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Sanitize data against NoSQL query injection
app.use(xss()); // Sanitize data against XSS attacks
app.use(hpp({ whitelist: ['price', 'rating', 'category'] })); // Prevent HTTP param pollution

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}



// Set static folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);


// Error handling middleware
app.use(errorHandler);

export default app;