// src/pages/ContactPage.tsx
import React, { useState } from "react";
import { 
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  Snackbar,
  Alert,
  useMediaQuery 
} from "@mui/material";
import { useTheme } from "@mui/material/styles";


// Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SendIcon from "@mui/icons-material/Send";

const ContactPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Form state
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  // Form validation state
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    message: false
  });
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {
      name: formState.name.trim() === "",
      email: !/^\S+@\S+\.\S+$/.test(formState.email),
      message: formState.message.trim() === ""
    };
    
    setErrors(newErrors);
    
    // If no errors, submit form
    if (!newErrors.name && !newErrors.email && !newErrors.message) {
      // Here you would normally send the data to your backend
      console.log("Form submitted:", formState);
      
      // Show success notification
      setNotification({
        open: true,
        message: "Your message has been sent! We'll get back to you soon.",
        severity: "success"
      });
      
      // Reset form
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } else {
      // Show error notification
      setNotification({
        open: true,
        message: "Please fix the errors in the form.",
        severity: "error"
      });
    }
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        align="center" 
        gutterBottom
        sx={{ 
          color: "#fff",
          fontWeight: 600,
          mb: 5,
          textShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        Get In Touch
      </Typography>
      
      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 4, 
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
            }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                mb: 3,
                color: theme.themeColors.buttonPrimary
              }}
            >
              Contact Information
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <LocationOnIcon sx={{ color: theme.themeColors.buttonPrimary, mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="body1" fontWeight={500}>Our Location</Typography>
                  <Typography variant="body2" color="text.secondary">123 Design Street, Creative City, 90210</Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <EmailIcon sx={{ color: theme.themeColors.buttonPrimary, mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="body1" fontWeight={500}>Email Us</Typography>
                  <Typography variant="body2" color="text.secondary">info@heraprints.com</Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PhoneIcon sx={{ color: theme.themeColors.buttonPrimary, mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="body1" fontWeight={500}>Call Us</Typography>
                  <Typography variant="body2" color="text.secondary">(555) 123-4567</Typography>
                </Box>
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>Business Hours</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">Monday - Friday:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">9:00 AM - 6:00 PM</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Saturday:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">10:00 AM - 4:00 PM</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Sunday:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Closed</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Contact Form */}
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={3}
            component="form"
            onSubmit={handleSubmit}
            sx={{ 
              p: 4,
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
            }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                mb: 3,
                color: theme.themeColors.buttonPrimary
              }}
            >
              Send Us a Message
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  error={errors.name}
                  helperText={errors.name ? "Name is required" : ""}
                  variant="outlined"
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  error={errors.email}
                  helperText={errors.email ? "Please enter a valid email" : ""}
                  variant="outlined"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Your Message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  error={errors.message}
                  helperText={errors.message ? "Message is required" : ""}
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                  size="large"
                  fullWidth={isMobile}
                  sx={{
                    py: 1.5,
                    px: 4,
                    backgroundColor: theme.themeColors.buttonPrimary,
                    '&:hover': {
                      backgroundColor: theme.themeColors.buttonPrimaryHover,
                    }
                  }}
                >
                  Send Message
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Map or additional information section */}
      <Paper 
        elevation={3}
        sx={{ 
          mt: 4, 
          p: 3,
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
        }}
      >
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            mb: 3,
            color: theme.themeColors.buttonPrimary
          }}
        >
          Frequently Asked Questions
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>What materials do you use?</Typography>
            <Typography variant="body2" paragraph>
              We use high-quality PLA and PETG materials for our 3D printed products, 
              ensuring durability and a beautiful finish. All our materials are eco-friendly and biodegradable.
            </Typography>
            
            <Typography variant="h6" gutterBottom>How long does shipping take?</Typography>
            <Typography variant="body2" paragraph>
              Domestic orders typically take 3-5 business days for delivery. International shipping 
              may take 7-14 business days depending on the destination country.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Do you accept custom orders?</Typography>
            <Typography variant="body2" paragraph>
              Yes! We love creating custom designs for our customers. Please contact us with your 
              requirements and we'll work together to bring your ideas to life.
            </Typography>
            
            <Typography variant="h6" gutterBottom>What is your return policy?</Typography>
            <Typography variant="body2" paragraph>
              We accept returns within 30 days of delivery for items in their original condition. 
              Please contact our customer service team to initiate a return or exchange.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Success/Error notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactPage;