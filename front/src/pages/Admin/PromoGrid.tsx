// src/pages/Admin/PromoGrid.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Import the PromoGrid component to preview it
import ClientPromoGrid from '../../components/PromoGrid';

// Define initial promo items (based on your current PromoGrid component)
const initialPromoItems = [
  {
    id: 'promo1',
    title: 'New Collection Arrived!',
    description: 'Explore the latest additions to our workspace organizers. Fresh designs, more colors!',
    buttonText: 'Discover Now',
    buttonLink: '/products?category=new',
    icon: 'campaign', // This would represent <CampaignIcon />
    color: 'primary'
  },
  {
    id: 'promo2',
    title: 'Summer Sale On!',
    description: 'Get 15% off selected items. Limited time!',
    buttonText: 'Shop Sale',
    buttonLink: '/products?sale=true',
    icon: 'local_offer', // <LocalOfferIcon />
    color: 'secondary'
  },
  {
    id: 'promo3',
    title: 'Free Shipping Update',
    description: 'Now available on all orders over $50.',
    buttonText: 'Learn More',
    buttonLink: '/shipping-info',
    icon: 'new_releases', // <NewReleasesIcon />
    color: 'info'
  },
  {
    id: 'promo4',
    title: 'Care Instructions',
    description: 'Learn how to best maintain your 3D printed items for longevity and lasting beauty.',
    buttonText: 'Read Guide',
    buttonLink: '/care-guide',
    icon: 'info', // <InfoIcon />
    color: 'warning'
  },
];

// Available icons and colors for the promo items
const availableIcons = [
  { value: 'campaign', label: 'Campaign' },
  { value: 'local_offer', label: 'Local Offer' },
  { value: 'new_releases', label: 'New Releases' },
  { value: 'info', label: 'Info' },
  { value: 'star', label: 'Star' },
  { value: 'shopping_cart', label: 'Shopping Cart' },
  { value: 'support', label: 'Support' },
  { value: 'card_giftcard', label: 'Gift Card' },
];

const availableColors = [
  { value: 'primary', label: 'Primary (Blue)' },
  { value: 'secondary', label: 'Secondary (Purple)' },
  { value: 'info', label: 'Info (Light Blue)' },
  { value: 'success', label: 'Success (Green)' },
  { value: 'warning', label: 'Warning (Orange)' },
  { value: 'error', label: 'Error (Red)' },
];

// Define interfaces
interface PromoItem {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  icon: string;
  color: string;
}

interface PromoItemDialogProps {
  open: boolean;
  onClose: () => void;
  item: PromoItem | null;
  onSave: (item: PromoItem) => void;
}

