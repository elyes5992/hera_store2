// src/pages/CartPage.tsx
import React, { useState, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Import RouterLink
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
import Stack from '@mui/material/Stack'; // Make sure Stack is imported

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

// --- Import Cart Context Hook and Types ---
import { useCart, CartItem } from '../context/cartcontext'; // Adjust path if needed


const CartPage: React.FC = () => {
  // --- Use Cart Context State and Actions ---
  const { cartItems, updateQuantity, removeItem, clearCart, getCartTotal } = useCart();

  // --- Local State for Form Details ---
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // --- Calculations (use getCartTotal from context) ---
  const orderSummary = useMemo(() => {
    const subtotal = getCartTotal(); // Use context total calculation
    const shipping = subtotal > 50 ? 0 : 5.99;
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [getCartTotal]); // Depend on context function

  // --- Event Handlers ---
  const handleQuantityChange = (id: string, delta: number) => {
    updateQuantity(id, delta); // Use context action
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id); // Use context action
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleConfirmOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("--- Order Confirmation ---");
    console.log("Cart Items:", JSON.stringify(cartItems, null, 2));
    console.log("User Details:", JSON.stringify(userDetails, null, 2));
    console.log("Order Summary:", JSON.stringify(orderSummary, null, 2));
    alert('Order Confirmed (Check Console)! This is a simulation.');
    clearCart(); // Use context action to clear cart
    setUserDetails({ name: '', email: '', address: '', city: '', postalCode: '', country: ''});
  };

  // --- Main Render ---
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, mt: { xs: 2, sm: 0 } }}> {/* Adjusted padding */}
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
          {/* --- Cart Items Column --- */}
          <Grid size={{xs:12, md:7}} >
            <Paper elevation={2} sx={{ p: { xs: 1, sm: 2 }, borderRadius: '12px' }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 1, pl: 1, fontWeight: 500 }}>Items</Typography>
              <List disablePadding>
                {cartItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      alignItems="center" // Align center vertically
                      sx={{
                        py: 2,
                        flexWrap: 'wrap' // Allow wrapping on small screens
                      }}
                    >
                      <ListItemAvatar sx={{ mr: { xs: 1, sm: 2 }, mb: { xs: 1, sm: 0 } }}>
                        <Avatar
                            variant="rounded"
                            src={item.imageUrl}
                            alt={item.name}
                            sx={{ width: { xs: 50, sm: 70 }, height: { xs: 50, sm: 70 } }} // Responsive avatar
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={`$${item.price.toFixed(2)} each`}
                        primaryTypographyProps={{ fontWeight: 'medium', mb: 0.5 }}
                        sx={{ flexGrow: 1, mr: 1, minWidth: '100px' }} // Allow text to take space
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
                    {/* Add divider except for the last item */}
                    {index < cartItems.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* --- Summary & Details Column --- */}
          <Grid size={{xs:12 ,md:5}} >
            {/* Order Summary */}
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: '12px' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>Order Summary</Typography>
                <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}> <Typography color="text.secondary">Subtotal</Typography> <Typography fontWeight="medium">${orderSummary.subtotal.toFixed(2)}</Typography> </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}> <Typography color="text.secondary">Shipping</Typography> <Typography fontWeight="medium">{orderSummary.shipping === 0 ? 'FREE' : `$${orderSummary.shipping.toFixed(2)}`}</Typography> </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}> <Typography color="text.secondary">Tax (Est.)</Typography> <Typography fontWeight="medium">${orderSummary.tax.toFixed(2)}</Typography> </Box>
                    <Divider sx={{ my: 1 }}/>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}> <Typography variant="h6">Total</Typography> <Typography variant="h6" fontWeight="bold">${orderSummary.total.toFixed(2)}</Typography> </Box>
                </Stack>
            </Paper>

            {/* User Details Form */}
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '12px' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>Shipping Details</Typography>
                <Box component="form" onSubmit={handleConfirmOrder} noValidate> {/* Added noValidate */}
                    <Grid container spacing={2}>
                        <Grid size={{xs:12}}> <TextField required fullWidth id="name" name="name" label="Full Name" value={userDetails.name} onChange={handleInputChange} variant="outlined" size="small" /> </Grid>
                        <Grid size={{xs:12}}> <TextField required fullWidth id="email" name="email" label="Email Address" type="email" value={userDetails.email} onChange={handleInputChange} variant="outlined" size="small" /> </Grid>
                        <Grid size={{xs:12}}> <TextField required fullWidth id="address" name="address" label="Street Address" value={userDetails.address} onChange={handleInputChange} variant="outlined" size="small" /> </Grid>
                        <Grid size={{xs:12,sm:6}} > <TextField required fullWidth id="city" name="city" label="City" value={userDetails.city} onChange={handleInputChange} variant="outlined" size="small" /> </Grid>
                        <Grid size={{xs:12,sm:6}}> <TextField required fullWidth id="postalCode" name="postalCode" label="Postal Code" value={userDetails.postalCode} onChange={handleInputChange} variant="outlined" size="small" /> </Grid>
                        <Grid size={{xs:12}}> <TextField required fullWidth id="country" name="country" label="Country" value={userDetails.country} onChange={handleInputChange} variant="outlined" size="small" /> </Grid>
                        <Grid size={{xs:12}}> <Button type="submit" variant="contained" color="primary" fullWidth size="large" startIcon={<ShoppingCartCheckoutIcon />} sx={{ mt: 2, py: 1.5 }}> Confirm Order & Checkout </Button> </Grid>
                    </Grid>
                </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CartPage;