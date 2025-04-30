// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const productRoutes = require('./routes/productRoutes');
const userRoutes=require ('./routes/userRoutes');
const orderRoutes=require ('./routes/orderRoutes');
const cartRoutes=require ('./routes/cartRoutes');
const categoryRoutes=require ('./routes/categoryRoutes');
const setupAdminUser = require('./utils/adminsetup');
const path = require('path');
//const userRoutes= require('.routes/userRoutes')

// Load environment variables
dotenv.config();

// Connect to database
connectDB().then(() => {
  // Setup admin user after database connection
  setupAdminUser();
});

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    :[ 'http://localhost:5173','http://172.16.50.122:5173'], // Vite's default port
  credentials: true
}));

// Sanitize data to prevent NoSQL injection
app.use(mongoSanitize());

// Serve uploaded files from the uploads folder
const uploadsPath = path.join(__dirname, '/uploads');
console.log('Attempting to serve static files for /uploads from:', uploadsPath); // Add logging
app.use('/uploads', express.static(uploadsPath));

// Routes
app.get('/', (req, res) => {
  res.send('Hera Store API is running');
});
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes); 










// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
});