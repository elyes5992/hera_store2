// src/components/PromoGrid.tsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';

// Import the necessary Icons
import CampaignIcon from '@mui/icons-material/Campaign';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import InfoIcon from '@mui/icons-material/Info';

// --- Animation Variants (Keep these) ---
const commonTransition = {
  duration: 0.4,
  ease: [0.25, 0.1, 0.25, 1.0],
};
const fromLeftVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: commonTransition },
};
const fromRightVariants = {
  hidden: { x: 100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: commonTransition },
};
const fromBottomVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: commonTransition },
};
// --- End Animation Variants ---

const PromoGrid: React.FC = () => {
  const viewportConfig = {
    once: false,
    amount: 0.3,
  };

  // Define common Paper styles for centering
  const centeredPaperStyles = {
    p: 3, // Consistent padding
    height: '100%',
    display: 'flex',
    flexDirection: 'column', // Ensure column layout
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    textAlign: 'center', // Center text
    bgcolor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Keep CSS hover
    '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' },
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportConfig}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          color="text.primary"
          component="h2"
          gutterBottom
          align="center"
          sx={{ mb: 4 }}
        >
          Featured Updates & Promos
        </Typography>
      </motion.div>

      {/* Top row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Left Item */}
        <Grid size={{xs:12 ,sm:12 ,md:6}}>
          <motion.div
            variants={fromLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            style={{ height: '100%' }}
          >
            <Paper elevation={3} sx={centeredPaperStyles} > {/* Apply common styles */}
              <CampaignIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" component="h3" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                New Collection Arrived!
              </Typography>
              {/* Use Box to control text width if needed, otherwise Typography directly */}
              <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1, mb: 2, maxWidth: '90%' }}> {/* Allow text to grow, add slight max width */}
                Explore the latest additions to our workspace organizers. Fresh designs, more colors!
              </Typography>
              <Button variant="outlined" color="primary" component={RouterLink} to="/products?category=new" sx={{ mt: 'auto' }}> {/* Push button towards bottom */}
                Discover Now
              </Button>
            </Paper>
          </motion.div>
        </Grid>

        {/* Right Item */}
        <Grid size={{xs:12 ,sm:12 ,md:6}}>
          <motion.div
            variants={fromRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            style={{ height: '100%' }}
          >
             <Paper elevation={3} sx={centeredPaperStyles}> {/* Apply common styles */}
              <LocalOfferIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} /> {/* Adjusted icon size/margin */}
              <Typography variant="h6" component="h3" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}> {/* Added gutterBottom */}
                Summer Sale On!
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1, mb: 2, maxWidth: '90%' }}> {/* Allow text to grow */}
                Get 15% off selected items. Limited time!
              </Typography>
              {/* Removed inner Box, place Button directly */}
              <Button variant="contained" color="secondary" component={RouterLink} to="/products?sale=true" sx={{ mt: 'auto' }}> {/* Push button towards bottom */}
                Shop Sale
              </Button>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Bottom row */}
      <Grid container spacing={3}>
        {/* Left Item */}
        <Grid size={{xs:12 ,sm:12 ,md:6}}>
          <motion.div
            variants={fromBottomVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            style={{ height: '100%' }}
          >
            <Paper elevation={3} sx={centeredPaperStyles}> {/* Apply common styles */}
              <NewReleasesIcon sx={{ fontSize: 40, color: 'info.main', mb: 2 }} /> {/* Adjusted icon size/margin */}
              <Typography variant="h6" component="h3" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}> {/* Added gutterBottom */}
                Free Shipping Update alwyas
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1, mb: 2, maxWidth: '90%' }}> {/* Allow text to grow */}
                Now available on all orders over $50.
              </Typography>
              {/* Removed inner Box, place Button directly */}
              <Button variant="text" color="info" component={RouterLink} to="/shipping-info" sx={{ mt: 'auto' }}> {/* Push button towards bottom */}
                Learn More
              </Button>
            </Paper>
          </motion.div>
        </Grid>

        {/* Right Item */}
        <Grid size={{xs:12 ,sm:12 ,md:6}}>
          <motion.div
            variants={fromBottomVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            style={{ height: '100%' }}
          >
            <Paper elevation={3} sx={centeredPaperStyles}> {/* Apply common styles */}
              <InfoIcon sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" component="h3" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                Care Instructions
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1, mb: 2, maxWidth: '90%' }}> {/* Allow text to grow */}
                Learn how to best maintain your 3D printed items for longevity and lasting beauty.
              </Typography>
              <Button variant="outlined" color="warning" component={RouterLink} to="/care-guide" sx={{ mt: 'auto' }}> {/* Push button towards bottom */}
                Read Guide
              </Button>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PromoGrid;