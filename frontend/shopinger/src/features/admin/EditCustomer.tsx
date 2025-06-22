import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCustomer, type CustomerUser } from '../../services/customerService';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { AxiosError } from 'axios';

interface EditCustomerProps {
  customer: CustomerUser;
  open: boolean;
  onClose: () => void;
}

export function EditCustomer({ customer, open, onClose }: EditCustomerProps) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [first_name, setFirstName] = useState(customer.profile?.first_name || '');
  const [last_name, setLastName] = useState(customer.profile?.last_name || '');
  const [email, setEmail] = useState(customer.email || '');
  const [phone_number, setPhoneNumber] = useState(customer.profile?.phone_number || '');

  // Populate form when customer changes
  useEffect(() => {
    if (customer) {
      setFirstName(customer.profile?.first_name || '');
      setLastName(customer.profile?.last_name || '');
      setEmail(customer.email || '');
      setPhoneNumber(customer.profile?.phone_number || '');
    }
  }, [customer]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<{
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
    }> }) => updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      dispatch(showNotification({ message: 'Customer updated successfully!', type: 'success' }));
      onClose();
    },
    onError: (err: AxiosError) => {
      const errorMessage = (err.response?.data as { message?: string })?.message || 'Failed to update customer.';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCustomer = {
      first_name,
      last_name,
      email,
      phone_number,
    };
    updateMutation.mutate({ id: customer.id, data: updatedCustomer });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Customer</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="First Name"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Last Name"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone Number"
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={updateMutation.isPending || !first_name || !last_name || !email}
        >
          {updateMutation.isPending ? <CircularProgress size={20} /> : 'Update Customer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
