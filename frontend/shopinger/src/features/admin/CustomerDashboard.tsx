import { useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomers, deleteCustomer, type CustomerUser } from '../../services/customerService'; // Use CustomerUser
import { Box, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { AxiosError } from 'axios';
import { CreateCustomer } from './CreateCustomer';
import { EditCustomer } from './EditCustomer';

export function CustomerDashboard() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [editCustomer, setEditCustomer] = useState<CustomerUser | null>(null); // Use CustomerUser
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerUser | null>(null); // Use CustomerUser
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: customers = [], isLoading, error } = useQuery<CustomerUser[], AxiosError | Error>({ // Use CustomerUser
    queryKey: ['customers'],
    queryFn: getCustomers,
  });

  useEffect(() => {
    if (error) {
      let errorMessage = 'Failed to load customers.';
      if (error instanceof AxiosError && error.response?.data) {
        errorMessage = (error.response.data as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    }
  }, [error, dispatch]);

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      dispatch(showNotification({ message: 'Customer deactivated successfully!', type: 'success' })); // Changed message
      setDeleteConfirmOpen(false);
      setCustomerToDelete(null);
    },
    onError: (err: AxiosError) => {
      const errorMessage = (err.response?.data as { message?: string })?.message || 'Failed to deactivate customer.'; // Changed message
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    },
  });

  const handleDeleteClick = (customer: CustomerUser) => { // Use CustomerUser
    setCustomerToDelete(customer);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      deleteMutation.mutate(customerToDelete.id);
    }
  };

  const columns: ColumnDef<CustomerUser>[] = [ // Use CustomerUser
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorFn: row => row.profile.first_name, // Access from profile
      id: 'first_name',
      header: 'First Name',
    },
    {
      accessorFn: row => row.profile.last_name, // Access from profile
      id: 'last_name',
      header: 'Last Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorFn: row => row.profile.phone_number, // Access from profile
      id: 'phone_number',
      header: 'Phone',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Box>
          <Button 
            size="small" 
            sx={{ mr: 1 }} 
            onClick={() => setEditCustomer(row.original)}
          >
            Edit
          </Button>
          <Button 
            size="small" 
            color="error" 
            onClick={() => handleDeleteClick(row.original)}
          >
            Deactivate {/* Changed from Delete */}
          </Button>
        </Box>
      ),
    },
  ];

  const table = useReactTable({
    data: customers,
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
        Customer Management
      </Typography>
      
      <Box className="mb-4 flex justify-between items-center">
        <TextField
          label="Search customers..."
          variant="outlined"
          size="small"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-1/3"
        />
        <CreateCustomer />
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

      {/* Edit Customer Dialog */}
      {editCustomer && (
        <EditCustomer
          customer={editCustomer}
          open={!!editCustomer}
          onClose={() => setEditCustomer(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Deactivation</DialogTitle> {/* Changed title */}
        <DialogContent>
          <Typography>
            Are you sure you want to deactivate customer "{customerToDelete?.profile.first_name} {customerToDelete?.profile.last_name}"? {/* Access from profile */}
            This action will set the user as inactive.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <CircularProgress size={20} /> : 'Deactivate'} {/* Changed button text */}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
