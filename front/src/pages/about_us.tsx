// src/pages/AboutUsPage.tsx
import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// Grid is still optional, uncomment if needed
// import Grid from "@mui/material/Grid";

const AboutUsPage: React.FC = () => {
  return (
    // Container centers content and sets max width
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}> {/* Adds vertical padding */}
      {/* Removed textAlign center to let text flow naturally, add it back if needed */}
      <Box>
        {/* Page Title */}
        <Typography variant="h3" component="h1" gutterBottom>
          About Us
        </Typography>

        {/* --- Add Your About Us Content Here --- */}

        {/* Section 1: Introduction */}
        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
          Our Story
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to Hera Prints! Founded in [Year], we started with a simple passion for creativity and technology. We saw the potential of 3D printing to transform everyday objects into personalized, functional, and beautiful pieces. What began as a small workshop experimenting with designs has grown into a dedicated space for crafting unique desk accessories and home goods.
        </Typography>
        <Typography variant="body1" paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Typography>
        <Typography variant="body1" paragraph>
          Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque.
        </Typography>

        {/* Section 2: Mission */}
        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          Our mission is to elevate your workspace and home environment through thoughtfully designed and meticulously crafted 3D printed products. We believe that organization and aesthetics go hand-in-hand, and we strive to create items that are not only practical but also inspire creativity and bring joy to your daily routines. We are committed to using high-quality materials and sustainable practices whenever possible.
        </Typography>
        <Typography variant="body1" paragraph>
          Aliquam faucibus, purus at gravida vehicula, arcu nisl condimentum nisl, vitae convallis nisl justo eu sapien. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.
        </Typography>

        {/* Section 3: Why Choose Us? */}
        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
          Why Hera Prints?
        </Typography>
        <Typography variant="body1" paragraph>
          **Unique Designs:** We focus on original, modern aesthetics you won't find everywhere else.
        </Typography>
        <Typography variant="body1" paragraph>
          **Quality Materials:** We select durable and often eco-friendly filaments for longevity.
        </Typography>
        <Typography variant="body1" paragraph>
          **Attention to Detail:** Every print is inspected to ensure it meets our quality standards.
        </Typography>
        <Typography variant="body1" paragraph>
          **Customer Focus:** We value your feedback and are always looking for ways to improve.
        </Typography>
         <Typography variant="body1" paragraph>
          Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna.
        </Typography>
         <Typography variant="body1" paragraph>
          Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum.
        </Typography>

        {/* Add more sections as needed (e.g., Team, Values, Contact Link) */}

      </Box>
    </Container>
  );
};

export default AboutUsPage;