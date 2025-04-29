// src/pages/Admin/AdminOrders.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Snackbar,
  useTheme,
  SelectChangeEvent,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Import custom components
import OrderFilters from '../../components/Admin/OrderFilters';
import OrdersTable from '../../components/Admin/OrderTable';
import OrderDetailsDialog from '../../components/Admin/OrderDetailsDialog';
import StatusUpdateDialog from '../../components/Admin/StatusUpdateDialog';
import DeleteConfirmationDialog from '../../components/Admin/DeleteConfirmationDialog';

// Import Redux hooks
import { 
  useGetOrdersQuery, 
  useUpdateOrderStatusMutation, 
  useDeleteOrderMutation 
} from '../../store/apis/orderApi';

// Define TypeScript interfaces
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

const AdminOrders: React.FC = () => {
  const theme = useTheme();

  // State for selected order (for view/edit)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for filters
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    customer: '',
    orderId: '',
  });

  // State for snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Mutations
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  // Query parameters for orders
  const queryParams = {
    pageNumber: page + 1,
    ...(filters.status && { status: filters.status }),
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
    ...(filters.customer && { customer: filters.customer }),
    ...(filters.orderId && { orderId: filters.orderId }),
  };

  // Fetch orders using RTK Query
  const { 
    data: ordersData, 
    isLoading: loading, 
    error: orderError,
    refetch: refetchOrders
  } = useGetOrdersQuery(queryParams);

  // Apply filters
  const handleApplyFilters = () => {
    setPage(0); // Reset to first page
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      status: '',
      startDate: '',
      endDate: '',
      customer: '',
      orderId: '',
    });
    setPage(0);
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFilters(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle view order
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOpenViewDialog(true);
  };

  // Handle edit order status
  const handleEditStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setOpenEditDialog(true);
  };

  // Handle delete order
  const handleDeleteOrder = (order: Order) => {
    setSelectedOrder(order);
    setOpenDeleteDialog(true);
  };

  // Handle status change in dialog
  const handleStatusChange = (e: SelectChangeEvent) => {
    setNewStatus(e.target.value);
  };

  // Update order status using mutation
  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;

    try {
      await updateOrderStatus({ 
        id: selectedOrder._id, 
        status: newStatus 
      }).unwrap();

      // Show success message
      setSnackbar({
        open: true,
        message: 'Order status updated successfully',
        severity: 'success',
      });

      // Close dialog
      setOpenEditDialog(false);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update order status',
        severity: 'error',
      });
    }
  };

  // Confirm delete order using mutation
  const confirmDeleteOrder = async () => {
    if (!selectedOrder) return;

    try {
      await deleteOrder(selectedOrder._id).unwrap();

      // Show success message
      setSnackbar({
        open: true,
        message: 'Order deleted successfully',
        severity: 'success',
      });

      // Close dialog
      setOpenDeleteDialog(false);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete order',
        severity: 'error',
      });
    }
  };

  // Handle pagination change
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle clicking Update Status from View Dialog
  const handleViewToUpdateStatus = () => {
    if (selectedOrder) {
      setOpenViewDialog(false);
      handleEditStatus(selectedOrder);
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ sm:6, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Order Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => refetchOrders()}
        >
          Refresh
        </Button>
      </Box>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <OrderFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      </Paper>

      {/* Orders Table */}
      <Paper elevation={3} sx={{ overflow: 'hidden', mb: 3 }}>
        <OrdersTable 
          ordersData={ordersData}
          loading={loading}
          error={orderError}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onViewOrder={handleViewOrder}
          onEditStatus={handleEditStatus}
          onDeleteOrder={handleDeleteOrder}
          setSnackbar={setSnackbar}
        />
      </Paper>

      {/* Order Details Dialog */}
      <OrderDetailsDialog 
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        order={selectedOrder}
        onUpdateStatus={handleViewToUpdateStatus}
      />

      {/* Status Update Dialog */}
      <StatusUpdateDialog 
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        status={newStatus}
        onStatusChange={handleStatusChange}
        onUpdate={handleUpdateOrderStatus}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog 
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={confirmDeleteOrder}
        itemName="this order"
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminOrders;