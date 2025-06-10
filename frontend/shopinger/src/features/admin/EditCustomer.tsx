import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCustomer, type Customer } from '../../services/customerService';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { AxiosError } from 'axios';

interface EditCustomerProps {
  customer: Customer;
  open: boolean;
  onClose: () => void;
}

export function EditCustomer({ customer, open, onClose }: EditCustomerProps) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [tel_number, setTelNumber] = useState('');

  // Populate form when customer changes
  useEffect(() => {
    if (customer) {
      setFirstName(customer.first_name || '');
      setLastName(customer.last_name || '');
      setEmail(customer.email || '');
      setTelNumber(customer.tel_number || '');
    }
  }, [customer]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Customer> }) => updateCustomer(id, data),
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
    const updatedCustomer: Partial<Customer> = {
      first_name,
      last_name,
      email,
      tel_number,
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
            value={tel_number}
            onChange={(e) => setTelNumber(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={updateMutation.isPending || !first_name || !last_name || !email || !tel_number}
        >
          {updateMutation.isPending ? <CircularProgress size={20} /> : 'Update Customer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
