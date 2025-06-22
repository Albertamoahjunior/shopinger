import { AppBar, Toolbar, Typography, Box, IconButton, Badge, InputBase } from '@mui/material'; // Import InputBase
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search'; // Import SearchIcon
import { useAppSelector } from '../../app/hooks';
import { selectCartItems } from '../../features/customer/cartSlice';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { Link, useNavigate } from '@tanstack/react-router'; // Import Link and useNavigate
import { useState } from 'react'; // Import useState

export function Header() {
  const cartItems = useAppSelector(selectCartItems);
  const totalItems = cartItems.reduce((total, item) => total + item.qty, 0);
  const user = useAppSelector(selectCurrentUser);
  const role = user?.profile?.role;
  const navigate = useNavigate(); // Initialize useNavigate
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/search', search: { query: searchQuery.trim() } }); // Navigate to search results page
    }
  };

  return (
    <AppBar position="static" className="mb-0">
      <Toolbar className="flex justify-between items-center px-4 py-2">
        <Typography variant="h6" component="div">
          Shopinger
        </Typography>
        <Box className="flex items-center space-x-4">
          {/* Global Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative rounded-md bg-gray-100 text-gray-900 flex items-center">
            <SearchIcon className="ml-2 text-gray-500" />
            <InputBase
              placeholder="Search..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 flex-1 py-1 pr-2"
            />
          </form>

          {role === 'customer' && (
            <Link to="/cart" className="no-underline text-inherit">
              <IconButton color="inherit">
                <Badge badgeContent={totalItems} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Link>
          )}
          {/* Add other role-specific elements here */}
          {role === 'admin' && (
            <Typography variant="body1" color="inherit">
              Admin Links
            </Typography>
          )}
          {/* Example for other roles */}
          {role === 'teller' && (
            <Typography variant="body1" color="inherit">
              Teller Dashboard
            </Typography>
          )}
          {role === 'deliverer' && (
            <Typography variant="body1" color="inherit">
              Deliverer Tasks
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
