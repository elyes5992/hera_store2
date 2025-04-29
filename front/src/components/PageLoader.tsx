// src/components/PageLoader.tsx
import React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// Loader Imports
import { Bouncy } from 'ldrs/react';
// If styles aren't automatically applied, you might need:
// import 'ldrs/react/Bouncy.css';

interface PageLoaderProps {
  isLoading: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ isLoading }) => {
  const theme = useTheme();

  // If not loading, render nothing
  if (!isLoading) {
    return null;
  }

  // If loading, render the overlay and loader
  return (
    <Box
      sx={{
        position: 'fixed', // Cover the whole screen
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent background
        backdropFilter: 'blur(3px)', // Optional blur
        zIndex: theme.zIndex.modal + 1, // Ensure it's on top
        // Optional: Add transitions for smoother fade-in/out
        // opacity: 1,
        // transition: 'opacity 0.3s ease-in-out',
      }}
      // If using transitions, you might control opacity via state slightly differently
    >
      <Bouncy
        size="60" // Adjust size
        speed="1.5" // Adjust speed
        // Use theme color or fallback
        color={theme.palette.primary.main || "black"}
      />
    </Box>
  );
};

export default PageLoader;