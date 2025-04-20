// src/pages/HomePage.tsx
import React from "react";
import { Link as RouterLink } from "react-router-dom"; // Import RouterLink for navigation
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container"; // Used for centering grid and collections section
import Box from "@mui/material/Box";
import Rating from '@mui/material/Rating'; // <-- Import Rating
import Chip from '@mui/material/Chip';   // <-- Import Chip
import Stack from '@mui/material/Stack'; 

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid"; // For the Best Sellers layout
import Card from "@mui/material/Card"; // Card component for grid items
import CardMedia from "@mui/material/CardMedia"; // For images inside Cards
import CardContent from "@mui/material/CardContent"; // For text content inside Cards
import { Carousel } from "react-responsive-carousel"; // The promo carousel component
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Base styles for the carousel
// Optional: Background shapes for visual effect
// import BackgroundShapes from "../components/BackgroundShapes"; // Uncomment if you use BackgroundShapes

// --- Import your Carousel images ---
// (Make sure these paths are correct relative to HomePage.tsx)
import promoImage1 from "../assets/hera_test_imgs/back11.jpg";
import promoImage2 from "../assets/hera_test_imgs/back22.jpg";

// import promoImage4 from "../assets/hera_test_imgs/back8.jpg"; // No longer needed for hero

// --- Import your Best Seller Grid images (8 total) ---
// (Make sure these paths are correct relative to HomePage.tsx)
import gridImg1 from "../assets/hera_test_imgs/prod1.jpg";

import gridImg2 from "../assets/hera_test_imgs/prod2.jpg";
import gridImg3  from "../assets/hera_test_imgs/prod3.jpg";
 // New image
import PromoGrid from "../components/PromoGrid";

import HeroSection from "../components/HeroSection";
import AnimatedProductButton from "../components/view_prod_butt";

// --- Data defining the content for the promo carousel slides ---
const carouselItems = [
  {
    id: 1,
    imageUrl: promoImage1,
    alt: "Stylish 3D Printed Desk Organizer Set",
    heading: "Declutter Your Desk",
    text: "Explore minimalist organizers, holders, and stands...",
    buttonText: "Shop Organizers",
    buttonLink: "/products?category=organizers",
  },
  {
    id: 1,
    imageUrl: promoImage2,
    alt: "Stylish 3D Printed Desk Organizer Set",
    heading: "Declutter Your Desk",
    text: "Explore minimalist organizers, holders, and stands...",
    buttonText: "Shop Organizers",
    buttonLink: "/products?category=organizers",
  },
  
];

