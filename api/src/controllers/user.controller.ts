import { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import {
    createUser,
    findUserById,
    findUserByEmail,
    updateUser,
    deleteUser,
    getAllUsers,
    getUsersByRole,
    userExists
} from "../services/user.services";

export const createNewUser = async (req: Request, res: Response) => {
    try {
        const {
            email,
            password,
            first_name,
            last_name,
            phone_number,
            role = UserRole.CUSTOMER,
            date_of_birth,
            hire_date,
            id_number,
            profile_data
        } = req.body;

        // Validate required fields
        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({
                message: "Email, password, first name, and last name are required"
            });
        }

        // Check if user already exists
        const existingUser = await userExists(email);
        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email" });
        }

        const newUser = await createUser({
            email,
            password,
            first_name,
            last_name,
            phone_number,
            role,
            date_of_birth: date_of_birth ? new Date(date_of_birth) : undefined,
            hire_date: hire_date ? new Date(hire_date) : undefined,
            id_number,
            profile_data
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            message: "User created successfully",
            user: userWithoutPassword
        });
    } catch (error: any) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await findUserById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json(userWithoutPassword);
    } catch (error: any) {
        console.error("Error getting user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json(userWithoutPassword);
    } catch (error: any) {
        console.error("Error getting user by email:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateUserById = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const { email, is_active, email_verified } = req.body;

        const updateData: any = {};
        if (email !== undefined) updateData.email = email;
        if (is_active !== undefined) updateData.is_active = is_active;
        if (email_verified !== undefined) updateData.email_verified = email_verified;

        const updatedUser = await updateUser(userId, updateData);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = updatedUser;

        res.status(200).json(userWithoutPassword);
    } catch (error: any) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteUserById = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const deletedUser = await deleteUser(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deactivated successfully" });
    } catch (error: any) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await getAllUsers(page, limit);

        // Remove passwords from response
        const usersWithoutPasswords = result.users.map(user => {
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.status(200).json({
            ...result,
            users: usersWithoutPasswords
        });
    } catch (error: any) {
        console.error("Error getting users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUsersByRoleController = async (req: Request, res: Response) => {
    try {
        const { role } = req.params;

        if (!Object.values(UserRole).includes(role as UserRole)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const users = await getUsersByRole(role as UserRole);

        // Remove passwords from response
        const usersWithoutPasswords = users.map(user => {
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.status(200).json(usersWithoutPasswords);
    } catch (error: any) {
        console.error("Error getting users by role:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkUserExists = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const exists = await userExists(email);

        res.status(200).json({ exists });
    } catch (error: any) {
        console.error("Error checking if user exists:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default {
    createNewUser,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
    getUsers,
    getUsersByRoleController,
    checkUserExists
};
