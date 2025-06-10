import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

interface NotificationState {
  message: string | null;
  type: 'success' | 'error' | 'info' | 'warning' | null;
  open: boolean;
}

const initialState: NotificationState = {
  message: null,
  type: null,
  open: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' | 'warning' }>
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.open = true;
    },
    hideNotification: (state) => {
      state.open = false;
      state.message = null;
      state.type = null;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export const selectNotification = (state: RootState) => state.notification;

export default notificationSlice.reducer;
