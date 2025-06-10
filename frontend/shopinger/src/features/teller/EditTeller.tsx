import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTeller, type Teller } from '../../services/tellerService';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { AxiosError } from 'axios';

interface EditTellerProps {
  teller: Teller;
  open: boolean;
  onClose: () => void;
}

export function EditTeller({ teller, open, onClose }: EditTellerProps) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [tel_number, setTelNumber] = useState('');
  const [employee_id, setEmployeeId] = useState('');
  const [shift, setShift] = useState('');

  useEffect(() => {
    if (teller) {
      setFirstName(teller.first_name || '');
      setLastName(teller.last_name || '');
      setEmail(teller.email || '');
      setTelNumber(teller.tel_number || '');
      setEmployeeId(teller.employee_id || '');
      setShift(teller.shift || '');
    }
  }, [teller]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Teller> }) => updateTeller(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tellers'] });
      dispatch(showNotification({ message: 'Teller updated successfully!', type: 'success' }));
      onClose();
    },
    onError: (err: AxiosError) => {
      const errorMessage = (err.response?.data as { message?: string })?.message || 'Failed to update teller.';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTeller: Partial<Teller> = {
      first_name,
      last_name,
      email,
      tel_number,
      employee_id,
      shift,
    };
    updateMutation.mutate({ id: teller.id, data: updatedTeller });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Teller</DialogTitle>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={updateMutation.isPending || !first_name || !last_name || !email || !tel_number}
          >
            {updateMutation.isPending ? <CircularProgress size={20} /> : 'Update Teller'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
