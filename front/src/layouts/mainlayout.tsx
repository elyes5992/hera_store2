// src/layouts/MainLayout.tsx
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from '@mui/material/styles'; // *** Ensure this is imported ***
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import Toolbar from '@mui/material/Toolbar';


import FloatingBlobs from '../components/floatingblobs';
import BlobLoader from '../components/Loader';



const MainLayout: React.FC = () => {
  const location = useLocation();
  const theme = useTheme(); // *** Ensure theme is obtained ***
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // When location changes, set loading to true
    setIsLoading(true);
    
    // After a delay, set loading to false (transition complete)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Adjust timing as needed
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };







  const getShapeVariant = () => {
    if (location.pathname.includes('/products')) {
      return 'product';
    } else if (location.pathname.includes('/contact')) {
      return 'contact';
    }
    return 'default';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        background: "linear-gradient(135deg, #e2cc9c 0%, #e84a2e 100%)",
        margin: 0,
        padding: 0,
        position: 'relative',
        
      }}
    >
      {/* Background shapes positioned absolutely */}
      {/*<Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <BackgroundShapes variant={getShapeVariant()} />
      </Box>*/}

      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>  
        <FloatingBlobs/>
      </Box>  

     

      
      
      

      <CssBaseline />
      
      {/* Navbar is rendered here but positioned fixed via its own styles */}
      <Navbar />
      <Toolbar />
      

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          position: 'relative',
          zIndex: 1, // Content above shapes
          
          
          pt: theme.mixins.toolbar,
         
        }}
      >
        <Outlet /> {/* Page content renders here */}
      </Box>

      {/* Footer is rendered last */}
      <Footer />
    </Box>
  );
};

export default MainLayout;