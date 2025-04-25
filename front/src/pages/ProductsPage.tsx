// src/pages/ProductsPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom"; // Import RouterLink for navigation
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton"; // Import IconButton
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"; // <-- Import Add to Cart icon
import { useCart, CartItem } from "../context/cartcontext";

// Import placeholder images
import gridImg1 from "../assets/hera_test_imgs/prod1.jpg";
import gridImg2 from "../assets/hera_test_imgs/prod2.jpg";
import gridImg3 from "../assets/hera_test_imgs/prod3.jpg";
import gridImg4 from "../assets/hera_test_imgs/prod4.jpg";
import gridImg5 from "../assets/hera_test_imgs/prod5.jpg";
import gridImg6 from "../assets/hera_test_imgs/prod6.jpg";
import gridImg7 from "../assets/hera_test_imgs/prod7.jpg";
import gridImg8 from "../assets/hera_test_imgs/prod8.jpg";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Define sample categories relevant to your store
const categories = [
  "Desk Organizers",
  "Stands & Risers",
  "Cable Management",
  "Planters",
  "Decorations",
  "Accessories",
];

// Define sample product data (Interface defined below)
const sampleProducts: Product[] = [
  // Added Type annotation
  {
    id: "prod1",
    name: "Minimalist Pen Holder",
    imageUrl: gridImg1,
    link: "/product/minimalist-pen-holder",
    price: 14.99,
    category: "Desk Organizers",
    discountpercentage: 10,
  },
  {
    id: "prod2",
    name: "Cable Clips (Set of 5)",
    imageUrl: gridImg2,
    link: "/product/cable-clips",
    price: 9.95,
    category: "Cable Management",
    discountpercentage: 10,
  },
  {
    id: "prod3",
    name: "Headphone Stand",
    imageUrl: gridImg3,
    link: "/product/geometric-headphone-stand",
    price: 24.5,
    category: "Stands & Risers",
    discountpercentage: 10,
  },
  {
    id: "prod4",
    name: "Laptop Stand",
    imageUrl: gridImg4,
    link: "/product/ergonomic-laptop-stand",
    price: 35.0,
    category: "Stands & Risers",
    discountpercentage: 10,
  },
  {
    id: "prod5",
    name: "Monitor Riser",
    imageUrl: gridImg5,
    link: "/product/monitor-riser",
    price: 42.75,
    category: "Stands & Risers",
    discountpercentage: 10,
  },
  {
    id: "prod6",
    name: "Modular Desk Tray",
    imageUrl: gridImg6,
    link: "/product/modular-desk-tray",
    price: 19.99,
    category: "Desk Organizers",
    discountpercentage: 10,
  },
  {
    id: "prod7",
    name: "Small Geometric Planter",
    imageUrl: gridImg7,
    link: "/product/small-planter",
    price: 12.0,
    category: "Planters",
    discountpercentage: 10,
  },
  {
    id: "prod8",
    name: "Aesthetic Phone Stand",
    imageUrl: gridImg8,
    link: "/product/phone-stand-aesthetic",
    price: 18.5,
    category: "Stands & Risers",
    discountpercentage: 10,
  }, // Corrected duplicate id, using different image
  {
    id: "prod10",
    name: "Desktop Figurine - Geometric Fox",
    imageUrl: gridImg7,
    link: "/product/geo-fox",
    price: 15.99,
    category: "Decorations",
    discountpercentage: 10,
  },
  {
    id: "prod11",
    name: "Under Desk Cable Tray",
    imageUrl: gridImg6,
    link: "/product/cable-tray",
    price: 22.0,
    category: "Cable Management",
    discountpercentage: 10,
  },
  {
    id: "prod12",
    name: "Large Pen & Utensil Holder",
    imageUrl: gridImg1,
    link: "/product/large-pen-holder",
    price: 20.0,
    category: "Desk Organizers",
    discountpercentage: 10,
  },
];

// Find min/max price for slider defaults
const prices = sampleProducts.map((p) => p.price);
const minPrice = Math.floor(Math.min(...prices)); // Use floor/ceil for cleaner slider steps
const maxPrice = Math.ceil(Math.max(...prices));

// Interface definitions
interface Product {
  id: string;
  name: string;
  imageUrl: string;
  link: string;
  price: number;
  category: string;
  discountpercentage?: number;
}

interface ProductCardProps {
  item: Product;
  imageHeight?: number | string;
  onAddToCart?: (item: Product) => void; // <-- Added onAddToCart prop
}

