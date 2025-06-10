import { createFileRoute } from '@tanstack/react-router';
import { AuthPage } from '../features/auth/AuthPage';

export const Route = createFileRoute('/auth')({
  component: AuthPage,
});