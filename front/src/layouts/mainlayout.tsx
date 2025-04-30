// src/layouts/MainLayout.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from '@mui/material/styles'; // *** Ensure this is imported ***
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import Toolbar from '@mui/material/Toolbar';




import PageLoader from '../components/PageLoader';
import FloatingBlobs2 from '../components/FloatingBlobs2';






const MainLayout: React.FC = () => {
  const location = useLocation();
  const theme = useTheme(); // *** Ensure theme is obtained ***
  const navigate = useNavigate();

  const [isForceLoading, setIsForceLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); 


  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // When location changes, set loading to true
     setIsForceLoading(true);

     timeoutRef.current = setTimeout(() => {
      setIsForceLoading(false);
      timeoutRef.current = null; // Clear the ref after timeout completes
    }, 2000);
    
    // After a delay, set loading to false (transition complete)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location.pathname]); // Re-run this effect ONLY when the pathname changes
  // --- End Forced Loader Effect ---


  // --- Determine if the loader should be shown ---
  // Show if React Router is loading OR if we are force loading
  

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
        background: "linear-gradient(135deg, #3a2f6b 0%, #0d4d54 100%)",
        margin: 0,
        padding: 0,
        position: 'relative',
        
      }}
    >
      {/* Background shapes positioned absolutely */}
      {/*<Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <BackgroundShapes variant={getShapeVariant()} />
      </Box>*/}
      {/*}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>  
        <FloatingBlobs/>
      </Box>  */}

     
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>  
        <FloatingBlobs2/>
      </Box>  
      
      
      
     
      <CssBaseline />
      
      
      {/* Navbar is rendered here but positioned fixed via its own styles */}
      <Navbar />
      <PageLoader isLoading={isLoading} /> {/* Loader component */}
      

      {/* Toolbar to push content below the navbar */}
      {/* This is a placeholder. You can customize it or remove it if not needed */}
      
      
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