// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import logoPath from '../assets/hera_test_imgs/logo.png' 

// Icons
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// --- Navigation items ---
const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

// --- Logo setup (Replace with your actual logo path/import) ---
//const logoPath = 'https://via.placeholder.com/150x40.png?text=Hera+Prints'; // Placeholder URL
// import logoPath from '../assets/logo.png';

const drawerWidth = 240;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleDrawerNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  // --- Drawer Content (Keep as before) ---
  const drawer = (
     <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1 }}>
         <Typography variant="h6" sx={{ my: 1, ml: 1 }}>Hera Prints</Typography>
         <IconButton onClick={handleDrawerToggle}><ChevronLeftIcon /></IconButton>
       </Box>
       <Divider />
       <List>
         {navItems.map((item) => (
           <ListItem key={item.label} disablePadding>
             <ListItemButton sx={{ textAlign: 'left', pl: 2 }} onClick={() => handleDrawerNavigation(item.path)}>
               <ListItemText primary={item.label} />
             </ListItemButton>
           </ListItem>
         ))}
         <Divider sx={{ my: 1 }}/>
         <ListItem disablePadding><ListItemButton sx={{ textAlign: 'left', pl: 2 }} onClick={() => handleDrawerNavigation('/account')}><ListItemText primary="Account" /></ListItemButton></ListItem>
         <ListItem disablePadding><ListItemButton sx={{ textAlign: 'left', pl: 2 }} onClick={() => handleDrawerNavigation('/cart')}><ListItemText primary="Cart" /></ListItemButton></ListItem>
       </List>
     </Box>
   );
  // --- End Drawer Content ---


  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
          component="nav"
          position="sticky"
          elevation={1}
          sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
        >
        <Toolbar>
            {/* --- Section 1: Left Side --- */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                {/* Hamburger (Mobile Only) */}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ display: { md: 'none' }, mr: 1 }} // Show only on mobile, add margin if needed
                >
                    <MenuIcon />
                </IconButton>

                {/* Desktop Navigation Links (Desktop Only) */}
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    {navItems.map((item) => (
                        <Button
                            key={item.label}
                            component={RouterLink}
                            to={item.path}
                            sx={{
                                mx: 1, // Adjust spacing
                                color: 'text.primary',
                                '&:hover': { bgcolor: 'action.hover' },
                                // Font weight or other style overrides if needed
                                // fontWeight: 500, // Example: Make links slightly bolder if Poppins is used
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>
            </Box>


            {/* --- Section 2: Center (Logo) --- */}
            {/* This Box holds the logo and ensures it doesn't stretch */}
            {/* It will be centered because Section 1 & 3 have flex: 1 */}
            <Box
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >
                <Box
                    component="img"
                    src={logoPath}
                    alt="Hera Prints Logo"
                    sx={{ height: { xs: 30, sm: 35, md: 40 }, width: 'auto' }}
                />
                
                <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' }, ml: 1 }}>
                    Hera Prints
                </Typography> 
            </Box>


            {/* --- Section 3: Right Side (Icons) --- */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IconButton
                    size="large"
                    aria-label="show shopping cart items"
                    onClick={() => navigate('/cart')}
                    sx={{ color: 'text.primary' }}
                >
                    <ShoppingCartIcon />
                </IconButton>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    onClick={() => navigate('/account')}
                    sx={{ color: 'text.primary', ml: 0.5 }} // Add slight margin if needed
                >
                    <AccountCircleIcon />
                </IconButton>
            </Box>

        </Toolbar>
      </AppBar>

      {/* --- Navigation Drawer Component (Keep as before) --- */}
       <Box component="nav" aria-label="site navigation">
         <Drawer
           variant="temporary"
           anchor="left"
           open={mobileOpen}
           onClose={handleDrawerToggle}
           ModalProps={{ keepMounted: true }}
           sx={{
             display: { xs: 'block', md: 'none' },
             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
           }}
         >
           {drawer}
         </Drawer>
       </Box>
       {/* --- End Drawer --- */}
    </Box>
  );
};

export default Navbar;