// Animated "View Products" Button Component
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { keyframes } from '@mui/system';

// Define animations
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 138, 76, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 138, 76, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 138, 76, 0);
  }
`;

const arrowMove = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
`;

const AnimatedProductButton = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mt: 4,
        mb: 4
      }}
    >
      <Button
        variant="contained"
        component={RouterLink}
        to="/products"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '28px',
          padding: '12px 30px',
          fontSize: '1.1rem',
          fontWeight: '600',
          letterSpacing: '0.5px',
          textTransform: 'none',
          transition: 'all 0.3s ease',
          backgroundColor: 'primary.main',
          color: 'white',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          
          // Before element for background effect
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            transition: 'all 0.6s ease',
          },
          
          // Animations and hover effects
          animation: `${pulse} 2s infinite`,
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
            backgroundColor: 'primary.dark',
            '&::before': {
              left: '100%'
            },
            '& .MuiButton-endIcon': {
              animation: `${arrowMove} 0.8s ease infinite`
            }
          },
          
          // Active state effect
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }
        }}
        endIcon={
          <ArrowForwardIcon 
            sx={{ 
              ml: 0.5, 
              transition: 'all 0.3s ease'
            }} 
          />
        }
      >
        View Products
      </Button>
    </Box>
  );
};

// Example usage in your HomePage component:
/*
import AnimatedProductButton from '../components/AnimatedProductButton';

// Then inside your HomePage component's return:
<Container>
  {/* Other content *//*}
  <AnimatedProductButton />
</Container>
*/

export default AnimatedProductButton;