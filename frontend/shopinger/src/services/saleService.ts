import api from '../api/axiosConfig';

export interface SaleItem {
  product_id: string;
  quantity: number;
  price_at_sale: number;
}

export interface CreateSalePayload {
  items: SaleItem[];
  total_amount: number;
  // Add other relevant fields like teller_id, customer_id (optional), etc.
}

export interface SaleResponse {
  message: string;
  saleId?: string; // Assuming a sale ID might be returned
  // Add other relevant fields from the successful response
}

export const createSale = async (payload: CreateSalePayload): Promise<SaleResponse> => {
  try {
    const response = await api.post('/sales', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating sale:', error);
    throw error;
  }
};

export interface Sale {
  id: string;
  total_amount: number;
  sale_date: string;
  customer_id?: number;
  teller_id?: number;
  items: SaleItem[];
}

export const getSales = async (): Promise<Sale[]> => {
  try {
    const response = await api.get('/sales');
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
};

export const getSaleById = async (id: string): Promise<Sale> => {
  try {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sale:', error);
    throw error;
  }
};
