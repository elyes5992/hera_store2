// src/pages/CartPage.tsx (or wherever it resides)
import React, { useState, useMemo, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
// Using Grid v2 for better spacing/sizing control
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles"; // Import useTheme

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

// Context & Types
import { useCart, CartItem } from "../context/cartcontext"; // Use updated CartItem interface
import { useUser } from "../context/userContext";
import Grid from "@mui/material/Grid";

// --- Style Constants for Frosted Effect ---
const frostedPaperSx = {
  p: { xs: 2, sm: 3 }, // Keep padding
  borderRadius: "16px", // Slightly more rounded corners often look good
  // --- Frosted Glass Effect ---
  backgroundColor: "rgba(255, 255, 255, 0.1)", // Very transparent white
  backdropFilter: "blur(12px)", // Adjust blur amount
  // --- Optional Subtle Border ---
  border: "1px solid rgba(255, 255, 255, 0.18)",
  // --- Remove Elevation/Shadow ---
  boxShadow: "none",
};

// --- Text Color Constants for Contrast on Frosted Background ---
const primaryTextFrosted = "rgba(255, 255, 255, 0.9)"; // Near white
const secondaryTextFrosted = "rgba(255, 255, 255, 0.7)"; // Lighter grey/white
const dividerFrosted = "rgba(255, 255, 255, 0.12)"; // Faint white divider

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme(); // Get theme object
  const {
    cartItems,
    updateQuantity, // Use the updated context function
    removeItem,
    clearCart: contextClearCart, // Renamed to avoid conflict
    getCartTotal,
    isLoading, // Get loading state from context
    error, // Get error state from context
    fetchCart, // Can be used for manual refresh if needed
  } = useCart();
  const { user } = useUser(); // Get user state for pre-filling form

  // Local state for form submission and alerts
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "success" });

  // Local user details state (for shipping form)
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  // Pre-fill user details when user data becomes available
  useEffect(() => {
    if (user) {
      setUserDetails((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]); // Run when user object changes

  // Order summary calculation - Relies on getCartTotal from context
  const orderSummary = useMemo(() => {
    const subtotal = getCartTotal(); // Uses priceAtAdd via context
    const shipping = subtotal > 50 ? 0 : 5.99; // Example shipping logic
    const taxRate = 0.08; // Example tax rate
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [getCartTotal]); // Correct dependency

  // --- Event Handlers ---

  const handleQuantityChange = async (id: string, delta: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    const newQuantity = item.quantity + delta;
    await updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = async (id: string) => {
    await removeItem(id);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (error) {
      setAlert({ open: true, message: error, severity: "error" });
    }
  }, [error]);

  const validateForm = () => {
    if (cartItems.length === 0) {
      setAlert({ open: true, message: "Your cart is empty", severity: "error" });
      return false;
    }
    const requiredFields = ["name", "email", "address", "city", "postalCode", "country"];
    const missingFields = requiredFields.filter( (field) => !userDetails[field as keyof typeof userDetails] );
    if (missingFields.length > 0) {
      setAlert({ open: true, message: `Please fill in all required fields: ${missingFields.join( ", " )}`, severity: "error" });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) {
      setAlert({ open: true, message: "Please enter a valid email address", severity: "error" });
      return false;
    }
    return true;
  };

  const handleConfirmOrder = async ( event: React.FormEvent<HTMLFormElement> ) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.quantity,
          image: item.imageUrl,
          price: item.price,
          product: item.id,
        })),
        shippingAddress: {
          address: userDetails.address,
          city: userDetails.city,
          postalCode: userDetails.postalCode,
          country: userDetails.country,
        },
        paymentMethod: "PayPal", // Example
        itemsPrice: orderSummary.subtotal,
        taxPrice: orderSummary.tax,
        shippingPrice: orderSummary.shipping,
        totalPrice: orderSummary.total,
      };

      const token = user?.token || localStorage.getItem("userToken");

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }
      const data = await response.json();

      setAlert({ open: true, message: "Order placed successfully!", severity: "success" });
      await contextClearCart();
      setUserDetails({
        name: user?.name || "",
        email: user?.email || "",
        address: "", city: "", postalCode: "", country: ""
      });
      console.log("Order created:", data);
      // Optional: navigate(`/order-confirmation/${data._id}`);
    } catch (err: any) {
      console.error("Error creating order:", err);
      setAlert({ open: true, message: err.message || "An error occurred while placing your order", severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatImageUrl = (url: string | undefined | null): string => {
    const API_BASE_URL = "http://localhost:5000";
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const sanitizedPath = url.startsWith("/") ? url.substring(1) : url;
    return `${API_BASE_URL}/${sanitizedPath}`;
  };

  // --- Rendering ---
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, mt: { xs: 2, sm: 0 } }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" color="white" sx={{ mb: 4, fontWeight: 600 }}>
        Your Shopping Cart
      </Typography>

      {isLoading && cartItems.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      )}

      {!isLoading && cartItems.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            ...frostedPaperSx, // Apply frosted style
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: secondaryTextFrosted }}> {/* Adjust text color */}
            Your cart is currently empty.
          </Typography>
          <Button component={RouterLink} to="/products" variant="contained" sx={{ mt: 2 }}>
            Start Shopping
          </Button>
        </Paper>
      )}

      {cartItems.length > 0 && (
        <Grid container spacing={4}>
          {/* Cart Items Column */}
          <Grid size={{xs:12 ,md:7}}>
            <Paper
              sx={{
                ...frostedPaperSx, // Apply frosted style
                p: { xs: 1, sm: 2 }, // Override padding if needed
                position: "relative",
                opacity: isLoading ? 0.7 : 1,
                pointerEvents: isLoading ? "none" : "auto",
                overflow: 'hidden', // Clip loading overlay if needed
              }}
            >
              {isLoading && (
                <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.3)", zIndex: 1, borderRadius: "inherit" }}>
                  <CircularProgress size={40} sx={{ color: 'white' }}/>
                </Box>
              )}
              <Typography variant="h5" gutterBottom sx={{ mb: 1, pl: 1, fontWeight: 500, color: primaryTextFrosted }}> {/* Text Color */}
                Items
              </Typography>
              <List disablePadding>
                {cartItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem alignItems="center" sx={{ py: 2, flexWrap: "wrap" }}>
                      <ListItemAvatar sx={{ mr: { xs: 1, sm: 2 }, mb: { xs: 1, sm: 0 } }}>
                        <Avatar variant="rounded" src={formatImageUrl(item.imageUrl)} alt={item.name} sx={{ width: { xs: 50, sm: 70 }, height: { xs: 50, sm: 70 } }}/>
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: primaryTextFrosted }}> {/* Text Color */}
                              ${item.price.toFixed(2)} each
                            </Typography>
                            {item.description && (
                              <Typography component="p" variant="caption" display="block" sx={{ mt: 0.5, lineHeight: 1.3, color: secondaryTextFrosted }}> {/* Text Color */}
                                {item.description.substring(0, 100)}{item.description.length > 100 ? "..." : ""}
                              </Typography>
                            )}
                          </>
                        }
                        primaryTypographyProps={{ fontWeight: "medium", mb: 0.5, sx: { color: primaryTextFrosted } }} // Text Color
                        sx={{ flexGrow: 1, mr: 1, minWidth: "100px" }}
                      />
                      {/* Quantity Controls */}
                      <Box sx={{ display: "flex", alignItems: "center", ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 }, minWidth: 120, justifyContent: "flex-end" }}>
                        <IconButton size="small" onClick={() => handleQuantityChange(item.id, -1)} aria-label="reduce quantity" disabled={isLoading} sx={{ color: secondaryTextFrosted }}> {/* Icon Color */}
                          <RemoveIcon fontSize="inherit" />
                        </IconButton>
                        <Typography sx={{ mx: { xs: 1, sm: 1.5 }, variant: "body1", color: primaryTextFrosted }}> {/* Text Color */}
                          {item.quantity}
                        </Typography>
                        <IconButton size="small" onClick={() => handleQuantityChange(item.id, 1)} aria-label="increase quantity" disabled={isLoading} sx={{ color: secondaryTextFrosted }}> {/* Icon Color */}
                          <AddIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item.id)} sx={{ ml: { xs: 1, sm: 1.5 }, color: theme.palette.error.light }} disabled={isLoading}> {/* Use lighter error color */}
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < cartItems.length - 1 && (
                      <Divider variant="inset" component="li" sx={{ borderColor: dividerFrosted, ml: {xs: 0, sm:'90px'} }} /> // Divider Color & Indent Fix
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Summary & Details Column */}
          <Grid size={{xs:12 ,md:5}}>
            {/* Order Summary Paper */}
            <Paper
              sx={{ ...frostedPaperSx, mb: 3 }} // Apply frosted style
            >
              <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 500, color: primaryTextFrosted }}> {/* Text Color */}
                Order Summary
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: secondaryTextFrosted }}>Subtotal</Typography> {/* Text Color */}
                  <Typography fontWeight="medium" sx={{ color: primaryTextFrosted }}>${orderSummary.subtotal.toFixed(2)}</Typography> {/* Text Color */}
                </Box>
                 <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: secondaryTextFrosted }}>Shipping</Typography> {/* Text Color */}
                  <Typography fontWeight="medium" sx={{ color: primaryTextFrosted }}>{orderSummary.shipping === 0 ? "FREE" : `$${orderSummary.shipping.toFixed(2)}`}</Typography> {/* Text Color */}
                </Box>
                 <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: secondaryTextFrosted }}>Tax (Est.)</Typography> {/* Text Color */}
                  <Typography fontWeight="medium" sx={{ color: primaryTextFrosted }}>${orderSummary.tax.toFixed(2)}</Typography> {/* Text Color */}
                </Box>
                <Divider sx={{ my: 1, borderColor: dividerFrosted }} /> {/* Divider Color */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" sx={{ color: primaryTextFrosted }}>Total</Typography> {/* Text Color */}
                  <Typography variant="h6" fontWeight="bold" sx={{ color: primaryTextFrosted }}>${orderSummary.total.toFixed(2)}</Typography> {/* Text Color */}
                </Box>
              </Stack>
            </Paper>

            {/* User Details Form Paper */}
            <Paper
              sx={{ ...frostedPaperSx, opacity: isLoading ? 0.7 : 1 }} // Apply frosted style
            >
              <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 500, color: primaryTextFrosted }}> {/* Text Color */}
                Shipping Details
              </Typography>
              {/* --- Form Fields need adjustments for contrast --- */}
              <Box component="form" onSubmit={handleConfirmOrder} noValidate>
                 <Grid container spacing={2}>
                   {/* Update TextField styles for better visibility */}
                   {['name', 'email', 'address', 'city', 'postalCode', 'country'].map((field) => (
                       <Grid size={{xs:12, sm:(field === 'city' || field === 'postalCode') ? 6 : 12}} key={field}>
                           <TextField
                               required
                               fullWidth
                               id={field}
                               name={field}
                               // Auto-generate label - improved slightly
                               label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                               type={field === 'email' ? 'email' : 'text'}
                               value={userDetails[field as keyof typeof userDetails]}
                               onChange={handleInputChange}
                               variant="outlined" // Or 'filled' - might look better with transparency
                               size="small"
                               disabled={isLoading || isSubmitting}
                               InputLabelProps={{
                                   sx: { color: secondaryTextFrosted }, // Label color
                               }}
                               InputProps={{
                                   sx: {
                                      color: primaryTextFrosted, // Input text color
                                      '& .MuiOutlinedInput-notchedOutline': {
                                          borderColor: dividerFrosted, // Border color
                                      },
                                      '&:hover .MuiOutlinedInput-notchedOutline': {
                                          borderColor: secondaryTextFrosted, // Hover border
                                      },
                                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                          borderColor: theme.palette.primary.light, // Focused border (use theme color)
                                      },
                                      '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                                          borderColor: 'rgba(255, 255, 255, 0.1)', // Disabled border
                                      },
                                      '&.Mui-disabled': {
                                          backgroundColor: 'rgba(255, 255, 255, 0.05)', // Slightly different bg when disabled
                                          WebkitTextFillColor: secondaryTextFrosted, // Ensure text color in disabled state
                                          '& .MuiInputLabel-root': { // Ensure label color in disabled state
                                              color: secondaryTextFrosted,
                                          }
                                      }
                                    },
                               }}
                           />
                       </Grid>
                   ))}
                   <Grid size={{xs:12}}>
                     <Button type="submit" variant="contained" color="primary" fullWidth size="large" startIcon={ isSubmitting ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartCheckoutIcon /> } sx={{ mt: 2, py: 1.5 }} disabled={ isLoading || isSubmitting || cartItems.length === 0 }>
                       {isSubmitting ? "Processing..." : "Confirm Order & Checkout"}
                     </Button>
                   </Grid>
                 </Grid>
               </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Alert Snackbar (Keep as is) */}
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} variant="filled" sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CartPage;