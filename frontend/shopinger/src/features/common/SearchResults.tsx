import { Box, Typography, CircularProgress } from '@mui/material';
import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { searchInventory } from '../../services/inventoryService';
import { ProductCard } from '../customer/ProductCard';
import { showNotification } from '../notifications/notificationSlice';
import { useAppDispatch } from '../../app/hooks';
import { useEffect } from 'react';
import { AxiosError } from 'axios';

interface SearchParams {
  query?: string;
}

export function SearchResults() {
  const { query } = useParams<SearchParams>();
  const dispatch = useAppDispatch();

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['searchResults', query],
    queryFn: async () => {
      if (!query) return [];
      return searchInventory(query);
    },
    enabled: !!query,
  });

  useEffect(() => {
    if (error) {
      let errorMessage = 'Failed to perform search.';
      if (error instanceof AxiosError && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    }
  }, [error, dispatch]);

  if (!query) {
    return (
      <Box className="p-4 text-center">
        <Typography variant="h5" gutterBottom>Enter a search term to find products.</Typography>
      </Box>
    );
  }

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
        Search Results for "{query}"
      </Typography>
      {searchResults && searchResults.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
          {searchResults.map((item) => (
            <ProductCard key={item.product_id} item={item} />
          ))}
        </Box>
      ) : (
        <Typography variant="body1" className="text-center mt-8">No products found matching your search.</Typography>
      )}
    </Box>
  );
}
