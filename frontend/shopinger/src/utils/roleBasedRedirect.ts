export const getRedirectRoute = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'customer':
      return '/customer';
    case 'teller':
      return '/teller';
    case 'deliverer':
      return '/deliverer';
    default:
      return '/';
  }
};
