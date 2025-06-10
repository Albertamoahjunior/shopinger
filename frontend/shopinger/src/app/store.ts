import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/customer/cartSlice';
import notificationReducer from '../features/notifications/notificationSlice'; // Import the new reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    notification: notificationReducer, // Add the notification reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
