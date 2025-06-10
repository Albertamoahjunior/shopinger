import { createFileRoute } from '@tanstack/react-router';
import { CartView } from '../features/customer/CartView';

export const Route = createFileRoute('/cart')({
  component: CartView,
});
