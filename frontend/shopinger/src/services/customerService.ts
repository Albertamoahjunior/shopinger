import api from '../api/axiosConfig';
import type { User } from './authService';
import type { UserProfile } from './profileService';

// Define a type for an order item (adjust based on actual API response)
export interface OrderItem {
  order_id: string;
  product_name: string;
  quantity: number;
  price: number;
  order_date: string;
  status: string;
  customer_id?: number; // This will now refer to user.id
}

// Define a type for sale data from API
interface SaleData {
  sale_id?: string;
  id?: string;
  product_name?: string;
  quantity?: number;
  total_amount?: number;
  price?: number;
  sale_date?: string;
  created_at?: string;
  status?: string;
  customer_user_id?: number; // Changed from customer_id to customer_user_id
}

// Customer is now a User with a Profile
export type CustomerUser = User & {
  profile: UserProfile;
};

export const getCustomers = async (): Promise<CustomerUser[]> => {
  try {
    const response = await api.get('/users/role/CUSTOMER'); // Fetch users with role CUSTOMER
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const getCustomerById = async (id: number): Promise<CustomerUser> => {
  try {
    const response = await api.get(`/users/${id}`); // Fetch user by ID
    return response.data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
};

// Create customer will now use the unified register endpoint
export const createCustomer = async (customerData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string;
}): Promise<CustomerUser> => {
  try {
    const response = await api.post('/auth/register', { ...customerData, role: 'CUSTOMER' });
    return response.data.user; // The register endpoint returns { token, user, message }
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

// Update customer will now use the unified profile update endpoint
export const updateCustomer = async (userId: number, customerData: Partial<{
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}>): Promise<CustomerUser> => {
  try {
    // Update profile data
    const profileUpdate: Partial<UserProfile> = {
      first_name: customerData.first_name,
      last_name: customerData.last_name,
      phone_number: customerData.phone_number,
    };
    await api.put(`/profile/${userId}`, profileUpdate);

    // Optionally update user email if provided
    if (customerData.email) {
      await api.put(`/users/${userId}`, { email: customerData.email });
    }

    // Fetch the updated user to return the complete CustomerUser object
    const updatedUserResponse = await api.get(`/users/${userId}`);
    return updatedUserResponse.data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

// Delete customer will now deactivate the user
export const deleteCustomer = async (id: number): Promise<void> => {
  try {
    await api.delete(`/users/${id}`); // Deactivate user
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

// For customer orders, we'll use the sales endpoint
export const getCustomerOrders = async (customerId?: number): Promise<OrderItem[]> => {
  try {
    const response = await api.get('/sales');
    const sales = response.data;
    
    const orders: OrderItem[] = sales.map((sale: SaleData) => ({
      order_id: sale.sale_id || sale.id || '',
      product_name: sale.product_name || 'Unknown Product',
      quantity: sale.quantity || 1,
      price: sale.total_amount || sale.price || 0,
      order_date: sale.sale_date || sale.created_at || '',
      status: sale.status || 'completed',
      customer_id: sale.customer_user_id // Use customer_user_id from backend
    }));
    
    return customerId ? orders.filter(order => order.customer_id === customerId) : orders;
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    throw error;
  }
};
