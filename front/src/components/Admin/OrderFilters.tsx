// src/components/Admin/OrderFilters.tsx
import React from 'react';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Stack,
  InputAdornment,
  useTheme,
} from '@mui/material';
import { CalendarMonth as CalendarIcon } from '@mui/icons-material';

interface OrderFiltersProps {
  filters: {
    status: string;
    startDate: string;
    endDate: string;
    customer: string;
    orderId: string;
  };
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
}) => {
  const theme = useTheme();

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              name="status"
              value={filters.status}
              label="Status"
             
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={onFilterChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={onFilterChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            fullWidth
            label="Customer Name/Email"
            name="customer"
            value={filters.customer}
            onChange={onFilterChange}
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            fullWidth
            label="Order ID"
            name="orderId"
            value={filters.orderId}
            onChange={onFilterChange}
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={onApplyFilters}
              fullWidth
              sx={{
                bgcolor: theme.themeColors.buttonPrimary,
                '&:hover': {
                  bgcolor: theme.themeColors.buttonPrimaryHover,
                },
              }}
            >
              Filter
            </Button>
            <Button variant="outlined" onClick={onResetFilters} fullWidth>
              Reset
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderFilters;