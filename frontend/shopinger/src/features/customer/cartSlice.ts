import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { getCart, addItemToCart, updateCartItemQty, removeItemFromCart } from '../../services/martService';
import type { MartItem } from '../../services/martService';

interface CartState {
  items: MartItem[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: 'idle',
  error: null,
};

export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (customerId: number) => {
    const response = await getCart(customerId);
    return response;
  }
);

export const addCartItem = createAsyncThunk(
  'cart/addCartItem',
  async ({ customerId, productId, qty }: { customerId: number; productId: string; qty: number }) => {
    const response = await addItemToCart(customerId, productId, qty);
    return response;
  }
);

export const updateCartQty = createAsyncThunk(
  'cart/updateCartQty',
  async ({ customerId, productId, qty }: { customerId: number; productId: string; qty: number }) => {
    const response = await updateCartItemQty(customerId, productId, qty);
    return response;
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async ({ customerId, productId }: { customerId: number; productId: string }) => {
    await removeItemFromCart(customerId, productId);
    return { customerId, productId };
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchCartItems.fulfilled, (state, action: PayloadAction<MartItem[]>) => {
        state.loading = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch cart items';
      })
      .addCase(addCartItem.fulfilled, (state, action: PayloadAction<MartItem>) => {
        state.items.push(action.payload);
      })
      .addCase(updateCartQty.fulfilled, (state, action: PayloadAction<MartItem>) => {
        const index = state.items.findIndex(item => item.product_id === action.payload.product_id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeCartItem.fulfilled, (state, action: PayloadAction<{ customerId: number; productId: string }>) => {
        state.items = state.items.filter(
          (item) => item.product_id !== action.payload.productId
        );
      });
  },
});

//export const {  } = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((total: number, item: MartItem) => total + item.product.product_price * item.qty, 0);
