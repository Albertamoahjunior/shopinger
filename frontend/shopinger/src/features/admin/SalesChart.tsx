import { useQuery } from '@tanstack/react-query';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../notifications/notificationSlice';
import { useEffect } from 'react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface SalesDataPoint {
  date: string;
  totalSales: number;
}

export function SalesChart() {
  const dispatch = useAppDispatch();

  // For now, we'll use mock data since we need to implement getSales from saleService
  // TODO: Replace with actual sales data from API
  const { data: salesData, isLoading, error } = useQuery<SalesDataPoint[]>({
    queryKey: ['salesData'],
    queryFn: async (): Promise<SalesDataPoint[]> => {
      // Mock data for now - replace with actual API call
      return [
        { date: '2024-01-01', totalSales: 1200 },
        { date: '2024-01-02', totalSales: 1500 },
        { date: '2024-01-03', totalSales: 1100 },
        { date: '2024-01-04', totalSales: 1800 },
        { date: '2024-01-05', totalSales: 2000 },
        { date: '2024-01-06', totalSales: 1700 },
        { date: '2024-01-07', totalSales: 2200 },
      ];
    },
  });

  useEffect(() => {
    if (error) {
      const errorMessage = error.message || 'Failed to load sales data.';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    }
  }, [error, dispatch]);

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

  if (!salesData || salesData.length === 0) {
    return (
      <Box className="p-4 text-center">
        <Typography variant="h6">No sales data available.</Typography>
      </Box>
    );
  }

  const chartLabels = salesData.map(data => data.date);
  const chartValues = salesData.map(data => data.totalSales);

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Total Sales',
        data: chartValues,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Sales Over Time',
      },
    },
  };

  return (
    <Box className="mt-8 p-4 border rounded-lg shadow-md">
      <Typography variant="h5" gutterBottom>
        Sales Analytics
      </Typography>
      <Line data={data} options={options} />
    </Box>
  );
}
