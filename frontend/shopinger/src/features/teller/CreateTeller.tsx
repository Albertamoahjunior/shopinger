import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTeller } from '../../services/tellerService';
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
  const [password, setPassword] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [hire_date, setHireDate] = useState('');
  const [id_number, setIdNumber] = useState('');
  const [shift, setShift] = useState('');

  const createMutation = useMutation({
    mutationFn: async () => {
      return createTeller({
        first_name,
        last_name,
        email,
        password,
        phone_number,
        hire_date,
        id_number,
        shift,
      });
    },
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
    setPassword('');
    setPhoneNumber('');
    setHireDate('');
    setIdNumber('');
    setShift('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
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
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <TextField
              label="Hire Date"
              value={hire_date}
              onChange={(e) => setHireDate(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Employee ID"
              value={id_number}
              onChange={(e) => setIdNumber(e.target.value)}
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
            disabled={createMutation.isPending || !first_name || !last_name || !email || !password}
          >
            {createMutation.isPending ? <CircularProgress size={20} /> : 'Create Teller'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
