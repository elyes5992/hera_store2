// src/pages/HomePage.tsx
import React from "react";
import { Link as RouterLink } from "react-router-dom"; // Import RouterLink for navigation
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container"; // Used for centering grid and collections section
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid"; // For the Best Sellers layout
import Card from "@mui/material/Card"; // Card component for grid items
import CardMedia from "@mui/material/CardMedia"; // For images inside Cards
import CardContent from "@mui/material/CardContent"; // For text content inside Cards
import { Carousel } from "react-responsive-carousel"; // The promo carousel component
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Base styles for the carousel
import backgroundShapes from "../components/3d_sahpes"; // Optional: Background shapes for visual effect

// --- Import your Carousel images ---
// (Make sure these paths are correct relative to HomePage.tsx)
import promoImage1 from "../assets/hera_test_imgs/back1.jpg";
import promoImage2 from "../assets/hera_test_imgs/back2.jpg";
import promoImage3 from "../assets/hera_test_imgs/back4.jpg";
import promoImage4 from "../assets/hera_test_imgs/back8.jpg";

// --- Import your Best Seller Grid images (8 total) ---
// (Make sure these paths are correct relative to HomePage.tsx)
import gridImg1 from "../assets/hera_test_imgs/img1.jpg";
import gridImg2 from "../assets/hera_test_imgs/img2.jpg";
import gridImg3 from "../assets/hera_test_imgs/img3.jpg";
import gridImg4 from "../assets/hera_test_imgs/img4.jpg";
import gridImg5 from "../assets/hera_test_imgs/img5.jpg";
import gridImg6 from "../assets/hera_test_imgs/img6.jpg";
import gridImg7 from "../assets/hera_test_imgs/img7.jpg"; // New image
import BackgroundShapes from "../components/3d_sahpes";
// New image

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
    id: 2,
    imageUrl: promoImage2,
    alt: "Phone stands available in multiple colors",
    heading: "Printed in Your Palette",
    text: "Choose from a wide range of colors...",
    buttonText: "See Color Options",
    buttonLink: "/products",
  },
  {
    id: 3,
    imageUrl: promoImage3,
    alt: "Tidy workspace featuring 3D printed accessories",
    heading: "Elevate Your Workspace",
    text: "Functional and aesthetic additions...",
    buttonText: "View All Products",
    buttonLink: "/products",
  },
];

// --- Data for Best Sellers Grid (UPDATED to 8 items with Prices) ---
const bestSellerItems = [
  {
    id: "prod1",
    name: "Minimalist Pen Holder",
    imageUrl: gridImg1,
    link: "/product/minimalist-pen-holder",
    price: 14.99,
  },
  {
    id: "prod2",
    name: "Cable Clips (Set of 5)",
    imageUrl: gridImg2,
    link: "/product/cable-clips",
    price: 9.95,
  },
  {
    id: "prod3",
    name: "Headphone Stand",
    imageUrl: gridImg3,
    link: "/product/geometric-headphone-stand",
    price: 24.5,
  },
  {
    id: "prod4",
    name: "Laptop Stand",
    imageUrl: gridImg4,
    link: "/product/ergonomic-laptop-stand",
    price: 35.0,
  },
  {
    id: "prod5",
    name: "Monitor Riser",
    imageUrl: gridImg5,
    link: "/product/monitor-riser",
    price: 42.75,
  },
  {
    id: "prod6",
    name: "Modular Desk Tray",
    imageUrl: gridImg6,
    link: "/product/modular-desk-tray",
    price: 19.99,
  },
  {
    id: "prod7",
    name: "Small Geometric Planter",
    imageUrl: gridImg7,
    link: "/product/small-planter",
    price: 12.0,
  },
];

// --- Placeholder URL for the Hero section background image ---
const heroImageUrl =
  "https://images.unsplash.com/photo-1611002214172-792c1f90b59a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80";

// --- Reusable Product Card Component (Handles Price Display) ---
interface ProductCardProps {
  item: {
    id: string;
    name: string;
    imageUrl: string;
    link: string;
    price?: number; // Price is optional
  };
  imageHeight?: number | string; // Allow overriding image height
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
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "100%",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": { boxShadow: 6 },
      }}
    >
      <CardMedia
        component="img"
        image={item.imageUrl}
        alt={item.name}
        sx={{
          height: imageHeight,
          objectFit: "cover",
          transition: "transform 0.35s ease-in-out",
          ".MuiCard-root:hover &": { transform: "scale(1.07)" },
        }}
      />
      <CardContent
        sx={{
          textAlign: "center",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 1,
          py: 1.5,
        }}
      >
        <Typography
          variant="body1"
          component="div"
          sx={{
            color: "text.primary",
            fontWeight: 500,
            minHeight: "2.5em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            mb: item.price !== undefined ? 0.5 : 0,
          }}
        >
          {" "}
          {item.name}{" "}
        </Typography>
        {item.price !== undefined && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: "bold" }}
          >
            ${item.price.toFixed(2)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// --- HomePage Component ---
const HomePage: React.FC = () => {
  return (
    <Box>
      
      {/* Main Page Container */}
      {/* ========== 1. Hero Section ========== */}
      <Container maxWidth={false} sx={{ mt: 3, maxWidth: "1400px" }}>
        <Box
          sx={{
            width: "100%",
            height: { xs: "350px", sm: "450px", md: "70vh" },
            backgroundImage: `url(${promoImage4})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            textAlign: "center",
            position: "relative",
            borderRadius: "16px", // Add this line
            overflow: "hidden",
          }}
        >
          <Box sx={{ zIndex: 2, p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "2rem", sm: "3rem", md: "3.5rem" },
              }}
            >
              {" "}
              Elevate Your Desk Setup{" "}
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{ mb: 3, display: { xs: "none", sm: "block" } }}
            >
              {" "}
              Discover unique 3D printed accessories for a modern workspace.{" "}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => console.log(`Navigate to: /products`)}
              sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
            >
              {" "}
              Shop Now{" "}
            </Button>
          </Box>
        </Box>
      </Container>
      {/* --- End Hero Section --- */}
      {/* ========== 2. Best Sellers Grid Section (Standard 4-Column Layout) ========== */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {" "}
        {/* Vertical Padding */}
        <Typography
          variant="h4"
          color="white"
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
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <ProductCard item={item} />{" "}
              {/* Use the reusable card component */}
            </Grid>
          ))}
        </Grid>{" "}
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
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  color: "#fff",
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
                    onClick={() =>
                      console.log(`Navigate to: ${item.buttonLink}`)
                    }
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
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Shop Our Collections
        </Typography>
        <Box sx={{ mt: 4 }}>
          {" "}
          {/* Margin Top */}
          <Typography variant="body1" align="center">
            Featured product categories will go here... (e.g., Organizers,
            Stands)
          </Typography>
          {/* TODO: Add another Grid/Card layout here for category links */}
        </Box>
      </Container>
      {/* --- End Other Homepage Content --- */}
    </Box> // End Main Page Container Box
  );
};

export default HomePage; // Export the component
