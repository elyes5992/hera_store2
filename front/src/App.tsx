// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/mainlayout'; // Import MainLayout
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage'; // Import ContactPage
// Import other pages as you create them
// import ProductsPage from './pages/ProductsPage';
// import AboutPage from './pages/AboutPage';
// import ContactPage from './pages/ContactPage';
// import CartPage from './pages/CartPage';
// import AccountPage from './pages/AccountPage'; // Or LoginPage, etc.

import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ProductsPage from './pages/ProductsPage';
import AboutUsPage from './pages/about_us';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Admin/AdminDashboard';
import PromoGridManagement from './pages/Admin/PromoGrid';
import CartPage from './pages/CartPage';

const themeColors = {
  // Orange gradient colors
  gradientStart: '#FF8C00', // Darker orange (DarkOrange)
  gradientEnd: '#FFA500',   // Lighter orange (Orange)
  // Other theme colors that complement the orange gradient
  cardBackground: 'rgba(255, 255, 255, 0.85)',
  buttonPrimary: '#FF6B00',
  buttonPrimaryHover: '#E05A00',
};

let theme = createTheme({
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    // other typography settings...
  },
  palette: {
    // Set both default (body) and paper (AppBar, Card, Drawer etc.) backgrounds
    background: {
      default: '#fafafa', // Very light grey background
      paper: '#fafafa',   // Matching background for components
    },
    // You might need to adjust text or primary/secondary colors
    // if the default ones don't have enough contrast with #fafafa
    // text: { primary: '#212121', secondary: '#757575' }, // Example: Ensure dark text
    // primary: { main: '#1976d2' },
  },
  // Add other theme overrides (spacing, components) here as needed
});

theme = {...responsiveFontSizes(theme),
  themeColors};

declare module '@mui/material/styles' {
  interface Theme {
    themeColors: typeof themeColors;
  }
  interface ThemeOptions {
    themeColors?: typeof themeColors;
  }
}

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Routes using MainLayout */}
          {/* ===> MainLayout is the element for the PARENT route <=== */}
          <Route path="/" element={<MainLayout />}>
            {/* Child routes render inside MainLayout's Outlet */}
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="About-us" element={<AboutUsPage />} />
            <Route path="cart" element={<CartPage/>} />
            
            
            <Route path="contact" element={<ContactPage />} />
            

            
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            {/* Admin login page (handled by AdminLayout) */}
            <Route path="login" element={<AdminLogin />} />
            
            {/* Admin dashboard pages */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="PromoGridMG" element={<PromoGridManagement />} />
            



            {/* Add more admin routes as needed */}
            {/* <Route path="categories" element={<Categories />} /> */}
            {/* <Route path="customers" element={<Customers />} /> */}
          </Route>

        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;