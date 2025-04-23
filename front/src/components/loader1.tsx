// src/components/LoadingSpinner.tsx
import React from 'react';
import { CircleLoader } from '../react-awesome-loaders-main'; // Import the specific loader
import Box from '@mui/material/Box'; // Using Box for easy centering (optional)

// Optional: Define props if you want to customize the loader later
interface LoadingSpinnerProps {
  size?: string;        // e.g., "60px"
  color?: string;       // e.g., "#ff5722"
  message?: string;     // Optional text message
  fullScreen?: boolean; // Optional: Center in the viewport
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "80px",          // Default size
  color = "#e84a2e",      // Default color (using one from your previous palette)
  message = "Loading...", // Default message
  fullScreen = false,   // Default to not taking full screen
}) => {

  // --- Loader Specific Props ---
  // Check react-awesome-loaders documentation for exact prop names if needed
  // For CirclesLoader, common props might relate to color, size aspects.
  // Let's assume it takes basic styling or has its own props.
  // *Update*: Looking at the source, CirclesLoader seems less directly customizable via simple props like 'size'.
  // It uses CSS variables. We'll control size/color via a wrapper or directly if possible.
  // Many loaders in this library DO accept `loaderProps` or similar. Let's simplify for now.
  // We'll primarily use the wrapper for centering and pass color potentially.

  const loaderStyle = {
     // If the loader component *itself* takes style props:
     // width: size,
     // height: size,
     // color: color, // Some loaders might use font color

     // Or often, you might need to set CSS variables if the loader uses them:
     '--loader-color': color, // Common pattern for this library
     '--loader-size': size,   // Example if it uses size variable
     fontSize: size, // Size might also be controlled by font-size for some loaders
  };


  // --- Wrapper Styling ---
  const wrapperSx = {
    display: 'flex',
    flexDirection: 'column', // Stack loader and message vertically
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: fullScreen ? '100vh' : '100%', // Take full viewport height if specified
    minHeight: '150px', // Ensure some minimum space
    textAlign: 'center',
    ...(fullScreen && { // Apply fixed positioning if fullScreen
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1500, // Ensure it's on top
        background: 'rgba(255, 255, 255, 0.8)', // Optional: dim background
    })
  };

  return (
    <Box sx={wrapperSx}>
      {/* Apply styles directly or pass props if the loader accepts them */}
      <CirclesLoader
         // Pass any props the specific loader component accepts
         // loaderProps={{ style: loaderStyle }} // Common pattern if it uses loaderProps
         style={loaderStyle} // Or apply style directly if accepted
         // Other specific props for CirclesLoader if available...
      />
      {message && (
        <Box component="p" sx={{ marginTop: '1rem', color: color, fontWeight: 'medium' }}>
          {message}
        </Box>
      )}
    </Box>
  );
};

export default LoadingSpinner;