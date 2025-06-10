import { PrismaClient, UserRole } from '@prisma/client';
import { hash_pass } from '../../config/auth.config';

const prisma = new PrismaClient();

// Create a new user with profile
export const createUser = async (userData: {
    email: string;
    password?: string; // Make password optional
    first_name: string;
    last_name: string;
    phone_number?: string;
    role: UserRole;
    date_of_birth?: Date;
    hire_date?: Date;
    id_number?: string;
    profile_data?: any;
    googleId?: string; // Add googleId
    provider?: string; // Add provider
}) => {
    try {
        const hashedPassword = userData.password ? hash_pass(userData.password) : undefined;
        
        const user = await prisma.user.create({
            data: {
                email: userData.email,
                password: hashedPassword,
                googleId: userData.googleId,
                provider: userData.provider,
                profile: {
                    create: {
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        phone_number: userData.phone_number,
                        role: userData.role,
                        date_of_birth: userData.date_of_birth,
                        hire_date: userData.hire_date,
                        id_number: userData.id_number,
                        profile_data: userData.profile_data,
                    }
                }
            },
            include: {
                profile: true
            }
        });
        
        return user;
    } catch (error: any) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// Find user by email
export const findUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                profile: true
            }
        });
        return user;
    } catch (error: any) {
        console.error("Error finding user by email:", error);
        throw error;
    }
};

// Find user by ID
export const findUserById = async (id: number) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                profile: true
            }
        });
        return user;
    } catch (error: any) {
        console.error("Error finding user by ID:", error);
        throw error;
    }
};

// Update user
export const updateUser = async (id: number, userData: {
    email?: string;
    is_active?: boolean;
    email_verified?: boolean;
}) => {
    try {
        const user = await prisma.user.update({
            where: { id },
            data: userData,
            include: {
                profile: true
            }
        });
        return user;
    } catch (error: any) {
        console.error("Error updating user:", error);
        throw error;
    }
};

// Update user profile
export const updateUserProfile = async (userId: number, profileData: {
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
            where: { user_id: userId },
            data: profileData,
            include: {
                user: true
            }
        });
        return profile;
    } catch (error: any) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

// Get users by role
export const getUsersByRole = async (role: UserRole) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                profile: {
                    role: role
                }
            },
            include: {
                profile: true
            }
        });
        return users;
    } catch (error: any) {
        console.error("Error getting users by role:", error);
        throw error;
    }
};

// Get all users with pagination
export const getAllUsers = async (page: number = 1, limit: number = 10) => {
    try {
        const skip = (page - 1) * limit;
        
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                include: {
                    profile: true
                },
                orderBy: {
                    created_at: 'desc'
                }
            }),
            prisma.user.count()
        ]);
        
        return {
            users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    } catch (error: any) {
        console.error("Error getting all users:", error);
        throw error;
    }
};

// Delete user (soft delete by setting is_active to false)
export const deleteUser = async (id: number) => {
    try {
        const user = await prisma.user.update({
            where: { id },
            data: { is_active: false },
            include: {
                profile: true
            }
        });
        return user;
    } catch (error: any) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

// Check if user exists by email
export const userExists = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true }
        });
        return !!user;
    } catch (error: any) {
        console.error("Error checking if user exists:", error);
        throw error;
    }
};

// Verify user credentials for login
export const verifyUserCredentials = async (email: string, password: string) => {
    try {
        const user = await findUserByEmail(email);
        if (!user || !user.is_active) {
            return null;
        }
        
        const { compare_pass } = await import('../../config/auth.config');
        const isValidPassword = compare_pass(password, user.password as string);
        
        if (!isValidPassword) {
            return null;
        }
        
        return user;
    } catch (error: any) {
        console.error("Error verifying user credentials:", error);
        throw error;
    }
};
