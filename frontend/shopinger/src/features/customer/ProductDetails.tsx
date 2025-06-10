import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getInventoryItemById } from '../../services/inventoryService';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { addCartItem } from './cartSlice';
import { AxiosError } from 'axios';
import { selectCurrentUser } from '../auth/authSlice';
//import type { InventoryItem } from '../../services/inventoryService';

// interface ProductDetailsProps {
//   item: InventoryItem | undefined;
// }

export function ProductDetails() {
  const { productId } = useParams({ strict: false }); // Get product ID from URL
  const dispatch = useAppDispatch();
  
  // Move this hook to the top, before any conditional logic
  const user = useAppSelector(selectCurrentUser);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['inventoryItem', productId],
    queryFn: () => productId ? getInventoryItemById(productId) : Promise.resolve(undefined),
    enabled: !!productId, // Only run query if productId is available
  });

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-full min-h-[calc(100vh-64px)]">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    let errorMessage = 'Failed to load product details.';
    if (error instanceof AxiosError && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    dispatch(showNotification({ message: errorMessage, type: 'error' }));
    return <Typography color="error" className="text-center mt-8">Error: {errorMessage}</Typography>;
  }

  if (!product) {
    return <Typography className="text-center mt-8">Product not found.</Typography>;
  }

  const handleAddToCart = () => {
    if (user) {
      dispatch(addCartItem({ customerId: user.id, productId: product.product_id, qty: 1 }));
      dispatch(showNotification({ message: `${product.product_name} added to cart!`, type: 'success' }));
    } else {
      dispatch(showNotification({ message: 'You must be logged in to add items to your cart.', type: 'warning' }));
    }
  };

  return (
    <Box className="p-4 flex flex-col md:flex-row items-center md:items-start gap-8">
      <Box className="w-full md:w-1/2 flex justify-center">
        <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.product_name} className="max-w-full h-auto rounded-lg shadow-lg" />
      </Box>
      <Box className="w-full md:w-1/2">
        <Typography variant="h4" component="h1" gutterBottom className="font-bold text-primary">
          {product.product_name}
        </Typography>
        <Typography variant="h5" component="p" gutterBottom className="text-secondary mb-4">
          ${product.product_price.toFixed(2)}
        </Typography>
        <Typography variant="body1" paragraph className="text-gray-700">
          {product.prod_desc || 'No description available.'}
        </Typography>
        <Typography variant="body2" className="text-gray-600 mb-4">
          Available Quantity: {product.product_qty}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          disabled={product.product_qty === 0}
          className="mt-4"
        >
          {product.product_qty > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </Box>
    </Box>
  );
}