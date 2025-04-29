// src/pages/AboutUsPage.tsx
import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper"; // Import Paper
// Grid is still optional, uncomment if needed
// import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles"; // Import useTheme
import { blue, orange } from "@mui/material/colors";

// --- Style Constants for Frosted Effect ---
const frostedPaperSx = {
  p: { xs: 3, sm: 4, md: 5 }, // Generous padding inside the paper
  backgroundColor: "rgba(255, 255, 255, 0.1)", // Adjust alpha as needed
  backdropFilter: "blur(12px)", // Adjust blur
  border: "1px solid rgba(255, 255, 255, 0.18)",
  boxShadow: "none", // Remove default elevation shadow
  borderRadius: "16px", // Consistent rounding
};

// --- Text Color Constants ---
const primaryTextFrosted = "rgba(255, 255, 255, 0.95)"; // Very bright white
const secondaryTextFrosted = "rgba(255, 255, 255, 0.75)"; // Slightly less bright white/grey

const AboutUsPage: React.FC = () => {
  const theme = useTheme(); // Get theme if needed for specific overrides

  return (
    // Container centers content and sets max width
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}> {/* Adds vertical padding */}
      {/* Page Title (outside the frosted box for prominence) */}
      <Typography
        variant="h3"
        component="h1"
        align="center" // Center the main title
        gutterBottom
        sx={{
          color: "#fff", // White color for title
          fontWeight: 600,
          mb: 5, // Margin below title
          textShadow: "0 2px 10px rgba(0,0,0,0.1)" // Optional subtle shadow
        }}
      >
        About Us
      </Typography>

      {/* Frosted Paper container for all the text content */}
      <Paper
        elevation={0} // Remove elevation
        sx={{
          ...frostedPaperSx, // Apply the frosted styles
        }}
      >
        {/* Use Box for internal structure if needed, or directly place Typography */}
        <Box>
          {/* --- Add Your About Us Content Here --- */}

          {/* Section 1: Introduction */}
          <Typography variant="h5" component="h2" sx={{ mt: 0, mb: 2, color: "#FF6347", fontWeight: 'bold' }}> {/* Adjusted margin, color */}
            Our Story
          </Typography>
          {/* Set text color for paragraphs */}
          <Typography variant="body1" paragraph sx={{ color: secondaryTextFrosted }}>
            Welcome to Hera Prints! Founded in [Year], we started with a simple passion for creativity and technology. We saw the potential of 3D printing to transform everyday objects into personalized, functional, and beautiful pieces. What began as a small workshop experimenting with designs has grown into a dedicated space for crafting unique desk accessories and home goods.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: secondaryTextFrosted }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: secondaryTextFrosted }}>
            Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque.
          </Typography>

          {/* Section 2: Mission */}
          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2, color: "#FF6347", fontWeight: 'bold' }}>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: secondaryTextFrosted }}>
            Our mission is to elevate your workspace and home environment through thoughtfully designed and meticulously crafted 3D printed products. We believe that organization and aesthetics go hand-in-hand, and we strive to create items that are not only practical but also inspire creativity and bring joy to your daily routines. We are committed to using high-quality materials and sustainable practices whenever possible.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: secondaryTextFrosted }}>
            Aliquam faucibus, purus at gravida vehicula, arcu nisl condimentum nisl, vitae convallis nisl justo eu sapien. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.
          </Typography>

          {/* Section 3: Why Choose Us? */}
          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2, color: "#FF6347", fontWeight: 'bold'}}>
            Why Hera Prints?
          </Typography>
          {/* Use Box with display flex for bullet points if needed, or keep as separate paragraphs */}
          <Typography variant="body1" paragraph sx={{ color: secondaryTextFrosted }}>
            <Box component="span" sx={{ fontWeight: 'bold', color: primaryTextFrosted }}>Unique Designs:</Box> We focus on original, modern aesthetics you won't find everywhere else.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: secondaryTextFrosted }}>
            <Box component="span" sx={{ fontWeight: 'bold', color: primaryTextFrosted }}>Quality Materials:</Box> We select durable and often eco-friendly filaments for longevity.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: secondaryTextFrosted }}>
            <Box component="span" sx={{ fontWeight: 'bold', color: primaryTextFrosted }}>Attention to Detail:</Box> Every print is inspected to ensure it meets our quality standards.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: secondaryTextFrosted }}>
            <Box component="span" sx={{ fontWeight: 'bold', color: primaryTextFrosted }}>Customer Focus:</Box> We value your feedback and are always looking for ways to improve.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: secondaryTextFrosted }}>
            Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: secondaryTextFrosted }}>
            Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum.
          </Typography>

          {/* Add more sections as needed (e.g., Team, Values, Contact Link) */}

        </Box>
      </Paper>
    </Container>
  );
};

export default AboutUsPage;