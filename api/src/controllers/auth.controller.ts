import { Request, Response } from "express";
import passport from "passport";
import { generateToken } from "../../config/auth.config";
import { registerUser, loginUser } from "../services/auth.services";
import { userExists } from "../services/user.services";
import { UserRole } from "@prisma/client";

// Unified login for all user types
const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await loginUser(email, password);
        
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const payload = {
            userId: user.id,
            role: user.profile?.role,
            email: user.email
        };

        const token = generateToken(payload, '1h');
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        
        res.status(200).json({ 
            token, 
            user: userWithoutPassword,
            message: "Login successful"
        });
    } catch (error: any) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Unified registration for all user types
const register = async (req: Request, res: Response) => {
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

        // Create new user
        const newUser = await registerUser({
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

        const payload = {
            userId: newUser.id,
            role: newUser.profile?.role,
            email: newUser.email
        };

        const token = generateToken(payload, '1h');
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;
        
        res.status(201).json({ 
            message: "User registered successfully", 
            token,
            user: userWithoutPassword
        });
    } catch (error: any) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Customer-specific registration (for backward compatibility)
const sign_up_customer = async (req: Request, res: Response) => {
    try {
        const { first_name, last_name, tel_number, email, password } = req.body;

        // Validate required fields
        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({ 
                message: "Email, password, first name, and last name are required" 
            });
        }

        // Check if user already exists
        const existingUser = await userExists(email);
        if (existingUser) {
            return res.status(409).json({ message: "Customer already exists" });
        }

        // Create new customer
        const newUser = await registerUser({
            email,
            password,
            first_name,
            last_name,
            phone_number: tel_number,
            role: UserRole.CUSTOMER
        });

        const payload = {
            userId: newUser.id,
            role: newUser.profile?.role,
            email: newUser.email
        };

        const token = generateToken(payload, '1h');
        
        res.status(201).json({ 
            message: "Successfully Signed Up", 
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                profile: newUser.profile
            }
        });
    } catch (error: any) {
        console.error("Error signing up customer:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Passport-based login (for existing passport strategies)
const passport_login = (req: Request, res: Response) => {
    console.log("Passport login");
    if (!req.user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = req.user as any;
    const payload = {
        userId: user.id,
        role: user.profile?.role,
        email: user.email
    };

    const token = generateToken(payload, '1h');
    res.status(200).json({ token, user: req.user });
};

const log_out = (req: Request, res: Response) => {
    req.logout((err: any) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ message: "Error logging out" });
        }
        res.status(200).json({ message: "Logged out successfully" });
    });
};

export default {
    login,
    register,
    sign_up_customer, // Keep for backward compatibility
    passport_login,
    log_out,
};
