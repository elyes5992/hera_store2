// src/components/Admin/CategoryModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

// Import the Category type from AdminLayout or define it here
import { Category } from '../../layouts/AdminLayout'; // Adjust path if needed

// Reusable Confirmation Dialog (Optional but recommended)
import ConfirmationDialog from '../../components/Admin/ConfirmationDialog'; // Assuming you create this

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onCategoryAdded: () => void; // Callback to refresh categories in parent
  onCategoryDeleted: () => void; // Callback to refresh categories in parent
  showSnackbar: (message: string, severity: 'success' | 'error') => void; // For feedback
}

// Helper for API calls
const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  onClose,
  categories,
  onCategoryAdded,
  onCategoryDeleted,
  showSnackbar
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loadingAction, setLoadingAction] = useState(false); // Loading for add/delete
  const [errorAction, setErrorAction] = useState<string | null>(null); // Error for add/delete

  // State for delete confirmation
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryName(event.target.value);
    setErrorAction(null); // Clear error when user types
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setErrorAction('Category name cannot be empty.');
      return;
    }
    setLoadingAction(true);
    setErrorAction(null);
    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add category');
      }
      setNewCategoryName(''); // Clear input on success
      onCategoryAdded(); // Trigger refresh in parent
      showSnackbar('Category added successfully!', 'success');
    } catch (err: any) {
      console.error("Error adding category:", err);
      setErrorAction(err.message || 'An error occurred.');
      showSnackbar(err.message || 'Failed to add category.', 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  // --- Delete Logic with Confirmation ---
  const handleOpenDeleteConfirm = (category: Category) => {
      setCategoryToDelete(category);
      setConfirmDialogOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
      setCategoryToDelete(null);
      setConfirmDialogOpen(false);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setLoadingAction(true);
    setErrorAction(null);
    handleCloseDeleteConfirm(); // Close confirmation dialog

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${categoryToDelete._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || 'Failed to delete category');
      }
      onCategoryDeleted(); // Trigger refresh in parent
      showSnackbar('Category deleted successfully!', 'success');
    } catch (err: any) {
      console.error("Error deleting category:", err);
      setErrorAction(err.message || 'An error occurred.');
      showSnackbar(err.message || 'Failed to delete category.', 'error');
    } finally {
      setLoadingAction(false);
    }
  };
  // --- End Delete Logic ---


  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Manage Categories
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {/* Add Category Section */}
          <Typography variant="h6" gutterBottom>Add New Category</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="new-category-name"
              label="Category Name"
              type="text"
              fullWidth
              variant="outlined"
              size="small"
              value={newCategoryName}
              onChange={handleInputChange}
              error={!!errorAction && errorAction.includes('empty')} // Example error highlighting
              helperText={errorAction && errorAction.includes('empty') ? errorAction : ''}
              disabled={loadingAction}
            />
            <Button
              onClick={handleAddCategory}
              variant="contained"
              disabled={loadingAction || !newCategoryName.trim()}
              startIcon={loadingAction ? <CircularProgress size={20} color="inherit"/> : <AddIcon />}
              sx={{ height: '40px' }} // Match TextField height
            >
              Add
            </Button>
          </Box>
           {errorAction && !errorAction.includes('empty') && ( // Show other errors
              <Alert severity="error" sx={{ mb: 2 }}>{errorAction}</Alert>
           )}

          <Divider sx={{ my: 2 }} />

          {/* Existing Categories List */}
          <Typography variant="h6" gutterBottom>Existing Categories</Typography>
          {categories.length === 0 ? (
            <Typography color="text.secondary">No categories found.</Typography>
          ) : (
            <List dense>
              {categories.map((category) => (
                <ListItem
                  key={category._id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleOpenDeleteConfirm(category)}
                      disabled={loadingAction} // Disable while any action is loading
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={category.name} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
         <Divider />
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
       <ConfirmationDialog
         open={confirmDialogOpen}
         onClose={handleCloseDeleteConfirm}
         onConfirm={handleDeleteCategory}
         title="Confirm Deletion"
         description={`Are you sure you want to delete the category "${categoryToDelete?.name || ''}"? This might affect products using this category.`}
         confirmText="Delete"
         isDangerousAction={true}
       />
    </>
  );
};

export default CategoryModal;