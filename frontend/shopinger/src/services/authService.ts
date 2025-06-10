// FAKE AUTH SERVICE
// This file simulates an authentication service.
// It will be replaced with actual API calls later.

// Define the shape of the login credentials
import axios from '../api/axiosConfig';

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: string;
  date_of_birth?: string;
  hire_date?: string;
  id_number?: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile_data?: any;
}

export interface User {
  id: number;
  email: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  profile: UserProfile | null;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

interface LoginCredentials {
  email?: string;
  password?: string;
}

interface RegisterCredentials extends LoginCredentials {
  first_name: string;
  last_name: string;
  phone_number?: string;
  role?: string;
  date_of_birth?: string;
  hire_date?: string;
  id_number?: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile_data?: any;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await axios.post('/auth/register', credentials);
  return response.data;
};

export const customerSignup = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await axios.post('/auth/signup/customer', credentials);
  return response.data;
};

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logout = async (): Promise<any> => {
  const response = await axios.post('/auth/logout');
  return response.data;
};

export const googleLogin = () => {
  window.location.href = `${axios.defaults.baseURL}/auth/google`;
};
