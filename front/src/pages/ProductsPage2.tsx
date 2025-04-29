import React, { useState, useEffect, useCallback ,memo } from "react";
import {
  Link as RouterLink,
  useNavigate,
  useParams, // <-- Import useParams
} from "react-router-dom";
import Container from "@mui/material/Container";
// Using Grid v2
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
import Chip from "@mui/material/Chip";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useCart } from "../context/cartcontext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import ProductModal from "../components/ProductModel"; // Corrected typo: ProductModel -> ProductModal
import { useTheme } from "@mui/material/styles"; // Import useTheme
import Grid from "@mui/material/Grid";

// Define available categories
const categories = [
  "Desk Organizers",
  "Stands & Risers",
  "Cable Management",
  "Planters",
  "Decorations",
  "Accessories",
];

// Interface definitions
interface Product {
  id: string;
  name: string;
  imageUrl: string;
  link: string; // Keep this if used elsewhere, but navigation changes
  price: number;
  category: string;
  description?: string; // Add description if needed by modal
  discountPercentage?: number;
  tags?: string[];
}

interface ProductCardProps {
  item: Product;
  imageHeight?: number | string;
  onCardClick: (product: Product) => void;
}

// --- Text Color Constants for Contrast on Frosted Background ---
// Defined outside component for potential reuse, or define inside if preferred
const primaryTextFrosted = "rgba(255, 255, 255, 0.95)"; // Very bright white
const secondaryTextFrosted = "rgba(255, 255, 255, 0.75)"; // Slightly less bright white/grey
const dividerFrosted = "rgba(255, 255, 255, 0.15)"; // Slightly more visible divider

