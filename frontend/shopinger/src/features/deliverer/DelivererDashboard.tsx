import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDeliverers, updateDeliverer, getDelivererById } from '../../services/deliveryService'; // Import getDelivererById
import type { DelivererUser } from '../../services/deliveryService';
import { Box, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { type UseMutationResult } from '@tanstack/react-query';

interface TableMeta {
  updateStatusMutation: UseMutationResult<DelivererUser, AxiosError, { id: number; status: 'pending' | 'out for delivery' | 'delivered' }, unknown>;
}

export function DelivererDashboard() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation<DelivererUser, AxiosError, { id: number; status: 'pending' | 'out for delivery' | 'delivered' }>({
    mutationFn: async ({ id, status }) => {
      const currentDeliverer = await getDelivererById(id);
      const updatedProfileData = {
        ...currentDeliverer.profile.profile_data,
        status: status,
      };
      return updateDeliverer(id, { profile_data: updatedProfileData });
    },
    onSuccess: (data) => {
      dispatch(showNotification({ message: `Deliverer ${data.profile.first_name} ${data.profile.last_name} status updated to ${data.profile.profile_data?.status}!`, type: 'success' }));
      queryClient.invalidateQueries({ queryKey: ['deliverers'] });
    },
    onError: (err: AxiosError) => {
      const errorMessage = (err.response?.data as { message?: string })?.message || 'Failed to update deliverer status.';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    },
  });

  const columns: ColumnDef<DelivererUser>[] = [
    {
      accessorFn: row => row.profile.first_name,
      id: 'first_name',
      header: 'First Name',
    },
    {
      accessorFn: row => row.profile.last_name,
      id: 'last_name',
      header: 'Last Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorFn: row => row.profile.phone_number,
      id: 'phone_number',
      header: 'Phone',
    },
    {
      accessorFn: row => row.profile.profile_data?.vehicle_type,
      id: 'vehicle_type',
      header: 'Vehicle Type',
    },
    {
      accessorFn: row => row.profile.profile_data?.status,
      id: 'status',
      header: 'Status',
      cell: info => {
        const status = info.getValue<'pending' | 'out for delivery' | 'delivered'>();
        if (!status) return <Chip label="UNKNOWN" color="default" size="small" />;
        
        let color: 'default' | 'warning' | 'success' = 'default';
        if (status === 'out for delivery') color = 'warning';
        if (status === 'delivered') color = 'success';
        return <Chip label={status.toUpperCase()} color={color} size="small" />;
      },
    },
    {
      id: 'actions',
      header: 'Update Status',
      cell: ({ row, table }) => {
        const { updateStatusMutation: { mutate, isPending } } = table.options.meta as TableMeta;
        const currentStatus = row.original.profile.profile_data?.status;

        return (
          <Box>
            <Button
              size="small"
              onClick={() => mutate({ id: row.original.id, status: 'out for delivery' })}
              disabled={currentStatus === 'out for delivery' || currentStatus === 'delivered' || isPending}
            >
              Out for Delivery
            </Button>
            <Button
              size="small"
              sx={{ ml: 1 }}
              onClick={() => mutate({ id: row.original.id, status: 'delivered' })}
              disabled={currentStatus === 'delivered' || isPending}
            >
              Delivered
            </Button>
          </Box>
        );
      },
    },
  ];

  const { data: deliverers = [], isLoading, error } = useQuery<DelivererUser[], AxiosError | Error>({
    queryKey: ['deliverers'],
    queryFn: getDeliverers,
  });

  useEffect(() => {
    if (error) {
      let errorMessage = 'Failed to load deliveries.';
      if (error instanceof AxiosError && error.response?.data) {
        errorMessage = (error.response.data as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    }
  }, [error, dispatch]);

  const table = useReactTable({
    data: deliverers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateStatusMutation: updateStatusMutation,
    } as TableMeta,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Failed to load deliverers.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Deliverer Management
      </Typography>
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
    </Box>
  );
}
