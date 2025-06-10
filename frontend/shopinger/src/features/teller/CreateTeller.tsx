import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTeller, type Teller } from '../../services/tellerService';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { AxiosError } from 'axios';

export function CreateTeller() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [tel_number, setTelNumber] = useState('');
  const [employee_id, setEmployeeId] = useState('');
  const [shift, setShift] = useState('');

  const createMutation = useMutation({
    mutationFn: createTeller,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tellers'] });
      dispatch(showNotification({ message: 'Teller created successfully!', type: 'success' }));
      handleClose();
    },
    onError: (err: AxiosError) => {
      const errorMessage = (err.response?.data as { message?: string })?.message || 'Failed to create teller.';
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
    setEmployeeId('');
    setShift('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTeller: Omit<Teller, 'id'> = {
      first_name,
      last_name,
      email,
      tel_number,
      employee_id,
      shift,
    };
    createMutation.mutate(newTeller);
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add New Teller
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Teller</DialogTitle>
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
              label="Employee ID"
              value={employee_id}
              onChange={(e) => setEmployeeId(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
             <TextField
              label="Shift"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              fullWidth
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
            {createMutation.isPending ? <CircularProgress size={20} /> : 'Create Teller'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
