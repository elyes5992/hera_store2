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
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import StarIcon from '@mui/icons-material/Star';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useTheme } from '@mui/material/styles'; // Import useTheme

// --- Animation Variants (Keep as is) ---
const containerVariants = { /* ... */ };
const itemVariants = { /* ... */ };

const MotionPaper = motion(Paper);
const MotionStack = motion(Stack);

// --- Style Constants for Frosted Effect ---
const frostedHeroSx = {
  backgroundColor: "rgba(255, 255, 255, 0.1)", // Adjust alpha for desired transparency
  backdropFilter: "blur(12px)", // Adjust blur
  border: "1px solid rgba(255, 255, 255, 0.18)",
  boxShadow: "none", // Remove base elevation shadow
  borderRadius: '16px', // Consistent rounding
};

// --- Text Color Constants for Contrast ---
const primaryTextFrosted = "rgba(255, 255, 255, 0.95)"; // Very bright white
const secondaryTextFrosted = "rgba(255, 255, 255, 0.75)"; // Slightly less bright white/grey
const dividerFrosted = "rgba(255, 255, 255, 0.12)";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme(); // Get theme

  const handleShopNowClick = () => {
    navigate('/products');
  };

  const viewportConfig = {
    once: false,
    amount: 0.2,
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: { xs: 4, md: 6 }, mb: { xs: 4, md: 6 } }}
    >
      <MotionPaper
        // elevation={4} // Removed base elevation
        sx={{
          ...frostedHeroSx, // Apply the frosted styles
          p: { xs: 3, sm: 4, md: 6 }, // Keep padding
          // bgcolor: 'rgba(255, 255, 255, 0.2)', // Overridden by frostedHeroSx
          // backdropFilter: 'blur(12px)', // Included in frostedHeroSx
          // borderRadius: '16px', // Included in frostedHeroSx
          // border: '1px solid rgba(255, 255, 255, 0.2)', // Included in frostedHeroSx
          textAlign: 'center',
          overflow: 'hidden',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease', // Add border-color transition
          '&:hover': {
             boxShadow: '0 8px 32px rgba(30, 35, 50, 0.3)', // Adjusted shadow for dark bg
             borderColor: "rgba(255, 255, 255, 0.3)", // Slightly brighter border on hover
          }
        }}
        // Animation (Keep as is)
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
      >
        <MotionStack
          spacing={2.5}
          alignItems="center"
          variants={containerVariants}
          initial="hidden"
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
                color: primaryTextFrosted, // *** TEXT COLOR ***
                lineHeight: 1.2,
                textShadow: '0 1px 3px rgba(0,0,0,0.2)', // Optional subtle text shadow
              }}
            >
              Elevate Your Desk Setup
            </Typography>
          </motion.div>

          {/* Main Description */}
          <motion.div variants={itemVariants}>
             <Typography
                variant="h6"
                component="p"
                sx={{
                    color: secondaryTextFrosted, // *** TEXT COLOR ***
                    lineHeight: 1.6,
                    maxWidth: '700px',
                    mx: 'auto'
                 }}>
                  Discover unique, high-quality 3D printed accessories designed for a modern workspace.
                </Typography>
          </motion.div>

          {/* Duplicate description removed */}

          {/* Key Selling Points / Stats Block */}
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 3 }}
              justifyContent="center"
              alignItems="center"
              // Use the frosted divider color
              divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block'}, borderColor: dividerFrosted }} />} // *** DIVIDER COLOR ***
              sx={{ mt: 1, mb: 1 }}
            >
              <Box display="flex" alignItems="center">
                  {/* Icons might need adjusted color too */}
                  <StarIcon sx={{ color: theme.palette.warning.light, mr: 0.5, fontSize: '1.3rem' }}/>
                  <Typography variant="body1" sx={{ color: secondaryTextFrosted}}> {/* *** TEXT COLOR *** */}
                    {/* Span color might need adjusting for contrast */}
                    <Box component="span" sx={{ color: theme.palette.warning.light, fontWeight: 'bold' }}>98%</Box> Customer Satisfaction
                  </Typography>
              </Box>

               <Box display="flex" alignItems="center">
                  <LocalShippingIcon sx={{ color: theme.palette.info.light, mr: 0.5, fontSize: '1.3rem' }}/>
                  <Typography variant="body1" sx={{ color: secondaryTextFrosted}}> {/* *** TEXT COLOR *** */}
                    Free Shipping on Orders <Box component="span" sx={{ fontWeight: 'bold' }}> $50</Box>
                  </Typography>
               </Box>

               <Box display="flex" alignItems="center">
                  <Typography variant="body1" sx={{ color: secondaryTextFrosted}}> {/* *** TEXT COLOR *** */}
                    Over <Box component="span" sx={{ fontWeight: 'bold' }}>50+</Box> Unique Designs
                  </Typography>
               </Box>
            </Stack>
          </motion.div>


           {/* Offer / Secondary Description (Optional) */}
           <motion.div variants={itemVariants}>
             <Typography
                variant="body1"
                component="p"
                sx={{
                    color: secondaryTextFrosted, // *** TEXT COLOR ***
                    lineHeight: 1.6,
                    maxWidth: '600px',
                    mx: 'auto'
                 }}>
                   {/* Adjust special text colors */}
                   Get <Box component="span" sx={{ color: theme.palette.secondary.light, fontWeight: 'bold' }}>10% OFF</Box> your first order! Use code: <Box component="span" sx={{ fontWeight: 'medium', borderBottom: `1px dashed ${secondaryTextFrosted}`, pb: '1px' }}>HERA10</Box>
                </Typography>
          </motion.div>


          {/* Button (Keep as is, contained buttons usually provide enough contrast) */}
          <motion.div variants={itemVariants}>
             <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleShopNowClick}
                sx={{
                    mt: 2,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    px: 5,
                    py: 1.5,
                    borderRadius: '25px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' // Slightly stronger shadow for button
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