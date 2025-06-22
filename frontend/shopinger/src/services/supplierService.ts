import api from '../api/axiosConfig';
import type { CustomerUser } from './customerService';

export const getSuppliers = async (): Promise<CustomerUser[]> => {
  try {
    const response = await api.get('/users/role/SUPPLIER_CONTACT');
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
};

export const createSupplier = async (supplierData: {
  first_name: string;
  last_name: string;
  email: string;
  password?: string; // Password can be optional for OAuth or if set by admin later
  phone_number?: string;
  // Add any other relevant fields for a supplier contact
}): Promise<CustomerUser> => { // Reusing CustomerUser type for now, might need a specific SupplierUser type
  try {
    const response = await api.post('/workers', {
      ...supplierData,
      role: 'SUPPLIER_CONTACT', // Ensure the role is set correctly
    });
    return response.data;
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
};

export const updateSupplier = async (id: number, supplierData: Partial<{
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  // Add any other relevant fields for a supplier contact that can be updated
}>): Promise<CustomerUser> => { // Reusing CustomerUser type for now
  try {
    const response = await api.put(`/workers/${id}`, supplierData);
    return response.data;
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw error;
  }
};

export const deleteSupplier = async (id: number): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw error;
  }
};
