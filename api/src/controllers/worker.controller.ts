import { PrismaClient, UserRole } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

const get_workers = async (req: Request, res: Response) => {
    try {
        const workers = await prisma.user.findMany({
            include: {
                profile: true
            }
        });
        res.status(200).json(workers);
    } catch (error: any) {
        console.error("Error getting workers:", error);
        res.status(500).send("Internal Server Error");
    }
};

const get_worker_by_id = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const worker = await prisma.user.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                profile: true
            },
        });
        if (!worker) {
            return res.status(404).send("Worker (User) not found");
        }
        res.status(200).json(worker);
    } catch (error: any) {
        console.error("Error getting worker (user) by id:", error);
        res.status(500).send("Internal Server Error");
    }
};

const add_worker = async (req: Request, res: Response) => {
    try {
        const { first_name, last_name, role, date_of_birth, id_number, email, password, phone_number } = req.body;

        // Validate role
        if (!Object.values(UserRole).includes(role)) {
            return res.status(400).send("Invalid user role provided.");
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                password,
                profile: {
                    create: {
                        first_name,
                        last_name,
                        phone_number,
                        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
                        id_number,
                        role: role as UserRole, // Cast to UserRole
                    }
                }
            },
            include: {
                profile: true
            }
        });
        res.status(201).json(newUser);
    } catch (error: any) {
        console.error("Error adding worker (user):", error);
        res.status(500).send("Internal Server Error");
    }
};

const remove_worker = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // Deactivate the user instead of deleting
        await prisma.user.update({
            where: {
                id: parseInt(id),
            },
            data: {
                is_active: false
            },
        });
        res.status(204).send("Worker (User) deactivated");
    } catch (error: any) {
        console.error("Error removing worker (user):", error);
        res.status(500).send("Internal Server Error");
    }
};

const update_worker = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, role, date_of_birth, id_number, email, phone_number } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: { profile: true }
        });

        if (!existingUser) {
            return res.status(404).send("Worker (User) not found");
        }

        // Validate role if provided
        if (role && !Object.values(UserRole).includes(role)) {
            return res.status(400).send("Invalid user role provided.");
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                email: email || existingUser.email,
                profile: {
                    update: {
                        first_name: first_name || existingUser.profile?.first_name,
                        last_name: last_name || existingUser.profile?.last_name,
                        phone_number: phone_number || existingUser.profile?.phone_number,
                        date_of_birth: date_of_birth ? new Date(date_of_birth) : existingUser.profile?.date_of_birth,
                        id_number: id_number || existingUser.profile?.id_number,
                        role: role ? (role as UserRole) : existingUser.profile?.role,
                    }
                }
            },
            include: { profile: true }
        });
        res.status(200).json(updatedUser);
    } catch (error: any) {
        console.error("Error updating worker (user):", error);
        res.status(500).send("Internal Server Error");
    }
};

export default {
    get_workers,
    get_worker_by_id,
    add_worker,
    remove_worker,
    update_worker,
};
