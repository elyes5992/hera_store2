// src/pages/ProductsPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid"; // Use single Grid import
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
import Chip from '@mui/material/Chip'; // <-- Import Chip
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useCart } from "../context/cartcontext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

// Define available categories (could be fetched from API if dynamic)
const categories = [
  "Desk Organizers",
  "Stands & Risers",
  "Cable Management",
  "Planters",
  "Decorations",
  "Accessories",
];

// --- Interface definitions - UPDATED ---
interface Product {
  id: string;
  name: string;
  imageUrl: string; // Expects a raw relative path from API
  link: string;
  price: number;
  category: string;
  discountPercentage?: number; // Corrected: Uppercase 'P'
  tags?: string[];             // Added: Optional array for tags
}

interface ProductCardProps {
  item: Product;
  imageHeight?: number | string;
}

// Products Page Component
const ProductsPage: React.FC = () => {
  const { addItem } = useCart();

  // --- State Definitions ---
  const [products, setProducts] = useState<Product[]>([]); // Full list from API
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // List after filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]); // Slider thumb positions
  const [actualMinPrice, setActualMinPrice] = useState<number>(0); // Slider min bound
  const [actualMaxPrice, setActualMaxPrice] = useState<number>(100); // Slider max bound
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // --- Image URL Formatting Function ---
  const formatImageUrl = (url: string | undefined | null): string => {
    const API_BASE_URL = "http://localhost:5000";
    if (!url) return "";
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const sanitizedPath = url.startsWith('/') ? url.substring(1) : url;
    return `${API_BASE_URL}/${sanitizedPath}`;
  };

  // --- Data Fetching Function - UPDATED ---
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    setProducts([]);
    setFilteredProducts([]);

    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      // console.log("Raw API response:", data); // Keep for debugging if needed

      if (data && data.products && Array.isArray(data.products)) {
        const apiProducts: Product[] = data.products.map((item: any) => ({
          id: item._id,
          name: item.name,
          imageUrl: item.imageUrl,
          link: `/product/${item._id}`,
          price: item.price,
          category: item.category,
          discountPercentage: item.discountPercentage || 0, // Map discount
          tags: item.tags || [],                           // Map tags
        }));

        // console.log("Processed products:", apiProducts); // Keep for debugging if needed

        setProducts(apiProducts);
        setFilteredProducts(apiProducts);

        if (apiProducts.length > 0) {
          const prices = apiProducts.map((p) => p.price);
          const minP = Math.floor(Math.min(...prices));
          const maxP = Math.ceil(Math.max(...prices));
          const finalMaxP = maxP >= minP ? maxP : minP + 50;
          setActualMinPrice(minP);
          setActualMaxPrice(finalMaxP);
          setPriceRange([minP, finalMaxP]);
        } else {
          setActualMinPrice(0);
          setActualMaxPrice(100);
          setPriceRange([0, 100]);
        }
      } else {
        console.warn("API response format unexpected:", data);
        setError("Received invalid data format from server.");
        setActualMinPrice(0);
        setActualMaxPrice(100);
        setPriceRange([0, 100]);
      }
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      setError(`Failed to load products. ${err.message || "Check network connection or server status."}`);
      setActualMinPrice(0);
      setActualMaxPrice(100);
      setPriceRange([0, 100]);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Effects ---
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const applyFilters = useCallback(() => {
    let tempProducts = [...products];
    if (selectedCategories.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }
    tempProducts = tempProducts.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    setFilteredProducts(tempProducts);
  }, [products, selectedCategories, priceRange]);

  useEffect(() => {
    if (!loading) {
      applyFilters();
    }
  }, [applyFilters, loading]); // Simplified dependencies

  // --- Event Handlers ---
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

  const handleDrawerToggle = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([actualMinPrice, actualMaxPrice]);
  };

  const handleAddToCart = (product: Product) => {
    const finalImageUrl = formatImageUrl(product.imageUrl);
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.discountPercentage && product.discountPercentage > 0
          ? product.price * (1 - product.discountPercentage / 100) // Add discounted price to cart
          : product.price,
        imageUrl: finalImageUrl,
      },
      1
    );
    setSnackbarMessage(`${product.name} added to cart!`);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  // --- Rendering Sub-Components ---

  // Filters UI (Sidebar/Drawer) - No changes needed here
  const renderFilters = () => (
     <Box sx={{ p: 2 }}>
      {/* Categories Section */}
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
                disabled={loading}
              />
            }
            label={category}
            sx={{ mb: -0.5 }}
          />
        ))}
      </FormGroup>
      <Divider sx={{ my: 2 }} />

      {/* Price Range Section */}
      <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: "bold" }}>
        Price Range
      </Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          getAriaLabel={() => "Price range"}
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          getAriaValueText={(value) => `$${value}`}
          valueLabelFormat={(value) => `$${value}`}
          min={actualMinPrice}
          max={actualMaxPrice}
          step={5}
          disabled={loading || products.length === 0}
          sx={{
            color: "primary.main",
            '& .MuiSlider-thumb': { backgroundColor: "primary.main" },
            '& .MuiSlider-rail': { opacity: 0.5 },
          }}
        />
      </Box>
      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
        ${priceRange[0]} - ${priceRange[1]}
      </Typography>
      <Divider sx={{ my: 2 }} />

      {/* Reset Button */}
      <Button
        variant="outlined"
        fullWidth
        onClick={resetFilters}
        disabled={loading}
        sx={{
          borderColor: "primary.main",
          color: "primary.main",
          "&:hover": { borderColor: "primary.dark", backgroundColor: "action.hover" },
        }}
      >
        Reset Filters
      </Button>
    </Box>
  );

  // --- Product Card Component - UPDATED ---
  const ProductCard: React.FC<ProductCardProps> = ({ item, imageHeight = 180 }) => {
    if (!item) return null;

    const handleAddToCartClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      handleAddToCart(item);
    };

    const displayImageUrl = formatImageUrl(item.imageUrl);

    // Calculate discount info
    const hasDiscount = item.discountPercentage && item.discountPercentage > 0;
    const discountedPrice = hasDiscount
      ? item.price * (1 - item.discountPercentage! / 100)
      : item.price;

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
            "& .add-to-cart-button": { opacity: 1, transform: "translateY(0)" },
          },
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
        }}
      >
        <Box sx={{ position: "relative" }}>
          {/* Discount Badge */}
          {hasDiscount && (
            <Chip
              label={`${item.discountPercentage}% OFF`}
              color="secondary"
              size="small"
              sx={{
                position: "absolute", top: 8, left: 8, zIndex: 1, fontWeight: "bold",
              }}
            />
          )}
          <CardMedia
            component="img"
            image={displayImageUrl}
            alt={item.name}
            sx={{
              height: imageHeight,
              objectFit: "cover",
              transition: "transform 0.35s ease-in-out",
              ".MuiCard-root:hover &": { transform: "scale(1.07)" },
              backgroundColor: "#f0f0f0",
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              console.error(`Image failed to load. Original: ${item.imageUrl}, Formatted: ${displayImageUrl}`);
              target.style.objectFit = 'contain';
            }}
          />
          {/* Add to Cart Button */}
          <IconButton
            aria-label={`Add ${item.name} to cart`}
            onClick={handleAddToCartClick}
            className="add-to-cart-button"
            size="small"
            sx={{
              position: "absolute", bottom: 8, right: 8,
              backgroundColor: "primary.main", color: "primary.contrastText",
              opacity: 0, transform: "translateY(10px)",
              transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
              "&:hover": { backgroundColor: "primary.dark", transform: "scale(1.1) translateY(0)" },
              zIndex: 2,
            }}
          >
            <AddShoppingCartIcon fontSize="inherit" />
          </IconButton>
        </Box>

        {/* Card Content Area - UPDATED */}
        <CardContent
          sx={{
            textAlign: "center", flexGrow: 1, display: "flex",
            flexDirection: "column", justifyContent: "space-between", // Use space-between
            alignItems: "center", px: 1, py: 1.5, gap: 0.5,
          }}
        >
          {/* Top part: Name and Tags */}
          <Box sx={{ width: '100%' }}>
            {/* Product Name */}
            <Typography
              variant="body1" component="div" title={item.name}
              sx={{
                color: "text.primary", fontWeight: 500, lineHeight: 1.3,
                maxHeight: '2.6em', minHeight: "2.6em", overflow: "hidden",
                textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", width: '100%', mb: 0.5
              }}
            >
              {item.name}
            </Typography>
            {/* Tags Display */}
            {item.tags && item.tags.length > 0 && (
              <Box
                sx={{
                  display: "flex", flexWrap: "wrap", justifyContent: "center",
                  gap: 0.5, mt: 0.5, minHeight: '1.5em' // Reserve space for tags if needed
                }}
              >
                {item.tags.slice(0, 3).map((tag) => ( // Limit tags displayed if needed
                  <Chip
                    key={tag} label={tag} size="small" variant="outlined"
                    sx={{ fontSize: "0.7rem" }}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Bottom part: Price */}
          <Box
             sx={{
               display: "flex", alignItems: "baseline", justifyContent: "center",
               gap: 1, flexWrap: "wrap", mt: 1 // Add margin top
             }}
          >
            {/* Price Display */}
            {hasDiscount && item.price !== undefined && (
              <Typography variant="body2" color="text.secondary"
                sx={{ textDecoration: "line-through", fontSize: "0.8rem" }}
              >
                ${item.price.toFixed(2)}
              </Typography>
            )}
            {item.price !== undefined && (
              <Typography variant="body1"
                color={hasDiscount ? "error.main" : "text.primary"}
                sx={{ fontWeight: "bold" }}
              >
                ${discountedPrice.toFixed(2)}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  // --- Main Component Render ---
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        background: "transparent",
        pt: 4, pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Page Title */}
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 3, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.2)", fontWeight: 600, textAlign: "center" }}>
          Explore Our Creations
        </Typography>

        {/* Mobile Filter Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button variant="contained" startIcon={<FilterListIcon />} onClick={handleDrawerToggle} disabled={loading}
            sx={{ display: { xs: "inline-flex", md: "none" }, backgroundColor: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)", color: "#fff", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" } }}
          >
            Filters
          </Button>
        </Box>

        {/* Main Layout: Sidebar + Products Grid */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
          {/* Sidebar */}
          <Box sx={{ width: { xs: "100%", md: "280px" }, flexShrink: 0, display: { xs: "none", md: "block" } }}>
            <Paper elevation={3} sx={{ position: "sticky", top: 80, backgroundColor: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(10px)", borderRadius: "12px", overflow: "hidden" }}>
              {renderFilters()}
            </Paper>
          </Box>

          {/* Products Grid / Loading / Error Area */}
          <Box sx={{ flexGrow: 1 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 10, minHeight: '300px' }}>
                <CircularProgress color="primary" size={60} />
              </Box>
            ) : error ? (
              <Paper elevation={3} sx={{ py: 5, px: 3, textAlign: "center", backgroundColor: "rgba(255, 220, 220, 0.9)", backdropFilter: "blur(5px)", borderRadius: "12px", color: 'error.dark' }}>
                <Typography variant="h6" gutterBottom>Oops! Something went wrong.</Typography>
                <Typography sx={{ mb: 2 }}>{error}</Typography>
                <Button variant="contained" color="primary" onClick={fetchProducts}>Try Again</Button>
              </Paper>
            ) : filteredProducts.length > 0 ? (
              <Grid container spacing={3}>
                {filteredProducts.map((product) => (
                  // Simplified Grid item usage
                  <Grid size={{xs:6 ,sm:6 ,md:4}}  key={product.id}>
                    <ProductCard item={product} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper elevation={3} sx={{ py: 5, textAlign: "center", backgroundColor: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(10px)", borderRadius: "12px" }}>
                <Typography align="center" color="text.secondary">
                  {products.length === 0
                    ? "No products are available at the moment."
                    : "No products found matching your criteria. Try adjusting the filters!"
                  }
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>

        {/* Mobile Filter Drawer */}
        <Drawer anchor="left" open={mobileFiltersOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", md: "none" } }}>
          <Box sx={{ width: 280, height: "100%", bgcolor: "background.paper" }} role="presentation">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ ml: 1 }}>Filters</Typography>
              <IconButton onClick={handleDrawerToggle} aria-label="Close filters"><CloseIcon /></IconButton>
            </Box>
            {renderFilters()}
          </Box>
        </Drawer>

        {/* Snackbar */}
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert onClose={handleSnackbarClose} severity="success" variant="filled" sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

      </Container>
    </Box>
  );
};

export default ProductsPage;