// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar'; // Make sure this import is correct
import Footer from '../components/Footer';

const MainLayout: React.FC = () => {
  return (
    // This Box should contain ONLY Navbar, main content Box with Outlet, and Footer
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* ===> Navbar should be rendered exactly ONCE here <=== */}
      <Navbar />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // Optional: Add padding here if needed, e.g., pt: 2 for space below sticky nav
          // paddingTop: (theme) => `${theme.mixins.toolbar.minHeight}px` // Or use theme value if AppBar isn't sticky
        }}
      >
        <Outlet /> {/* Page content renders here */}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default MainLayout;