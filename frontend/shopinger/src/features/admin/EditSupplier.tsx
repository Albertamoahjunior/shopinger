import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSupplier, type Supplier } from '../../services/supplierService';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { AxiosError } from 'axios';

interface EditSupplierProps {
  supplier: Supplier;
  open: boolean;
  onClose: () => void;
}

export function EditSupplier({ supplier, open, onClose }: EditSupplierProps) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [tel_number, setTelNumber] = useState('');
  const [company_name, setCompanyName] = useState('');
  const [address, setAddress] = useState('');

  // Populate form when supplier changes
  useEffect(() => {
    if (supplier) {
      setFirstName(supplier.first_name || '');
      setLastName(supplier.last_name || '');
      setEmail(supplier.email || '');
      setTelNumber(supplier.tel_number || '');
      setCompanyName(supplier.company_name || '');
      setAddress(supplier.address || '');
    }
  }, [supplier]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Supplier> }) => updateSupplier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      dispatch(showNotification({ message: 'Supplier updated successfully!', type: 'success' }));
      onClose();
    },
    onError: (err: AxiosError) => {
      const errorMessage = (err.response?.data as { message?: string })?.message || 'Failed to update supplier.';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSupplier: Partial<Supplier> = {
      first_name,
      last_name,
      email,
      tel_number,
      company_name,
      address,
    };
    updateMutation.mutate({ id: supplier.id, data: updatedSupplier });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Supplier</DialogTitle>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={updateMutation.isPending || !first_name || !last_name || !email || !tel_number}
        >
          {updateMutation.isPending ? <CircularProgress size={20} /> : 'Update Supplier'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
