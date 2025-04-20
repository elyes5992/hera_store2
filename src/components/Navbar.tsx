// src/components/Navbar.tsx
import React, { useState } from "react";
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

import logoPath from "../assets/hera_test_imgs/logo2.jpg";

// Icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// --- Navigation items ---
const navItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
];

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

  // --- Drawer Content ---
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          background: "linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)",
          color: "white",
        }}
      >
        <Typography variant="h6" sx={{ my: 1, ml: 1 }}>
          Hera Prints
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              sx={{ textAlign: "left", pl: 2 }}
              onClick={() => handleDrawerNavigation(item.path)}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: "left", pl: 2 }}
            onClick={() => handleDrawerNavigation("/account")}
          >
            <ListItemText primary="Account" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: "left", pl: 2 }}
            onClick={() => handleDrawerNavigation("/cart")}
          >
            <ListItemText primary="Cart" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
  // --- End Drawer Content ---

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        component="nav"
        position="sticky"
        elevation={0} // Remove shadow
        sx={{
          bgcolor: "transparent", // Transparent background
          backdropFilter: "blur(8px)", // Blur effect
          // Subtle border
          color: "white", // Text color
          boxShadow: "none", // Ensure no shadow
        }}
      >
        <Toolbar>
          {/* Shadow background behind the entire navbar content */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.25)", // Semi-transparent dark background
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)", // Shadow effect
              borderBottom: "1px solid rgba(255, 255, 255, 0.12)", // Subtle border
            }}
          />

          {/* --- Section 1: Left Side --- */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              position: "relative", // Ensure content is above the shadow
              zIndex: 1,
            }}
          >
            {/* Hamburger (Mobile Only) */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: "none" }, mr: 1 }} // Show only on mobile, add margin if needed
            >
              <MenuIcon />
            </IconButton>

            {/* Desktop Navigation Links (Desktop Only) */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    mx: 1, // Adjust spacing
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      transform: "translateY(-2px)",
                      transition: "all 0.3s",
                    },
                    fontWeight: 500,
                    transition: "all 0.3s",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: "5px",
                      left: "50%",
                      width: "0%",
                      height: "2px",
                      backgroundColor: "white",
                      transition: "all 0.3s",
                      transform: "translateX(-50%)",
                    },
                    "&:hover::after": {
                      width: "60%",
                    },
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
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              cursor: "pointer",
              position: "relative", // Ensure content is above the shadow
              zIndex: 1,
            }}
            onClick={() => navigate("/")}
          >
            {/* Logo with shadow background */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                
                borderRadius: '50%',
                padding: '0.1px',
                height: { xs: 38, sm: 42, md: 48 },
                width: { xs: 38, sm: 42, md: 48 },
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)', // Enhanced shadow for logo
              }}
            >
              <Box
                component="img"
                src={logoPath}
                alt="Hera Prints Logo"
                sx={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>

            <Typography
              variant="h6"
              component="div"
              sx={{
                display: { xs: "none", sm: "block" },
                ml: 1.5,
                fontWeight: 600,
                letterSpacing: "0.5px",
                textShadow: '0 2px 4px rgba(0,0,0,0.3)', // Text shadow for better visibility
              }}
            >
              Hera Prints
            </Typography>
          </Box>

          {/* --- Section 3: Right Side (Icons) --- */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              position: "relative", // Ensure content is above the shadow
              zIndex: 1,
            }}
          >
            <IconButton
              size="large"
              aria-label="show shopping cart items"
              onClick={() => navigate("/cart")}
              sx={{
                color: "white",
                transition: "all 0.3s",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)",
                },
                // Icon shadow
                '& svg': {
                  filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))',
                }
              }}
            >
              <ShoppingCartIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="account of current user"
              onClick={() => navigate("/account")}
              sx={{
                color: "white",
                ml: 1,
                transition: "all 0.3s",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)",
                },
                // Icon shadow
                '& svg': {
                  filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))',
                }
              }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* --- Navigation Drawer Component --- */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Navbar;