import { useQuery } from '@tanstack/react-query';
import { getInventory } from '../../services/inventoryService';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ProductCard } from './ProductCard';
import { useAppDispatch } from '../../app/hooks'; // Import useAppDispatch
import { showNotification } from '../notifications/notificationSlice'; // Import showNotification
import { useEffect } from 'react';
import { OrderHistory } from './OrderHistory';
import { AxiosError } from 'axios'; // Import AxiosError

export function CustomerDashboard() {
  const dispatch = useAppDispatch(); // Initialize dispatch
  const { data: inventory, isLoading, error } = useQuery({
    queryKey: ['inventory'],
    queryFn: getInventory,
  });

  useEffect(() => {
    if (error) {
      let errorMessage = 'Failed to load inventory.';
      if (error instanceof AxiosError && error.response?.data) {
        errorMessage = (error.response.data as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    }
  }, [error, dispatch]);

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-full min-h-[calc(100vh-64px)]"> {/* Converted sx to Tailwind */}
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return null; // Notification will handle the error display
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
        {inventory?.map((item) => (
          <ProductCard key={item.product_id} item={item} />
        ))}
      </Box>
      <OrderHistory />
    </Box>
  );
}
