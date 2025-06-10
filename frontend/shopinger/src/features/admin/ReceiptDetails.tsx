import { Box, Dialog, DialogTitle, DialogContent, Typography, Button, DialogActions } from '@mui/material';
import type { Receipt } from '../../services/receiptService';

interface ReceiptDetailsProps {
  receipt: Receipt;
  open: boolean;
  onClose: () => void;
}

export function ReceiptDetails({ receipt, open, onClose }: ReceiptDetailsProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Receipt Details</DialogTitle>
      <DialogContent>
        <Box>
          <Typography variant="h6">Receipt Number: {receipt.receipt_number}</Typography>
          <Typography>Sale ID: {receipt.sale_id}</Typography>
          <Typography>Total Amount: ${receipt.total_amount}</Typography>
          <Typography>Payment Method: {receipt.payment_method}</Typography>
          <Typography>Date: {new Date(receipt.created_at).toLocaleDateString()}</Typography>
          {receipt.customer_id && <Typography>Customer ID: {receipt.customer_id}</Typography>}
          {receipt.teller_id && <Typography>Teller ID: {receipt.teller_id}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={() => { /* Implement print functionality */ }} variant="contained">
          Print Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
}
