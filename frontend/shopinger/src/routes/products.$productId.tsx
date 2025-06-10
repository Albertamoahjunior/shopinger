import { createFileRoute } from '@tanstack/react-router';
import { ProductDetails } from '../features/customer/ProductDetails';

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetails,
});
