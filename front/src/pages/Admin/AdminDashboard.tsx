// src/pages/Admin/Dashboard.tsx
import React from 'react';
import {
  Box,
  Grid, // Using Grid directly
  Paper,
  Typography,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Skeleton,
  Alert,
  Chip // Make sure Chip is imported if used in top product card
} from '@mui/material';
import {
  ShoppingBag as OrdersIcon,
  Inventory as ProductsIcon,
  TrendingUp as TrendingIcon,
  AttachMoney as RevenueIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom'; // Use RouterLink
import {
    useGetOrderStatsQuery,
    useGetOrdersQuery,
    useGetTotalRevenueQuery,
    useGetTotalOrdersCountQuery // Import the second hook
} from '../../store/apis/orderApi';
import { useGetProductsQuery } from '../../store/productsApi'; // Ensure correct path
import { format } from 'date-fns';

// Define necessary interfaces if not imported globally
interface Order {
    _id: string;
    user: { // Assuming populated user
      _id: string;
      name: string;
      email?: string; // Optional email
    } | null; // User could be null if deleted
    totalPrice?: number;
    status: string;
    createdAt: string;
    // Add other fields if needed by your component logic
  }

interface Product {
    _id: string;
    name: string;
    rating?: number;
    price?: number;
    countInStock?: number; // For low stock KPI
    // Add other fields if needed
}

const MotionPaper = motion(Paper);

const Dashboard: React.FC = () => {

  // --- RTK Query Hooks ---
  // Hook for KPI stats (Revenue, Status Counts)
  const {
    data: orderStats,
    isLoading: isOrderStatsLoading,
    error: orderStatsError
  } = useGetOrderStatsQuery(); // Keep this for KPIs

  // Hook specifically to get recent orders list (WORKAROUND)
  const {
    data: ordersPageData, // Data from the paginated endpoint
    isLoading: isOrdersPageLoading, // Separate loading state
    error: ordersPageError // Separate error state
  } = useGetOrdersQuery({ pageNumber: 1 }); // Fetch first page

  const {
    data: revenueData, // Contains { totalRevenue: number }
    isLoading: isRevenueLoading, // Specific loading state for revenue
    error: revenueError // Specific error state for revenue
} = useGetTotalRevenueQuery();

const {
  data: totalOrdersData, // Contains { totalOrders: number }
  isLoading: isTotalOrdersLoading,
  error: totalOrdersError
} = useGetTotalOrdersCountQuery();

  // Hook for Product info (Total Products, Top Product)
  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError
  } = useGetProductsQuery({});

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  // --- Helper Functions ---
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      console.error("Date formatting error:", error);
      return 'Invalid date';
    }
  };

  // --- Memoized Data Processing ---
  // Derive recent orders list from the paginated query data
  const recentOrders: Order[] = React.useMemo(() => {
    if (ordersPageData?.orders && Array.isArray(ordersPageData.orders)) {
      // Already sorted by backend, just take the first 6
      return ordersPageData.orders.slice(0, 6);
    }
    return [];
  }, [ordersPageData]);

  // Derive top product (ensure product has 'rating')
  const topProduct: Product | null = React.useMemo(() => {
     if (!productsData?.products || productsData.products.length === 0) return null;
     // Create a shallow copy before sorting
     return [...productsData.products]
       .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];
  }, [productsData]);

  // Determine loading/error states for the specific sections
  const kpiLoading = isOrderStatsLoading || isProductsLoading;
  const recentOrdersListLoading = isOrdersPageLoading; // Use the specific hook's loading state
  const recentOrdersListError = ordersPageError;     // Use the specific hook's error state
  const topProductsListLoading = isProductsLoading;
  const topProductsListError = productsError;


  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      {/* --- KPI Cards --- */}
      {/* Still use isOrderStatsLoading/isProductsLoading and their respective error states here */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
         {/* Total Orders Card - uses orderStats */}
         {/* USING size PROP AS REQUESTED */}
                 {/* Total Orders Card - uses totalOrdersData & orderStats */}
        <Grid size={{xs:12, sm:6, md:3}}> {/* Using size prop */}
          <MotionPaper
            variants={itemVariants}
            elevation={3}
            sx={{
              borderRadius: 2, // Keep rounded corners
              p: 2,           // Keep padding
              height: '100%', // Maintain height consistency
              // Apply the requested orange gradient
              background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.8) 0%, rgba(255, 165, 0, 0.7) 100%)',
              color: 'white', // Ensure text is white for contrast
            }}
          >
            {/* Card Header Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total Orders</Typography>
              <OrdersIcon fontSize="large" />
            </Box>

            {/* Card Content Section (Conditional Rendering) */}
            {/* Check loading state for the main count */}
            {isTotalOrdersLoading ? (
              // Loading State for main count: Show Skeleton
              <Skeleton
                variant="text"
                width="60%" // Match Products card skeleton style
                height={40}
                sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} // Use light skeleton for contrast
              />
            ) : totalOrdersError ? (
              // Error State for main count: Show Error message
              <Typography variant="body2" sx={{ color: 'error.light' }}> {/* Use light error color */}
                  Error
              </Typography>
            ) : (
              // Success State: Show Data
              <>
                {/* Display Total Orders count from its dedicated hook */}
                <Typography variant="h3">
                  {totalOrdersData?.totalOrders ?? 0}
                </Typography>

                {/* Display Pending count (using orderStats hook data) */}
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                  {/* Show placeholder if pending count is still loading */}
                  {isOrderStatsLoading ? '...' : (orderStats?.ordersByStatus?.find(s => s._id === 'Processing')?.count ?? 0)} pending
                </Typography>
              </>
            )}
          </MotionPaper>
        </Grid>

         {/* Products Card - uses productsData */}
          {/* USING size PROP AS REQUESTED */}
         <Grid size={{xs:12, sm:6, md:3}}>
           <MotionPaper variants={itemVariants} elevation={3} sx={{ borderRadius: 2, p: 2, height: '100%', background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.8) 0%, rgba(100, 120, 220, 0.7) 100%)', color: 'white' }} >
             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Products</Typography><ProductsIcon fontSize="large" />
             </Box>
              {isProductsLoading ? (<Skeleton variant="text" width="60%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}/>)
              : productsError ? (<Typography variant="body2" color="error">Error</Typography>)
              : (<>
                 <Typography variant="h3">
                    {productsData?.total ?? productsData?.products?.length ?? 0}
                 </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    {productsData?.products?.filter((p: { countInStock?: number }) => (p.countInStock ?? 0) < 5).length ?? 0} low stock
                 </Typography>
                </>)}
           </MotionPaper>
         </Grid>

         {/* Revenue Card - uses orderStats */}
          {/* USING size PROP AS REQUESTED */}
          <Grid size={{xs:12, sm:6, md:3}}>
            {/* Using MotionPaper and variants from your existing code */}
            <MotionPaper
              variants={itemVariants} // Use itemVariants defined in your component
              elevation={3}
              sx={{
                borderRadius: 2,
                p: 2,
                height: '100%', // Make height consistent if needed
                // Using the green gradient from your example
                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.8) 0%, rgba(105, 220, 80, 0.7) 100%)',
                color: 'white', // Set text color for contrast
              }}
            >
              {/* Card Header Section */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" component="div">
                      Revenue
                  </Typography>
                  <RevenueIcon fontSize="large" />
              </Box>

              {/* Card Content Section (Conditional Rendering) */}
              {isRevenueLoading ? (
                // Loading State: Show Skeleton
                <Skeleton
                  variant="text"
                  width="60%"
                  height={40}
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} // Skeleton color for contrast
                />
              ) : revenueError ? (
                // Error State: Show Error message
                <Typography variant="body2" sx={{ color: 'error.light' }}> {/* Use light error color for contrast */}
                    Error
                </Typography>
              ) : (
                // Success State: Show Revenue Data
                <>
                  <Typography variant="h3" component="div">
                      {/* Safely access and format totalRevenue */}
                      ${revenueData?.totalRevenue?.toLocaleString() ?? '0.00'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                      All time
                  </Typography>
                 </>
              )}
            </MotionPaper>
          </Grid>

        {/* Top Selling Card - uses productsData */}
         {/* USING size PROP AS REQUESTED */}
        <Grid size={{xs:12, sm:6, md:3}}>
           <MotionPaper variants={itemVariants} elevation={3} sx={{ borderRadius: 2, p: 2, height: '100%', background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.8) 0%, rgba(180, 50, 200, 0.7) 100%)', color: 'white' }} >
             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Top Selling</Typography><TrendingIcon fontSize="large" />
             </Box>
              {isProductsLoading ? (<Skeleton variant="text" width="60%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}/>)
              : productsError ? (<Typography variant="body2" color="error">Error</Typography>)
              : (<>
                   <Typography variant="h3" noWrap title={topProduct?.name}>
                     {topProduct?.name?.split(' ')[0] ?? 'N/A'}
                   </Typography>
                   <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                     {topProduct ? `${topProduct.rating ?? 0} ★ rating` : 'No data'}
                   </Typography>
                 </>)}
           </MotionPaper>
        </Grid>
      </Grid>

      {/* --- Recent Orders and Top Products Lists --- */}
      <Grid container spacing={3}>
        {/* Recent Orders Card */}
         {/* USING size PROP AS REQUESTED */}
        <Grid size={{xs:12, md:6}}>
          <MotionPaper variants={itemVariants} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardHeader
              title="Recent Orders"
              sx={{ background: 'linear-gradient(135deg, #f6f9fc 0%, #f1f4f9 100%)', borderBottom: '1px solid #eee' }}
            />
            <CardContent sx={{ p: 0 }}>
              {/* Use the specific loading state for this list */}
              {recentOrdersListLoading ? (
                <Box sx={{ p: 2 }}>
                  {[...Array(6)].map((_, index) => (
                    <Skeleton key={index} variant="rectangular" height={45} sx={{ mb: 1 }} />
                  ))}
                </Box>
              /* Use the specific error state for this list */
              ) : recentOrdersListError ? (
                <Alert severity="error" sx={{ m: 2 }}>
                  Error loading recent orders.
                  {/* Optionally display more details: {JSON.stringify(recentOrdersListError)} */}
                </Alert>
              /* Display data if not loading and no error */
              ) : recentOrders.length > 0 ? (
                <List sx={{ pt: 0 }}>
                  {recentOrders.map((order, index) => (
                    <React.Fragment key={order._id}>
                      <ListItem sx={{ py: 1.5, px: 2 }}>
                        <Grid container spacing={1} alignItems="center">
                          {/* Order ID */}
                           {/* USING size PROP AS REQUESTED */}
                          <Grid size={{xs:6, sm:3, md:3}}>
                             <ListItemText
                              primary={order._id.substring(order._id.length - 6).toUpperCase()}
                              secondary={formatDate(order.createdAt)}
                              primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium', color: 'primary.main', component: RouterLink, to: `/admin/orders/${order._id}`, sx:{textDecoration:'none', '&:hover':{textDecoration:'underline'}} }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </Grid>
                          {/* Customer Name */}
                           {/* USING size PROP AS REQUESTED */}
                          <Grid size={{xs:6, sm:3, md:3}}>
                             <ListItemText
                              primary={order.user?.name ?? 'N/A'} // Safe access
                              primaryTypographyProps={{ variant: 'body2', noWrap: true, title: order.user?.name ?? '' }}
                            />
                          </Grid>
                          {/* Total Price */}
                           {/* USING size PROP AS REQUESTED */}
                          <Grid size={{xs:6, sm:3, md:2}} sx={{ textAlign: {sm: 'right'} }}>
                             <ListItemText
                              primary={`$${order.totalPrice?.toFixed(2) ?? '0.00'}`}
                              primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                            />
                          </Grid>
                          {/* Status */}
                           {/* USING size PROP AS REQUESTED */}
                          <Grid size={{xs:6, sm:3, md:4}} sx={{ textAlign: 'right' }}>
                            <ListItemText
                              primary={order.status}
                              primaryTypographyProps={{
                                variant: 'body2',
                                sx: {
                                  display: 'inline-block', px: 1, borderRadius: '4px', fontWeight: 'medium',
                                  color: order.status === 'Delivered' ? 'success.dark' : order.status === 'Shipped' ? 'info.dark' : order.status === 'Cancelled' ? 'error.dark' : 'warning.dark',
                                  bgcolor: order.status === 'Delivered' ? 'success.light' : order.status === 'Shipped' ? 'info.light' : order.status === 'Cancelled' ? 'error.light' : 'warning.light',
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                      </ListItem>
                      {index < recentOrders.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              /* Show 'No orders' if not loading, no error, but array is empty */
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">No recent orders found</Typography>
                </Box>
              )}

              {/* View All Link - Show if not loading and no error */}
              {!recentOrdersListLoading && !recentOrdersListError && (
                 <>
                   <Divider />
                   <Box sx={{ p: 1, textAlign: 'center' }}>
                     <RouterLink to="/admin/orders" style={{ textDecoration: 'none' }}>
                       <Typography color="primary" variant="button">View All Orders</Typography>
                     </RouterLink>
                   </Box>
                 </>
               )}
            </CardContent>
          </MotionPaper>
        </Grid>

        {/* Top Products Card */}
        {/* Use topProductsListLoading and topProductsListError here */}
         {/* USING size PROP AS REQUESTED */}
        <Grid size={{xs:12, md:6}}>
           <MotionPaper variants={itemVariants} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
             <CardHeader
              title="Top Products"
              sx={{ background: 'linear-gradient(135deg, #f6f9fc 0%, #f1f4f9 100%)', borderBottom: '1px solid #eee' }}
            />
             <CardContent sx={{ p: 0 }}>
               {topProductsListLoading ? (
                  <Box sx={{ p: 2 }}>{[...Array(5)].map((_, index) => (<Skeleton key={index} variant="text" height={30} sx={{ mb: 1 }} />))}</Box>
               ) : topProductsListError ? (
                  <Alert severity="error" sx={{ m: 2 }}>Error loading products.</Alert>
               ) : productsData?.products && productsData.products.length > 0 ? (
                 <List sx={{ pt: 0 }}>
                  {[...productsData.products] // Create copy
                    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)) // Sort safely
                    .slice(0, 5) // Take top 5
                    .map((product, index) => (
                    <React.Fragment key={product._id}>
                      <ListItem sx={{ py: 1.5, px: 2 }}>
                        <Grid container spacing={1} alignItems="center">
                           {/* USING size PROP AS REQUESTED */}
                          <Grid size={{xs:7, sm:8}}>
                            <ListItemText
                              primary={product.name}
                              primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium', noWrap: true, title: product.name, component: RouterLink, to: `/admin/products/${product._id}/edit`, sx: { color: 'text.primary', textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: 'primary.main' } } }}
                             />
                          </Grid>
                           {/* USING size PROP AS REQUESTED */}
                          <Grid size={{xs:2, sm:2}} sx={{ textAlign: 'center' }}>
                             <ListItemText primary={`${product.rating ?? 'N/A'} ★`} primaryTypographyProps={{ variant: 'body2' }} />
                          </Grid>
                           {/* USING size PROP AS REQUESTED */}
                          <Grid size={{xs:3, sm:2}} sx={{ textAlign: 'right' }}>
                            <ListItemText primary={`$${product.price?.toFixed(2) ?? '0.00'}`} primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }} />
                          </Grid>
                        </Grid>
                      </ListItem>
                      {index < Math.min(productsData.products.length, 5) - 1 && <Divider component="li" />}
                    </React.Fragment>
                   ))}
                 </List>
               ) : (
                 <Box sx={{ p: 3, textAlign: 'center' }}><Typography variant="body1" color="text.secondary">No products found</Typography></Box>
               )}
               {!topProductsListLoading && !topProductsListError && (
                  <>
                   <Divider />
                   <Box sx={{ p: 1, textAlign: 'center' }}>
                     <RouterLink to="/admin/AdminProducts" style={{ textDecoration: 'none' }}>
                       <Typography color="primary" variant="button">Manage Products</Typography>
                     </RouterLink>
                   </Box>
                 </>
               )}
             </CardContent>
           </MotionPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;