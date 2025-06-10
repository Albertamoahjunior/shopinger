import axios from '../api/axiosConfig';

export interface InventoryItem {
  product_id: string;
  product_name: string;
  prod_desc: string;
  product_price: number;
  product_qty: number;
  supplier_id: number;
  prod_spec?: string;
  imageUrl?: string;
}

export const getInventory = async (): Promise<InventoryItem[]> => {
  const response = await axios.get('/inventory/all');
  return response.data;
};

export const getInventoryItemById = async (id: string): Promise<InventoryItem | undefined> => {
  const response = await axios.get(`/inventory/prod/${id}`);
  return response.data;
};

export const createInventoryItem = async (item: Omit<InventoryItem, 'product_id'>): Promise<InventoryItem> => {
  const response = await axios.post('/inventory', item);
  return response.data;
};

export const updateInventoryItem = async (item: InventoryItem): Promise<InventoryItem> => {
  const response = await axios.put(`/inventory/${item.product_id}`, item);
  return response.data;
};

export const deleteInventoryItem = async (id: string): Promise<void> => {
  await axios.delete(`/inventory/${id}`);
};

export const searchInventory = async (query: string): Promise<InventoryItem[]> => {
  const response = await axios.get(`/inventory/search/${query}`);
  return response.data;
};
