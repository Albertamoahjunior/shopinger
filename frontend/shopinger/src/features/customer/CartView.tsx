import React from 'react'; // Import React
import { Box, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCartItems, selectCartTotal, updateCartQty, removeCartItem } from './cartSlice';
import { showNotification } from '../notifications/notificationSlice';
import type { MartItem } from '../../services/martService';

export function CartView() {
  const cartItems: MartItem[] = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const dispatch = useAppDispatch();

  const handleIncrement = (customerId: number, productId: string, qty: number) => {
    dispatch(updateCartQty({ customerId, productId, qty: qty + 1 }));
  };

  const handleDecrement = (customerId: number, productId: string, qty: number) => {
    dispatch(updateCartQty({ customerId, productId, qty: qty - 1 }));
  };

  const handleRemove = (customerId: number, productId: string) => {
    dispatch(removeCartItem({ customerId, productId }));
    dispatch(showNotification({ message: 'Item removed from cart.', type: 'info' }));
  };

  if (cartItems.length === 0) {
    return (
      <Box className="p-4 text-center">
        <Typography variant="h5" gutterBottom>Your cart is empty.</Typography>
        <Typography variant="body1">Add some products to get started!</Typography>
      </Box>
    );
  }

  return (
    <Box className="p-4">
      <Typography variant="h4" gutterBottom>Your Shopping Cart</Typography>
      <List>
        {cartItems.map((item) => (
          <React.Fragment key={item.product_id}>
            <ListItem className="flex items-center justify-between py-2">
              <ListItemText
                primary={item.product.product_name}
                secondary={`$${item.product.product_price.toFixed(2)} x ${item.qty}`}
                className="flex-grow"
              />
              <Box className="flex items-center">
                <IconButton size="small" onClick={() => handleDecrement(item.customer_id, item.product_id, item.qty)} disabled={item.qty <= 1}>
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body1" className="mx-2">{item.qty}</Typography>
                <IconButton size="small" onClick={() => handleIncrement(item.customer_id, item.product_id, item.qty)}>
                  <AddIcon />
                </IconButton>
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(item.customer_id, item.product_id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Box className="mt-4 p-4 border-t border-gray-300 flex justify-between items-center">
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6">${cartTotal.toFixed(2)}</Typography>
      </Box>
      <Button variant="contained" color="primary" fullWidth className="mt-4">
        Proceed to Checkout
      </Button>
    </Box>
  );
}
