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
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRegisterMutation } from '../store/apis/authApi';
import { useUser } from '../context/userContext';

interface SignUpFormProps {
  onSwitchMode: () => void;
  onSuccess: () => void;  // Function to call when switching to Sign In
}

const formVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const buttonHoverTap = {
  hover: { scale: 1.03, transition: { type: 'spring', stiffness: 300 } },
  tap: { scale: 0.97 },
};

const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchMode, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const [register, { isLoading }] = useRegisterMutation();
  const { login: userLogin } = useUser();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    // Clear password error when user types in password fields
    if ((event.target.name === 'password' || event.target.name === 'confirmPassword') && passwordError) {
      setPasswordError(null);
    }
    // Clear register error when user types anything
    if (registerError) {
      setRegisterError(null);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    
    // Create the registration data
    const registerData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      password: formData.password,
    };
    
    try {
      console.log("SignUpForm: Awaiting registration..."); // Keep debug logs
      const userData = await register(registerData).unwrap();
      console.log("SignUpForm: Registration successful, userData:", userData);

      console.log("SignUpForm: Calling userLogin...");
      userLogin(userData); // Update context
      console.log("SignUpForm: userLogin called.");

      console.log("SignUpForm: Calling onSuccess to close modal..."); // Keep debug logs
      // **** CALL THE onSuccess FUNCTION ****
      onSuccess();
      console.log("SignUpForm: onSuccess call completed."); // Keep debug logs

    } catch (err: any) {
      console.error("SignUpForm: Registration failed in catch block:", err);
      setRegisterError(
        err.data?.message || 'Registration failed. Please try again.'
      );
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
              Create Account
            </Typography>

            {registerError && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {registerError}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid size={{xs:12 ,sm:6}}>
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
              <Grid size={{xs:12 ,sm:6}}>
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
              id="email-signup"
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
              error={!!passwordError}
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
              helperText={passwordError}
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
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
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