const ProductsPage: React.FC = () => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { productId: productIdFromUrl } = useParams<{ productId?: string }>();
  const theme = useTheme(); // Get theme object

  // --- State Definitions ---
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [actualMinPrice, setActualMinPrice] = useState<number>(0);
  const [actualMaxPrice, setActualMaxPrice] = useState<number>(100);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- Functions (Keep existing implementations) ---
  const formatImageUrl = useCallback(
    (url: string | undefined | null): string => {
      const API_BASE_URL = "http://localhost:5000"; //
      if (!url) return "";
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      const sanitizedPath = url.startsWith("/") ? url.substring(1) : url;
      return `${API_BASE_URL}/${sanitizedPath}`;
    },
    []
  );
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) {
        throw new Error(
          `Error fetching products: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      if (data && data.products && Array.isArray(data.products)) {
        const apiProducts: Product[] = data.products.map((item: any) => ({
          id: item._id,
          name: item.name,
          imageUrl: item.imageUrl,
          link: `/products/${item._id}`,
          price: item.price,
          category: item.category,
          description: item.description || "",
          discountPercentage: item.discountPercentage || 0,
          tags: item.tags || [],
        }));
        setProducts(apiProducts);
        if (apiProducts.length > 0) {
          const prices = apiProducts.map((p) => p.price);
          const minP = Math.floor(Math.min(...prices));
          const maxP = Math.ceil(Math.max(...prices));
          const finalMaxP = maxP >= minP ? maxP : minP + 50;
          setActualMinPrice(minP);
          setActualMaxPrice(finalMaxP);
          if (priceRange[0] === 0 && priceRange[1] === 100) {
            setPriceRange([minP, finalMaxP]);
          }
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
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      setError(
        `Failed to load products. ${
          err.message || "Check network connection or server status."
        }`
      );
      setActualMinPrice(0);
      setActualMaxPrice(100);
      setPriceRange([0, 100]);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, [priceRange]); // Keep dependencies minimal for initial fetch

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
    fetchProducts();
  }, [fetchProducts]);
  useEffect(() => {
    if (!loading) {
      applyFilters();
    }
  }, [applyFilters, loading]);
  useEffect(() => {
    if (productIdFromUrl && !loading && products.length > 0) {
      const productFromUrl = products.find((p) => p.id === productIdFromUrl);
      if (productFromUrl && !modalOpen) {
        setSelectedProduct(productFromUrl);
        setModalOpen(true);
      } else if (!productFromUrl) {
        console.warn(`Product with ID ${productIdFromUrl} not found.`);
        navigate("/products", { replace: true });
      }
    } else if (!productIdFromUrl && modalOpen) {
      /* Optional close */
    }
  }, [productIdFromUrl, loading, products, navigate, modalOpen]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = event.target.name;
    setSelectedCategories((prev) =>
      event.target.checked
        ? [...prev, category]
        : prev.filter((c) => c !== category)
    );
  };
  const handleCardClick = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
    navigate(`/products/${product.id}`, { replace: true });
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    navigate("/products", { replace: true });
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
  const handleAddToCart = (productId: string, quantity: number = 1) => {
    const product = products.find((p) => p.id === productId) || selectedProduct;
    if (product) {
      addItem(productId, quantity);
      setSnackbarMessage(`${product.name} added to cart!`);
      setSnackbarOpen(true);
    } else {
      console.error("Could not find product to add to cart:", productId);
      setSnackbarMessage(`Error adding item to cart.`);
      setSnackbarOpen(true);
    }
  };
  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  // Style constant for frosted effect
  const frosty = {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Adjust alpha for desired transparency
    backdropFilter: "blur(12px)", // Adjust blur
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "none", // Remove base elevation shadow
    borderRadius: "16px", // Consistent rounding
  };

  // --- Rendering Sub-Components ---

  const renderFilters = () => (
    // Apply base text color to the container for filters
    <Box sx={{ p: 2, color: primaryTextFrosted }}>
      <Typography
        variant="h6"
        gutterBottom
        component="div"
        sx={{ fontWeight: "bold", color: "inherit" }}
      >
        {" "}
        {/* Inherit color */}
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
                sx={{
                  color: secondaryTextFrosted, // Checkbox border color when unchecked
                  "&.Mui-checked": {
                    color: theme.palette.primary.light, // Color when checked (light primary)
                  },
                  "&.Mui-disabled": {
                    // Style disabled state
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              />
            }
            label={category}
            sx={{ mb: -0.5, color: "inherit" }} // Label inherits text color
          />
        ))}
      </FormGroup>
      <Divider sx={{ my: 2, borderColor: dividerFrosted }} />{" "}
      {/* Use frosted divider color */}
      <Typography
        variant="h6"
        gutterBottom
        component="div"
        sx={{ fontWeight: "bold", color: "inherit" }}
      >
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
            color: theme.palette.primary.light, // Slider track/thumb color
            "& .MuiSlider-thumb": {
              backgroundColor: theme.palette.primary.light, // Ensure thumb matches
              "&:hover, &.Mui-focusVisible": {
                // Optional: Slightly enhance thumb on hover/focus
                boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}33`, // Faint glow using alpha hex
              },
            },
            "& .MuiSlider-rail": {
              opacity: 0.3,
              backgroundColor: secondaryTextFrosted,
            },
            "& .MuiSlider-track": { borderColor: theme.palette.primary.light }, // Ensure track border uses light color
            "& .MuiSlider-valueLabel": {
              backgroundColor: theme.palette.primary.dark, // Darker background for label
              color: "white", // White text for label
            },
            "&.Mui-disabled": {
              // Style disabled slider track/thumb
              color: "rgba(255, 255, 255, 0.3)",
              "& .MuiSlider-thumb": {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              },
              "& .MuiSlider-rail": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            },
          }}
        />
      </Box>
      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 1, color: "inherit" }}
      >
        {" "}
        {/* Inherit text color */}${priceRange[0]} - ${priceRange[1]}
      </Typography>
      <Divider sx={{ my: 2, borderColor: dividerFrosted }} />{" "}
      {/* Use frosted divider color */}
      <Button
        variant="outlined"
        fullWidth
        onClick={resetFilters}
        disabled={loading}
        sx={{
          borderColor: dividerFrosted, // Use frosted divider color for border
          color: primaryTextFrosted, // White text
          "&:hover": {
            borderColor: secondaryTextFrosted, // Slightly brighter border on hover
            backgroundColor: "rgba(255, 255, 255, 0.08)", // Faint hover background
          },
          "&.Mui-disabled": {
            // Style disabled button
            borderColor: "rgba(255, 255, 255, 0.1)",
            color: "rgba(255, 255, 255, 0.3)",
          },
        }}
      >
        Reset Filters
      </Button>
    </Box>
  );

  // --- Product Card Component ---
  const ProductCard: React.FC<ProductCardProps> = ({
    item,
    imageHeight = "300px", // Use string value for height
    onCardClick,
  }) => {
    if (!item) return null;

    const handleAddToCartClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      event.stopPropagation();
      event.preventDefault();
      handleAddToCart(item.id);
    };

    const displayImageUrl = formatImageUrl(item.imageUrl);
    const hasTags = item.tags && item.tags.length > 0;
    const hasDiscount = item.discountPercentage && item.discountPercentage > 0;
    const discountedPrice = hasDiscount
      ? item.price * (1 - item.discountPercentage! / 100)
      : item.price;

    return (
      <Card
        component={RouterLink}
        to={`/products/${item.id}`}
        onClick={(e) => {
          e.preventDefault();
          onCardClick(item);
        }}
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
            cursor: "pointer",
            borderColor: "rgba(255, 255, 255, 0.3)", // Slightly brighter border on hover
          },
          ...frosty, // Apply frosted styles
        }}
      >
        <Box sx={{ position: "relative" }}>
        {hasDiscount && (
            <Chip
              label={`${item.discountPercentage}% OFF`}
              color="primary"
              size="small"
              sx={{
                position: "absolute", top: 8, left: 8, zIndex: 1, fontWeight: "bold",
              }}
            />
          )}
          {hasTags &&
            item.tags
              ?.slice(0, 1)
              .map((tag) => (
                <Chip key={tag} label={`${item.tags}`}
                color="primary"
                size="small"
                sx={{
                  position: "absolute", top: 8, right: 8, zIndex: 1, fontWeight: "bold",
                }} /* ...chip props... */ />
              ))}
          <CardMedia
            component="img"
            image={displayImageUrl}
            alt={item.name}
            sx={{
              height: imageHeight,
              objectFit: "cover",
              transition: "transform 0.35s ease-in-out",
              ".MuiCard-root:hover &": { transform: "scale(1.07)" },
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }} // Faint placeholder
            onError={(e) => {
              /* ... */
            }}
          />
          <IconButton
            aria-label={`Add ${item.name} to cart`}
            onClick={handleAddToCartClick}
            className="add-to-cart-button"
            size="small"
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
            <AddShoppingCartIcon fontSize="inherit" />
          </IconButton>
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // Remove fixed height, use flexbox space-between
            px: 1.5,
            py: 1, // Adjusted padding
            minHeight: "70px", // Keep min height
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline", // Removed p, boxSizing, minHeight from here
            }}
          >
            {/* Product Name - Use primary frosted color */}
            <Typography
              variant="body1"
              component="div"
              title={item.name}
              sx={{
                color: primaryTextFrosted,
                fontWeight: "bold",
                fontSize: "1.1rem",
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textAlign: "left",
                flexShrink: 1,
                mr: 1,
              }}
            >
              {item.name}
            </Typography>

            {/* Price Group */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "baseline",
                gap: 0.5,
                flexShrink: 0,
              }}
            >
              {/* Original Price - Use secondary frosted color */}
              {hasDiscount && item.price !== undefined && (
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: "line-through",
                    fontSize: "0.8rem",
                    color: secondaryTextFrosted,
                  }}
                >
                  ${item.price.toFixed(2)}
                </Typography>
              )}
              {/* Final/Discounted Price - Use theme error light or primary frosted */}
              {item.price !== undefined && (
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    color: hasDiscount
                      ? theme.palette.error.light
                      : primaryTextFrosted,
                    fontSize: "1.5rem",
                  }}
                >
                  ${discountedPrice.toFixed(2)}
                </Typography>
              )}
            </Box>
          </Box>
          {/* Description commented out */}
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
            disabled={loading}
            sx={{
              display: { xs: "inline-flex", md: "none" },
              ...frosty,
              color: primaryTextFrosted,
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.15)" }, // Apply frosted styles to button too
            }}
          >
            Filters
          </Button>
        </Box>

        {/* Main Layout */}
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
              elevation={0} // Remove elevation, use border from frosty
              sx={{
                position: "sticky",
                top: { xs: 80, sm: 114 }, // Adjust based on header height + margin
                ...frosty, // Apply frosted styles
                overflow: "hidden",
              }}
            >
              {renderFilters()} {/* Filter content */}
            </Paper>
          </Box>

          {/* Products Grid Area */}
          <Box sx={{ flexGrow: 1 }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 10,
                  minHeight: "300px",
                }}
              >
                <CircularProgress sx={{ color: "white" }} size={60} />{" "}
                {/* White spinner */}
              </Box>
            ) : error ? (
              <Paper
                elevation={0}
                sx={{
                  ...frosty,
                  py: 5,
                  px: 3,
                  textAlign: "center",
                  color: theme.palette.error.light,
                }}
              >
                {" "}
                {/* Frosted Error Paper */}
                <Typography variant="h6" gutterBottom>
                  {" "}
                  Oops! Something went wrong.{" "}
                </Typography>
                <Typography sx={{ mb: 2 }}>{error}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={fetchProducts}
                >
                  {" "}
                  Try Again{" "}
                </Button>
              </Paper>
            ) : filteredProducts.length > 0 ? (
              <Grid container spacing={3}>
                {filteredProducts.map((product) => (
                  <Grid size={{ xs: 6, sm: 6, md: 4 }} key={product.id}>
                    {" "}
                    {/* Grid v2 sizing */}
                    <ProductCard item={product} onCardClick={handleCardClick} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  ...frosty,
                  py: 5,
                  textAlign: "center",
                  color: secondaryTextFrosted,
                }}
              >
                {" "}
                {/* Frosted No Results Paper */}
                <Typography align="center">
                  {" "}
                  {products.length === 0
                    ? "No products are available at the moment."
                    : "No products found matching your criteria. Try adjusting the filters!"}{" "}
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
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" } }}
          PaperProps={{
            sx: {
              width: 280,
              ...frosty,
              backgroundColor: "rgba(40, 45, 70, 0.85)",
            },
          }} // Apply frosty to Drawer Paper, maybe darker/less transparent bg
        >
          <Box sx={{ height: "100%" }} role="presentation">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                borderBottom: 1,
                borderColor: dividerFrosted, // Use frosted divider color
              }}
            >
              <Typography
                variant="h6"
                sx={{ ml: 1, color: primaryTextFrosted }}
              >
                {" "}
                Filters{" "}
              </Typography>{" "}
              {/* White text */}
              <IconButton
                onClick={handleDrawerToggle}
                aria-label="Close filters"
                sx={{ color: primaryTextFrosted }}
              >
                {" "}
                {/* White icon */}
                <CloseIcon />
              </IconButton>
            </Box>
            {renderFilters()} {/* Render filters with adjusted text colors */}
          </Box>
        </Drawer>

        {/* Snackbar */}
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
            {" "}
            {snackbarMessage}{" "}
          </Alert>
        </Snackbar>

        {/* Product Modal */}
        <ProductModal
          product={selectedProduct}
          open={modalOpen}
          onClose={handleModalClose}
          onAddToCart={handleAddToCart}
          formatImageUrl={formatImageUrl}
        />
      </Container>
    </Box>
  );
};

export default ProductsPage;
