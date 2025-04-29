// src/layouts/AdminLayout.tsx
import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  Snackbar, // Added for feedback
  Alert,    // Added for feedback
  CircularProgress // Added for category loading
} from "@mui/material";

// Icons (keep existing)
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import GridViewIcon from "@mui/icons-material/GridView";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Logo
import logoPath from "../assets/hera_test_imgs/logo2.jpg";

// Import the new modal component
import CategoryModal from "../pages/Admin/CategoryModal"; // Adjust path as needed

// Define Category type (adjust based on your backend model)
export interface Category {
  _id: string;
  name: string;
  // Add other fields if necessary (e.g., description, image)
}


const drawerWidth = 240;

// Mock function for authentication - replace with your actual auth logic
const checkAdminAuth = () => {
  const token = localStorage.getItem("adminToken");
  const adminInfo = localStorage.getItem("adminInfo");
  if (!token || !adminInfo) return false;
  try {
    const admin = JSON.parse(adminInfo);
    return admin && admin.isAdmin === true;
  } catch (error) { return false; }
};

// Helper for API calls
const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const AdminLayout: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  // --- State for Category Modal ---
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  // --- End Category State ---

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const isAdmin = checkAdminAuth();
      setIsAuthenticated(isAdmin);
      if (!isAdmin && !location.pathname.includes("/admin/login")) {
        navigate("/admin/login");
      }
    };
    checkAuth();
  }, [navigate, location.pathname]);

  // --- Fetch Categories ---
  const fetchCategories = useCallback(async () => {
      // No need to fetch if modal isn't potentially opening or if not authenticated
      if (!isAuthenticated) return;

      setCategoryLoading(true);
      setCategoryError(null);
      try {
          // Assuming a public or admin-only endpoint to get categories
          const response = await fetch('http://localhost:5000/api/categories', {
              // Add headers if your GET /categories needs auth
              // headers: getAuthHeaders(),
          });
          if (!response.ok) {
              throw new Error('Failed to fetch categories');
          }
          const data = await response.json();
          // Assuming the API returns an array directly or { categories: [...] }
          setCategories(data.categories || data || []);
      } catch (err: any) {
          console.error("Error fetching categories:", err);
          setCategoryError(err.message || 'Could not load categories.');
          // Show error in snackbar
          setSnackbar({ open: true, message: err.message || 'Could not load categories.', severity: 'error' });
      } finally {
          setCategoryLoading(false);
      }
  }, [isAuthenticated]); // Refetch if auth state changes

  // Fetch categories when authenticated
  useEffect(() => {
      if (isAuthenticated) {
          fetchCategories();
      } else {
          setCategories([]); // Clear categories if logged out
      }
  }, [isAuthenticated, fetchCategories]);
  // --- End Fetch Categories ---

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo"); // Also clear admin info
    setIsAuthenticated(false);
    setCategories([]); // Clear categories on logout
    navigate("/admin/login");
  };

  // --- Category Modal Handlers ---
  const handleOpenCategoryModal = () => {
    // Optional: Fetch categories fresh every time modal opens, or rely on initial fetch
    // fetchCategories(); // Uncomment to fetch fresh data on open
    setIsCategoryModalOpen(true);
  };
  const handleCloseCategoryModal = () => setIsCategoryModalOpen(false);
  // --- End Category Modal Handlers ---


  // --- Nav Items Definition ---
  const navItems = [
    { text: "dashboard", icon: <DashboardIcon />, path: "/admin/dashboard", action: () => navigate("/admin/dashboard") },
    { text: "Orders", icon: <ShoppingBagIcon />, path: "/admin/orders", action: () => navigate("/admin/orders") },
    { text: "Products", icon: <InventoryIcon />, path: "/admin/AdminProducts", action: () => navigate("/admin/AdminProducts") },
    { text: "Categories", icon: <CategoryIcon />, path: "/admin/categories", action: handleOpenCategoryModal }, // <-- Use modal action
    { text: "Promo Grid", icon: <GridViewIcon />, path: "/admin/PromoGridMG", action: () => navigate("/admin/PromoGridMG") },
  ];
  // --- End Nav Items ---

  // Snackbar close handler
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // Conditional Rendering Logic (keep as is)
  if (!isAuthenticated && !location.pathname.includes("/admin/login")) return null;
  if (location.pathname.includes("/admin/login")) return <Outlet />;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { sm: `${open ? drawerWidth : 0}px` },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          // Use theme colors if defined, otherwise fallback
          backgroundColor: theme.themeColors?.gradientStart || theme.palette.primary.main,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerOpen}
            sx={{ mr: 2, display: { sm: open ? "none" : "flex" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Toolbar Content (Title, Profile Menu) */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" noWrap component="div" sx={{ mr: 3 }}>
               Hera Prints Admin
            </Typography>
            {/* Optional: Add more elements here if needed */}
          </Box>

          {/* Admin Profile */}
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt="Admin" sx={{ bgcolor: theme.themeColors?.buttonPrimary || theme.palette.secondary.main }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
          <Menu /* ... User Menu props ... */
            sx={{ mt: "45px" }} id="menu-appbar" anchorEl={anchorElUser}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            keepMounted transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={handleCloseUserMenu} disabled> {/* Disabled Profile for now */}
              <Typography textAlign="center">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" } }}
        variant="persistent" anchor="left" open={open}
      >
        {/* Drawer Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', padding: theme.spacing(0, 1), ...theme.mixins.toolbar, justifyContent: 'space-between' }}>
           <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
             <Box component="img" src={logoPath} alt="Hera Prints Logo" sx={{ height: 40, width: 40, borderRadius: '50%', mr: 1 }} />
             <Typography variant="h6" noWrap component="div"> Hera Admin </Typography>
           </Box>
          <IconButton onClick={handleDrawerClose}><ChevronLeftIcon /></IconButton>
        </Box>
        <Divider />
        {/* Navigation List */}
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                // Highlight based on path OR if it's the categories item and the modal is open (optional)
                selected={location.pathname === item.path}
                onClick={item.action} // Use the action defined in navItems
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "rgba(255, 140, 0, 0.1)", // Example selection color
                    "&:hover": { backgroundColor: "rgba(255, 140, 0, 0.2)" },
                  },
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? (theme.themeColors?.buttonPrimary || theme.palette.primary.main) : "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text.charAt(0).toUpperCase() + item.text.slice(1)} sx={{ color: location.pathname === item.path ? (theme.themeColors?.buttonPrimary || theme.palette.primary.main) : "inherit" }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        {/* Logout Button */}
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, padding: theme.spacing(3), transition: theme.transitions.create("margin", { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen }), marginLeft: `-${drawerWidth}px`, ...(open && { transition: theme.transitions.create("margin", { easing: theme.transitions.easing.easeOut, duration: theme.transitions.duration.enteringScreen }), marginLeft: 0, }), }}>
        <Toolbar /> {/* This pushes content below AppBar */}
        {categoryLoading && categories.length === 0 && <CircularProgress />} {/* Show loading initially */}
        {categoryError && <Alert severity="error">{categoryError}</Alert>} {/* Show fetch error */}
        <Outlet /> {/* Renders the specific admin page component */}
      </Box>

      {/* Render the Category Modal */}
      <CategoryModal
        open={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        categories={categories}
        onCategoryAdded={fetchCategories} // Pass fetchCategories to refresh list after add
        onCategoryDeleted={fetchCategories} // Pass fetchCategories to refresh list after delete
        showSnackbar={(message: any, severity: any) => setSnackbar({ open: true, message, severity })} // Pass snackbar handler
      />

      {/* Snackbar for general feedback */}
       <Snackbar
         open={snackbar.open}
         autoHideDuration={5000}
         onClose={handleCloseSnackbar}
         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
       >
         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
           {snackbar.message}
         </Alert>
       </Snackbar>

    </Box>
  );
};

export default AdminLayout;