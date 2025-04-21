// src/pages/Admin/AdminLogin.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Alert,
  useTheme,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { motion } from 'framer-motion';

// Mock admin credentials (in a real app, this would be validated on the backend)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const MotionPaper = motion(Paper);

const AdminLogin: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Check if user is already logged in
  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    // Check admin credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // In a real app, you would get a token from your backend
      localStorage.setItem('adminToken', 'admin-mock-token');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <MotionPaper
          elevation={6}
          sx={{ 
            p: 4, 
            width: '100%',
            mt: 8,
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Avatar sx={{ m: 1, bgcolor: theme.themeColors.buttonPrimary }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Admin Login
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                bgcolor: theme.themeColors.buttonPrimary,
                '&:hover': {
                  bgcolor: theme.themeColors.buttonPrimaryHover,
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </MotionPaper>
      </Box>
    </Container>
  );
};

export default AdminLogin;