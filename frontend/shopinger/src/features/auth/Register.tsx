import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useAppDispatch } from '../../app/hooks';
import { registerAsync } from './authSlice';
import { showNotification } from '../notifications/notificationSlice';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { googleLogin } from '../../services/authService';

const registerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
  phone_number: z.string().optional(),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await dispatch(registerAsync(data)).unwrap();
      navigate({ to: '/' });
    } catch (error: unknown) {
      let errorMessage = 'Registration failed.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
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
          />
          <TextField
            margin="normal"
            fullWidth
            id="phone_number"
            label="Phone Number (Optional)"
            autoComplete="phone_number"
            {...register('phone_number')}
            error={!!errors.phone_number}
            helperText={errors.phone_number?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1, mb: 2 }}
            onClick={googleLogin}
          >
            Sign Up with Google
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
