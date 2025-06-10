import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAppSelector } from '../app/hooks';
import { selectCurrentUser } from '../features/auth/authSlice';
import { CustomerDashboard } from '../features/customer/CustomerDashboard';
import { AdminDashboard } from '../features/admin/AdminDashboard';
import { TellerDashboard } from '../features/teller/TellerDashboard';
import { DelivererDashboard } from '../features/deliverer/DelivererDashboard';
//import { ProductDetails } from '../features/customer/ProductDetails'; // Import ProductDetails

function RoleBasedRedirect() {
  const { role } = useAppSelector(selectCurrentUser);

  switch (role) {
    case 'admin':
      return <AdminDashboard />;
    case 'teller':
      return <TellerDashboard />;
    case 'deliverer':
      return <DelivererDashboard />;
    case 'customer':
      return <CustomerDashboard />;
    default:
      // If for some reason there's no role, redirect to auth
      throw redirect({ to: '/auth' });
  }
}

export const Route = createFileRoute('/')({
  component: RoleBasedRedirect,
});
