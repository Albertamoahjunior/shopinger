import { useEffect } from 'react';
import { Box, Button, Container, TextField, Typography, CircularProgress } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCurrentUser } from './authSlice';
import { getProfile, updateProfile } from '../../services/profileService';
import type { UserProfile as ProfileServiceUserProfile } from '../../services/profileService';
import type { User } from '../../services/authService';
import { showNotification } from '../notifications/notificationSlice';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone_number: z.string().optional(),
});

type ProfileFormInputs = z.infer<typeof profileSchema>;

export function UserProfile() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const user: User | null = useAppSelector(selectCurrentUser);

  const { data: profile, isLoading, error } = useQuery<ProfileServiceUserProfile, AxiosError | Error>({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User ID is not available.');
      }
      return getProfile(user.id);
    },
    enabled: !!user?.id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.user?.email || '',
        phone_number: profile.phone_number || '',
      });
    }
  }, [profile, reset]);

  useEffect(() => {
    if (error) {
      const errorMessage = (error as AxiosError<{ message: string }>).response?.data?.message || error.message || 'Failed to load user profile.';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    }
  }, [error, dispatch]);

  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormInputs) => {
      if (!user?.id) {
        throw new Error('User ID is not available for profile update.');
      }
      return updateProfile(user.id, {
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
      dispatch(showNotification({ message: 'Profile updated successfully!', type: 'success' }));
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const errorMessage = err.response?.data?.message || 'Failed to update profile.';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    },
  });

  const onSubmit = (data: ProfileFormInputs) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-full min-h-[calc(100vh-64px)]">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return null; // Notification will handle the error display
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box className="mt-8 flex flex-col items-center p-4 shadow-lg rounded-lg bg-white">
        <Typography component="h1" variant="h5" className="mb-4 font-bold text-primary">
          User Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate className="w-full mt-1">
          <TextField
            margin="normal"
            required
            fullWidth
            id="first_name"
            label="First Name"
            autoComplete="first_name"
            autoFocus
            {...register('first_name')}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
            className="mb-4"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="last_name"
            label="Last Name"
            autoComplete="last_name"
            {...register('last_name')}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
            className="mb-4"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            className="mb-4"
            disabled // Email should not be editable here
          />
          <TextField
            margin="normal"
            fullWidth
            id="phone_number"
            label="Phone Number"
            autoComplete="phone_number"
            {...register('phone_number')}
            error={!!errors.phone_number}
            helperText={errors.phone_number?.message}
            className="mb-4"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="mt-3 mb-2"
            disabled={updateMutation.isPending}
          >
            Update Profile
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
