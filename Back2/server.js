// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const productRoutes = require('./routes/productRoutes');
const userRoutes=require ('./routes/userRoutes');
const path = require('path');
//const userRoutes= require('.routes/userRoutes')

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173', // Vite's default port
  credentials: true
}));

// Sanitize data to prevent NoSQL injection
app.use(mongoSanitize());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// Serve uploaded files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
});