import { useQuery } from '@tanstack/react-query';
import { getCustomerOrders, type OrderItem } from '../../services/customerService';
import { Box, CircularProgress, Typography } from '@mui/material';
import { type ColumnDef } from '@tanstack/react-table';
import { TanStackTable } from '../../components/table/TanStackTable';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { useEffect } from 'react';

export function OrderHistory() {
  const dispatch = useAppDispatch();

  const { data: orders, isLoading, error } = useQuery<OrderItem[]>({
    queryKey: ['customerOrders'],
    queryFn: getCustomerOrders,
  });

  useEffect(() => {
    if (error) {
      const errorMessage = error.message || 'Failed to load order history.';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    }
  }, [error, dispatch]);

  const columns: ColumnDef<OrderItem>[] = [
    {
      accessorKey: 'order_id',
      header: 'Order ID',
    },
    {
      accessorKey: 'product_name',
      header: 'Product',
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: (info) => `$${info.getValue<number>().toFixed(2)}`,
    },
    {
      accessorKey: 'order_date',
      header: 'Order Date',
      cell: (info) => new Date(info.getValue<string>()).toLocaleDateString(),
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
  ];

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-full min-h-[200px]">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return null; // Notification will handle the error display
  }

  if (!orders || orders.length === 0) {
    return (
      <Box className="p-4 text-center">
        <Typography variant="h6">No order history found.</Typography>
      </Box>
    );
  }

  return (
    <Box className="mt-8">
      <Typography variant="h5" gutterBottom>
        Your Order History
      </Typography>
      <TanStackTable data={orders} columns={columns} />
    </Box>
  );
}
