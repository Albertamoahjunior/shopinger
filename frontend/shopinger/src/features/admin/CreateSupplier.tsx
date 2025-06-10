import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSupplier, type Supplier } from '../../services/supplierService';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { AxiosError } from 'axios';

export function CreateSupplier() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [tel_number, setTelNumber] = useState('');
  const [company_name, setCompanyName] = useState('');
  const [address, setAddress] = useState('');

  const createMutation = useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      dispatch(showNotification({ message: 'Supplier created successfully!', type: 'success' }));
      handleClose();
    },
    onError: (err: AxiosError) => {
      const errorMessage = (err.response?.data as { message?: string })?.message || 'Failed to create supplier.';
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
    setCompanyName('');
    setAddress('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupplier: Omit<Supplier, 'id'> = {
      first_name,
      last_name,
      email,
      tel_number,
      company_name,
      address,
    };
    createMutation.mutate(newSupplier);
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add New Supplier
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Supplier</DialogTitle>
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
            <TextField
              label="Company Name"
              value={company_name}
              onChange={(e) => setCompanyName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              multiline
              rows={3}
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
            {createMutation.isPending ? <CircularProgress size={20} /> : 'Create Supplier'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
