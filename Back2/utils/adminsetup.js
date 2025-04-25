// utils/adminSetup.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const setupAdminUser = async () => {
  try {
    // Check if admin user exists
    let adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminUser) {
      console.log('Creating admin user...');
      // Create admin user
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      adminUser = await User.create({
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD, // Will be hashed by pre-save hook
        isAdmin: true
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error setting up admin user:', error.message);
  }
};

module.exports = setupAdminUser;