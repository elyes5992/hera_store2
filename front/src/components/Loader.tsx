// src/components/BlobLoader.tsx
import React from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@mui/system';
import Typography from '@mui/material/Typography';

// Loading animation keyframes
const pulse = keyframes`
  0% { transform: scale(0.8); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.3; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface BlobLoaderProps {
  text?: string;
  isLoading?: boolean;
  colorPalette?: string[];
}

const BlobLoader: React.FC<BlobLoaderProps> = ({
  text = 'Loading...',
  isLoading = true,
  colorPalette = ['#e84a2e', '#ff8c00', '#ff5722', '#d84315', '#bf360c'],
}) => {
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
        backdropFilter: 'blur(5px)',
      }}
    >
      {/* Loader container with blobs */}
      <Box
        sx={{
          position: 'relative',
          width: '120px',
          height: '120px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Main centered blob */}
        <Box
          sx={{
            position: 'absolute',
            width: '60px',
            height: '60px',
            borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
            background: colorPalette[0],
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
            animation: `${pulse} 2s ease-in-out infinite`,
            zIndex: 2,
          }}
        />
        
        {/* Orbiting small blobs */}
        <Box
          sx={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            animation: `${spin} 8s linear infinite`,
          }}
        >
          {[...Array(4)].map((_, index) => (
            <Box
              key={`orbit-blob-${index}`}
              sx={{
                position: 'absolute',
                width: '20px',
                height: '20px',
                borderRadius: '60% 40% 50% 50% / 40% 60% 40% 60%',
                background: colorPalette[(index + 1) % colorPalette.length],
                top: `${50 - Math.sin(index * (Math.PI / 2)) * 50}%`,
                left: `${50 - Math.cos(index * (Math.PI / 2)) * 50}%`,
                transform: 'translate(-50%, -50%)',
                animation: `${pulse} 2s ease-in-out infinite ${index * 0.5}s`,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Loading text */}
      <Typography 
        variant="h6" 
        sx={{ 
          mt: 3, 
          fontWeight: 500,
          animation: `${float} 2s ease-in-out infinite`,
          color: '#333',
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default BlobLoader;