// --- Data for Best Sellers Grid (UPDATED to 8 items with Prices) ---
const bestSellerItems = [
  {
    id: "prod1",
    name: "Modular Desk Tray",
    imageUrl: gridImg1,
    link: "/product/modular-desk-tray",
    price: 19.99,
    description: "Organize your small items effortlessly.",
    rating: 4.5,
    tags: ['New', 'Best Seller'], // Example tags
  },
  {
    id: "prod2",
    name: "Cable Clips (Set of 5)", // Updated name
    imageUrl: gridImg2,
    link: "/product/cable-clips",
    price: 7.95, // Adjusted price
    originalPrice: 9.95, // Example original price for discount
    description: "Tame your desk cables with style.",
    rating: 4.0,
    tags: ['Sale'],
  },
  {
    id: "prod3",
    name: "Minimalist Pen Holder",
    imageUrl: gridImg3,
    link: "/product/minimalist-pen-holder",
    price: 14.99,
    description: "Sleek and modern pen organization.",
    rating: 5.0,
    tags: ['Best Seller'],
  },
  {
    id: "prod4",
    name: "Geometric Headphone Stand", // Updated name
    imageUrl: gridImg3, // USING GRIDIMG3 FOR EXAMPLE - REPLACE WITH ACTUAL IMAGE
    link: "/product/geometric-headphone-stand",
    price: 24.50,
    description: "Display your headphones elegantly.",
    rating: 4.8,
    // No tags example
  },
  {
    id: "prod5",
    name: "Ergonomic Laptop Stand", // Updated name
    imageUrl: gridImg1, // USING GRIDIMG1 FOR EXAMPLE - REPLACE WITH ACTUAL IMAGE
    link: "/product/ergonomic-laptop-stand",
    price: 35.00,
    description: "Improve posture and airflow.",
    rating: 4.2,
    tags: ['New'],
  },
  {
    id: "prod6",
    name: "Small Geometric Planter", // Updated name
    imageUrl: gridImg2, // USING GRIDIMG2 FOR EXAMPLE - REPLACE WITH ACTUAL IMAGE
    link: "/product/small-planter",
    price: 10.00, // Adjusted price
    originalPrice: 12.00,
    description: "Perfect for succulents or small plants.",
    rating: 4.6,
    tags: ['Sale', 'Eco-Friendly'],
  },
  {
    id: "prod7",
    name: "Monitor Riser Shelf", // Updated name
    imageUrl: gridImg3, // USING GRIDIMG3 FOR EXAMPLE - REPLACE WITH ACTUAL IMAGE
    link: "/product/monitor-riser",
    price: 42.75,
    description: "Elevate your monitor, store items below.",
    rating: 4.9,
    tags: ['Best Seller'],
  },
  {
    id: "prod8",
    name: "Phone & Tablet Stand", // Updated name
    imageUrl: gridImg1, // USING GRIDIMG1 FOR EXAMPLE - REPLACE WITH ACTUAL IMAGE
    link: "/product/phone-stand",
    price: 18.50,
    description: "Hands-free viewing for your devices.",
    rating: 4.3,
    tags: [], // No tags
  },
];
// --- Reusable Product Card Component (Handles Price Display) ---
interface ProductCardProps {
  item: {
    id: string;
    name: string;
    imageUrl: string;
    link: string;
    price?: number;
    // --- Add new optional fields ---
    description?: string;
    rating?: number;
    tags?: string[];
    originalPrice?: number;
    // --- End new fields ---
  };
  imageHeight?: number | string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  imageHeight = 180,
}) => {
  // Default height adjusted slightly
  if (!item) return null; // Basic safety check

  return (
    <Card
    component={RouterLink}
    to={item.link}
    sx={{
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative', // Needed for absolute positioning of tags
      height: '100%',
      overflow: 'hidden',
      borderRadius: '8px', // Slightly rounded corners
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)', // Softer shadow
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)', // Lift effect on hover
        boxShadow: '0 6px 16px rgba(0,0,0,0.12)', // Stronger hover shadow
      },
    }}
  >
    {/* --- Tags Overlay --- */}
    {item.tags && item.tags.length > 0 && (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          p: 1,
          zIndex: 1, // Ensure tags are above image
          display: 'flex',
          flexWrap: 'wrap', // Allow tags to wrap if many
          gap: 0.5, // Spacing between tags
        }}
      >
        {item.tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            color={
              tag.toLowerCase() === 'sale' ? 'secondary' :
              tag.toLowerCase() === 'new' ? 'info' :
              tag.toLowerCase() === 'best seller' ? 'primary' :
              'default'
            }
            sx={{
               fontWeight: 'bold',
               fontSize: '0.7rem',
               height: '20px',
               boxShadow: '0 1px 3px rgba(0,0,0,0.2)', // Subtle shadow on chip
               '& .MuiChip-label': { px: '8px'} // Adjust padding if needed
            }}
          />
        ))}
      </Box>
    )}

    <CardMedia
      component="img"
      image={item.imageUrl}
      alt={item.name}
      sx={{
        height: imageHeight,
        objectFit: 'cover',
        transition: 'transform 0.4s ease', // Slightly longer transition
        // Keep zoom effect on hover, but relative to Card hover
        '.MuiCard-root:hover &': { // Target image only when card is hovered
          transform: 'scale(1.05)', // Subtle scale
        }
      }}
    />
    <CardContent
      sx={{
        textAlign: 'center',
        flexGrow: 1, // Make content take remaining space
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Push price/rating down if space allows
        alignItems: 'center',
        px: 2, // More horizontal padding
        py: 1.5,
      }}
    >
      {/* Top part of content */}
      <Box sx={{ width: '100%', mb: 1 }}>
          <Typography
            variant="h6" // Use h6 for product name for better hierarchy
            component="div"
            title={item.name} // Add title attribute for long names
            sx={{
              color: 'text.primary',
              fontWeight: 600, // Bolder name
              // Limit name to 2 lines with ellipsis
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '2.6em', // Ensure space for 2 lines approx (adjust if needed)
              mb: 0.5, // Margin below name
            }}
          >
            {item.name}
          </Typography>

          {item.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1, // Margin below description
                // Limit description to 2 lines
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                minHeight: '2.4em', // Approx space for 2 lines
              }}
            >
              {item.description}
            </Typography>
          )}
      </Box>

      {/* Bottom part of content (Rating and Price) */}
      <Box sx={{ width: '100%' }}>
          {item.rating !== undefined && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
              <Rating
                name={`rating-${item.id}`}
                value={item.rating}
                readOnly
                size="small"
                precision={0.5}
                sx={{ color: '#faaf00' }} // Classic star color
              />
              {/* Optional: Display number rating */}
              {/* <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>({item.rating.toFixed(1)})</Typography> */}
            </Box>
          )}

          {/* Price Display */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 0.75 }}>
            { item.originalPrice && (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.disabled',
                  textDecoration: 'line-through',
                }}
              >
                ${item.originalPrice.toFixed(2)}
              </Typography>
            )}
            {item.price !== undefined && (
              <Typography
                variant="h6" // Make current price more prominent
                component="div" // Use div to avoid semantic issues
                color={item.originalPrice ? 'secondary.main' : 'text.primary'} // Highlight sale price
                sx={{ fontWeight: 'bold' }}
              >
                ${item.price.toFixed(2)}
              </Typography>
            )}
          </Box>
      </Box>

    </CardContent>
  </Card>
  );
};

