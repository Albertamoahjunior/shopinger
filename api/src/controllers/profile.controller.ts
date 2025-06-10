import { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import * as profileService from "../services/profile.services";
import { getUsersByRole as getUsersByRoleService, findUserById } from "../services/user.services";

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const profile = await profileService.getProfile(userId);
        
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json(profile);
    } catch (error: any) {
        console.error("Error getting profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const {
            first_name,
            last_name,
            phone_number,
            role,
            date_of_birth,
            hire_date,
            id_number,
            profile_data
        } = req.body;

        const updateData: any = {};
        
        if (first_name !== undefined) updateData.first_name = first_name;
        if (last_name !== undefined) updateData.last_name = last_name;
        if (phone_number !== undefined) updateData.phone_number = phone_number;
        if (role !== undefined) updateData.role = role;
        if (date_of_birth !== undefined) updateData.date_of_birth = new Date(date_of_birth);
        if (hire_date !== undefined) updateData.hire_date = new Date(hire_date);
        if (id_number !== undefined) updateData.id_number = id_number;
        if (profile_data !== undefined) updateData.profile_data = profile_data;

        const profile = await profileService.updateProfile(userId, updateData);
        
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json(profile);
    } catch (error: any) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProfilesByRole = async (req: Request, res: Response) => {
    try {
        const { role } = req.params;
        
        if (!Object.values(UserRole).includes(role as UserRole)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const profiles = await profileService.getProfileByRole(role as UserRole);
        res.status(200).json(profiles);
    } catch (error: any) {
        console.error("Error getting profiles by role:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUsersByRole = async (req: Request, res: Response) => {
    try {
        const { role } = req.params;
        
        if (!Object.values(UserRole).includes(role as UserRole)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const users = await getUsersByRoleService(role as UserRole);
        res.status(200).json(users);
    } catch (error: any) {
        console.error("Error getting users by role:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createAddress = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // First, get the user's profile to get the profile ID
        const profile = await profileService.getProfile(userId);
        
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const {
            address_line,
            country,
            state,
            city,
            postal_code,
            is_primary = false
        } = req.body;

        const address = await profileService.createAddress(profile.id, {
            address_line,
            country,
            state,
            city,
            postal_code,
            is_primary
        });

        res.status(201).json(address);
    } catch (error: any) {
        console.error("Error creating address:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateAddress = async (req: Request, res: Response) => {
    try {
        const addressId = parseInt(req.params.addressId);
        
        if (isNaN(addressId)) {
            return res.status(400).json({ message: "Invalid address ID" });
        }

        const {
            address_line,
            country,
            state,
            city,
            postal_code,
            is_primary
        } = req.body;

        const updateData: any = {};
        
        if (address_line !== undefined) updateData.address_line = address_line;
        if (country !== undefined) updateData.country = country;
        if (state !== undefined) updateData.state = state;
        if (city !== undefined) updateData.city = city;
        if (postal_code !== undefined) updateData.postal_code = postal_code;
        if (is_primary !== undefined) updateData.is_primary = is_primary;

        const address = await profileService.updateAddress(addressId, updateData);
        res.status(200).json(address);
    } catch (error: any) {
        console.error("Error updating address:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const addressId = parseInt(req.params.addressId);
        
        if (isNaN(addressId)) {
            return res.status(400).json({ message: "Invalid address ID" });
        }

        await profileService.deleteAddress(addressId);
        res.status(200).json({ message: "Address deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting address:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getCurrentUserProfile = async (req: Request, res: Response) => {
    try {
        // Assuming user ID is available in req.user from authentication middleware
        const userId = (req as any).user?.userId || (req as any).user?.id;
        
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const profile = await profileService.getProfile(userId);
        
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json(profile);
    } catch (error: any) {
        console.error("Error getting current user profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default {
    getProfile,
    updateProfile,
    getProfilesByRole,
    getUsersByRole,
    createAddress,
    updateAddress,
    deleteAddress,
    getCurrentUserProfile
};
