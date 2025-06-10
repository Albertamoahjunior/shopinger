import { useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReceipts, deleteReceipt, type Receipt } from '../../services/receiptService';
import { Box, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { AxiosError } from 'axios';
import { ReceiptDetails } from './ReceiptDetails';

export function ReceiptDashboard() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [receiptDetails, setReceiptDetails] = useState<Receipt | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [receiptToDelete, setReceiptToDelete] = useState<Receipt | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: receipts = [], isLoading, error } = useQuery<Receipt[], AxiosError | Error>({
    queryKey: ['receipts'],
    queryFn: getReceipts,
  });

  useEffect(() => {
    if (error) {
      let errorMessage = 'Failed to load receipts.';
      if (error instanceof AxiosError && error.response?.data) {
        errorMessage = (error.response.data as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    }
  }, [error, dispatch]);

  const deleteMutation = useMutation({
    mutationFn: deleteReceipt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      dispatch(showNotification({ message: 'Receipt deleted successfully!', type: 'success' }));
      setDeleteConfirmOpen(false);
      setReceiptToDelete(null);
    },
    onError: (err: AxiosError) => {
      const errorMessage = (err.response?.data as { message?: string })?.message || 'Failed to delete receipt.';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    },
  });

  const handleDeleteClick = (receipt: Receipt) => {
    setReceiptToDelete(receipt);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (receiptToDelete) {
      deleteMutation.mutate(receiptToDelete.id);
    }
  };

  const columns: ColumnDef<Receipt>[] = [
    {
      accessorKey: 'receipt_number',
      header: 'Receipt Number',
    },
    {
      accessorKey: 'sale_id',
      header: 'Sale ID',
    },
    {
      accessorKey: 'total_amount',
      header: 'Total Amount',
      cell: info => `$${info.getValue<number>().toFixed(2)}`,
    },
    {
      accessorKey: 'payment_method',
      header: 'Payment Method',
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: info => new Date(info.getValue<string>()).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Box>
          <Button 
            size="small" 
            sx={{ mr: 1 }} 
            onClick={() => setReceiptDetails(row.original)}
          >
            View Details
          </Button>
          <Button 
            size="small" 
            color="error" 
            onClick={() => handleDeleteClick(row.original)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const table = useReactTable({
    data: receipts,
    columns,
    state: {
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-full min-h-[calc(100vh-64px)]">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return null;
  }

  return (
    <Box className="p-4">
      <Typography variant="h4" gutterBottom>
        Receipt Management
      </Typography>
      
      <Box className="mb-4 flex justify-between items-center">
        <TextField
          label="Search receipts..."
          variant="outlined"
          size="small"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-1/3"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="flex justify-between items-center mt-4">
        <Button
          variant="outlined"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous Page
        </Button>
        <Typography variant="body2">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next Page
        </Button>
      </Box>

      {/* Receipt Details Dialog */}
      {receiptDetails && (
        <ReceiptDetails
          receipt={receiptDetails}
          open={!!receiptDetails}
          onClose={() => setReceiptDetails(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete receipt "{receiptToDelete?.receipt_number}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
