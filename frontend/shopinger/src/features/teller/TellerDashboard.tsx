import React, { useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, type ColumnDef } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInventory, type InventoryItem } from '../../services/inventoryService';
import { Box, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { createSale, type SaleResponse, type CreateSalePayload } from '../../services/saleService';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { AxiosError } from 'axios';
import { getTellers, deleteTeller, type Teller } from '../../services/tellerService';
import { CreateTeller } from './CreateTeller';
import { EditTeller } from './EditTeller';

interface SaleCartItem extends InventoryItem {
  saleQuantity: number;
}

// interface Props {}

export function TellerDashboard() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [saleItems, setSaleItems] = useState<SaleCartItem[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [editTeller, setEditTeller] = useState<Teller | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tellerToDelete, setTellerToDelete] = useState<Teller | null>(null);

  const { data: inventory = [], isLoading: inventoryLoading, error: inventoryError } = useQuery<InventoryItem[], AxiosError | Error>({
    queryKey: ['inventory'],
    queryFn: getInventory,
  });

  const { data: tellers = [], isLoading: tellersLoading, error: tellersError } = useQuery<Teller[], AxiosError | Error>({
    queryKey: ['tellers'],
    queryFn: getTellers,
  });

  useEffect(() => {
    if (inventoryError) {
      let errorMessage = 'Failed to load inventory.';
      if (inventoryError instanceof AxiosError && inventoryError.response?.data) {
        errorMessage = (inventoryError.response.data as { message: string }).message;
      } else if (inventoryError instanceof Error) {
        errorMessage = inventoryError.message;
      }
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    }
  }, [inventoryError, dispatch]);

  useEffect(() => {
    if (tellersError) {
      let errorMessage = 'Failed to load tellers.';
      if (tellersError instanceof AxiosError && tellersError.response?.data) {
        errorMessage = (tellersError.response.data as { message: string }).message;
      } else if (tellersError instanceof Error) {
        errorMessage = tellersError.message;
      }
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    }
  }, [tellersError, dispatch]);

  const createSaleMutation = useMutation<SaleResponse, AxiosError, CreateSalePayload>({
    mutationFn: createSale,
    onSuccess: (data: SaleResponse) => {
      dispatch(showNotification({ message: data.message || 'Sale created successfully!', type: 'success' }));
      setSaleItems([]);
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (err: AxiosError) => {
      const errorMessage = ((err.response?.data as { message?: string })?.message) || 'Failed to create sale.';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeller,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tellers'] });
      dispatch(showNotification({ message: 'Teller deleted successfully!', type: 'success' }));
      setDeleteConfirmOpen(false);
      setTellerToDelete(null);
    },
    onError: (err: AxiosError) => {
      const errorMessage = (err.response?.data as { message?: string })?.message || 'Failed to delete teller.';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    },
  });

  const addToSale = (item: InventoryItem) => {
    setSaleItems((prevItems) => {
      const existingItem = prevItems.find((saleItem) => saleItem.product_id === item.product_id);
      if (existingItem) {
        const inventoryQty = inventory.find(inv => inv.product_id === item.product_id)?.product_qty || 0;
        if (existingItem.saleQuantity < inventoryQty) {
          return prevItems.map((saleItem) =>
            saleItem.product_id === item.product_id
              ? { ...saleItem, saleQuantity: saleItem.saleQuantity + 1 }
              : saleItem
          );
        } else {
          dispatch(showNotification({ message: `Cannot add more ${item.product_name}. Max quantity reached.`, type: 'warning' }));
          return prevItems;
        }
      } else {
        if (item.product_qty > 0) {
          return [...prevItems, { ...item, saleQuantity: 1 }];
        } else {
          dispatch(showNotification({ message: `${item.product_name} is out of stock.`, type: 'warning' }));
          return prevItems;
        }
      }
    });
  };

  const handleSaleIncrement = (id: string) => {
    setSaleItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product_id === id) {
          const inventoryQty = inventory.find(inv => inv.product_id === id)?.product_qty || 0;
          if (item.saleQuantity < inventoryQty) {
            return { ...item, saleQuantity: item.saleQuantity + 1 };
          } else {
            dispatch(showNotification({ message: `Cannot add more ${item.product_name}. Max quantity reached.`, type: 'warning' }));
          }
        }
        return item;
      })
    );
  };

  const handleSaleDecrement = (id: string) => {
    setSaleItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id === id && item.saleQuantity > 1
          ? { ...item, saleQuantity: item.saleQuantity - 1 }
          : item
      ).filter(item => item.saleQuantity > 0)
    );
  };

  const handleRemoveFromSale = (id: string) => {
    setSaleItems((prevItems) => prevItems.filter((item) => item.product_id !== id));
    dispatch(showNotification({ message: 'Item removed from sale cart.', type: 'info' }));
  };

  const calculateSaleTotal = () => {
    return saleItems.reduce((total, item) => total + item.product_price * item.saleQuantity, 0);
  };

  const handleProcessSale = () => {
    if (saleItems.length === 0) {
      dispatch(showNotification({ message: 'Sale cart is empty. Add items to proceed.', type: 'warning' }));
      return;
    }

    const payload = {
      items: saleItems.map(item => ({
        product_id: item.product_id,
        quantity: item.saleQuantity,
        price_at_sale: item.product_price,
      })),
      total_amount: calculateSaleTotal(),
    };
    createSaleMutation.mutate(payload);
  };

  const handleTellerDeleteClick = (teller: Teller) => {
    setTellerToDelete(teller);
    setDeleteConfirmOpen(true);
  };

  const handleTellerDeleteConfirm = () => {
    if (tellerToDelete) {
      deleteMutation.mutate(tellerToDelete.id);
    }
  };

  const table = useReactTable({
    data: inventory,
    columns: [
      {
        accessorKey: 'product_name',
        header: 'Product Name',
      },
      {
        accessorKey: 'product_price',
        header: 'Price',
        cell: info => `$${info.getValue<number>().toFixed(2)}`,
      },
      {
        accessorKey: 'product_qty',
        header: 'Available Quantity',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button size="small" variant="contained" onClick={() => addToSale(row.original)}>
            Add to Sale
          </Button>
        ),
      },
    ],
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const tellerColumns: ColumnDef<Teller>[] = [
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
      accessorKey: 'employee_id',
      header: 'Employee ID',
    },
    {
      accessorKey: 'shift',
      header: 'Shift',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: any }) => (
        <Box>
          <Button size="small" sx={{ mr: 1 }} onClick={() => setEditTeller(row.original)}>Edit</Button>
          <Button size="small" color="error" onClick={() => handleTellerDeleteClick(row.original)}>Delete</Button>
        </Box>
      ),
    },
  ];

  const tellerTable = useReactTable({
    data: tellers,
    columns: tellerColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const isLoading = inventoryLoading || tellersLoading;
  const error = inventoryError || tellersError;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Failed to load data.</Typography>;
  }

  return (
    <Box className="p-4">
      <Typography variant="h4" gutterBottom>
        Point of Sale
      </Typography>
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Inventory Table */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Available Products
          </Typography>
          <TextField
            label="Search products..."
            variant="outlined"
            size="small"
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="mb-4 w-full"
          />
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
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
        </Box>

        {/* Right Column: Sale Cart */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Sale Cart
          </Typography>
          {saleItems.length === 0 ? (
            <Typography variant="body1" className="text-center text-gray-500">
              No items in sale cart. Add products from the left.
            </Typography>
          ) : (
            <List>
              {saleItems.map((item) => (
                <React.Fragment key={item.product_id}>
                  <ListItem className="flex items-center justify-between py-2">
                    <ListItemText
                      primary={item.product_name}
                      secondary={`$${item.product_price.toFixed(2)} x ${item.saleQuantity}`}
                      className="flex-grow"
                    />
                    <Box className="flex items-center">
                      <IconButton size="small" onClick={() => handleSaleDecrement(item.product_id)} disabled={item.saleQuantity <= 1}>
                        <RemoveIcon />
                      </IconButton>
                      <Typography variant="body1" className="mx-2">{item.saleQuantity}</Typography>
                      <IconButton size="small" onClick={() => handleSaleIncrement(item.product_id)}>
                        <AddIcon />
                      </IconButton>
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFromSale(item.product_id)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </Box>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
          <Box className="mt-4 p-4 border-t border-gray-300 flex justify-between items-center">
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">${calculateSaleTotal().toFixed(2)}</Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
            onClick={handleProcessSale}
            disabled={saleItems.length === 0 || createSaleMutation.isPending}
          >
            {createSaleMutation.isPending ? <CircularProgress size={24} /> : 'Process Sale'}
          </Button>
        </Box>
      </Box>

      <Typography variant="h5" gutterBottom className="mt-8">
        Teller Management
      </Typography>

      <Box className="mb-4 flex justify-between items-center">
        <CreateTeller />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {tellerTable.getHeaderGroups().map(headerGroup => (
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
            {tellerTable.getRowModel().rows.map(row => (
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

      {editTeller && (
        <EditTeller
          teller={editTeller}
          open={!!editTeller}
          onClose={() => setEditTeller(null)}
        />
      )}

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete teller "{tellerToDelete?.first_name} {tellerToDelete?.last_name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleTellerDeleteConfirm} 
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