// Promo Item Edit/Add Dialog Component
const PromoItemDialog: React.FC<PromoItemDialogProps> = ({
  open,
  onClose,
  item,
  onSave
}) => {
  const isNewItem = !item?.id;
  
  // Initialize form state with item data or default values
  const [formData, setFormData] = useState<PromoItem>(
    item || {
      id: `promo${Date.now()}`,
      title: '',
      description: '',
      buttonText: '',
      buttonLink: '',
      icon: 'campaign',
      color: 'primary'
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isNewItem ? 'Add New Promo Item' : 'Edit Promo Item'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="buttonText"
              label="Button Text"
              value={formData.buttonText}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="buttonLink"
              label="Button Link"
              value={formData.buttonLink}
              onChange={handleChange}
              fullWidth
              required
              helperText="e.g., /products, /contact"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Icon</InputLabel>
              <Select
                name="icon"
                value={formData.icon}
                onChange={handleSelectChange}
                label="Icon"
              >
                {availableIcons.map(icon => (
                  <MenuItem key={icon.value} value={icon.value}>
                    {icon.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Color</InputLabel>
              <Select
                name="color"
                value={formData.color}
                onChange={handleSelectChange}
                label="Color"
              >
                {availableColors.map(color => (
                  <MenuItem key={color.value} value={color.value}>
                    {color.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isNewItem ? 'Add Item' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Confirmation dialog for deletions
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  content
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main PromoGrid Management Component
const PromoGridManagement: React.FC = () => {
  const theme = useTheme();
  const [promoItems, setPromoItems] = useState<PromoItem[]>(initialPromoItems);
  
  // Dialog states
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<PromoItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  // Open the dialog for editing
  const handleEditItem = (item: PromoItem) => {
    setCurrentItem(item);
    setItemDialogOpen(true);
  };

  // Open the dialog for adding
  const handleAddItem = () => {
    setCurrentItem(null);
    setItemDialogOpen(true);
  };

  // Open the delete confirmation dialog
  const handleDeleteClick = (item: PromoItem) => {
    setCurrentItem(item);
    setDeleteDialogOpen(true);
  };

  // Delete a promo item
  const confirmDelete = () => {
    if (currentItem) {
      setPromoItems(promoItems.filter(p => p.id !== currentItem.id));
      setNotification({
        open: true,
        message: `Promo item "${currentItem.title}" has been deleted.`,
        severity: "success"
      });
    }
    setDeleteDialogOpen(false);
  };

  // Save promo item changes or add new item
  const handleSaveItem = (updatedItem: PromoItem) => {
    // Check if it's a new item or updating an existing one
    if (promoItems.some(p => p.id === updatedItem.id)) {
      // Update existing item
      setPromoItems(promoItems.map(p => 
        p.id === updatedItem.id ? updatedItem : p
      ));
      setNotification({
        open: true,
        message: `"${updatedItem.title}" has been updated.`,
        severity: "success"
      });
    } else {
      // Add new item
      setPromoItems([...promoItems, updatedItem]);
      setNotification({
        open: true,
        message: `"${updatedItem.title}" has been added.`,
        severity: "success"
      });
    }
  };

  // Move item up in the order
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newItems = [...promoItems];
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
      setPromoItems(newItems);
    }
  };

  // Move item down in the order
  const handleMoveDown = (index: number) => {
    if (index < promoItems.length - 1) {
      const newItems = [...promoItems];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      setPromoItems(newItems);
    }
  };

  // Render a simple preview of the item
  const renderItemCard = (item: PromoItem, index: number) => {
    return (
      <Card 
        sx={{ 
          position: 'relative', 
          height: '100%',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 3
          }
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {item.description}
          </Typography>
          <Button
            size="small"
            variant="contained"
            color={item.color as "primary" | "secondary" | "success" | "error" | "info" | "warning"}
            sx={{ mt: 1 }}
          >
            {item.buttonText}
          </Button>
        </CardContent>
        
        {/* Actions Overlay */}
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          right: 0,
          p: 0.5,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Tooltip title="Edit">
            <IconButton 
              size="small" 
              onClick={() => handleEditItem(item)}
              sx={{ mb: 0.5 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              size="small" 
              onClick={() => handleDeleteClick(item)}
              color="error"
              sx={{ mb: 0.5 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Move Up">
            <span> {/* Wrap to prevent tooltip errors when disabled */}
              <IconButton 
                size="small" 
                onClick={() => handleMoveUp(index)} 
                disabled={index === 0}
                sx={{ mb: 0.5 }}
              >
                <ArrowUpIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Move Down">
            <span> {/* Wrap to prevent tooltip errors when disabled */}
              <IconButton 
                size="small" 
                onClick={() => handleMoveDown(index)} 
                disabled={index === promoItems.length - 1}
              >
                <ArrowDownIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Card>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Promo Grid Management
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            sx={{ mr: 2 }}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            sx={{
              bgcolor: theme.themeColors.buttonPrimary,
              '&:hover': {
                bgcolor: theme.themeColors.buttonPrimaryHover,
              }
            }}
          >
            Add Promo Item
          </Button>
        </Box>
      </Box>
      
      {/* Preview (when enabled) */}
      {showPreview && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4, 
            backgroundColor: 'rgba(255, 245, 230, 0.5)', 
            border: '1px dashed orange'
          }}
        >
          <Typography variant="h6" gutterBottom>Preview</Typography>
          <Box sx={{ mt: 2 }}>
            {/* Import your actual PromoGrid component here */}
            <ClientPromoGrid />
          </Box>
          <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
            This is a preview of how the promo grid appears to users. Changes made here will be reflected on the site.
          </Typography>
        </Paper>
      )}
      
      {/* Promo Items Grid */}
      <Grid container spacing={3}>
        {promoItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            {renderItemCard(item, index)}
          </Grid>
        ))}
        
        {/* Empty State */}
        {promoItems.length === 0 && (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              <Typography variant="h6" gutterBottom>No Promo Items</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add your first promotional item to get started.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
              >
                Add Promo Item
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      {/* Note about implementation */}
      <Paper sx={{ p: 2, mt: 4, backgroundColor: 'rgba(250, 250, 250, 0.9)' }}>
        <Typography variant="subtitle2" color="text.secondary">
          Note: Changes made here are currently saved in local state. In a production environment, 
          these would be saved to a database and reflected on the main site.
        </Typography>
      </Paper>
      
      {/* Edit/Add Dialog */}
      <PromoItemDialog
        open={itemDialogOpen}
        onClose={() => setItemDialogOpen(false)}
        item={currentItem}
        onSave={handleSaveItem}
      />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Promo Item"
        content={`Are you sure you want to delete "${currentItem?.title}"? This action cannot be undone.`}
      />
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={() => setNotification({...notification, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({...notification, open: false})}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PromoGridManagement;