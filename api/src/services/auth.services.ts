import { PrismaClient, UserRole } from '@prisma/client';
import { hash_pass, compare_pass } from '../../config/auth.config';

const prisma = new PrismaClient();

// Register a new user
export const registerUser = async (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    role: UserRole;
    date_of_birth?: Date;
    hire_date?: Date;
    id_number?: string;
    profile_data?: any;
}) => {
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: userData.email }
        });

        if (existingUser) {
            throw new Error('User already exists with this email');
        }

        const hashedPassword = hash_pass(userData.password);
        
        const user = await prisma.user.create({
            data: {
                email: userData.email,
                password: hashedPassword,
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
        console.error("Error registering user:", error);
        throw error;
    }
};

// Login user
export const loginUser = async (email: string, password: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                profile: true
            }
        });

        if (!user || !user.is_active) {
            return null;
        }

        const isValidPassword = compare_pass(password, user.password);
        
        if (!isValidPassword) {
            return null;
        }

        return user;
    } catch (error: any) {
        console.error("Error logging in user:", error);
        throw error;
    }
};

// Find user by email for passport strategy
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

// Find user by ID for passport strategy
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

// Update user password
export const updatePassword = async (userId: number, newPassword: string) => {
    try {
        const hashedPassword = hash_pass(newPassword);
        
        const user = await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
            include: {
                profile: true
            }
        });
        
        return user;
    } catch (error: any) {
        console.error("Error updating password:", error);
        throw error;
    }
};

// Verify user password
export const verifyPassword = async (userId: number, password: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true }
        });

        if (!user) {
            return false;
        }

        return compare_pass(password, user.password);
    } catch (error: any) {
        console.error("Error verifying password:", error);
        throw error;
    }
};

// Activate/Deactivate user
export const toggleUserStatus = async (userId: number, isActive: boolean) => {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { is_active: isActive },
            include: {
                profile: true
            }
        });
        
        return user;
    } catch (error: any) {
        console.error("Error toggling user status:", error);
        throw error;
    }
};

// Verify email
export const verifyEmail = async (userId: number) => {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { email_verified: true },
            include: {
                profile: true
            }
        });
        
        return user;
    } catch (error: any) {
        console.error("Error verifying email:", error);
        throw error;
    }
};
