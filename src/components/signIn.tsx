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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface SignInFormProps {
  onSwitchMode: () => void; // Function to call when switching to Sign Up
  // Add onSubmit prop if needed: onSubmit: (data: { email: string; password: string }) => void;
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Sign In Data:', formData);
    // Add your actual sign-in logic here
    // Example: if (onSubmit) onSubmit(formData);
  };

  return (
    <motion.div variants={formVariants} initial="hidden" animate="visible">
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: '12px',
          // Example background - adjust with your theme
          // bgcolor: 'rgba(255, 255, 255, 0.08)',
          // backdropFilter: 'blur(10px)',
        }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5} alignItems="center">
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Welcome Back!
            </Typography>

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
             {/* Optional: Remember Me Checkbox & Forgot Password Link */}
             {/*
             <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: -1 }}>
                <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                <Link href="#" variant="body2"> Forgot password? </Link>
             </Box>
             */}

            <motion.div whileHover="hover" whileTap="tap" variants={buttonHoverTap} style={{ width: '100%' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
              >
                Sign In
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