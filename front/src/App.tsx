// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/mainlayout'; // Import MainLayout
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage'; // Import ContactPage


import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import AboutUsPage from './pages/about_us';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Admin/AdminDashboard';

import CartPage from './pages/CartPage';
import AdminProductsPage from './pages/Admin/AdminProducts';
import ProductsPage2 from './pages/ProductsPage2';



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
            <Route path="products" element={<ProductsPage2 />} />
            <Route path="About-us" element={<AboutUsPage />} />
            <Route path="cart" element={<CartPage/>} />
            
            
            
            
            <Route path="contact" element={<ContactPage />} />
            

            
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            {/* Admin login page (handled by AdminLayout) */}
            <Route path="login" element={<AdminLogin />} />
            
            {/* Admin dashboard pages */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="AdminProducts" element={<AdminProductsPage/>} />
            
            
            
          


            
          </Route>

        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;