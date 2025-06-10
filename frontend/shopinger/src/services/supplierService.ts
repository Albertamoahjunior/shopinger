import api from '../api/axiosConfig';

export interface Supplier {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  tel_number: string;
  company_name?: string;
  address?: string;
}

export const getSuppliers = async (): Promise<Supplier[]> => {
  try {
    const response = await api.get('/suppliers');
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
};

export const getSupplierById = async (id: number): Promise<Supplier> => {
  try {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching supplier:', error);
    throw error;
  }
};

export const createSupplier = async (supplier: Omit<Supplier, 'id'>): Promise<Supplier> => {
  try {
    const response = await api.post('/suppliers', supplier);
    return response.data;
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
};

export const updateSupplier = async (id: number, supplier: Partial<Supplier>): Promise<Supplier> => {
  try {
    const response = await api.put(`/suppliers/${id}`, supplier);
    return response.data;
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw error;
  }
};

export const deleteSupplier = async (id: number): Promise<void> => {
  try {
    await api.delete(`/suppliers/${id}`);
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw error;
  }
};
