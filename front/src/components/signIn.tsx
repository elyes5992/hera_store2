// src/components/auth/SignInForm.tsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLoginMutation } from '../store/apis/authApi';
import { useUser } from '../context/userContext';

interface SignInFormProps {
  onSwitchMode: () => void;
  onSuccess: () => void;  // Function to call when switching to Sign Up
}

const formVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const buttonHoverTap = {
  hover: { scale: 1.03, transition: { type: 'spring', stiffness: 300 } },
  tap: { scale: 0.97 },
};

const SignInForm: React.FC<SignInFormProps> = ({ onSwitchMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [login, { isLoading }] = useLoginMutation();
  const { login: userLogin } = useUser();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    // Clear error when user types
    if (loginError) setLoginError(null);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const userData = await login(formData).unwrap();
      userLogin(userData);
      // You can redirect or close the modal here
    } catch (err: any) {
      setLoginError(
        err.data?.message || 'Failed to login. Please check your credentials.'
      );
      console.error('Login failed:', err);
    }
  };

  return (
    <motion.div variants={formVariants} initial="hidden" animate="visible">
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: '12px',
        }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5} alignItems="center">
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Welcome Back!
            </Typography>

            {loginError && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {loginError}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!loginError}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!loginError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <motion.div whileHover="hover" whileTap="tap" variants={buttonHoverTap} style={{ width: '100%' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </motion.div>

            <Typography variant="body2" sx={{ mt: 2 }}>
              Don't have an account?{' '}
              <Link component="button" variant="body2" onClick={onSwitchMode} sx={{ fontWeight: 'bold' }}>
                Sign Up
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default SignInForm;