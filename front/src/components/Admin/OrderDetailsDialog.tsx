// src/components/Admin/OrderDetailsDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';

// Define interfaces
interface OrderItem {
  _id: string;
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

interface OrderDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: () => void;
}

// Status chip colors
const statusColors: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
  Processing: 'warning',
  Shipped: 'info',
  Delivered: 'success',
  Cancelled: 'error',
};

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  open,
  onClose,
  order,
  onUpdateStatus,
}) => {
  const theme = useTheme();

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (!order) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Order Details - #{order._id.substring(order._id.length - 8).toUpperCase()}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Typography><strong>Name:</strong> {order.user.name}</Typography>
              <Typography><strong>Email:</strong> {order.user.email}</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Typography>{order.shippingAddress.address}</Typography>
              <Typography>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </Typography>
              <Typography>{order.shippingAddress.country}</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Order Information
              </Typography>
              <Typography><strong>Date:</strong> {formatDate(order.createdAt)}</Typography>
              <Typography><strong>Payment Method:</strong> {order.paymentMethod}</Typography>
              <Typography>
                <strong>Payment Status:</strong>{' '}
                <Chip
                  size="small"
                  label={order.isPaid ? `Paid (${formatDate(order.paidAt)})` : 'Unpaid'}
                  color={order.isPaid ? 'success' : 'warning'}
                />
              </Typography>
              <Typography>
                <strong>Delivery Status:</strong>{' '}
                <Chip
                  size="small"
                  label={order.isDelivered ? `Delivered (${formatDate(order.deliveredAt)})` : 'Not Delivered'}
                  color={order.isDelivered ? 'success' : 'warning'}
                />
              </Typography>
              <Typography>
                <strong>Order Status:</strong>{' '}
                <Chip
                  size="small"
                  label={order.status}
                  color={statusColors[order.status]}
                />
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography><strong>Items:</strong></Typography>
                <Typography>${(order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography><strong>Shipping:</strong></Typography>
                <Typography>${order.shippingPrice.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography><strong>Tax:</strong></Typography>
                <Typography>${order.taxPrice.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #eee' }}>
                <Typography variant="h6"><strong>Total:</strong></Typography>
                <Typography variant="h6">${order.totalPrice.toFixed(2)}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.orderItems.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Box
                            component="img"
                            src={
                              item.image.startsWith('http')
                                ? item.image
                                : `http://localhost:5000/${item.image.startsWith('/') ? item.image.substring(1) : item.image}`
                            }
                            alt={item.name}
                            sx={{ width: 50, height: 50, objectFit: 'contain', borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                        <TableCell align="right">{item.qty}</TableCell>
                        <TableCell align="right">${(item.price * item.qty).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button 
          variant="contained" 
          onClick={onUpdateStatus}
          sx={{
            bgcolor: theme.themeColors.buttonPrimary,
            '&:hover': {
              bgcolor: theme.themeColors.buttonPrimaryHover,
            },
          }}
        >
          Update Status
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;