// src/components/HeroSection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Divider, // Import Divider
} from '@mui/material';
import { motion } from 'framer-motion'; // Import motion
import StarIcon from '@mui/icons-material/Star'; // Example Icon for rating
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; // Example Icon for shipping

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Slightly faster stagger
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      duration: 0.5,
    },
  },
};

const MotionPaper = motion(Paper);
const MotionStack = motion(Stack);

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleShopNowClick = () => {
    navigate('/products');
  };

  const viewportConfig = {
    once: false, // Animate only once
    amount: 0.2, // Trigger when 20% is visible
  };

  return (
    
    <Container
      maxWidth="lg"
      
      sx={{ mt: { xs: 4, md: 6 }, mb: { xs: 4, md: 6 } }}
    >
      <MotionPaper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 4, md: 6 }, // Adjusted padding
          bgcolor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
          overflow: 'hidden',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
             boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }
        }}
        // Animate paper fade in
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
      >
        {/* Main Stagger Container */}
        <MotionStack
          spacing={2.5} // Slightly increase spacing
          alignItems="center"
          variants={containerVariants}
          initial="hidden"
          // Use whileInView for scroll triggering based on viewportConfig
          whileInView="visible"
          viewport={viewportConfig}
        >
          {/* Headline */}
          <motion.div variants={itemVariants}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                color: 'text.primary',
                lineHeight: 1.2,
              }}
            >
              Elevate Your Desk Setup
            </Typography>
          </motion.div>

          {/* Main Description */}
          <motion.div variants={itemVariants}>
             <Typography
                variant="h6" // Use h6 for better hierarchy
                component="p"
                sx={{
                    color: 'text.secondary',
                    lineHeight: 1.6,
                    maxWidth: '700px',
                    mx: 'auto'
                 }}>
                  Discover unique, high-quality 3D printed accessories designed for a modern workspace.
                </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
             <Typography
                variant="h6" // Use h6 for better hierarchy
                component="p"
                sx={{
                    color: 'text.secondary',
                    lineHeight: 1.6,
                    maxWidth: '700px',
                    mx: 'auto'
                 }}>
                  Discover unique, high-quality 3D printed accessories designed for a modern workspace.
                </Typography>
          </motion.div>

          {/* Key Selling Points / Stats Block */}
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }} // Stack vertically on small, row on larger
              spacing={{ xs: 1.5, sm: 3 }} // Adjust spacing
              justifyContent="center"
              alignItems="center"
              divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block'}, borderColor: 'rgba(0, 0, 0, 0.1)' }} />} // Divider for larger screens
              sx={{ mt: 1, mb: 1 }} // Add margin
            >
              <Box display="flex" alignItems="center">
                  <StarIcon sx={{ color: 'warning.main', mr: 0.5, fontSize: '1.3rem' }}/>
                  <Typography variant="body1" sx={{ color: 'text.secondary'}}>
                    <Box component="span" sx={{ color: 'warning.main', fontWeight: 'bold' }}>98%</Box> Customer Satisfaction
                  </Typography>
              </Box>

               <Box display="flex" alignItems="center">
                  <LocalShippingIcon sx={{ color: 'info.main', mr: 0.5, fontSize: '1.3rem' }}/>
                  <Typography variant="body1" sx={{ color: 'text.secondary'}}>
                    Free Shipping on Orders <Box component="span" sx={{ fontWeight: 'bold' }}> $50</Box>
                  </Typography>
               </Box>

               <Box display="flex" alignItems="center">
                   {/* Optional: Add another stat like items sold or design count */}
                  <Typography variant="body1" sx={{ color: 'text.secondary'}}>
                    Over <Box component="span" sx={{ fontWeight: 'bold' }}>50+</Box> Unique Designs
                  </Typography>
               </Box>
            </Stack>
          </motion.div>


           {/* Offer / Secondary Description (Optional) */}
           <motion.div variants={itemVariants}>
             <Typography
                variant="body1" // Smaller text for offer
                component="p"
                sx={{
                    color: 'text.secondary',
                    lineHeight: 1.6,
                    maxWidth: '600px',
                    mx: 'auto'
                 }}>
                   Get <Box component="span" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>10% OFF</Box> your first order! Use code: <Box component="span" sx={{ fontWeight: 'medium', borderBottom: '1px dashed', pb: '1px' }}>HERA10</Box>
                </Typography>
          </motion.div>


          {/* Button */}
          <motion.div variants={itemVariants}>
             <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleShopNowClick}
                sx={{
                    mt: 2, // Keep margin top
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    px: 5, // Slightly more padding
                    py: 1.5,
                    borderRadius: '25px', // More rounded button
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' // Subtle shadow
                }}
            >
                Shop Now & Save
            </Button>
          </motion.div>

        </MotionStack>
      </MotionPaper>
    </Container>
    
  );
};

export default HeroSection;