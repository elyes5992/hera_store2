// src/components/Admin/StatusUpdateDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme,
} from '@mui/material';

interface StatusUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  status: string;
  onStatusChange: (e: SelectChangeEvent) => void;
  onUpdate: () => void;
}

const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({
  open,
  onClose,
  status,
  onStatusChange,
  onUpdate,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Update Order Status</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            value={status}
            label="Status"
            onChange={onStatusChange}
          >
            <MenuItem value="Processing">Processing</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={onUpdate} 
          variant="contained"
          sx={{
            bgcolor: theme.themeColors.buttonPrimary,
            '&:hover': {
              bgcolor: theme.themeColors.buttonPrimaryHover,
            },
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusUpdateDialog;