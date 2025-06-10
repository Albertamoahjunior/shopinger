import { Box, Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { addCartItem } from './cartSlice';
import type { InventoryItem } from '../../services/inventoryService';
import { Link } from '@tanstack/react-router'; // Import Link
import { useAppSelector } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { selectCurrentUser } from '../auth/authSlice';

interface ProductCardProps {
  item: InventoryItem;
}

export function ProductCard({ item }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  const handleAddToCart = () => {
    if (user) {
      dispatch(addCartItem({ customerId: user.id, productId: item.product_id, qty: 1 }));
    } else {
      // Handle case where user is not logged in
      console.warn('User not logged in. Cannot add to cart.');
      dispatch(showNotification({ message: 'You must be logged in to add items to your cart.', type: 'warning' }));
    }
  };

  return (
    <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }, p: 2 }}>
      <Card>
        <Link to="/products/$productId" params={{ productId: item.product_id }} className="no-underline text-inherit"> {/* Link to product details */}
          <CardMedia
            component="img"
            height="140"
            image={item.imageUrl || 'https://via.placeholder.com/150'}
            alt={item.product_name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {item.product_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.prod_desc}
            </Typography>
            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
              ${item.product_price.toFixed(2)}
            </Typography>
          </CardContent>
        </Link>
        <CardActions>
          <Button size="small" onClick={handleAddToCart}>Add to Cart</Button>
        </CardActions>
      </Card>
    </Box>
  );
}
