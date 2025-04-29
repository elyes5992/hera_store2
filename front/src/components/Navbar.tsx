import React, { useState, useEffect,useCallback, useMemo, useContext } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import LogoutIcon from '@mui/icons-material/Logout';

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import PersonIcon from '@mui/icons-material/Person';
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import { keyframes } from '@mui/system'; // Import keyframes utility

import { throttle } from 'lodash';

import logoPath from "../assets/hera_test_imgs/logo2.jpg";

// Icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// Import the AuthModal
import AuthModal from "./auth/authmodel";
import { useUser } from '../context/userContext';
import Avatar from "@mui/material/Avatar";

// --- Navigation items ---
const navItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "About Us", path: "/About-us" },
  { label: "Contact", path: "/contact" },
];

const drawerWidth = 240;

// --- Define the shake animation ---
const cuteShake = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-20deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(20deg); }
  100% { transform: rotate(0deg); }
`;
// --- End animation definition ---

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
  const { user, isAuthenticated, logout } = useUser();



  const handleScroll = useCallback(() => {
    const currentScrollState = window.scrollY > 10; // Use a small threshold > 0 if needed
    // Update state only if the scrolled state *actually changes*
    setIsScrolled(prevScrolled => {
      if (prevScrolled !== currentScrollState) {
        return currentScrollState;
      }
      return prevScrolled; // No change, prevent unnecessary re-render trigger
    });
  }, []); // Empty dependency array as window.scrollY is globally available

  // Create a throttled version of the scroll handler
  const throttledScrollHandler = useMemo(
    () => throttle(handleScroll, 150), // Throttle to run at most every 150ms
    [handleScroll] // Dependency: the memoized handleScroll function
  );

  // Effect to attach and clean up the throttled listener
  useEffect(() => {
    // Check initial state on mount
    handleScroll();

    window.addEventListener("scroll", throttledScrollHandler, { passive: true });

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
      throttledScrollHandler.cancel(); // Important: Cancel any pending throttled calls on unmount
    };
  }, [handleScroll, throttledScrollHandler]); // Add dependencies

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

  const handleLogout = () => {
    logout(); // Call the logout function from your context
    handleCloseUserMenu(); // Close the profile menu
    navigate('/'); // Redirect to home page after logout
    // Optional: Add a toast notification for successful logout
  };


  // --- Drawer Content ---
  const drawer = (
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
        <Typography variant="h6" sx={{ my: 1, ml: 1, flexGrow: 1 }}>
          Hera Prints
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "inherit" }}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List onClick={handleDrawerToggle}>
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

        {isAuthenticated ? (
          <>
             {/* Profile Link */}
            <ListItem disablePadding>
              <ListItemButton
                sx={{ textAlign: "left", pl: 2 }}
                onClick={() => {
                  navigate("/profile"); // Navigate to profile page
                }}
              >
                <PersonIcon sx={{ mr: 1.5 }} />
                <ListItemText primary={user?.name || "Profile"} /> {/* Show user name */}
              </ListItemButton>
            </ListItem>
            {/* Logout Link */}
            <ListItem disablePadding>
              <ListItemButton
                sx={{ textAlign: "left", pl: 2 }}
                onClick={() => {
                  logout(); // Call logout directly
                  navigate('/'); // Navigate home after logout from drawer
                  // handleDrawerToggle called by parent List onClick
                }}
              >
                 <LogoutIcon sx={{ mr: 1.5 }} />
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          // Sign In / Sign Up Link
          <ListItem disablePadding>
            <ListItemButton
              sx={{ textAlign: "left", pl: 2 }}
              onClick={() => {
                // Open the modal, don't navigate away
                handleOpenAuthModal("signIn");
                // Let the modal handle closing the drawer if needed, or keep drawer open
                // handleDrawerToggle is called by parent List onClick, maybe prevent propagation if needed
              }}
            >
              <PersonIcon sx={{ mr: 1.5 }}/>
              <ListItemText primary="Sign In / Sign Up" />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: "left", pl: 2 }}
            onClick={() => {
              handleOpenAuthModal("signIn");
              handleDrawerToggle();
            }}
          >
            <ListItemText primary="Sign In / Sign Up" />
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
          width: "100%",
          maxWidth: "1900px",
          bgcolor: isScrolled ? "rgba(60, 30, 30, 0.5)" : "transparent",
          backdropFilter: isScrolled ? "blur(5px)" : "none", 
          borderBottomLeftRadius: isScrolled ? "20px" : "0px",
          borderBottomRightRadius: isScrolled ? "20px" : "0px",
          color: "white",
          boxShadow: isScrolled ? floatingShadow : "none",
          zIndex: theme.zIndex.drawer + 1,
          transition: `background-color ${transitionDuration} ${transitionTiming}, backdrop-filter ${transitionDuration} ${transitionTiming}, border-radius ${transitionDuration} ${transitionTiming}, box-shadow ${transitionDuration} ${transitionTiming}`,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: "70px", sm: "90px" } }}>

          {/* Section 1: Left */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
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
                    textShadow: floatingShadow,
                    transform: floatingTransform,
                    transition: `transform 0.3s ${transitionTiming}, background-color 0.3s ${transitionTiming}, text-shadow 0.3s ${transitionTiming}`,
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      transform: "translateY(-3px)",
                      textShadow: "0 3px 6px rgba(0,0,0,0.4)",
                    },
                    fontWeight: 600,
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
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate("/")}>
             <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  padding: '1px',
                  height: { xs: 40, sm: 44, md: 50 },
                  width: { xs: 40, sm: 44, md: 50 },
                  overflow: 'hidden',
                  boxShadow: "0 10px 10px rgba(0,0,0,0.8)",
                  transform: floatingTransform,
                  transition: `transform 0.3s ${transitionTiming}, box-shadow 0.3s ${transitionTiming}`,
                  '&:hover': {
                      transform: 'translateY(-3px) scale(1.03)',
                      boxShadow: "0 6px 15px rgba(0,0,0,0.4)",
                  }
                }}
             >
                <Box
                    component="img"
                    src={logoPath}
                    alt="Hera Prints Logo"
                    sx={{ height: '120%', width: '120%', objectFit: 'cover', display: 'block' }}
                />
             </Box>
             <Typography
                variant="h4"
                component="div"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  ml: 2,
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textShadow: "0 6px 10px rgba(0,0,0,0.8)",
                  transform: floatingTransform,
                  transition: `transform 0.3s ${transitionTiming}, text-shadow 0.3s ${transitionTiming}`,
                }}
             >
                Hera Prints
             </Typography>
          </Box>

          {/* Section 3: Right Side (Icons) */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>

            {/* Cart Icon */}
            <Tooltip title="Shopping Cart">
               <IconButton size="large" aria-label="show shopping cart items" onClick={() => navigate("/cart")} sx={{ /* Cart icon styles */
                  color: "white", mr: 1, // Added margin right
                  transform: floatingTransform,
                  transition: `transform 0.3s ${transitionTiming}, background-color 0.3s ${transitionTiming}`,
                  "& svg": { filter: `drop-shadow(${floatingShadow})`, transition: `filter 0.3s ${transitionTiming}, transform 0.4s ease-in-out`, fontSize: '2.1rem'},
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)", "& svg": { filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.4))", animation: `${cuteShake} 0.4s ease-in-out`, fontSize: '2.3rem'}},
                }}>
                <ShoppingCartIcon sx={{ fontSize: 'inherit' }}/>
              </IconButton>
            </Tooltip>

            {/* Profile Icon & Menu */}
            <Tooltip title={isAuthenticated ? (user?.name || 'Account') : 'Account'}>
              <IconButton size="large" aria-label="account options" aria-controls={ Boolean(anchorElUser) ? "profile-menu-appbar" : undefined } aria-haspopup="true" onClick={handleOpenUserMenu} sx={{ /* Profile icon styles */
                  color: "white", ml: 0.5, // Adjusted margin left
                  transform: floatingTransform,
                  transition: `transform 0.3s ${transitionTiming}, background-color 0.3s ${transitionTiming}`,
                  "& .MuiSvgIcon-root, & .MuiAvatar-root": { // Target both icon and avatar
                    filter: `drop-shadow(${floatingShadow})`,
                    transition: `filter 0.3s ${transitionTiming}, transform 0.4s ease-in-out`,
                    fontSize: '2.1rem', // Base size for icon
                    width: 32, height: 32 // Base size for avatar
                  },
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)", "& .MuiSvgIcon-root, & .MuiAvatar-root": { filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.4))", animation: `${cuteShake} 0.4s ease-in-out`, fontSize: '2.3rem', width: 34, height: 34 }}, // Slightly larger on hover
                }}>
                 {/* --- Show Avatar or Icon based on Auth State --- */}
                 {isAuthenticated && user?.name ? ( // Example: Use Avatar if logged in and name exists
                     <Avatar sx={{ width: 'inherit', height: 'inherit', bgcolor: 'secondary.main' /* Example BG */ }}>
                        {user.name.charAt(0).toUpperCase()} {/* Display first initial */}
                     </Avatar>
                 ) : (
                    <PersonIcon sx={{ fontSize: 'inherit' }} />
                 )}
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
              sx={{ mt: "10px" }} // Adjusted margin top
            >
              {/* --- Conditional Menu Items --- */}
              {isAuthenticated ? (
                [ // Use array for multiple items if needed, or Fragment
                  <MenuItem key="profile" onClick={() => { navigate('/profile'); handleCloseUserMenu(); }}>
                     <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography textAlign="center">{user?.name || "Profile"}</Typography>
                  </MenuItem>,
                  <MenuItem key="logout" onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }}/>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                ]
              ) : (
                [ // Use array for multiple items
                  <MenuItem key="signin" onClick={() => handleOpenAuthModal("signIn")}>
                    <Typography textAlign="center">Sign In</Typography>
                  </MenuItem>,
                  <MenuItem key="signup" onClick={() => handleOpenAuthModal("signUp")}>
                    <Typography textAlign="center">Sign Up</Typography>
                  </MenuItem>
                ]
              )}
              {/* --- End Conditional Menu Items --- */}
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
      {!isAuthenticated && (
        <AuthModal
            open={authModalOpen}
            handleClose={handleCloseAuthModal}
            initialMode={initialAuthMode}
            // Pass the context's login function to the modal if it needs to trigger login state update
            // onLoginSuccess={(userData) => login(userData)} // You might already handle this within the modal using useUser hook
        />
      )}
    </>
  );
};

export default Navbar;