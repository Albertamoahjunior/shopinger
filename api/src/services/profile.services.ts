import { PrismaClient, UserRole } from '@prisma/client';
const prisma = new PrismaClient();

export const getProfile = async (userId: number) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: {
                user_id: userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        is_active: true,
                        email_verified: true,
                        created_at: true,
                        updated_at: true
                    }
                },
                addresses: true
            }
        });
        return profile;
    } catch (error) {
        console.error("Error getting profile:", error);
        throw error;
    }
};

export const updateProfile = async (userId: number, data: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    role?: UserRole;
    date_of_birth?: Date;
    hire_date?: Date;
    id_number?: string;
    profile_data?: any;
}) => {
    try {
        const profile = await prisma.profile.update({
            where: {
                user_id: userId,
            },
            data: data,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        is_active: true,
                        email_verified: true,
                        created_at: true,
                        updated_at: true
                    }
                },
                addresses: true
            }
        });
        return profile;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

export const getProfileByRole = async (role: UserRole) => {
    try {
        const profiles = await prisma.profile.findMany({
            where: {
                role: role
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        is_active: true,
                        email_verified: true,
                        created_at: true,
                        updated_at: true
                    }
                },
                addresses: true
            }
        });
        return profiles;
    } catch (error) {
        console.error("Error getting profiles by role:", error);
        throw error;
    }
};

export const createAddress = async (profileId: number, addressData: {
    address_line?: string;
    country?: string;
    state?: string;
    city?: string;
    postal_code?: string;
    is_primary?: boolean;
}) => {
    try {
        // If this is set as primary, make sure no other address is primary for this profile
        if (addressData.is_primary) {
            await prisma.address.updateMany({
                where: {
                    profile_id: profileId
                },
                data: {
                    is_primary: false
                }
            });
        }

        const address = await prisma.address.create({
            data: {
                profile_id: profileId,
                ...addressData
            }
        });
        return address;
    } catch (error) {
        console.error("Error creating address:", error);
        throw error;
    }
};

export const updateAddress = async (addressId: number, addressData: {
    address_line?: string;
    country?: string;
    state?: string;
    city?: string;
    postal_code?: string;
    is_primary?: boolean;
}) => {
    try {
        // If this is set as primary, make sure no other address is primary for this profile
        if (addressData.is_primary) {
            const address = await prisma.address.findUnique({
                where: { id: addressId }
            });
            
            if (address) {
                await prisma.address.updateMany({
                    where: {
                        profile_id: address.profile_id,
                        id: { not: addressId }
                    },
                    data: {
                        is_primary: false
                    }
                });
            }
        }

        const updatedAddress = await prisma.address.update({
            where: { id: addressId },
            data: addressData
        });
        return updatedAddress;
    } catch (error) {
        console.error("Error updating address:", error);
        throw error;
    }
};

export const deleteAddress = async (addressId: number) => {
    try {
        const address = await prisma.address.delete({
            where: { id: addressId }
        });
        return address;
    } catch (error) {
        console.error("Error deleting address:", error);
        throw error;
    }
};
