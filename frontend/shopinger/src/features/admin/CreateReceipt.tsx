import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReceipt, type Receipt } from '../../services/receiptService';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { AxiosError } from 'axios';

export function CreateReceipt() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [sale_id, setSaleId] = useState('');
  const [receipt_number, setReceiptNumber] = useState('');
  const [total_amount, setTotalAmount] = useState('');
  const [payment_method, setPaymentMethod] = useState('');
  const [customer_id, setCustomerId] = useState('');
  const [teller_id, setTellerId] = useState('');

  const createMutation = useMutation({
    mutationFn: createReceipt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      dispatch(showNotification({ message: 'Receipt created successfully!', type: 'success' }));
      handleClose();
    },
    onError: (err: AxiosError) => {
      const errorMessage = (err.response?.data as { message?: string })?.message || 'Failed to create receipt.';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    },
  });

  const handleClose = () => {
    setOpen(false);
    // Clear form
    setSaleId('');
    setReceiptNumber('');
    setTotalAmount('');
    setPaymentMethod('');
    setCustomerId('');
    setTellerId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReceipt: Omit<Receipt, 'id' | 'created_at'> = {
      sale_id: parseInt(sale_id),
      receipt_number: receipt_number,
      total_amount: parseFloat(total_amount),
      payment_method: payment_method,
      customer_id: customer_id ? parseInt(customer_id) : undefined,
      teller_id: teller_id ? parseInt(teller_id) : undefined,
    };
    createMutation.mutate(newReceipt);
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add New Receipt
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Receipt</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Sale ID"
              value={sale_id}
              onChange={(e) => setSaleId(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Receipt Number"
              value={receipt_number}
              onChange={(e) => setReceiptNumber(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Total Amount"
              type="number"
              value={total_amount}
              onChange={(e) => setTotalAmount(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Payment Method"
              value={payment_method}
              onChange={(e) => setPaymentMethod(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Customer ID (optional)"
              value={customer_id}
              onChange={(e) => setCustomerId(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Teller ID (optional)"
              value={teller_id}
              onChange={(e) => setTellerId(e.target.value)}
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
            disabled={createMutation.isPending || !sale_id || !receipt_number || !total_amount || !payment_method}
          >
            {createMutation.isPending ? <CircularProgress size={20} /> : 'Create Receipt'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
