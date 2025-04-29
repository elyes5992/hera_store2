import React from "react";
// import { useNavigate, useParams } from "react-router-dom"; // <-- Remove these
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
// import { useCart } from "../context/cartcontext"; // <-- Remove if not directly used here

// Define the Product type directly or import if shared
interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  discountPercentage?: number;
  tags?: string[];
  description?: string;
}

interface ProductModalProps {
  product: Product | null; // Type it correctly
  open: boolean;
  onClose: () => void; // Simple close handler from parent
  onAddToCart: (productId: string, quantity: number) => void; // Handler from parent
  formatImageUrl: (url: string | undefined | null) => string;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  open,
  onClose, // Just use onClose now
  onAddToCart,
  formatImageUrl,
}) => {
  const [quantity, setQuantity] = React.useState(1);
  // const navigate = useNavigate(); // <-- Remove

  // Reset quantity when modal opens for a new product
  React.useEffect(() => {
    if (open) {
      setQuantity(1);
    }
  }, [open, product]); // Reset when open state changes or product changes

  if (!product) return null; // Still need this guard

  const handleAddToCartClick = () => {
    onAddToCart(product.id, quantity); // Call parent's handler
    // Don't close the modal or navigate here
  };

  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discountPercentage! / 100)
    : product.price;

  // --- UPDATED handleBackToProducts ---
  const handleBackClick = () => {
    onClose(); // Simply call the parent's onClose handler
  };

  const displayImageUrl = formatImageUrl(product.imageUrl);

  return (
    <Modal
      open={open}
      onClose={onClose} // Use the parent's close handler for backdrop click etc.
      aria-labelledby="product-modal-title"
      aria-describedby="product-modal-description"
      sx={{ /* ... modal styles ... */
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <Paper
        elevation={5}
        sx={{ /* ... paper styles ... */
          width: { xs: "95%", sm: "90%", md: "75%" },
          maxWidth: "1000px", // Limit max width
          maxHeight: "90vh",
          overflow: "auto", // Make content scrollable if needed
          borderRadius: "16px",
          position: "relative", // Needed for absolute positioning of buttons
          p: 0, // Remove padding here, add within content areas
          backgroundColor: "rgba(255, 255, 255, 0.98)", // Slightly opaque background
        }}
      >
        {/* Close button */}
        <IconButton
          aria-label="close"
          onClick={onClose} // Use parent's handler
          sx={{ /* ... close button styles ... */
            position: "absolute",
            top: 8,
            right: 8,
            color: "grey.500",
            zIndex: 2, // Ensure it's above content
            bgcolor: "rgba(255, 255, 255, 0.7)",
             "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Back button */}
        <IconButton
          aria-label="back"
          onClick={handleBackClick} // <-- Use updated handler
          sx={{ /* ... back button styles ... */
            position: "absolute",
            top: 8,
            left: 8,
            color: "grey.500",
            zIndex: 2, // Ensure it's above content
            bgcolor: "rgba(255, 255, 255, 0.7)",
             "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Grid container>
          {/* Product Image */}
          <Grid size={{ xs: 12, md: 6 }}>
             <Box sx={{ /* ... image container styles ... */
                 height: { xs: '300px', sm: '350px', md: '100%' }, // Let height fill on larger screens
                 minHeight: '300px', // Ensure min height
                 position: 'relative',
                 overflow: 'hidden', // Clip image if needed
                 borderTopLeftRadius: { md: '16px' }, // Match paper radius
                 borderBottomLeftRadius: { md: '16px' },
             }}>
              {hasDiscount && (
                <Chip
                  label={`${product.discountPercentage}% OFF`}
                  color="secondary"
                  size="small"
                  sx={{ /* ... discount chip styles ... */
                     position: "absolute",
                     top: 16, // Adjust position
                     left: 16, // Adjust position (consider back button)
                     zIndex: 1,
                     fontWeight: "bold",
                  }}
                />
              )}
              <img
                src={displayImageUrl}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // Cover the area
                }}
              />
             </Box>
          </Grid>

          {/* Product Details */}
          <Grid size={{ xs:12 ,md:6}}>
            <Box sx={{ p: { xs: 2, sm: 3}, pt: { xs: 6, sm: 5 } }}> {/* Add padding, more top padding due to buttons */}
              <Box sx={{ mb: 2 }}>
                <Typography id="product-modal-title" variant="h5" fontWeight="bold" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Category: {product.category}
                </Typography>
                {product.tags && product.tags.length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, my: 1 }}>
                    {product.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.75rem" }}
                      />
                    ))}
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Price Display */}
              <Box sx={{ my: 2 }}>
                 <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    {hasDiscount && (
                        <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through" }}
                        >
                        ${product.price.toFixed(2)}
                        </Typography>
                    )}
                    <Typography
                        variant="h5"
                        color={hasDiscount ? "error.main" : "text.primary"}
                        fontWeight="bold"
                    >
                        ${discountedPrice.toFixed(2)}
                    </Typography>
                 </Box>
                {hasDiscount && (
                    <Typography variant="body2" color="success.main" sx={{ mt: 0.5 }}>
                    You save: ${(product.price - discountedPrice).toFixed(2)} ({product.discountPercentage}%)
                    </Typography>
                )}
              </Box>

              {/* Description */}
              <Box sx={{ my: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography id="product-modal-description" variant="body2" color="text.secondary">
                  {product.description || "No description available for this product."}
                </Typography>
              </Box>

              {/* Quantity Selector */}
              <Box sx={{ display: 'flex', alignItems: 'center', my: 3, gap: 2 }}>
                 <Typography variant="body1">Quantity:</Typography>
                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant="outlined" size="small" onClick={() => setQuantity(q => Math.max(1, q - 1))} sx={{ minWidth: '40px' }}>-</Button>
                    <Typography sx={{ mx: 2, minWidth: '20px', textAlign: 'center' }}>{quantity}</Typography>
                    <Button variant="outlined" size="small" onClick={() => setQuantity(q => q + 1)} sx={{ minWidth: '40px' }}>+</Button>
                 </Box>
              </Box>

              {/* Add to Cart Button */}
              <Button
                variant="contained"
                startIcon={<AddShoppingCartIcon />}
                onClick={handleAddToCartClick} // Use specific handler
                fullWidth
                size="large"
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: "8px",
                }}
              >
                Add {quantity} to Cart {/* Dynamically update button text */}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

export default ProductModal;