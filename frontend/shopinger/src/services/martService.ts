import axios from '../api/axiosConfig';

export interface MartItem {
    customer_id: number;
    product_id: string;
    type: string;
    qty: number;
    product: {
        product_name: string;
        product_price: number;
        imageUrls: string[];
    };
}

export const getCart = async (customerId: number): Promise<MartItem[]> => {
    const response = await axios.get(`/mart/${customerId}`);
    return response.data;
};

export const addItemToCart = async (customerId: number, productId: string, qty: number): Promise<MartItem> => {
    const response = await axios.post('/mart', { customerId, productId, qty });
    return response.data;
};

export const updateCartItemQty = async (customerId: number, productId: string, qty: number): Promise<MartItem> => {
    const response = await axios.put('/mart', { customerId, productId, qty });
    return response.data;
};

export const removeItemFromCart = async (customerId: number, productId: string): Promise<void> => {
    await axios.delete(`/mart/${customerId}/${productId}`);
};
