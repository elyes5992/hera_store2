// src/pages/ProductsPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid"; // <-- Keep this Grid
import MuiGrid from "@mui/material/Grid"; // <-- Import Grid with a different name for item sizing
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
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useCart } from "../context/cartcontext"; // Assuming CartItem is also exported or defined here
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress"; // For loading state

// --- REMOVED: Local image imports ---
// import gridImg1 from "../assets/hera_test_imgs/prod1.jpg";
// ... other image imports

// Define available categories (can also be fetched from API if dynamic)
const categories = [
  "Desk Organizers",
  "Stands & Risers",
  "Cable Management",
  "Planters",
  "Decorations",
  "Accessories",
];

// --- REMOVED: sampleProducts array ---

// Interface definitions (assuming CartItem is defined in cartcontext)
interface Product {
  id: string;
  name: string;
  imageUrl: string; // This will now always be a URL string from the API
  link: string;
  price: number;
  category: string;
  discountpercentage?: number; // Ensure backend provides this if needed
}

interface ProductCardProps {
  item: Product;
  imageHeight?: number | string;
  // onAddToCart is handled by the parent component now using handleAddToCart
}

// Products Page Component
const ProductsPage: React.FC = () => {
  const { addItem } = useCart();

  // State for products data fetched from API
  const [products, setProducts] = useState<Product[]>([]); // Start with empty array
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Start with empty array
  const [loading, setLoading] = useState(true); // Start in loading state
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]); // Initial default range
  const [actualMinPrice, setActualMinPrice] = useState<number>(0); // Store actual min price from data
  const [actualMaxPrice, setActualMaxPrice] = useState<number>(100); // Store actual max price from data
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // State for notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // --- REMOVED: Global min/max price calculation based on sampleProducts ---

  // Format image URL - PREPENDS BACKEND URL IF NEEDED
  // IMPORTANT: Adjust `http://localhost:5000` if your backend runs elsewhere
  //            Adjust the check (e.g., `url.startsWith('/')`) based on what your API returns
  const formatImageUrl = (url: string): string => {
    if (!url) return ""; // Return empty string for invalid input

    // If it's already an absolute URL (starts with http/https), use it directly
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // If it's a relative path starting with '/' (common practice for API responses),
    // prepend the backend base URL.
    if (url.startsWith("/")) {
      // MAKE SURE THIS BASE URL IS CORRECT FOR YOUR BACKEND ENVIRONMENT
      const backendBaseUrl = "http://localhost:5000";
      return `${backendBaseUrl}${url}`;
    }

    // If it's a relative path *not* starting with '/' (e.g., "uploads/image.jpg")
    // *You might need to adjust this case depending on your API's exact output*
    // Option A: Prepend base URL and a slash
    // const backendBaseUrl = "http://localhost:5000";
    // return `${backendBaseUrl}/${url}`;
    // Option B: Assume it's an error or an unexpected format (use as is, might break)
    console.warn(
      "Received potentially incorrect relative image URL format:",
      url
    );
    return url; // Fallback: use as is, but it might fail to load
  };

  // Function to fetch products from the API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    setProducts([]); // Clear previous products while loading
    setFilteredProducts([]);

    try {
      const response = await fetch("http://localhost:5000/api/products/upload");

      if (!response.ok) {
        throw new Error(
          `Error fetching products: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data && data.products && Array.isArray(data.products)) {
        const apiProducts: Product[] = data.products.map((item: any) => ({
          // Ensure mapping matches your actual API response structure
          id: item._id, // Assuming MongoDB ObjectId
          name: item.name,
          imageUrl: item.imageUrl, // Keep the raw URL from API here
          link: `/product/${item._id}`, // Generate link based on ID
          price: item.price,
          category: item.category,
          discountPercentage: item.discountPercentage || 0,
        }));

        setProducts(apiProducts);
        setFilteredProducts(apiProducts); // Initially, all products are shown

        // Calculate actual price range from fetched products
        if (apiProducts.length > 0) {
          const prices = apiProducts.map((p) => p.price);
          const minP = Math.floor(Math.min(...prices));
          const maxP = Math.ceil(Math.max(...prices));
          // Ensure max is always >= min
          const finalMaxP = maxP >= minP ? maxP : minP + 50; // Add buffer if max==min

          setActualMinPrice(minP);
          setActualMaxPrice(finalMaxP);
          setPriceRange([minP, finalMaxP]); // Set slider thumbs to full range initially
          console.log("Fetched products:", apiProducts);
          console.log("Calculated price range:", [minP, finalMaxP]);
        } else {
          // Handle case where API returns success but empty product list
          setActualMinPrice(0);
          setActualMaxPrice(100); // Reset to default range if no products
          setPriceRange([0, 100]);
          console.log("Fetched successfully, but no products returned.");
        }
      } else {
        console.warn(
          "API response did not contain expected 'products' array."
        );
        setError("Received invalid data format from server.");
        // Keep products/filteredProducts as empty arrays
        setActualMinPrice(0);
        setActualMaxPrice(100);
        setPriceRange([0, 100]);
      }
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      setError(`Failed to load products. ${err.message || ""}`);
      // Keep products/filteredProducts as empty arrays
      setActualMinPrice(0);
      setActualMaxPrice(100);
      setPriceRange([0, 100]);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies, fetch on mount

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Include fetchProducts in dependency array

  // Filter Logic (remains largely the same, but operates on API data)
  const applyFilters = useCallback(() => {
    // Start with the full list of products fetched from the API
    let tempProducts = [...products];

    // Filter by Category
    if (selectedCategories.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Filter by Price Range state
    tempProducts = tempProducts.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setFilteredProducts(tempProducts);
  }, [products, selectedCategories, priceRange]);

  // Re-run filters when selections or the base product list changes
  useEffect(() => {
    // Don't apply filters while loading initial data
    if (!loading) {
      applyFilters();
    }
  }, [applyFilters, selectedCategories, priceRange, loading, products]); // Added products and loading

  // Event Handlers (remain the same)
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = event.target.name;
    setSelectedCategories((prev) =>
      event.target.checked
        ? [...prev, category]
        : prev.filter((c) => c !== category)
    );
  };

  // Update price range state as slider moves
  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  // Optional: Could apply filters only when slider is released (for performance)
  // const handlePriceChangeCommitted = (...) => { applyFilters(); };

  const handleDrawerToggle = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    // Reset price range to the actual min/max derived from the data
    setPriceRange([actualMinPrice, actualMaxPrice]);
    // applyFilters(); // Filters will re-run automatically due to useEffect dependency on priceRange
  };

  // Handler for adding to cart (uses formatImageUrl for consistency)
  const handleAddToCart = (product: Product) => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        // Format the URL here before adding to cart context
        imageUrl: formatImageUrl(product.imageUrl),
      },
      1 // Add quantity 1
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

  // Filters UI - uses actualMinPrice/actualMaxPrice for Slider bounds
  const renderFilters = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: "bold" }}>
        Categories
      </Typography>
      <FormGroup>
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
        ))}
      </FormGroup>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: "bold" }}>
        Price Range
      </Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          getAriaLabel={() => "Price range"}
          value={priceRange} // Controlled by priceRange state
          onChange={handlePriceChange}
          // onChangeCommitted={handlePriceChangeCommitted} // Optional performance optimization
          valueLabelDisplay="auto"
          getAriaValueText={(value) => `$${value}`}
          valueLabelFormat={(value) => `$${value}`}
          min={actualMinPrice} // Use actual min from fetched data
          max={actualMaxPrice} // Use actual max from fetched data
          step={5} // Or calculate based on range
          disabled={loading || products.length === 0} // Disable if loading or no products
          sx={{
            color: "primary.main",
            "& .MuiSlider-thumb": { backgroundColor: "primary.main" },
            "& .MuiSlider-rail": { opacity: 0.5 },
          }}
        />
      </Box>
      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
        ${priceRange[0]} - ${priceRange[1]}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Button
        variant="outlined"
        fullWidth
        onClick={resetFilters}
        disabled={loading} // Disable while loading
        sx={{
          borderColor: "primary.main",
          color: "primary.main",
          "&:hover": {
            borderColor: "primary.dark",
            backgroundColor: "action.hover",
          },
        }}
      >
        Reset Filters
      </Button>
    </Box>
  );

  // Product Card Component - Uses formatImageUrl
  const ProductCard: React.FC<ProductCardProps> = ({
    item,
    imageHeight = 180,
  }) => {
    if (!item) return null;

    // Specific handler for the button inside the card
    const handleAddToCartClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      event.stopPropagation(); // Prevent card's link navigation
      event.preventDefault(); // Prevent default button behavior just in case
      handleAddToCart(item); // Call the main handler passed from parent
    };

    const displayImageUrl = formatImageUrl(item.imageUrl); // Format URL for display

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
          <CardMedia
            component="img"
            image={displayImageUrl} // Use the formatted URL
            alt={item.name}
            sx={{
              height: imageHeight,
              objectFit: "cover",
              transition: "transform 0.35s ease-in-out",
              ".MuiCard-root:hover &": { transform: "scale(1.07)" },
              backgroundColor: "#eee", // Add a placeholder background color
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              console.error(`Image failed to load: ${item.imageUrl}`);
              console.error(`Formatted URL attempted: ${displayImageUrl}`);
              // Optional: Set a fallback image
              // target.src = '/path/to/placeholder.jpg';
              target.style.objectFit = "contain"; // Adjust fit for placeholder maybe
            }}
          />
          <IconButton
            aria-label={`Add ${item.name} to cart`}
            onClick={handleAddToCartClick} // Use the specific click handler
            className="add-to-cart-button"
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              opacity: 0,
              transform: "translateY(10px)",
              transition:
                "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "primary.dark",
                transform: "scale(1.1) translateY(0)",
              },
              zIndex: 2,
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
              minHeight: "2.5em", // Ensure space for 2 lines approx
              display: "-webkit-box", // For multi-line ellipsis
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              // alignItems: "center", // Remove these if using ellipsis
              // justifyContent: "center",
              // flexGrow: 1, // Remove these if using ellipsis
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
        minHeight: "calc(100vh - 64px)", // Adjust 64px based on your Navbar height
        background: "transparent", // Assuming background is set in MainLayout
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            mb: 3,
            color: "#fff",
            textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Explore Our Creations
        </Typography>

        {/* Mobile Filter Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={handleDrawerToggle}
            disabled={loading} // Disable while loading
            sx={{
              display: { xs: "inline-flex", md: "none" },
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
                top: 80, // Adjust based on Navbar height + desired gap
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                overflow: "hidden", // Hide parts of slider if they overflow briefly
              }}
            >
              {renderFilters()}
            </Paper>
          </Box>

          {/* Products Grid / Loading / Error Area */}
          <Box sx={{ flexGrow: 1 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress color="primary" size={60} />
              </Box>
            ) : error ? (
              <Paper
                sx={{
                  py: 5,
                  px: 3,
                  textAlign: "center",
                  backgroundColor: "rgba(255, 200, 200, 0.85)", // Reddish background for error
                  backdropFilter: "blur(5px)",
                  borderRadius: "12px",
                }}
              >
                <Typography variant="h6" color="error.dark" gutterBottom>
                  Oops! Something went wrong.
                </Typography>
                <Typography color="error.main">{error}</Typography>
                <Button variant="contained" onClick={fetchProducts} sx={{ mt: 2 }}>
                  Try Again
                </Button>
              </Paper>
            ) : filteredProducts.length > 0 ? (
              <Grid container spacing={3}>
                {filteredProducts.map((product) => (
                  // Use MuiGrid for item sizing to avoid name clash with container Grid
                  <MuiGrid size={{xs:6, sm:6 ,md:4}} key={product.id}>
                    <ProductCard item={product} />
                  </MuiGrid>
                ))}
              </Grid>
            ) : (
              // Condition for no products *after* loading and no error
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
                  {products.length === 0
                    ? "No products are available at the moment." // Message if fetch returned empty
                    : "No products found matching your criteria. Try adjusting the filters!" // Message if filters cleared results
                  }
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="left"
          open={mobileFiltersOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Keep filters mounted for state persistence
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <Box
            sx={{
              width: 280,
              height: "100%",
              bgcolor: "background.paper",
            }}
            role="presentation"
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" sx={{ ml: 1 }}>
                Filters
              </Typography>
              <IconButton onClick={handleDrawerToggle} aria-label="Close filters">
                <CloseIcon />
              </IconButton>
            </Box>
            {/* Render filters UI, disable during loading */}
            {renderFilters()}
          </Box>
        </Drawer>

        {/* Snackbar for Add to Cart Confirmation */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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