// src/components/Footer.tsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3, // Padding top & bottom
        px: 2, // Padding left & right
        mt: 'auto', // Margin top auto - crucial for sticky footer
        backgroundColor: '#3e2723', // Rich dark brown color
        color: 'white', // White text for all content
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" color="inherit">
          Your sticky footer content here.
        </Typography>
        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ mt: 1 }}>
          {'© '}
          {new Date().getFullYear()}
          {' Hera Prints. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;