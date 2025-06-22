import { TellerDashboard } from '../features/teller/TellerDashboard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/teller')({
  component: TellerDashboard,
})

// export default Route;