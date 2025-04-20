// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '../components/Navbar';


const MainLayout: React.FC = () => {
  return (
    
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        // Apply the gradient background to the entire layout
        background: "linear-gradient(135deg, #FF8C00 0%,rgb(238, 199, 181) 100%)",
        // Remove any default margins or padding that might cause gaps
        margin: 0,
        padding: 0,
        position: 'relative', // Add this
        overflow: 'hidden'
      }}
    >
      <CssBaseline />
      
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          // Remove any default margins or padding that might cause gaps
          margin: 0,
          padding: 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;