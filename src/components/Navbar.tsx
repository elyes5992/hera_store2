// src/components/Navbar.tsx
import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Menu from '@mui/material/Menu';         // <-- Import Menu
import MenuItem from '@mui/material/MenuItem'; // <-- Import MenuItem
import Tooltip from '@mui/material/Tooltip';   // <-- Import Tooltip
import { useTheme } from "@mui/material/styles";

import logoPath from "../assets/hera_test_imgs/logo2.jpg";

// Icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Keep this icon
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// Import the AuthModal (ensure path is correct)
import AuthModal from './Auth/authmodal'; // <-- Import AuthModal

// --- Navigation items ---
const navItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "About Us", path: "/About-us" },
  { label: "Contact", path: "/contact" },
];

const drawerWidth = 240;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  // --- State for Profile Menu ---
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  // --- State for Auth Modal ---
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [initialAuthMode, setInitialAuthMode] = useState<'signIn' | 'signUp'>('signIn');

  // --- Effect for Scroll Listener ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // --- Drawer Handlers ---
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleDrawerNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  // --- Handlers for Profile Menu ---
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // --- Handlers for Auth Modal ---
  const handleOpenAuthModal = (mode: 'signIn' | 'signUp') => {
    setInitialAuthMode(mode);
    setAuthModalOpen(true);
    handleCloseUserMenu(); // Close the menu when opening modal
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };

  // --- Drawer Content (remains the same) ---
  const drawer = (
    <Box sx={{ width: drawerWidth }} role="presentation">
      {/* ... Drawer Header ... */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1, background: /*...*/ 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)', color: /*...*/ theme.palette.getContrastText('#FF8C00'), }}>
         <Typography variant="h6" sx={{ my: 1, ml: 1, flexGrow: 1 }}> Hera Prints </Typography>
         <IconButton onClick={handleDrawerToggle} sx={{ color: "inherit" }}> <ChevronLeftIcon /> </IconButton>
       </Box>
      <Divider />
      <List onClick={handleDrawerToggle}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton sx={{ textAlign: "left", pl: 2 }} onClick={() => handleDrawerNavigation(item.path)} >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
         {/* Update Drawer Account Link to open Sign In */}
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "left", pl: 2 }} onClick={() => { handleOpenAuthModal('signIn'); handleDrawerToggle(); /* Close drawer */ }} >
            <ListItemText primary="Sign In / Sign Up" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "left", pl: 2 }} onClick={() => handleDrawerNavigation("/cart")} >
            <ListItemText primary="Cart" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
  // --- End Drawer Content ---

  const transitionDuration = "0.3s";
  const transitionTiming = "ease-in-out";

  return (
    <> {/* Use Fragment to render AppBar and Modal */}
      <AppBar
        component="nav"
        position="fixed"
        elevation={0}
        sx={{
          // ... other AppBar styles ...
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "1900px",
          bgcolor: isScrolled ? "rgba(76, 39, 39, 0.4)" : "transparent",
          backdropFilter: isScrolled ? "blur(8px)" : "none",
          borderBottomLeftRadius: isScrolled ? "20px" : "0px",
          borderBottomRightRadius: isScrolled ? "20px" : "0px",
          color: "white",
          boxShadow: "none",
          zIndex: theme.zIndex.drawer + 1,
          transition: `background-color ${transitionDuration} ${transitionTiming}, backdrop-filter ${transitionDuration} ${transitionTiming}, border-radius ${transitionDuration} ${transitionTiming}`,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: "70px", sm: "90px" } }}>
          {/* --- Toolbar Content Sections --- */}

          {/* Section 1: Left (Menu Icon + Desktop Nav) */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
            <IconButton
              color="inherit" aria-label="open drawer" edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: "none" }, mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {navItems.map((item) => (
                <Button
                  key={item.label} component={RouterLink} to={item.path}
                  sx={{ mx: 2, color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.4)", '&:hover': { /*...*/ }, fontWeight: 600, transition: "all 0.3s", position: "relative", '&::after': { /*...*/ }, '&:hover::after': { width: "60%" } }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Section 2: Center (Logo) */}
          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")} >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", padding: "1px", height: { xs: 40, sm: 44, md: 50 }, width: { xs: 40, sm: 44, md: 50 }, overflow: "hidden", boxShadow: "0 3px 12px rgba(0,0,0,0.35)" }}>
              <Box component="img" src={logoPath} alt="Hera Prints Logo" sx={{ height: "120%", width: "120%", objectFit: "cover", display: "block" }} />
            </Box>
            <Typography variant="h6" component="div" sx={{ display: { xs: "none", sm: "block" }, ml: 1.5, fontWeight: 600, letterSpacing: "0.5px", textShadow: "0 2px 4px rgba(0,0,0,0.4)" }}>
              Hera Prints
            </Typography>
          </Box>

          {/* Section 3: Right Side (Icons) */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            {/* Cart Icon */}
            <Tooltip title="Shopping Cart">
              <IconButton
                size="large" aria-label="show shopping cart items" onClick={() => navigate("/cart")}
                sx={{ color: "white", transition: "all 0.3s", '&:hover': { bgcolor: "rgba(255, 255, 255, 0.1)", transform: "translateY(-2px)" }, '& svg': { filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))" } }}
              >
                <ShoppingCartIcon />
              </IconButton>
            </Tooltip>

            {/* Profile Icon & Menu */}
            <Tooltip title="Account">
              <IconButton
                size="large"
                aria-label="account options"
                aria-controls={Boolean(anchorElUser) ? 'profile-menu-appbar' : undefined} // Link to menu id
                aria-haspopup="true"
                onClick={handleOpenUserMenu} // <-- Attach handler here
                sx={{
                  color: "white", ml: 1, transition: "all 0.3s",
                  '&:hover': { bgcolor: "rgba(255, 255, 255, 0.1)", transform: "translateY(-2px)" },
                  '& svg': { filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))" }
                }}
              >
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
            <Menu
                id="profile-menu-appbar" // ID for aria-controls
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu} // Close handler
                sx={{ mt: '5px' }} // Optional margin
            >
                <MenuItem onClick={() => handleOpenAuthModal('signIn')}>
                    <Typography textAlign="center">Sign In</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleOpenAuthModal('signUp')}>
                    <Typography textAlign="center">Sign Up</Typography>
                </MenuItem>
                {/* Add other items like "My Account" or "Logout" here, conditionally */}
            </Menu>
            {/* End Profile Icon & Menu */}
          </Box>
        </Toolbar>
      </AppBar>

      {/* --- Navigation Drawer Component --- */}
      <Drawer
        variant="temporary" anchor="left" open={mobileOpen} onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, }, zIndex: theme.zIndex.drawer }}
      >
        {drawer}
      </Drawer>

      {/* --- Render AuthModal --- */}
      <AuthModal
        open={authModalOpen}
        handleClose={handleCloseAuthModal}
        initialMode={initialAuthMode}
      />
    </>
  );
};

export default Navbar;