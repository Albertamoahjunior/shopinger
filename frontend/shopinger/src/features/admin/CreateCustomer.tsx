import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCustomer, type Customer } from '../../services/customerService';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { AxiosError } from 'axios';

export function CreateCustomer() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [tel_number, setTelNumber] = useState('');

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      dispatch(showNotification({ message: 'Customer created successfully!', type: 'success' }));
      handleClose();
    },
    onError: (err: AxiosError) => {
      const errorMessage = (err.response?.data as { message?: string })?.message || 'Failed to create customer.';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    },
  });

  const handleClose = () => {
    setOpen(false);
    // Clear form
    setFirstName('');
    setLastName('');
    setEmail('');
    setTelNumber('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Omit<Customer, 'id'> = {
      first_name,
      last_name,
      email,
      tel_number,
    };
    createMutation.mutate(newCustomer);
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add New Customer
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Customer</DialogTitle>
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={createMutation.isPending || !first_name || !last_name || !email || !tel_number}
          >
            {createMutation.isPending ? <CircularProgress size={20} /> : 'Create Customer'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
