// src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './Config/db';

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});