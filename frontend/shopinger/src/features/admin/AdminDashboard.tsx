import { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import type { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInventory, deleteInventoryItem } from '../../services/inventoryService';
import type { InventoryItem } from '../../services/inventoryService';
import { Box, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import { CreateInventoryItem } from './CreateInventoryItem';
import { EditInventoryItem } from './EditInventoryItem';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { AxiosError } from 'axios';
import { SalesChart } from './SalesChart';
import { SupplierDashboard } from './SupplierDashboard';
import { CustomerDashboard } from './CustomerDashboard';
import { ReceiptDashboard } from './ReceiptDashboard';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: inventory = [], isLoading, error } = useQuery<InventoryItem[], AxiosError | Error>({
    queryKey: ['inventory'],
    queryFn: getInventory,
  });

  useEffect(() => {
    if (error) {
      let errorMessage = 'Failed to load inventory.';
      
      if (error instanceof AxiosError && error.response?.data) {
        errorMessage = (error.response.data as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    }
  }, [error, dispatch]);

  const deleteMutation = useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      dispatch(showNotification({ message: 'Item deleted successfully!', type: 'success' }));
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => { // Use AxiosError for better typing
      const errorMessage = err.response?.data?.message || 'Failed to delete item.';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    },
  });

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: 'product_name',
      header: 'Product Name',
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      accessorKey: 'prod_desc',
      header: 'Description',
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      accessorKey: 'product_price',
      header: 'Price',
      cell: info => `$${info.getValue<number>().toFixed(2)}`,
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      accessorKey: 'product_qty',
      header: 'Quantity',
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      accessorKey: 'supplier_id',
      header: 'Supplier ID',
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      accessorKey: 'prod_spec',
      header: 'Product Specification',
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Box>
          <Button size="small" sx={{ mr: 1 }} onClick={() => setEditItem(row.original)}>Edit</Button>
          <Button size="small" color="error" onClick={() => deleteMutation.mutate(row.original.product_id)}>Delete</Button>
        </Box>
      ),
    },
  ];

  const table = useReactTable({
    data: inventory,
    columns,
    state: {
      globalFilter,
      pagination,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
        Admin Dashboard
      </Typography>

      <SalesChart />

      <Typography variant="h5" gutterBottom className="mt-8">
        Inventory Management
      </Typography>
      <Box className="mb-4 flex justify-between items-center">
        <TextField
          label="Search inventory..."
          variant="outlined"
          size="small"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-1/3"
        />
        <CreateInventoryItem />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
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
      {editItem && (
        <EditInventoryItem
          item={editItem}
          open={!!editItem}
          onClose={() => setEditItem(null)}
        />
      )}

      <Typography variant="h5" gutterBottom className="mt-8">
        Supplier Management
      </Typography>
      <SupplierDashboard />

      <Typography variant="h5" gutterBottom className="mt-8">
        Customer Management
      </Typography>
      <CustomerDashboard />

       <Typography variant="h5" gutterBottom className="mt-8">
        Receipt Management
      </Typography>
      <ReceiptDashboard />
    </Box>
  );
}
