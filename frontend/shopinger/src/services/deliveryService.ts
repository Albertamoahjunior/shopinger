import api from '../api/axiosConfig';
import type { User } from './authService';
import type { UserProfile } from './profileService';
import type { JsonValue } from '../types/prisma.d'; // Import JsonValue

// Delivery is now a User with a Profile
export type DelivererUser = User & {
  profile: UserProfile & {
    hire_date?: string;
    id_number?: string;
    profile_data?: {
      vehicle_type?: string;
      license_number?: string;
      status?: 'pending' | 'out for delivery' | 'delivered';
    };
  };
};

// This interface represents a delivery record, not a deliverer user
export interface DeliveryRecord {
  delivery_id: number;
  deliverer_user_id: number;
  delivery_report: string;
  customer_user_id: number;
  delivery_time?: string;
  customer_report?: string;
  receipt_id?: number;
  customer?: User; // Assuming customer user object might be included
  deliverer?: User; // Assuming deliverer user object might be included
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  receipt?: any; // Adjust based on actual receipt type
  status?: 'pending' | 'out for delivery' | 'delivered' | 'completed' | 'cancelled'; // Add status to DeliveryRecord
}

export const getDeliverers = async (): Promise<DelivererUser[]> => {
  try {
    const response = await api.get('/users/role/DELIVERER'); // Fetch users with role DELIVERER
    return response.data;
  } catch (error) {
    console.error('Error fetching deliverers:', error);
    throw error;
  }
};

export const getDelivererById = async (id: number): Promise<DelivererUser> => {
  try {
    const response = await api.get(`/users/${id}`); // Fetch user by ID
    return response.data;
  } catch (error) {
    console.error('Error fetching deliverer:', error);
    throw error;
  }
};

export const createDeliverer = async (delivererData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string;
  hire_date?: string;
  id_number?: string;
  vehicle_type?: string;
  license_number?: string;
  status?: 'pending' | 'out for delivery' | 'delivered';
}): Promise<DelivererUser> => {
  try {
    const response = await api.post('/auth/register', {
      ...delivererData,
      role: 'DELIVERER',
      profile_data: {
        vehicle_type: delivererData.vehicle_type,
        license_number: delivererData.license_number,
        status: delivererData.status,
      } as JsonValue // Explicitly cast to JsonValue
    });
    return response.data.user;
  } catch (error) {
    console.error('Error creating deliverer:', error);
    throw error;
  }
};

export const updateDeliverer = async (userId: number, delivererData: Partial<{
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  hire_date: string;
  id_number: string;
  vehicle_type: string;
  license_number: string;
  status: 'pending' | 'out for delivery' | 'delivered';
}>): Promise<DelivererUser> => {
  try {
    // Fetch current profile to merge profile_data
    const currentProfile = await api.get(`/profile/${userId}`);
    const existingProfileData = currentProfile.data.profile_data || {};

    // Update profile data
    const profileUpdate: Partial<UserProfile> = {
      first_name: delivererData.first_name,
      last_name: delivererData.last_name,
      phone_number: delivererData.phone_number,
      hire_date: delivererData.hire_date,
      id_number: delivererData.id_number,
      profile_data: {
        ...existingProfileData, // Merge existing profile_data
        vehicle_type: delivererData.vehicle_type,
        license_number: delivererData.license_number,
        status: delivererData.status,
      } as JsonValue,
    };
    await api.put(`/profile/${userId}`, profileUpdate);

    // Optionally update user email if provided
    if (delivererData.email) {
      await api.put(`/users/${userId}`, { email: delivererData.email });
    }

    // Fetch the updated user to return the complete DelivererUser object
    const updatedUserResponse = await api.get(`/users/${userId}`);
    return updatedUserResponse.data;
  } catch (error) {
    console.error('Error updating deliverer:', error);
    throw error;
  }
};

export const deleteDeliverer = async (id: number): Promise<void> => {
  try {
    await api.delete(`/users/${id}`); // Deactivate user
  } catch (error) {
    console.error('Error deleting deliverer:', error);
    throw error;
  }
};

// Functions for actual delivery records (not deliverer users)
export const getDeliveryRecords = async (): Promise<DeliveryRecord[]> => {
  try {
    const response = await api.get('/deliveries'); // Assuming a /deliveries endpoint exists
    return response.data;
  } catch (error) {
    console.error('Error fetching delivery records:', error);
    throw error;
  }
};

export const getDeliveryRecordById = async (id: number): Promise<DeliveryRecord> => {
  try {
    const response = await api.get(`/deliveries/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching delivery record:', error);
    throw error;
  }
};

export const createDeliveryRecord = async (deliveryData: Omit<DeliveryRecord, 'delivery_id'>): Promise<DeliveryRecord> => {
  try {
    const response = await api.post('/deliveries', deliveryData);
    return response.data;
  } catch (error) {
    console.error('Error creating delivery record:', error);
    throw error;
  }
};

export const updateDeliveryRecord = async (id: number, deliveryData: Partial<DeliveryRecord>): Promise<DeliveryRecord> => {
  try {
    const response = await api.put(`/deliveries/${id}`, deliveryData);
    return response.data;
  } catch (error) {
    console.error('Error updating delivery record:', error);
    throw error;
  }
};

export const deleteDeliveryRecord = async (id: number): Promise<void> => {
  try {
    await api.delete(`/deliveries/${id}`);
  } catch (error) {
    console.error('Error deleting delivery record:', error);
    throw error;
  }
};

// Legacy function names for backward compatibility
export const getDeliveries = getDeliverers; // This now returns DelivererUser[]
export const updateDeliveryStatus = async (id: string, newStatus: DeliveryRecord['status']): Promise<DeliveryRecord> => {
  try {
    // This function now updates a delivery record, not a deliverer user's status
    const updatedRecord = await updateDeliveryRecord(parseInt(id), { status: newStatus });
    return updatedRecord;
  } catch (error) {
    console.error('Error updating delivery status:', error);
    throw error;
  }
};
