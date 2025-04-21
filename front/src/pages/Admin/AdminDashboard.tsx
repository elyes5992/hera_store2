// src/pages/Admin/Dashboard.tsx
import React from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme
} from '@mui/material';
import {
  ShoppingBag as OrdersIcon,
  Inventory as ProductsIcon,
  TrendingUp as TrendingIcon,
  AttachMoney as RevenueIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Mock data for dashboard
const mockData = {
  totalOrders: 134,
  totalProducts: 48,
  totalRevenue: 5248.75,
  pendingOrders: 12,
  lowStockProducts: 5,
  recentOrders: [
    { id: 'ORD-2024-1013', customer: 'John Doe', date: '2025-04-19', amount: 128.50, status: 'Delivered' },
    { id: 'ORD-2024-1012', customer: 'Jane Smith', date: '2025-04-18', amount: 78.99, status: 'Processing' },
    { id: 'ORD-2024-1011', customer: 'Bob Johnson', date: '2025-04-17', amount: 214.25, status: 'Shipped' },
    { id: 'ORD-2024-1010', customer: 'Alice Brown', date: '2025-04-16', amount: 45.99, status: 'Delivered' },
  ],
  topProducts: [
    { name: 'Minimalist Pen Holder', sold: 28, revenue: 419.72 },
    { name: 'Laptop Stand', sold: 19, revenue: 665.00 },
    { name: 'Cable Clips (Set of 5)', sold: 17, revenue: 169.15 },
    { name: 'Modular Desk Tray', sold: 15, revenue: 299.85 },
  ],
};

const MotionPaper = motion(Paper);

const Dashboard: React.FC = () => {
  const theme = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{xs:12 ,sm:6 ,md:3}} >
          <MotionPaper 
            variants={itemVariants}
            elevation={3}
            sx={{ 
              borderRadius: 2, 
              p: 2,
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.8) 0%, rgba(255, 165, 0, 0.7) 100%)',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" component="div">
                Total Orders
              </Typography>
              <OrdersIcon fontSize="large" />
            </Box>
            <Typography variant="h3" component="div">
              {mockData.totalOrders}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
              {mockData.pendingOrders} orders pending
            </Typography>
          </MotionPaper>
        </Grid>
        
        <Grid size={{xs:12 ,sm:6 ,md:3}}>
          <MotionPaper 
            variants={itemVariants}
            elevation={3}
            sx={{ 
              borderRadius: 2, 
              p: 2,
              height: '100%',
              background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.8) 0%, rgba(100, 120, 220, 0.7) 100%)',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" component="div">
                Products
              </Typography>
              <ProductsIcon fontSize="large" />
            </Box>
            <Typography variant="h3" component="div">
              {mockData.totalProducts}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
              {mockData.lowStockProducts} running low on stock
            </Typography>
          </MotionPaper>
        </Grid>
        
        <Grid size={{xs:12 ,sm:6 ,md:3}}>
          <MotionPaper 
            variants={itemVariants}
            elevation={3}
            sx={{ 
              borderRadius: 2, 
              p: 2,
              height: '100%',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.8) 0%, rgba(105, 220, 80, 0.7) 100%)',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" component="div">
                Revenue
              </Typography>
              <RevenueIcon fontSize="large" />
            </Box>
            <Typography variant="h3" component="div">
              ${mockData.totalRevenue.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
              For the current month
            </Typography>
          </MotionPaper>
        </Grid>
        
        <Grid size={{xs:12 ,sm:6 ,md:3}}>
          <MotionPaper 
            variants={itemVariants}
            elevation={3}
            sx={{ 
              borderRadius: 2, 
              p: 2,
              height: '100%',
              background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.8) 0%, rgba(180, 50, 200, 0.7) 100%)',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" component="div">
                Top Selling
              </Typography>
              <TrendingIcon fontSize="large" />
            </Box>
            <Typography variant="h3" component="div">
              {mockData.topProducts[0].name.split(' ')[0]}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
              {mockData.topProducts[0].sold} units sold this month
            </Typography>
          </MotionPaper>
        </Grid>
      </Grid>

      {/* Recent Orders and Top Products */}
      <Grid container spacing={3}>
        <Grid size={{xs:12 ,sm:6 ,md:6}}>
          <MotionPaper
            variants={itemVariants}
            elevation={3}
            sx={{ borderRadius: 2, overflow: 'hidden' }}
          >
            <CardHeader 
              title="Recent Orders" 
              sx={{ 
                background: 'linear-gradient(135deg, #f6f9fc 0%, #f1f4f9 100%)',
                borderBottom: '1px solid #eee',
              }}
            />
            <CardContent sx={{ p: 0 }}>
              <List>
                {mockData.recentOrders.map((order, index) => (
                  <React.Fragment key={order.id}>
                    <ListItem sx={{py: 1.5 }}>
                      <Grid container spacing={8}>
                        <Grid size={{xs:6 ,md:4}}>
                          <ListItemText 
                            primary={order.id} 
                            secondary={order.date}
                            primaryTypographyProps={{ 
                              variant: 'body2', 
                              fontWeight: 'medium',
                              color: 'primary' 
                            }}
                            secondaryTypographyProps={{ 
                              variant: 'caption'
                            }}
                          />
                        </Grid>
                        <Grid size={{xs:4 ,md:4}}>
                          <ListItemText 
                            primary={order.customer} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </Grid>
                        <Grid size={{xs:2 ,md:2}}>
                          <ListItemText 
                            primary={`$${order.amount.toFixed(2)}`} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </Grid>
                        <Grid size={{xs:2,md:3}}>
                          <ListItemText 
                            primary={order.status} 
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              color: 
                                order.status === 'Delivered' ? 'success.main' :
                                order.status === 'Shipped' ? 'info.main' : 
                                'warning.main',
                              fontWeight: 'medium',
                            }}
                          />
                        </Grid>
                      </Grid>
                    </ListItem>
                    {index < mockData.recentOrders.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </MotionPaper>
        </Grid>
        
        <Grid size={{xs:12 ,md:5}} >
          <MotionPaper
            variants={itemVariants}
            elevation={3}
            sx={{ borderRadius: 2, overflow: 'hidden' }}
          >
            <CardHeader 
              title="Top Products" 
              sx={{ 
                background: 'linear-gradient(135deg, #f6f9fc 0%, #f1f4f9 100%)',
                borderBottom: '1px solid #eee',
              }}
            />
            <CardContent sx={{ p: 0 }}>
              <List>
                {mockData.topProducts.map((product, index) => (
                  <React.Fragment key={product.name}>
                    <ListItem sx={{ py: 1.5 }}>
                      <Grid container spacing={2}>
                        <Grid size={{xs:7 }}>
                          <ListItemText 
                            primary={product.name} 
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              fontWeight: index === 0 ? 'bold' : 'medium',
                            }}
                          />
                        </Grid>
                        <Grid size={{xs:2}} sx={{ textAlign: 'center' }}>
                          <ListItemText 
                            primary={product.sold} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </Grid>
                        <Grid size={{xs:3}} sx={{ textAlign: 'right' }}>
                          <ListItemText 
                            primary={`$${product.revenue.toFixed(2)}`} 
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              fontWeight: 'medium',
                            }}
                          />
                        </Grid>
                      </Grid>
                    </ListItem>
                    {index < mockData.topProducts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </MotionPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;