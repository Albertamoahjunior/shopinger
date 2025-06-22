import { DelivererDashboard } from '../features/deliverer/DelivererDashboard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/deliverer')({
  component: DelivererDashboard,
})

// export default Route;