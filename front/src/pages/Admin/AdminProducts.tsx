// src/pages/Admin/AdminProductsPage.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Grid,
  Chip,
  Alert,
  Snackbar,
  Avatar,
  TablePagination,
  useTheme,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Define TypeScript interfaces
interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  countInStock: number;
  imageUrl: string;
  description: string;
  discountPercentage?: number;
  tags?: string[];
}
interface Category {
  _id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  price: number;
  category: string;
  countInStock: number;
  description: string;
  discountPercentage?: number;
  tags?: string[];
  imageUrl?: string;
  images?: string[];
}

const AdminProductsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // State for product data
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true); // Separate loading for categories dropdown
  const [categoryError, setCategoryError] = useState<string | null>(null); 

  // State for product form
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    category: "",
    countInStock: 0,
    description: "",
    discountPercentage: 0,
    tags: [],
  });
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // State for image upload
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for delete confirmation
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCategories = useCallback(async () => {
    setCategoryLoading(true);
    setCategoryError(null);
    try {
        // Assuming public GET endpoint, no token needed here? Adjust if required.
        const response = await fetch('http://localhost:5000/api/categories');
        if (!response.ok) {
            throw new Error('Failed to fetch categories for dropdown');
        }
        const data = await response.json();
        // Assuming API returns array directly or { categories: [...] }
        setAvailableCategories(data.categories || data || []);
    } catch (err: any) {
        console.error("Error fetching categories:", err);
        setCategoryError(err.message || 'Could not load categories.');
        // Optionally show snackbar error here too
        // setSnackbar({ open: true, message: err.message || 'Could not load categories.', severity: 'error' });
    } finally {
        setCategoryLoading(false);
    } }, []);


    useEffect(() => {
      fetchAvailableCategories();
  }, [fetchAvailableCategories]);

  // Function to handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "tags") {
      // Convert comma-separated string to array
      setFormData({
        ...formData,
        [name]: value
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
      });
    } else if (
      name === "price" ||
      name === "countInStock" ||
      name === "discountPercentage"
    ) {
      // Convert string to number for numeric fields
      setFormData({
        ...formData,
        [name]: value === "" ? 0 : Number(value),
      });
    } else {
      // Handle other string fields
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  // Specific handler for the Category Select dropdown
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value // Value will be the category name string
    }));
};

  // Function to handle image upload
  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Debug info
    const file = files[0];
    console.log("Selected file:", {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
    });

    setUploadingImage(true);
    setImageError(null);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    const token = localStorage.getItem("adminToken");
    if (!token) {
      setImageError("Authentication required");
      setUploadingImage(false);
      return;
    }

    // Add more debugging
    console.log("Sending upload request to server...");

    // Upload the image - don't set Content-Type header when using FormData
    fetch("http://localhost:5000/api/products/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Important: Do NOT set Content-Type when sending FormData
      },
      body: formData,
    })
      .then((response) => {
        console.log("Server response status:", response.status);
        if (!response.ok) {
          return response.text().then((text) => {
            // Try to parse as JSON, but handle case where it's not JSON
            try {
              const errorData = JSON.parse(text);
              throw new Error(errorData.message || "Failed to upload image");
            } catch (e) {
              throw new Error(`Upload failed: ${text || response.statusText}`);
            }
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Upload success, server returned:", data);

        // Update form data with the new image URL
        if (data.imageUrl) {
          setFormData((prev) => ({
            ...prev,
            imageUrl: data.imageUrl,
          }));
        } else if (data.images && data.images.length > 0) {
          setFormData((prev) => ({
            ...prev,
            imageUrl: data.images[0],
            images: data.images,
          }));
        }

        setSnackbar({
          open: true,
          message: "Image uploaded successfully",
          severity: "success",
        });
      })
      .catch((err) => {
        console.error("Error uploading image:", err);
        setImageError("Failed to upload image: " + err.message);
      })
      .finally(() => {
        setUploadingImage(false);
      });
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic validation
    if (!formData.name || !formData.category || formData.price <= 0) {
      setFormError("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const url =
        formMode === "create"
          ? "http://localhost:5000/api/products"
          : `http://localhost:5000/api/products/${currentProductId}`;

      const method = formMode === "create" ? "POST" : "PUT";

      // If no image URL and we're creating a product, use a default
      if (!formData.imageUrl && formMode === "create") {
        setFormData((prev) => ({
          ...prev,
          imageUrl: "/uploads/sample.jpg", // Default image path from backend
        }));
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save product");
      }

      // Refresh products list
      await fetchProducts();

      // Show success message
      setSnackbar({
        open: true,
        message:
          formMode === "create"
            ? "Product created successfully"
            : "Product updated successfully",
        severity: "success",
      });

      // Close form
      handleCloseForm();
    } catch (err: any) {
      setFormError(err.message || "An error occurred while saving the product");
      console.error("Error saving product:", err);
    }
  };

  // Function to handle product deletion
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:5000/api/products/${productToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      // Refresh products list
      await fetchProducts();

      // Show success message
      setSnackbar({
        open: true,
        message: "Product deleted successfully",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || "An error occurred while deleting the product",
        severity: "error",
      });
      console.error("Error deleting product:", err);
    } finally {
      setOpenDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  // Function to open create product form
  const handleOpenCreateForm = () => {
    setFormData({
      name: "",
      price: 0,
      category: "",
      countInStock: 0,
      description: "",
      discountPercentage: 0,
      tags: [],
    });
    setFormMode("create");
    setCurrentProductId(null);
    setOpenForm(true);
  };

  // Function to open edit product form
  const handleOpenEditForm = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      countInStock: product.countInStock,
      description: product.description,
      discountPercentage: product.discountPercentage || 0,
      tags: product.tags || [],
      imageUrl: product.imageUrl,
    });
    setFormMode("edit");
    setCurrentProductId(product._id);
    setOpenForm(true);
  };

  // Function to close product form
  const handleCloseForm = () => {
    setOpenForm(false);
    setFormError(null);
  };

  // Function to open delete confirmation dialog
  const handleOpenDeleteDialog = (productId: string) => {
    setProductToDelete(productId);
    setOpenDeleteDialog(true);
  };

  // Function to close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setProductToDelete(null);
  };

  // Function to handle pagination changes
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply pagination to filtered products
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );



  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1">
          Product Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateForm}
          sx={{
            bgcolor: theme.themeColors.buttonPrimary,
            "&:hover": {
              bgcolor: theme.themeColors.buttonPrimaryHover,
            },
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "action.active", mr: 1 }} />
            ),
          }}
          size="small"
        />
      </Paper>

      {/* Products Table */}
      <Paper elevation={3} sx={{ overflow: "hidden", mb: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "background.default" }}>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Price ($)</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                      <TableRow key={product._id} hover>
                        <TableCell>
                          <Avatar
                            src={
                              product.imageUrl
                                ? (
                                    // Check if it's already an absolute URL (starts with http:// or https://)
                                    product.imageUrl.startsWith('http://') || product.imageUrl.startsWith('https://')
                                      ? product.imageUrl // Use it directly if absolute
                                      // Otherwise, construct the full URL assuming backend is at localhost:5000
                                      // and imageUrl is like 'uploads/image.jpg' or '/uploads/image.jpg'
                                      : `http://localhost:5000/${
                                          // Remove leading slash if present to avoid double slash //
                                          product.imageUrl.startsWith('/') ? product.imageUrl.substring(1) : product.imageUrl
                                        }`
                                  )
                                : undefined // Or provide a path to a default placeholder image if imageUrl is missing
                            }
                            alt={product.name}
                            variant="rounded"
                            sx={{ width: 50, height: 50 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {product.name}
                          </Typography>
                          {product.discountPercentage &&
                            product.discountPercentage > 0 && (
                              <Chip
                                label={`${product.discountPercentage}% OFF`}
                                size="small"
                                color="secondary"
                                sx={{ mt: 0.5 }}
                              />
                            )}
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell align="right">
                          ${product.price.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={product.countInStock.toString()}
                            color={
                              product.countInStock > 0 ? "success" : "error"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEditForm(product)}
                            aria-label="edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(product._id)}
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body1" sx={{ py: 2 }}>
                          {searchTerm
                            ? "No products found matching your search."
                            : "No products available."}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Product Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>
          {formMode === "create" ? "Add New Product" : "Edit Product"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid size={{xs:12 ,sm:6}} >
                  <FormControl fullWidth required margin="normal" error={!!categoryError || (formError && formError.includes('Category'))} disabled={categoryLoading}>
                      <InputLabel id="category-select-label">Category</InputLabel>
                      <Select
                          labelId="category-select-label"
                          id="category-select"
                          name="category" // Must match state key
                          value={formData.category} // Bind to state
                          label="Category" // Required for outlined label
                          onChange={handleCategoryChange} // Use specific handler
                      >
                          {/* Default empty option */}
                          <MenuItem value="" disabled>
                              <em>{categoryLoading ? "Loading..." : "Select a Category"}</em>
                          </MenuItem>
                          {/* Map available categories */}
                          {availableCategories.map((cat) => (
                              <MenuItem key={cat._id} value={cat.name}>
                                  {cat.name}
                              </MenuItem>
                          ))}
                      </Select>
                      {/* Show category fetch error */}
                      {categoryError && <Typography variant="caption" color="error" sx={{mt: 1}}>{categoryError}</Typography>}
                  </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  required
                  label="Price"
                  name="price"
                  type="text"
                  
                
                 
                  value={formData.price}
                  onChange={handleInputChange}
                  margin="normal"
                  placeholder="e.g., 19.99" 
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  required
                  label="Stock Quantity"
                  name="countInStock"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={formData.countInStock}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Discount Percentage"
                  name="discountPercentage"
                  type="text"
                  inputMode="numeric"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Tags (comma separated)"
                  name="tags"
                  value={formData.tags?.join(", ")}
                  onChange={handleInputChange}
                  margin="normal"
                  helperText="E.g., bestseller, new, sale"
                />
              </Grid>

              {/* Image Upload Section */}
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }}>
                  <Chip label="Product Image" />
                </Divider>

                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={(e) => handleImageUpload(e.target.files)}
                />

                {/* Current Image Preview */}
                {/* Current Image Preview */}
                {formData.imageUrl && (
                  <Box sx={{ mb: 2, textAlign: "center" }}>
                    <Paper
                      elevation={2}
                      sx={{
                        display: "inline-block",
                        p: 1,
                        borderRadius: 1,
                        maxWidth: "100%",
                        position: "relative",
                      }}
                    >
                      <img
                        // --- CORRECTED SRC LOGIC ---
                        src={
                          // First check if it's already an absolute URL (less likely here, but safe)
                          formData.imageUrl.startsWith("http://") ||
                          formData.imageUrl.startsWith("https://")
                            ? formData.imageUrl
                            : // If not absolute, construct the full URL from backend base
                              // Assuming API returns "uploads/image.jpg" format
                              `http://localhost:5000/${
                                formData.imageUrl.startsWith("/")
                                  ? formData.imageUrl.substring(1)
                                  : formData.imageUrl
                              }`
                        }
                        // --- End of Corrected SRC LOGIC ---
                        alt={formData.name || "Product Image Preview"} // Add fallback alt text
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          display: "block",
                          backgroundColor: "#f0f0f0", // Placeholder background
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          console.error(
                            `Preview image failed to load. Raw path: ${formData.imageUrl}, Attempted src: ${target.src}`
                          );
                          // Set a visible placeholder on error
                          target.src =
                            "https://via.placeholder.com/200x200.png?text=Image+Load+Error";
                          target.alt = "Image failed to load";
                        }}
                      />
                    </Paper>
                  </Box>
                )}

                {/* Image Upload Button */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    sx={{ flexGrow: 1 }}
                  >
                    {formData.imageUrl ? "Change Image" : "Upload Image"}
                  </Button>

                  {formData.imageUrl && (
                    <Button
                      color="error"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    >
                      Remove
                    </Button>
                  )}
                </Box>

                {uploadingImage && (
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography variant="body2">Uploading image...</Typography>
                  </Box>
                )}

                {imageError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {imageError}
                  </Alert>
                )}

                {!formData.imageUrl && !uploadingImage && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Upload a product image (JPG, PNG, or WEBP format)
                  </Typography>
                )}

                {/* Alternative direct URL input */}
                <TextField
                  fullWidth
                  label="Or Enter Image URL Directly"
                  name="imageUrl"
                  value={formData.imageUrl || ""}
                  onChange={handleInputChange}
                  margin="normal"
                  size="small"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseForm}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={uploadingImage}
              sx={{
                bgcolor: theme.themeColors.buttonPrimary,
                "&:hover": {
                  bgcolor: theme.themeColors.buttonPrimaryHover,
                },
              }}
            >
              {formMode === "create" ? "Create" : "Update"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteProduct} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProductsPage;
