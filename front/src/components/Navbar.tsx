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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";

import logoPath from "../assets/hera_test_imgs/logo2.jpg";

// Icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// Import the AuthModal
import AuthModal from "./auth/authmodel";

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
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [initialAuthMode, setInitialAuthMode] = useState<"signIn" | "signUp">(
    "signIn"
  );

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Drawer Handlers
  const handleDrawerToggle = () => setMobileOpen((p) => !p);
  const handleDrawerNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  // Profile Menu Handlers
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  // Auth Modal Handlers
  const handleOpenAuthModal = (mode: "signIn" | "signUp") => {
    setInitialAuthMode(mode);
    setAuthModalOpen(true);
    handleCloseUserMenu();
  };
  const handleCloseAuthModal = () => setAuthModalOpen(false);

  // --- Drawer Content ---
  const drawer = (
    /* ... Drawer content remains the same ... */
    <Box sx={{ width: drawerWidth }} role="presentation">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          background:
            theme.palette.mode === "dark"
              ? theme.palette.grey[900]
              : "linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)",
          color: theme.palette.getContrastText(
            theme.palette.mode === "dark" ? theme.palette.grey[900] : "#FF8C00"
          ),
        }}
      >
        {" "}
        <Typography variant="h6" sx={{ my: 1, ml: 1, flexGrow: 1 }}>
          {" "}
          Hera Prints{" "}
        </Typography>{" "}
        <IconButton onClick={handleDrawerToggle} sx={{ color: "inherit" }}>
          {" "}
          <ChevronLeftIcon />{" "}
        </IconButton>{" "}
      </Box>
      <Divider />
      <List onClick={handleDrawerToggle}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            {" "}
            <ListItemButton
              sx={{ textAlign: "left", pl: 2 }}
              onClick={() => handleDrawerNavigation(item.path)}
            >
              {" "}
              <ListItemText primary={item.label} />{" "}
            </ListItemButton>{" "}
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          {" "}
          <ListItemButton
            sx={{ textAlign: "left", pl: 2 }}
            onClick={() => {
              handleOpenAuthModal("signIn");
              handleDrawerToggle();
            }}
          >
            {" "}
            <ListItemText primary="Sign In / Sign Up" />{" "}
          </ListItemButton>{" "}
        </ListItem>
        <ListItem disablePadding>
          {" "}
          <ListItemButton
            sx={{ textAlign: "left", pl: 2 }}
            onClick={() => handleDrawerNavigation("/cart")}
          >
            {" "}
            <ListItemText primary="Cart" />{" "}
          </ListItemButton>{" "}
        </ListItem>
      </List>
    </Box>
  );

  const transitionDuration = "0.3s";
  const transitionTiming = "ease-in-out";
  const floatingShadow = "0 2px 5px rgba(0,0,0,0.3)"; // Base shadow for floating
  const floatingTransform = "translateY(-1px)"; // Slight lift

  return (
    <>
      <AppBar
        component="nav"
        position="fixed"
        elevation={0}
        sx={{
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          overflowX: "hidden",
          width: "100%", // Keep full width for background control
          maxWidth: "1900px",
          bgcolor: isScrolled ? "rgba(76, 39, 39, 0.4)" : "transparent", // Dark Brownish transparent
          backdropFilter: isScrolled ? "blur(8px)" : "none",
          borderBottomLeftRadius: isScrolled ? "20px" : "0px",
          borderBottomRightRadius: isScrolled ? "20px" : "0px",
          color: "white",
          boxShadow: isScrolled ? floatingShadow : "none", // Add shadow only when scrolled for better visibility
          zIndex: theme.zIndex.drawer + 1,
          transition: `background-color ${transitionDuration} ${transitionTiming}, backdrop-filter ${transitionDuration} ${transitionTiming}, border-radius ${transitionDuration} ${transitionTiming}, box-shadow ${transitionDuration} ${transitionTiming}`,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: "70px", sm: "90px" } }}>
          {/* Background overlay isn't strictly needed if AppBar has bgcolor/blur */}
          {/* Consider removing if it causes complexity */}

          {/* Section 1: Left */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: "none" }, mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    mx: 2,
                    color: "white",
                    // --- Initial Floating Style ---
                    textShadow: floatingShadow, // Apply shadow to text
                    transform: floatingTransform, // Apply slight lift
                    transition: `transform 0.3s ${transitionTiming}, background-color 0.3s ${transitionTiming}, text-shadow 0.3s ${transitionTiming}`, // Add transition targets
                    // --- End Initial Floating Style ---
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      transform: "translateY(-3px)", // Enhance lift on hover
                      textShadow: "0 3px 6px rgba(0,0,0,0.4)", // Enhance shadow on hover
                    },
                    fontWeight: 600,
                    position: "relative",
                    "&::after": {
                      /* ... underline style ... */ content: '""',
                      position: "absolute",
                      bottom: "5px",
                      left: "50%",
                      width: "0%",
                      height: "2px",
                      backgroundColor: "white",
                      transition: "all 0.3s",
                      transform: "translateX(-50%)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                    },
                    "&:hover::after": { width: "60%" },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Section 2: Center (Logo) */}
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                padding: "1px",
                height: { xs: 40, sm: 44, md: 50 },
                width: { xs: 40, sm: 44, md: 50 },
                overflow: "hidden",
                // --- Initial Floating Style ---
                boxShadow: "0 10px 10px rgba(0,0,0,0.8)", // Slightly stronger initial shadow
                transform: floatingTransform, // Apply slight lift
                transition: `transform 0.3s ${transitionTiming}, box-shadow 0.3s ${transitionTiming}`,
                "&:hover": {
                  transform: "translateY(-3px) scale(1.03)", // Enhance lift and scale on hover
                  boxShadow: "0 6px 15px rgba(0,0,0,0.4)",
                },
                // --- End Initial Floating Style ---
              }}
            >
              <Box
                component="img"
                src={logoPath}
                alt="Hera Prints Logo"
                sx={{
                  height: "120%",
                  width: "120%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
            <Typography
              variant="h4"
              component="div"
              sx={{
                display: { xs: "none", sm: "block" },
                ml: 2,
                fontWeight: 600,
                letterSpacing: "0.5px",
                // --- Initial Floating Style ---
                textShadow: "0 6px 10px rgba(0,0,0,0.8)", // Apply shadow to text
                transform: floatingTransform, // Apply slight lift
                transition: `transform 0.3s ${transitionTiming}, text-shadow 0.3s ${transitionTiming}`,
                // --- End Initial Floating Style ---
              }}
            >
              Hera Prints
            </Typography>
          </Box>

          {/* Section 3: Right Side (Icons) */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {/* Cart Icon */}
            <Tooltip title="Shopping Cart">
              <IconButton
                size="large"
                aria-label="show shopping cart items"
                onClick={() => navigate("/cart")}
                sx={{
                  color: "white",
                  // --- Initial Floating Style ---
                  transform: floatingTransform, // Apply slight lift
                  transition: `transform 0.3s ${transitionTiming}, background-color 0.3s ${transitionTiming}`, // Add transition
                  "& svg": {
                    filter: `drop-shadow(${floatingShadow})`, // Apply drop shadow initially
                    transition: `filter 0.3s ${transitionTiming}`,
                  },
                  // --- End Initial Floating Style ---
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    transform: "translateY(-3px)", // Enhance lift on hover
                    "& svg": {
                      filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.4))", // Enhance shadow on hover
                    },
                  },
                }}
              >
                <ShoppingCartIcon />
              </IconButton>
            </Tooltip>

            {/* Profile Icon & Menu */}
            <Tooltip title="Account">
              <IconButton
                size="large"
                aria-label="account options"
                aria-controls={
                  Boolean(anchorElUser) ? "profile-menu-appbar" : undefined
                }
                aria-haspopup="true"
                onClick={handleOpenUserMenu}
                sx={{
                  color: "white",
                  ml: 1,
                  // --- Initial Floating Style ---
                  transform: floatingTransform, // Apply slight lift
                  transition: `transform 0.3s ${transitionTiming}, background-color 0.3s ${transitionTiming}`, // Add transition
                  "& svg": {
                    filter: `drop-shadow(${floatingShadow})`, // Apply drop shadow initially
                    transition: `filter 0.3s ${transitionTiming}`,
                  },
                  // --- End Initial Floating Style ---
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    transform: "translateY(-3px)", // Enhance lift on hover
                    "& svg": {
                      filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.4))", // Enhance shadow on hover
                    },
                  },
                }}
              >
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
            <Menu
              id="profile-menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              sx={{ mt: "5px" }}
            >
              <MenuItem onClick={() => handleOpenAuthModal("signIn")}>
                {" "}
                <Typography textAlign="center">Sign In</Typography>{" "}
              </MenuItem>
              <MenuItem onClick={() => handleOpenAuthModal("signUp")}>
                {" "}
                <Typography textAlign="center">Sign Up</Typography>{" "}
              </MenuItem>
            </Menu>
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
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          zIndex: theme.zIndex.drawer,
        }}
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
