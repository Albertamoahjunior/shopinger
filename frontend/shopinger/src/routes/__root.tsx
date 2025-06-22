import { createRootRoute, Outlet, redirect, useLocation, useRouter, RootRoute } from '@tanstack/react-router';
import type { BeforeLoadContextOptions } from '@tanstack/react-router';
import { store } from '../app/store';
import { Box, Container } from '@mui/material';
import { Header } from '../components/layout/Header';
import { NotificationSnackbar } from '../components/common/NotificationSnackbar';
import {Route as adminRoute}  from './admin';
import {Route as customerRoute} from './customer';
import {Route as tellerRoute} from './teller';
import {Route as delivererRoute} from './deliverer';
import { ErrorBoundary } from 'react-error-boundary';
import type { FallbackProps } from 'react-error-boundary';

// Define role-based default routes
const ROLE_DEFAULT_ROUTES = {
  admin: '/admin',
  teller: '/teller',
  deliverer: '/deliverer',
  customer: '/customer',
} as const;

// Define role-based access rules
const ROLE_PROTECTED_ROUTES: Record<string, string[]> = {
  '/admin': ['admin'],
  '/teller': ['teller'],
  '/deliverer': ['deliverer'],
  '/customer': ['customer'],
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/auth', '/register', '/'] as const;

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const router = useRouter();
  
  const handleReset = () => {
    // Clear any error state and navigate to a safe route
    resetErrorBoundary();
    router.navigate({ to: '/' });
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '50vh',
        p: 3
      }}
    >
      <div role="alert">
        <h2>Something went wrong</h2>
        <details style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>
          <summary>Error details</summary>
          {error.message}
        </details>
        <button onClick={handleReset} style={{ padding: '0.5rem 1rem' }}>
          Go to Home
        </button>
      </div>
    </Box>
  );
}

function getDefaultRouteForRole(role: string): string {
  return ROLE_DEFAULT_ROUTES[role as keyof typeof ROLE_DEFAULT_ROUTES] || '/customer';
}

function isRouteAccessible(pathname: string, userRole: string): boolean {
  // Check if the route requires specific roles
  for (const [route, allowedRoles] of Object.entries(ROLE_PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      return allowedRoles.includes(userRole);
    }
  }
  // If no specific role requirement found, allow access
  return true;
}

export const Route: RootRoute = createRootRoute({
  component: function RootComponent() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/auth' || location.pathname === '/register';

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {!isAuthPage && <Header />}
        <Container 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            py: isAuthPage ? 0 : 2,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <ErrorBoundary FallbackComponent={ErrorFallback}>
  <Outlet />
</ErrorBoundary>
        </Container>
        <NotificationSnackbar />
      </Box>
    );
  },
  beforeLoad: (
    ctx: BeforeLoadContextOptions<any, any, any, any, any>
  ) => {
    try {
      const { location } = ctx;
      const authState = store.getState().auth;
      const token = authState?.token;
      const user = authState?.user;
      const userRole = user?.profile?.role;

      const isAuthenticated = Boolean(token && token.trim() !== '');
      const isPublicRoute = PUBLIC_ROUTES.some(route => 
        location.pathname === route || location.pathname.startsWith(route)
      );

      // Handle unauthenticated users
      if (!isAuthenticated) {
        if (!isPublicRoute) {
          throw redirect({
            to: '/auth',
            search: {
              redirect: location.href,
            },
          });
        }
        return; // Allow access to public routes
      }

      // Handle authenticated users
      if (isAuthenticated && userRole) {
        // If user is on root path, redirect to their default route
        if (location.pathname === '/') {
          throw redirect({
            to: getDefaultRouteForRole(userRole),
          });
        }

        // Check role-based access for protected routes
        if (!isRouteAccessible(location.pathname, userRole)) {
          // Redirect to user's default route instead of generic '/'
          throw redirect({
            to: getDefaultRouteForRole(userRole),
          });
        }

        // Prevent authenticated users from accessing auth pages
        if (location.pathname === '/auth' || location.pathname === '/register') {
          throw redirect({
            to: getDefaultRouteForRole(userRole),
          });
        }
      } else if (isAuthenticated && !userRole) {
        // Edge case: authenticated but no role - redirect to auth
        throw redirect({
          to: '/auth',
        });
      }
    } catch (error) {
      // If there's an error accessing the store, redirect to auth
      if (error instanceof Error && !error.message.includes('redirect')) {
        console.error('Error in beforeLoad:', error);
        throw redirect({
          to: '/auth',
        });
      }
      // Re-throw redirect errors
      throw error;
    }
  },
});

// Add child routes after creating the root route
Route.addChildren([
  adminRoute,
  customerRoute,
  tellerRoute,
  delivererRoute,
]);
