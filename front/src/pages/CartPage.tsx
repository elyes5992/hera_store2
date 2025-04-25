// src/pages/CartPage.tsx
import React, { useState, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Add useNavigate
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar'; // Add Snackbar
import Alert from '@mui/material/Alert'; // Add Alert
import CircularProgress from '@mui/material/CircularProgress'; // Add loading indicator

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

// Context
import { useCart, CartItem } from '../context/cartcontext';

const CartPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { cartItems, updateQuantity, removeItem, clearCart, getCartTotal } = useCart();

  // Add loading and alert states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // User details state
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // Order summary calculations
  const orderSummary = useMemo(() => {
    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 5.99;
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [getCartTotal]);

  // Event Handlers
  const handleQuantityChange = (id: string, delta: number) => {
    updateQuantity(id, delta);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Form validation
  const validateForm = () => {
    // Check if cart is empty
    if (cartItems.length === 0) {
      setAlert({
        open: true,
        message: 'Your cart is empty',
        severity: 'error',
      });
      return false;
    }

    // Check required fields
    const requiredFields = ['name', 'email', 'address', 'city', 'postalCode', 'country'];
    const missingFields = requiredFields.filter(field => !userDetails[field as keyof typeof userDetails]);
    
    if (missingFields.length > 0) {
      setAlert({
        open: true,
        message: `Please fill in all required fields: ${missingFields.join(', ')}`,
        severity: 'error',
      });
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) {
      setAlert({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'error',
      });
      return false;
    }

    return true;
  };

  // Handle order submission
  const handleConfirmOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.imageUrl,
          price: item.price,
          product: item.id, // This should be the product ID
        })),
        shippingAddress: {
          address: userDetails.address,
          city: userDetails.city,
          postalCode: userDetails.postalCode,
          country: userDetails.country,
        },
        paymentMethod: 'PayPal', // Hard-coded for now, could be dynamic
        itemsPrice: orderSummary.subtotal,
        taxPrice: orderSummary.tax,
        shippingPrice: orderSummary.shipping,
        totalPrice: orderSummary.total,
      };

      // Get token if user is logged in (optional)
      const token = localStorage.getItem('userToken');
      
      // Make API request to create order
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      // Order created successfully
      const data = await response.json();
      
      setAlert({
        open: true,
        message: 'Order placed successfully!',
        severity: 'success',
      });

      // Clear cart and form
      clearCart();
      setUserDetails({
        name: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
      });

      // After successful order, redirect to order confirmation or thank you page
      // You could create this page and pass the order ID
      // For now, we'll just log the order and stay on the page
      console.log('Order created:', data);
      
      // Optional: redirect to a thank you page
      // setTimeout(() => {
      //   navigate(`/order-confirmation/${data._id}`);
      // }, 2000);
      
    } catch (error) {
      console.error('Error creating order:', error);
      setAlert({
        open: true,
        message: error instanceof Error ? error.message : 'An error occurred while placing your order',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close alert
  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, mt: { xs: 2, sm: 0 } }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 600 }}>
        Your Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', borderColor: 'divider' }}>
          <Typography variant="h6" color="text.secondary">Your cart is currently empty.</Typography>
          <Button component={RouterLink} to="/products" variant="contained" sx={{ mt: 2 }}>
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {/* Cart Items Column */}
          <Grid item xs={12} md={7}>
            <Paper elevation={2} sx={{ p: { xs: 1, sm: 2 }, borderRadius: '12px' }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 1, pl: 1, fontWeight: 500 }}>Items</Typography>
              <List disablePadding>
                {cartItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      alignItems="center"
                      sx={{
                        py: 2,
                        flexWrap: 'wrap'
                      }}
                    >
                      <ListItemAvatar sx={{ mr: { xs: 1, sm: 2 }, mb: { xs: 1, sm: 0 } }}>
                        <Avatar
                          variant="rounded"
                          src={item.imageUrl}
                          alt={item.name}
                          sx={{ width: { xs: 50, sm: 70 }, height: { xs: 50, sm: 70 } }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={`$${item.price.toFixed(2)} each`}
                        primaryTypographyProps={{ fontWeight: 'medium', mb: 0.5 }}
                        sx={{ flexGrow: 1, mr: 1, minWidth: '100px' }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 }, minWidth: 120, justifyContent: 'flex-end' }}>
                        <IconButton size="small" onClick={() => handleQuantityChange(item.id, -1)} aria-label="reduce quantity">
                          <RemoveIcon fontSize="inherit" />
                        </IconButton>
                        <Typography sx={{ mx: { xs: 1, sm: 1.5 } }} variant="body1">{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => handleQuantityChange(item.id, 1)} aria-label="increase quantity">
                          <AddIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item.id)} sx={{ ml: { xs: 1, sm: 1.5 } }}>
                          <DeleteIcon fontSize="small" color="error"/>
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < cartItems.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Summary & Details Column */}
          <Grid item xs={12} md={5}>
            {/* Order Summary */}
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: '12px' }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>Order Summary</Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight="medium">${orderSummary.subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography fontWeight="medium">
                    {orderSummary.shipping === 0 ? 'FREE' : `$${orderSummary.shipping.toFixed(2)}`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Tax (Est.)</Typography>
                  <Typography fontWeight="medium">${orderSummary.tax.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }}/>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" fontWeight="bold">${orderSummary.total.toFixed(2)}</Typography>
                </Box>
              </Stack>
            </Paper>

            {/* User Details Form */}
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '12px' }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>Shipping Details</Typography>
              <Box component="form" onSubmit={handleConfirmOrder} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="name"
                      name="name"
                      label="Full Name"
                      value={userDetails.name}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      name="email"
                      label="Email Address"
                      type="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="address"
                      name="address"
                      label="Street Address"
                      value={userDetails.address}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="city"
                      name="city"
                      label="City"
                      value={userDetails.city}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="postalCode"
                      name="postalCode"
                      label="Postal Code"
                      value={userDetails.postalCode}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="country"
                      name="country"
                      label="Country"
                      value={userDetails.country}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartCheckoutIcon />}
                      sx={{ mt: 2, py: 1.5 }}
                      disabled={isSubmitting || cartItems.length === 0}
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Order & Checkout'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Alert for success/error messages */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CartPage;