// --- HomePage Component ---
const HomePage: React.FC = () => {
  return (
    // Optionally add BackgroundShapes here if you want them on the whole page
    // <Box sx={{ position: 'relative' }}>
    //   <BackgroundShapes variant="default" />
    <Box sx={{ position: "relative", zIndex: 1 }}>
      {" "}
      {/* Ensure content is above background shapes if used */}
      
      
      
      {/* Main Page Container */}
      
      {/* ========== 1. Hero Section (Text Only) ========== */}
      <HeroSection />
      {/* --- End Hero Section --- */}



      {/* -------Promo Grid------- */}
      <PromoGrid />
      {/* -------end Promo Grid section- ------ */}



      
      {/* ========== 2. Best Sellers Grid Section ========== */}
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4} }}>
        {" "}
        {/* Vertical Padding */}
        <Typography
          variant="h4"
          // color="white" // Changed: Use default theme color or specify e.g., 'text.primary'
          color="text.primary"
          component="h2"
          gutterBottom
          align="center"
          sx={{ mb: 4 }}
        >
          Best Sellers
        </Typography>
        {/* Grid layout - maps over all 8 items */}
        <Grid container spacing={3}>
          {" "}
          {/* Adjust spacing between items */}
          {bestSellerItems.map((item) => (
            // Each product card is a grid item
            // xs=12 (full width on mobile), sm=6 (2 per row), md=3 (4 per row)
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={item.id}>
              <ProductCard item={item} />{" "}
              {/* Use the reusable card component */}
            </Grid>
          ))}
        </Grid>{" "}
        <AnimatedProductButton/>
        {/* End Best Sellers Grid Container */}
      </Container>
      {/* --- End Best Sellers Grid Section --- */}

      
      {/* ========== 3. Promo Carousel Section ========== */}
      {/* Wrapper adds horizontal padding for narrowed appearance */}
      <Box sx={{ my: { xs: 4, md: 6 }, px: { xs: 2, sm: 4, md: 6 } }}>
        <Carousel
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          showIndicators={true}
          interval={5000}
          stopOnHover={true}
        >
          {carouselItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                position: "relative",
                height: { xs: "250px", sm: "350px", md: "400px" },
                borderRadius: "8px", // Optional: Add rounding to carousel slides
                overflow: "hidden", // Ensure image respects border radius
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.4)", // Keep overlay for text visibility
                  color: "#fff", // Keep white color for overlay text
                  textAlign: "center",
                  padding: { xs: 2, sm: 3, md: 4 },
                }}
              >
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
                  }}
                >
                  {" "}
                  {item.heading}{" "}
                </Typography>
                <Typography
                  variant="h6"
                  component="p"
                  sx={{ mb: 3, display: { xs: "none", sm: "block" } }}
                >
                  {" "}
                  {item.text}{" "}
                </Typography>
                {item.buttonText && item.buttonLink && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    component={RouterLink} // Use RouterLink for navigation
                    to={item.buttonLink}
                    // onClick={() => console.log(`Navigate to: ${item.buttonLink}`)} // Replaced by RouterLink
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                  >
                    {" "}
                    {item.buttonText}{" "}
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </Carousel>
      </Box>
      {/* --- End Promo Carousel Section --- */}
      {/* ========== 4. Other Homepage Content Section (Example) ========== */}
      <Container maxWidth="lg" sx={{ pb: 4 }}>
        {" "}
        {/* Padding Bottom */}
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          align="center"
          color="text.primary" // Use theme color
        >
          Shop Our Collections
        </Typography>
        <Box sx={{ mt: 4 }}>
          {" "}
          {/* Margin Top */}
          <Typography
            variant="body1"
            align="center"
            color="text.secondary" // Use theme color
          >
            Featured product categories will go here... (e.g., Organizers,
            Stands)
          </Typography>
          {/* TODO: Add another Grid/Card layout here for category links */}
        </Box>
      </Container>
      {/* --- End Other Homepage Content --- */}
    </Box> // End Main Page Container Box
    // </Box> // Closes outer Box if using BackgroundShapes
  );
};

export default HomePage; // Export the component
