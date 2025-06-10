import axios from '../api/axiosConfig';
import type { User } from './authService'; // Import the User type from authService
import type { JsonValue, Address } from '../types/prisma.d'; // Import JsonValue and Address types

export interface UserProfile {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    phone_number?: string;
    role: string;
    date_of_birth?: string;
    hire_date?: string;
    id_number?: string;
    profile_data?: JsonValue;
    created_at: string;
    updated_at: string;
    user?: User; // Nested user object
    addresses?: Address[]; // Assuming addresses might be included
}

export const getProfile = async (userId: number): Promise<UserProfile> => {
    const response = await axios.get(`/profile/${userId}`);
    return response.data;
};

export const updateProfile = async (userId: number, profileData: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await axios.put(`/profile/${userId}`, profileData);
    return response.data;
};
