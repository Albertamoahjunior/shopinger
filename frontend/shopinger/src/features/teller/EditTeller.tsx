import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTeller, type TellerUser } from '../../services/tellerService';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { AxiosError } from 'axios';

interface EditTellerProps {
  teller: TellerUser;
  open: boolean;
  onClose: () => void;
}

export function EditTeller({ teller, open, onClose }: EditTellerProps) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [first_name, setFirstName] = useState(teller.profile.first_name || '');
  const [last_name, setLastName] = useState(teller.profile.last_name || '');
  const [email, setEmail] = useState(teller.email || '');
  const [phone_number, setPhoneNumber] = useState(teller.profile.phone_number || '');
  const [hire_date, setHireDate] = useState(teller.profile.hire_date || '');
  const [id_number, setIdNumber] = useState(teller.profile.id_number || '');
  const [shift, setShift] = useState(teller.profile.profile_data?.shift || '');

  useEffect(() => {
    if (teller) {
      setFirstName(teller.profile.first_name || '');
      setLastName(teller.profile.last_name || '');
      setEmail(teller.email || '');
      setPhoneNumber(teller.profile.phone_number || '');
      setHireDate(teller.profile.hire_date || '');
      setIdNumber(teller.profile.id_number || '');
      setShift(teller.profile.profile_data?.shift || '');
    }
  }, [teller]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<{
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      hire_date: string;
      id_number: string;
      shift: string;
    }> }) => updateTeller(id, data),
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
    const updatedTeller = {
      first_name,
      last_name,
      email,
      phone_number,
      hire_date,
      id_number,
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
        <Button onClick={onClose}>Cancel</Button>
        <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={updateMutation.isPending || !first_name || !last_name || !email}
          >
            {updateMutation.isPending ? <CircularProgress size={20} /> : 'Update Teller'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
