import { createRootRoute, Outlet, redirect, useLocation } from '@tanstack/react-router';
import { store } from '../app/store';
import { Box, Container } from '@mui/material';
import { Header } from '../components/layout/Header';
import { NotificationSnackbar } from '../components/common/NotificationSnackbar';

export const Route = createRootRoute({
  component: function RootComponent() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/auth';

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '100vh' }}>
        {!isAuthPage && <Header />}
        <Container component="main" sx={{ flexGrow: 1 }}>
          <Outlet />
        </Container>
        <NotificationSnackbar />
      </Box>
    );
  },
  beforeLoad: ({ location }) => {
    const { token, role } = store.getState().auth;
    const isAuthenticated = !!token;
    const userRole = role;

    // Define role-based access rules
    const roleProtectedRoutes: Record<string, string[]> = {
      '/admin': ['admin'],
      '/teller': ['teller'],
      '/deliverer': ['deliverer'],
      // Add other role-protected routes here
    };

    // Check authentication
    if (!isAuthenticated && location.pathname !== '/auth') {
      throw redirect({
        to: '/auth',
        search: {
          redirect: location.href,
        },
      });
    }

    // Check role-based access for authenticated users
    if (isAuthenticated) {
      for (const pathPrefix in roleProtectedRoutes) {
        if (location.pathname.startsWith(pathPrefix)) {
          const allowedRoles = roleProtectedRoutes[pathPrefix];
          if (!userRole || !allowedRoles.includes(userRole)) {
            // Redirect to a forbidden page or dashboard if role is not allowed
            throw redirect({
              to: '/', // Redirect to home or a specific forbidden page
              // You might want to add a notification here
            });
          }
        }
      }
    }
  },
});
