import api from '../api/axiosConfig';

export interface Receipt {
  id: number;
  sale_id: number;
  receipt_number: string;
  total_amount: number;
  tax_amount?: number;
  discount_amount?: number;
  payment_method: string;
  created_at: string;
  customer_id?: number;
  teller_id?: number;
}

export interface ReceiptItem {
  id: number;
  receipt_id: number;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export const getReceipts = async (): Promise<Receipt[]> => {
  try {
    const response = await api.get('/reciepts');
    return response.data;
  } catch (error) {
    console.error('Error fetching receipts:', error);
    throw error;
  }
};

export const getReceiptById = async (id: number): Promise<Receipt> => {
  try {
    const response = await api.get(`/reciepts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching receipt:', error);
    throw error;
  }
};

export const createReceipt = async (receipt: Omit<Receipt, 'id' | 'created_at'>): Promise<Receipt> => {
  try {
    const response = await api.post('/reciepts', receipt);
    return response.data;
  } catch (error) {
    console.error('Error creating receipt:', error);
    throw error;
  }
};

export const updateReceipt = async (id: number, receipt: Partial<Receipt>): Promise<Receipt> => {
  try {
    const response = await api.put(`/reciepts/${id}`, receipt);
    return response.data;
  } catch (error) {
    console.error('Error updating receipt:', error);
    throw error;
  }
};

export const deleteReceipt = async (id: number): Promise<void> => {
  try {
    await api.delete(`/reciepts/${id}`);
  } catch (error) {
    console.error('Error deleting receipt:', error);
    throw error;
  }
};

export const getReceiptsBySaleId = async (saleId: number): Promise<Receipt[]> => {
  try {
    const response = await api.get(`/reciepts?sale_id=${saleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching receipts by sale ID:', error);
    throw error;
  }
};

export const getReceiptsByCustomerId = async (customerId: number): Promise<Receipt[]> => {
  try {
    const response = await api.get(`/reciepts?customer_id=${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching receipts by customer ID:', error);
    throw error;
  }
};
