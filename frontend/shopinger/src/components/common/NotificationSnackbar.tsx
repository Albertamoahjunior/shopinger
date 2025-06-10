import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectNotification, hideNotification } from '../../features/notifications/notificationSlice';

export function NotificationSnackbar() {
  const dispatch = useAppDispatch();
  const { message, type, open } = useAppSelector(selectNotification);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideNotification());
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
      <Alert onClose={handleClose} severity={type || 'info'} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
