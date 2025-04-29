// src/components/Admin/OrdersTable.tsx
import React, { useState } from 'react'; // Import useState
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
  Alert,
  TablePagination,
  Paper, // Import Paper for TableContainer background
  Skeleton
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircleOutline as MarkPaidIcon, // Icon for marking as Paid
  HighlightOff as MarkUnpaidIcon // Icon for marking as Unpaid
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useToggleOrderPaidStatusMutation } from '../../store/apis/orderApi'; // Import the toggle hook

// Define interfaces - must match the interfaces in AdminOrders.tsx
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

interface OrdersResponse {
  orders: Order[];
  page: number;
  pages: number;
  total: number;
}

interface OrdersTableProps {
  ordersData: OrdersResponse | undefined;
  loading: boolean;
  error: any;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onViewOrder: (order: Order) => void;
  onEditStatus: (order: Order) => void;
  onDeleteOrder: (order: Order) => void;
  // Add setSnackbar prop
  setSnackbar: (snackbarState: { open: boolean; message: string; severity: 'success' | 'error' }) => void;
}

// Status chip colors
const statusColors: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
  Processing: 'warning',
  Shipped: 'info',
  Delivered: 'success',
  Cancelled: 'error',
};

const OrdersTable: React.FC<OrdersTableProps> = ({
  ordersData,
  loading,
  error,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onViewOrder,
  onEditStatus,
  onDeleteOrder,
  setSnackbar, // Destructure setSnackbar prop
}) => {

  // --- Hook for the toggle paid status mutation ---
  const [togglePaidStatus, { isLoading: isTogglingPaid }] = useToggleOrderPaidStatusMutation();
  // Local state to track which row's paid status is being toggled
  const [togglingPaidId, setTogglingPaidId] = useState<string | null>(null);


  // --- Handler for toggling paid status ---
  const handleTogglePaid = async (orderId: string) => {
    setTogglingPaidId(orderId); // Indicate loading for this specific row
    try {
      // Call the mutation hook
      const updatedOrder = await togglePaidStatus(orderId).unwrap();
      // Show success feedback using the passed snackbar setter
      setSnackbar({
        open: true,
        message: `Order marked as ${updatedOrder.isPaid ? 'Paid' : 'Unpaid'} successfully`,
        severity: 'success',
      });
      // Note: RTK Query invalidation should handle table refresh automatically
    } catch (err: any) {
      // Show error feedback
      console.error("Failed to toggle paid status:", err);
      setSnackbar({
        open: true,
        message: err.data?.message || err.error || 'Failed to update payment status',
        severity: 'error',
      });
    } finally {
      setTogglingPaidId(null); // Clear loading indicator for this row
    }
  };


  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Calculate order total (keep if used elsewhere, otherwise direct access is fine)
  const calculateTotal = (order: Order) => {
    return order.totalPrice.toFixed(2);
  };

  if (loading && !ordersData) { // Show loading only on initial fetch
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error.data?.message || error.error || 'An error occurred while fetching orders'}
      </Alert>
    );
  }

  return (
    <>
      <TableContainer component={Paper} elevation={0}> {/* Use Paper for background */}
        <Table stickyHeader sx={{ minWidth: 800 }} aria-label="orders table">
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-head': { fontWeight: 'bold', bgcolor: 'grey.100' } }}>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Payment</TableCell> {/* Header */}
              <TableCell align="center">Status</TableCell>
              <TableCell align="center" sx={{ minWidth: 150 }}>Actions</TableCell> {/* Ensure enough space */}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Handle Loading state specifically for table rows */}
            {loading && ordersData?.orders.length  && (
                [...Array(rowsPerPage)].map((_, i) => (
                    <TableRow key={`skel-${i}`}>
                        <TableCell colSpan={7}><Skeleton animation="wave" /></TableCell>
                    </TableRow>
                ))
            )}
            {/* Handle Empty state */}
            {!loading && (!ordersData || ordersData.orders.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 4 }}>
                    No orders found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {/* Render Order Rows */}
            {!loading && ordersData?.orders && ordersData.orders.length > 0 && (
              ordersData.orders.map((order) => (
                <TableRow key={order._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  {/* Order ID */}
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium" color="primary.main">
                      {order._id.substring(order._id.length - 8).toUpperCase()}
                    </Typography>
                  </TableCell>
                  {/* Date */}
                  <TableCell>
                    <Typography variant="caption">{formatDate(order.createdAt)}</Typography>
                    </TableCell>
                  {/* Customer */}
                  <TableCell>
                    <Typography variant="body2" noWrap title={order.user?.name}>{order.user?.name ?? 'N/A'}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap title={order.user?.email}>
                      {order.user?.email}
                    </Typography>
                  </TableCell>
                  {/* Total */}
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">${calculateTotal(order)}</Typography>
                  </TableCell>
                  {/* Payment Status & Toggle */}
                  <TableCell align="center">
                     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                       <Chip
                         size="small"
                         label={order.isPaid ? 'Paid' : 'Unpaid'}
                         color={order.isPaid ? 'success' : 'warning'}
                         sx={{ minWidth: 55 }} // Ensure chip width is consistent
                       />
                       <Tooltip title={order.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}>
                         {/* Wrap IconButton in span for Tooltip when disabled */}
                         <span>
                           <IconButton
                             size="small"
                             onClick={() => handleTogglePaid(order._id)}
                             // Disable only the button for the row being processed
                             disabled={isTogglingPaid && togglingPaidId === order._id}
                             color={order.isPaid ? "warning" : "success"}
                           >
                             {/* Show spinner or icon */}
                             {(isTogglingPaid && togglingPaidId === order._id) ? (
                               <CircularProgress size={20} color="inherit" />
                             ) : (
                               order.isPaid ? <MarkUnpaidIcon sx={{fontSize: '1.1rem'}} /> : <MarkPaidIcon sx={{fontSize: '1.1rem'}}/>
                             )}
                           </IconButton>
                         </span>
                       </Tooltip>
                    </Box>
                  </TableCell>
                  {/* Order Status */}
                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={order.status}
                      color={statusColors[order.status] || 'default'}
                    />
                  </TableCell>
                  {/* Actions */}
                  <TableCell align="center">
                     <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0 }}>
                       <Tooltip title="View Details">
                         <IconButton size="small" onClick={() => onViewOrder(order)} color="info">
                           <ViewIcon fontSize="inherit"/>
                         </IconButton>
                       </Tooltip>
                       <Tooltip title="Update Status">
                         <IconButton size="small" onClick={() => onEditStatus(order)} color="primary">
                           <EditIcon fontSize="inherit"/>
                         </IconButton>
                       </Tooltip>
                       <Tooltip title="Delete Order">
                         <IconButton size="small" onClick={() => onDeleteOrder(order)} color="error">
                           <DeleteIcon fontSize="inherit"/>
                         </IconButton>
                       </Tooltip>
                     </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        // Ensure count is provided even if ordersData is undefined initially
        count={ordersData?.total ?? 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  );
};

export default OrdersTable;