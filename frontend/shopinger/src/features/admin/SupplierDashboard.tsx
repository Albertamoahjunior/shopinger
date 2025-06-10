import { useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSuppliers, deleteSupplier, type Supplier } from '../../services/supplierService';
import { Box, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { AxiosError } from 'axios';
import { CreateSupplier } from './CreateSupplier';
import { EditSupplier } from './EditSupplier';

export function SupplierDashboard() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: suppliers = [], isLoading, error } = useQuery<Supplier[], AxiosError | Error>({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
  });

  useEffect(() => {
    if (error) {
      let errorMessage = 'Failed to load suppliers.';
      if (error instanceof AxiosError && error.response?.data) {
        errorMessage = (error.response.data as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    }
  }, [error, dispatch]);

  const deleteMutation = useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      dispatch(showNotification({ message: 'Supplier deleted successfully!', type: 'success' }));
      setDeleteConfirmOpen(false);
      setSupplierToDelete(null);
    },
    onError: (err: AxiosError) => {
      const errorMessage = (err.response?.data as { message?: string })?.message || 'Failed to delete supplier.';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    },
  });

  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (supplierToDelete) {
      deleteMutation.mutate(supplierToDelete.id);
    }
  };

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: 'first_name',
      header: 'First Name',
    },
    {
      accessorKey: 'last_name',
      header: 'Last Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'tel_number',
      header: 'Phone',
    },
    {
      accessorKey: 'company_name',
      header: 'Company',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Box>
          <Button 
            size="small" 
            sx={{ mr: 1 }} 
            onClick={() => setEditSupplier(row.original)}
          >
            Edit
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
    data: suppliers,
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
        Supplier Management
      </Typography>
      
      <Box className="mb-4 flex justify-between items-center">
        <TextField
          label="Search suppliers..."
          variant="outlined"
          size="small"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-1/3"
        />
        <CreateSupplier />
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

      {/* Edit Supplier Dialog */}
      {editSupplier && (
        <EditSupplier
          supplier={editSupplier}
          open={!!editSupplier}
          onClose={() => setEditSupplier(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete supplier "{supplierToDelete?.first_name} {supplierToDelete?.last_name}"?
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
