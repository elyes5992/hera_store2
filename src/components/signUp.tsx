// src/components/auth/SignUpForm.tsx
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
  Grid, // Use Grid for name fields
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface SignUpFormProps {
  onSwitchMode: () => void; // Function to call when switching to Sign In
  // Add onSubmit prop: onSubmit: (data: { firstName: string; lastName: string; email: string; password: string }) => void;
}

// Re-use or define variants if needed (can be imported from a shared file)
const formVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const buttonHoverTap = {
  hover: { scale: 1.03, transition: { type: 'spring', stiffness: 300 } },
  tap: { scale: 0.97 },
};

const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    // Clear password error when user types in password fields
    if (event.target.name === 'password' || event.target.name === 'confirmPassword') {
        setPasswordError(null);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        setPasswordError("Passwords do not match!");
        return; // Stop submission
    }
    setPasswordError(null); // Clear error if they match
    console.log('Sign Up Data:', formData);
    // Add your actual sign-up logic here
    // Example: if (onSubmit) onSubmit(formData);
  };

  return (
    <motion.div variants={formVariants} initial="hidden" animate="visible">
        <Paper
            elevation={4}
            sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: '12px',
            // bgcolor: 'rgba(255, 255, 255, 0.08)', // Example background
            // backdropFilter: 'blur(10px)',
            }}
        >
            <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5} alignItems="center">
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Create Account
                </Typography>

                <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    />
                </Grid>
                </Grid>

                <TextField
                required
                fullWidth
                id="email-signup" // Ensure unique ID if both forms rendered together
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                />

                <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password-signup"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!passwordError} // Show error state if passwords don't match
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

                <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!passwordError}
                helperText={passwordError} // Display error message here
                />

                <motion.div whileHover="hover" whileTap="tap" variants={buttonHoverTap} style={{ width: '100%' }}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
                    >
                        Sign Up
                    </Button>
                </motion.div>

                <Typography variant="body2" sx={{ mt: 2 }}>
                Already have an account?{' '}
                <Link component="button" variant="body2" onClick={onSwitchMode} sx={{ fontWeight: 'bold' }}>
                    Sign In
                </Link>
                </Typography>
            </Stack>
            </Box>
      </Paper>
    </motion.div>
  );
};

export default SignUpForm;