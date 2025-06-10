import { createFileRoute } from '@tanstack/react-router';
import { SearchResults } from '../features/common/SearchResults';

export const Route = createFileRoute('/search')({
  component: SearchResults,
  validateSearch: (search: { query?: string }) => {
    return {
      query: search.query || '',
    };
  },
});
