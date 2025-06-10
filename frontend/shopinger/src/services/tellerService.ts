import api from '../api/axiosConfig';
import type { User } from './authService';
import type { UserProfile } from './profileService';

// Teller is now a User with a Profile
export type TellerUser = User & {
  profile: UserProfile & {
    hire_date?: string;
    id_number?: string;
    profile_data?: {
      shift?: string;
    };
  };
};

export const getTellers = async (): Promise<TellerUser[]> => {
  try {
    const response = await api.get('/users/role/TELLER'); // Fetch users with role TELLER
    return response.data;
  } catch (error) {
    console.error('Error fetching tellers:', error);
    throw error;
  }
};

export const getTellerById = async (id: number): Promise<TellerUser> => {
  try {
    const response = await api.get(`/users/${id}`); // Fetch user by ID
    return response.data;
  } catch (error) {
    console.error('Error fetching teller:', error);
    throw error;
  }
};

export const createTeller = async (tellerData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string;
  hire_date?: string;
  id_number?: string;
  shift?: string;
}): Promise<TellerUser> => {
  try {
    const response = await api.post('/auth/register', {
      ...tellerData,
      role: 'TELLER',
      profile_data: { shift: tellerData.shift }
    });
    return response.data.user;
  } catch (error) {
    console.error('Error creating teller:', error);
    throw error;
  }
};

export const updateTeller = async (userId: number, tellerData: Partial<{
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  hire_date: string;
  id_number: string;
  shift: string;
}>): Promise<TellerUser> => {
  try {
    // Update profile data
    const profileUpdate: Partial<UserProfile> = {
      first_name: tellerData.first_name,
      last_name: tellerData.last_name,
      phone_number: tellerData.phone_number,
      hire_date: tellerData.hire_date,
      id_number: tellerData.id_number,
      profile_data: tellerData.shift ? { shift: tellerData.shift } : undefined,
    };
    await api.put(`/profile/${userId}`, profileUpdate);

    // Optionally update user email if provided
    if (tellerData.email) {
      await api.put(`/users/${userId}`, { email: tellerData.email });
    }

    // Fetch the updated user to return the complete TellerUser object
    const updatedUserResponse = await api.get(`/users/${userId}`);
    return updatedUserResponse.data;
  } catch (error) {
    console.error('Error updating teller:', error);
    throw error;
  }
};

export const deleteTeller = async (id: number): Promise<void> => {
  try {
    await api.delete(`/users/${id}`); // Deactivate user
  } catch (error) {
    console.error('Error deleting teller:', error);
    throw error;
  }
};
