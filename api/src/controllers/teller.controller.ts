import { PrismaClient, UserRole } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

const get_tellers = async (req: Request, res: Response) => {
    try {
        const tellers = await prisma.user.findMany({
            where: {
                profile: {
                    role: UserRole.TELLER
                }
            },
            include: {
                profile: true
            }
        });
        res.status(200).json(tellers);
    } catch (error: any) {
        console.error("Error getting tellers:", error);
        res.status(500).send("Internal Server Error");
    }
};

const get_teller_by_id = async (req: Request, res: Response) => {
    try {
        const { teller_id } = req.params;
        const teller = await prisma.user.findUnique({
            where: {
                id: parseInt(teller_id),
                profile: {
                    role: UserRole.TELLER
                }
            },
            include: {
                profile: true
            },
        });
        if (!teller) {
            return res.status(404).send("Teller not found");
        }
        res.status(200).json(teller);
    } catch (error: any) {
        console.error("Error getting teller by id:", error);
        res.status(500).send("Internal Server Error");
    }
};

const add_teller = async (req: Request, res: Response) => {
    try {
        const { first_name, last_name, email, password, phone_number, date_of_birth, id_number } = req.body;

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
                        role: UserRole.TELLER,
                    }
                }
            },
            include: {
                profile: true
            }
        });
        res.status(201).json(newUser);
    } catch (error: any) {
        console.error("Error adding teller:", error);
        res.status(500).send("Internal Server Error");
    }
};

const remove_teller = async (req: Request, res: Response) => {
    try {
        const { teller_id } = req.params;
        // Deactivate the user instead of deleting
        await prisma.user.update({
            where: {
                id: parseInt(teller_id),
                profile: {
                    role: UserRole.TELLER
                }
            },
            data: {
                is_active: false
            },
        });
        res.status(204).send("Teller deactivated");
    } catch (error: any) {
        console.error("Error removing teller:", error);
        res.status(500).send("Internal Server Error");
    }
};

const update_teller = async (req: Request, res: Response) => {
    try {
        const { teller_id } = req.params;
        const { first_name, last_name, email, phone_number, date_of_birth, id_number } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(teller_id) },
            include: { profile: true }
        });

        if (!existingUser || existingUser.profile?.role !== UserRole.TELLER) {
            return res.status(404).send("Teller not found");
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(teller_id) },
            data: {
                email: email || existingUser.email,
                profile: {
                    update: {
                        first_name: first_name || existingUser.profile?.first_name,
                        last_name: last_name || existingUser.profile?.last_name,
                        phone_number: phone_number || existingUser.profile?.phone_number,
                        date_of_birth: date_of_birth ? new Date(date_of_birth) : existingUser.profile?.date_of_birth,
                        id_number: id_number || existingUser.profile?.id_number,
                    }
                }
            },
            include: { profile: true }
        });
        res.status(200).json(updatedUser);
    } catch (error: any) {
        console.error("Error updating teller:", error);
        res.status(500).send("Internal Server Error");
    }
};

export default {
    get_tellers,
    get_teller_by_id,
    add_teller,
    remove_teller,
    update_teller,
};