// Products Page Component
const ProductsPage: React.FC = () => {
  // State
  const { addItem } = useCart();

  // State for products data
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // State for notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Fetch products from API on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch products from the API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Make the API call to the backend
      const response = await fetch("http://localhost:5000/api/products");

      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.status}`);
      }

      const data = await response.json();

      // Check if we have products data
      if (data && data.products && Array.isArray(data.products)) {
        // Transform the API data to match our Product interface
        const apiProducts: Product[] = data.products.map((item: any) => ({
          id: item._id,
          name: item.name,
          imageUrl: item.imageUrl,
          link: `/product/${item._id}`,
          price: item.price,
          category: item.category,
          discountPercentage: item.discountPercentage || 0,
        }));

        // Set products and initialize filtered products
        setProducts(apiProducts);
        setFilteredProducts(apiProducts);

        // Calculate price range from actual products
        const prices = apiProducts.map((p) => p.price);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceRange([
          minPrice,
          maxPrice > minPrice ? maxPrice : minPrice + 50,
        ]);

        console.log("Fetched products:", apiProducts);
      } else {
        // Fallback to sample data if response format is unexpected
        console.warn(
          "API response did not contain expected products data, using sample data"
        );
        setProducts(sampleProducts);
        setFilteredProducts(sampleProducts);

        // Set price range from sample products
        const prices = sampleProducts.map((p) => p.price);
        setPriceRange([
          Math.floor(Math.min(...prices)),
          Math.ceil(Math.max(...prices)),
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again later.");

      // Fallback to sample data
      setProducts(sampleProducts);
      setFilteredProducts(sampleProducts);

      // Set price range from sample products
      const prices = sampleProducts.map((p) => p.price);
      setPriceRange([
        Math.floor(Math.min(...prices)),
        Math.ceil(Math.max(...prices)),
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Format image URL - ensures server path is properly converted to full URL
  // Inside your ProductsPage component

const formatImageUrl = (url: string | undefined | null): string => {
  // Base URL of your backend server where images are served
  const API_BASE_URL = "http://localhost:5000"; // <-- Make sure this is correct!

  if (!url) {
    // Return an empty string or a path to a default placeholder image
    // Example placeholder: return '/path/to/default-placeholder.png';
    return "";
  }

  // 1. Check if it's already an absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url; // It's already complete, use it as is
  }

  // 2. If not absolute, treat it as a relative path from the backend root.
  //    Construct the full URL.
  //    Ensure we don't create double slashes (e.g., "http://server//uploads/image.jpg")
  const sanitizedPath = url.startsWith('/') ? url.substring(1) : url;

  // Construct the full URL
  return `${API_BASE_URL}/${sanitizedPath}`;
};
  // Filter Logic
  const applyFilters = useCallback(() => {
    let tempProducts = [...products];

    // Filter by Category
    if (selectedCategories.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Filter by Price Range
    tempProducts = tempProducts.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setFilteredProducts(tempProducts);
  }, [products, selectedCategories, priceRange]);

  // Re-run filters when selections change
  useEffect(() => {
    applyFilters();
  }, [applyFilters, selectedCategories, priceRange]);

  // Event Handlers
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = event.target.name;
    setSelectedCategories((prev) =>
      event.target.checked
        ? [...prev, category]
        : prev.filter((c) => c !== category)
    );
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handlePriceChangeCommitted = (
    event: Event | React.SyntheticEvent<Element, Event>,
    newValue: number | number[]
  ) => {
    // Can apply filter here if desired for performance
  };

  const handleDrawerToggle = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    // Reset price range to min/max of all products
    const prices = products.map((p) => p.price);
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));
    setPriceRange([minPrice, maxPrice]);
  };

  // Handler for adding to cart
  const handleAddToCart = (product: Product) => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,

        imageUrl: formatImageUrl(product.imageUrl),
      },
      1
    );

    setSnackbarMessage(`${product.name} added to cart!`);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // Filters UI - reusable for Sidebar and Drawer
  const renderFilters = () => (
    // ... (renderFilters content remains the same)
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        {" "}
        Categories{" "}
      </Typography>
      <FormGroup>
        {" "}
        {categories.map((category) => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                checked={selectedCategories.includes(category)}
                onChange={handleCategoryChange}
                name={category}
                size="small"
              />
            }
            label={category}
            sx={{ mb: -0.5 }}
          />
        ))}{" "}
      </FormGroup>
      <Divider sx={{ my: 2 }} />
      <Typography
        variant="h6"
        gutterBottom
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        {" "}
        Price Range{" "}
      </Typography>
      <Box sx={{ px: 1 }}>
        {" "}
        <Slider
          getAriaLabel={() => "Price range"}
          value={priceRange}
          onChange={handlePriceChange}
          onChangeCommitted={handlePriceChangeCommitted}
          valueLabelDisplay="auto"
          getAriaValueText={(value) => `$${value}`}
          valueLabelFormat={(value) => `$${value}`}
          min={minPrice}
          max={maxPrice}
          step={5}
          sx={{
            color: "primary.main",
            "& .MuiSlider-thumb": { backgroundColor: "primary.main" },
            "& .MuiSlider-rail": { opacity: 0.5 },
          }}
        />{" "}
      </Box>
      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
        {" "}
        ${priceRange[0]} - ${priceRange[1]}{" "}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Button
        variant="outlined"
        fullWidth
        onClick={resetFilters}
        sx={{
          borderColor: "primary.main",
          color: "primary.main",
          "&:hover": {
            borderColor: "primary.dark",
            backgroundColor: "action.hover",
          },
        }}
      >
        {" "}
        Reset Filters{" "}
      </Button>
    </Box>
  );

  // --- UPDATED Product Card Component (within ProductsPage) ---
  const ProductCard: React.FC<ProductCardProps> = ({
    item,
    imageHeight = 180,
  }) => {
    if (!item) return null;

    const handleAddToCartClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      event.stopPropagation();
      event.preventDefault();
      handleAddToCart(item);
    };

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
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            transform: "translateY(-4px)",
            // Show button on card hover
            "& .add-to-cart-button": {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
        }}
      >
        <Box sx={{ position: "relative" }}>
          {" "}
          {/* Wrapper for media + button */}
          <CardMedia
            component="img"
            image={formatImageUrl(item.imageUrl)}
            alt={item.name}
            sx={{
              height: imageHeight,
              objectFit: "cover",
              transition: "transform 0.35s ease-in-out",
              ".MuiCard-root:hover &": { transform: "scale(1.07)" },
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              console.error(`Image failed to load: ${item.imageUrl}`);
              console.error(`Formatted URL: ${formatImageUrl(item.imageUrl)}`);
              
            }}
          />
          <IconButton
            aria-label={`Add ${item.name} to cart`}
            onClick={handleAddToCartClick}
            className="add-to-cart-button" // Class for hover targeting
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "primary.main", // Use theme color
              color: "primary.contrastText",
              opacity: 0, // Initially hidden
              transform: "translateY(10px)", // Start slightly down
              transition:
                "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "primary.dark", // Darken on hover
                transform: "scale(1.1) translateY(0)", // Slight scale effect
              },
              zIndex: 2, // Ensure button is clickable over image
            }}
          >
            <AddShoppingCartIcon fontSize="small" />
          </IconButton>
        </Box>

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
            {item.name}
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
  // --- End Product Card Component ---

  // Main Render
  return (
    <Box
      sx={{
        minHeight: "100vh",
        // Example background - assuming these vars are defined elsewhere or replace with actual colors
        // background: 'linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)',
        background: "transparent", // Using background from MainLayout
        pt: 4, // Adjust padding top if needed considering fixed navbar
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Page Title */}
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            mb: 3,
            color: "#fff", // White color suitable for gradient background
            textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            fontWeight: 600,
            textAlign: "center", // Center title
          }}
        >
          Explore Our Creations
        </Typography>

        {/* Mobile Filter Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          {" "}
          {/* Center button */}
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={handleDrawerToggle}
            sx={{
              display: { xs: "inline-flex", md: "none" }, // Use inline-flex for centering
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            Filters
          </Button>
        </Box>

        {/* Main Layout - Flexbox for side-by-side display */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Sidebar */}
          <Box
            sx={{
              width: { xs: "100%", md: "280px" },
              flexShrink: 0,
              display: { xs: "none", md: "block" },
            }}
          >
            <Paper
              elevation={3}
              sx={{
                position: "sticky",
                top: 80, // Adjust based on your actual Navbar height
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
              }}
            >
              {renderFilters()}
            </Paper>
          </Box>

          {/* Products Grid */}
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Grid size={{ xs: 6, sm: 6, md: 4 }} key={product.id}>
                    {" "}
                    {/* Grid sizing */}
                    <ProductCard
                      item={product}
                      // Pass the handler
                    />
                  </Grid>
                ))
              ) : (
                <Grid size={{ xs: 12 }}>
                  {" "}
                  {/* Full width for message */}
                  <Paper
                    sx={{
                      py: 5,
                      textAlign: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.85)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "12px",
                    }}
                  >
                    <Typography align="center" color="text.secondary">
                      No products found matching your criteria. Try adjusting
                      the filters!
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="left"
          open={mobileFiltersOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          {/* Re-using renderFilters inside a styled Box for the Drawer */}
          <Box
            sx={{
              width: 280,
              height: "100%",
              bgcolor: "background.paper", // Use theme background for drawer
            }}
            role="presentation"
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
              }}
            >
              <Typography variant="h6" sx={{ ml: 1 }}>
                {" "}
                Filters{" "}
              </Typography>
              <IconButton onClick={handleDrawerToggle}>
                {" "}
                <CloseIcon />{" "}
              </IconButton>
            </Box>
            <Divider />
            {renderFilters()} {/* Render the filters UI */}
          </Box>
        </Drawer>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000} // Hide after 3 seconds
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Position
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ProductsPage;
