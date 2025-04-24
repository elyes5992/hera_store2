// src/components/admin/FileUpload.tsx
import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
  Paper,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

interface FileUploadProps {
  onFileUpload: (fileUrl: string) => void;
  currentImage?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, WEBP)');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }
    
    setError(null);
    setUploading(true);
    
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('images', file);
      
      // Upload file
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = Math.min(prev + 10, 90);
          return newProgress;
        });
      }, 200);
      
      const response = await fetch('http://localhost:5000/api/products/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      
      // Set progress to 100% when done
      setProgress(100);
      
      // Get response data with file URL
      const data = await response.json();
      
      // Create file preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Pass file URL to parent component
      onFileUpload(data.imageUrl || data.path || objectUrl);
      
      // Reset progress after 1 second
      setTimeout(() => {
        setProgress(0);
        setUploading(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An error occurred during file upload');
      setUploading(false);
      setProgress(0);
      console.error('Upload error:', err);
    }
  };
  
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onFileUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Box sx={{ mb: 2 }}>
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      {previewUrl ? (
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Paper elevation={2} sx={{ p: 1, borderRadius: 1 }}>
            <Box sx={{ position: 'relative' }}>
              <img
                src={previewUrl}
                alt="Product preview"
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bgcolor: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
                size="small"
                onClick={handleRemoveImage}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        </Box>
      ) : (
        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            p: 3,
            mb: 2,
            textAlign: 'center',
            backgroundColor: 'background.default',
          }}
        >
          <ImageIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body1" gutterBottom>
            No image selected
          </Typography>
        </Box>
      )}
      
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={handleButtonClick}
        disabled={uploading}
        fullWidth
      >
        {previewUrl ? 'Change Image' : 'Upload Image'}
      </Button>
      
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5, textAlign: 'center' }}>
            Uploading: {progress}%
          </Typography>
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;