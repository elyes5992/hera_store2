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

// --- Style Constants for Frosted Effect ---
const frostedPaperSx = {
  p: { xs: 3, sm: 4 }, // Consistent padding
  backgroundColor: "rgba(255, 255, 255, 0.1)", // Adjust alpha as needed
  backdropFilter: "blur(12px)", // Adjust blur
  border: "1px solid rgba(255, 255, 255, 0.18)",
  boxShadow: "none", // Remove default elevation shadow
  borderRadius: "16px", // Consistent rounding
  color: "rgba(255, 255, 255, 0.9)", // Default text color for content inside
};

// --- Text Color Constants (Optional - for specific overrides) ---
const primaryTextFrosted = "rgba(255, 255, 255, 0.95)";
const secondaryTextFrosted = "rgba(255, 255, 255, 0.75)";
const dividerFrosted = "rgba(255, 255, 255, 0.15)";

const ContactPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Form state
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  // Form validation state
  const [errors, setErrors] = useState({ name: false, email: false, message: false });
  // Notification state
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) { setErrors(prev => ({ ...prev, [name]: false })); }
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { name: formState.name.trim() === "", email: !/^\S+@\S+\.\S+$/.test(formState.email), message: formState.message.trim() === "" };
    setErrors(newErrors);
    if (!newErrors.name && !newErrors.email && !newErrors.message) {
      console.log("Form submitted:", formState); // Replace with actual submission logic
      setNotification({ open: true, message: "Your message has been sent! We'll get back to you soon.", severity: "success" });
      setFormState({ name: "", email: "", subject: "", message: "" }); // Reset form
    } else {
      setNotification({ open: true, message: "Please fix the errors in the form.", severity: "error" });
    }
  };

  // Close notification
  const handleCloseNotification = () => { setNotification(prev => ({ ...prev, open: false })); };

  // Removed the local 'frosty' variable, using frostedPaperSx directly

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ color: "#fff", fontWeight: 600, mb: 5, textShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        Get In Touch
      </Typography>

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid size={{xs:12 ,md:5}}> {/* Use Grid v2 syntax */}
          <Paper
            elevation={0} // Remove elevation
            sx={{
              ...frostedPaperSx, // Apply frosted style
              height: "100%", // Ensure it fills grid height if needed
              // Override padding slightly if needed for this specific section
              p: { xs: 3, sm: 4 },
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3, color: primaryTextFrosted /* Use frosted text color */ }}>
              Contact Information
            </Typography>

            <Box sx={{ mb: 4 }}>
              {/* Use theme.palette colors for icons for consistency */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <LocationOnIcon sx={{ color: theme.palette.primary.light, mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="body1" fontWeight={500} sx={{ color: primaryTextFrosted }}>Our Location</Typography>
                  <Typography variant="body2" sx={{ color: secondaryTextFrosted }}>123 Design Street, Creative City, 90210</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <EmailIcon sx={{ color: theme.palette.primary.light, mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="body1" fontWeight={500} sx={{ color: primaryTextFrosted }}>Email Us</Typography>
                  <Typography variant="body2" sx={{ color: secondaryTextFrosted }}>info@heraprints.com</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PhoneIcon sx={{ color: theme.palette.primary.light, mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="body1" fontWeight={500} sx={{ color: primaryTextFrosted }}>Call Us</Typography>
                  <Typography variant="body2" sx={{ color: secondaryTextFrosted }}>(555) 123-4567</Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3, borderColor: dividerFrosted }} /> {/* Frosted divider */}

            <Typography variant="h6" gutterBottom sx={{ color: primaryTextFrosted }}>Business Hours</Typography>
            <Grid container spacing={1}>
              <Grid size={{xs:12}}> <Typography variant="body2" sx={{ color: secondaryTextFrosted }}>Monday - Friday:</Typography> </Grid>
              <Grid size={{xs:12}}> <Typography variant="body2" sx={{ color: secondaryTextFrosted }}>9:00 AM - 6:00 PM</Typography> </Grid>
              <Grid size={{xs:12}}> <Typography variant="body2" sx={{ color: secondaryTextFrosted }}>Saturday:</Typography> </Grid>
              <Grid size={{xs:12}}> <Typography variant="body2" sx={{ color: secondaryTextFrosted }}>10:00 AM - 4:00 PM</Typography> </Grid>
              <Grid size={{xs:12}}> <Typography variant="body2" sx={{ color: secondaryTextFrosted }}>Sunday:</Typography> </Grid>
              <Grid size={{xs:12}}> <Typography variant="body2" sx={{ color: secondaryTextFrosted }}>Closed</Typography> </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Contact Form */}
        <Grid size={{xs:12, md:7}}> {/* Use Grid v2 syntax */}
          <Paper
            elevation={0} // Remove elevation
            component="form"
            onSubmit={handleSubmit}
            sx={{
              ...frostedPaperSx, // Apply frosted style
               p: { xs: 3, sm: 4 }, // Consistent padding
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3, color: primaryTextFrosted /* Use frosted text color */ }}>
              Send Us a Message
            </Typography>

            <Grid container spacing={3}>
              {/* Apply styles to TextFields for frosted background */}
              <Grid size={{xs:12, sm:6}}> {/* Use Grid v2 syntax */}
                <TextField
                  fullWidth label="Your Name" name="name" value={formState.name} onChange={handleChange} error={errors.name} helperText={errors.name ? "Name is required" : ""} variant="outlined" required size="small" // Size small for consistency
                  InputLabelProps={{ sx: { color: secondaryTextFrosted } }}
                  InputProps={{ sx: { color: primaryTextFrosted, '& .MuiOutlinedInput-notchedOutline': { borderColor: dividerFrosted }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: secondaryTextFrosted }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.light } } }}
                  FormHelperTextProps={{ sx: { color: theme.palette.error.light } }} // Lighter helper text for error
                />
              </Grid>

              <Grid size={{xs:12, sm:6}}> {/* Use Grid v2 syntax */}
                <TextField
                  fullWidth label="Your Email" name="email" type="email" value={formState.email} onChange={handleChange} error={errors.email} helperText={errors.email ? "Please enter a valid email" : ""} variant="outlined" required size="small"
                  InputLabelProps={{ sx: { color: secondaryTextFrosted } }}
                  InputProps={{ sx: { color: primaryTextFrosted, '& .MuiOutlinedInput-notchedOutline': { borderColor: dividerFrosted }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: secondaryTextFrosted }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.light } } }}
                   FormHelperTextProps={{ sx: { color: theme.palette.error.light } }}
                />
              </Grid>

              <Grid size={{xs:12}}> {/* Use Grid v2 syntax */}
                <TextField
                  fullWidth label="Subject" name="subject" value={formState.subject} onChange={handleChange} variant="outlined" size="small"
                  InputLabelProps={{ sx: { color: secondaryTextFrosted } }}
                  InputProps={{ sx: { color: primaryTextFrosted, '& .MuiOutlinedInput-notchedOutline': { borderColor: dividerFrosted }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: secondaryTextFrosted }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.light } } }}
                />
              </Grid>

              <Grid size={{xs:12}}> {/* Use Grid v2 syntax */}
                <TextField
                  fullWidth label="Your Message" name="message" value={formState.message} onChange={handleChange} error={errors.message} helperText={errors.message ? "Message is required" : ""} variant="outlined" multiline rows={4} required size="small"
                  InputLabelProps={{ sx: { color: secondaryTextFrosted } }}
                  InputProps={{ sx: { color: primaryTextFrosted, '& .MuiOutlinedInput-notchedOutline': { borderColor: dividerFrosted }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: secondaryTextFrosted }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.light } } }}
                   FormHelperTextProps={{ sx: { color: theme.palette.error.light } }}
                />
              </Grid>

              <Grid size={{xs:12}}> {/* Use Grid v2 syntax */}
                <Button type="submit" variant="contained" endIcon={<SendIcon />} size="large" fullWidth={isMobile} sx={{ py: 1.5, px: 4, /* Keep theme button colors */ }}>
                  Send Message
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* FAQ section */}
      <Paper
        elevation={0} // Remove elevation
        sx={{
          mt: 4,
          ...frostedPaperSx // Apply frosted style
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3, color: primaryTextFrosted /* Use frosted text color */ }}>
          Frequently Asked Questions
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{xs:12 ,md:6}}> {/* Use Grid v2 syntax */}
            <Typography variant="h6" gutterBottom sx={{ color: primaryTextFrosted }}>What materials do you use?</Typography>
            <Typography variant="body2" paragraph sx={{ color: secondaryTextFrosted }}>
              We use high-quality PLA and PETG materials for our 3D printed products,
              ensuring durability and a beautiful finish. All our materials are eco-friendly and biodegradable.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ color: primaryTextFrosted }}>How long does shipping take?</Typography>
            <Typography variant="body2" paragraph sx={{ color: secondaryTextFrosted }}>
              Domestic orders typically take 3-5 business days for delivery. International shipping
              may take 7-14 business days depending on the destination country.
            </Typography>
          </Grid>

          <Grid size={{xs:12 ,md:6}}> {/* Use Grid v2 syntax */}
            {/* Added the missing question text here */}
             <Typography variant="h6" gutterBottom sx={{ color: primaryTextFrosted }}>Can I track my order?</Typography>
             <Typography variant="body2" paragraph sx={{ color: secondaryTextFrosted }}>
                 Yes, once your order ships, you will receive an email with tracking information.
             </Typography>

            <Typography variant="h6" gutterBottom sx={{ color: primaryTextFrosted }}>Do you accept custom orders?</Typography>
            <Typography variant="body2" paragraph sx={{ color: secondaryTextFrosted }}>
              Yes! We love creating custom designs for our customers. Please contact us with your
              requirements and we'll work together to bring your ideas to life.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ color: primaryTextFrosted }}>What is your return policy?</Typography>
            <Typography variant="body2" paragraph sx={{ color: secondaryTextFrosted }}>
              We accept returns within 30 days of delivery for items in their original condition.
              Please contact our customer service team to initiate a return or exchange.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Success/Error notification */}
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} >
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled" sx={{ width: '100%' }} >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactPage;