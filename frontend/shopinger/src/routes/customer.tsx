import { CustomerDashboard } from '../features/customer/CustomerDashboard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customer')({
  component: CustomerDashboard,
})

// export default Route;
