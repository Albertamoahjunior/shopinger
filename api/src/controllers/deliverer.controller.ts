import { PrismaClient, UserRole } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

const get_deliverers = async (req: Request, res: Response) => {
    try {
        const deliverers = await prisma.user.findMany({
            where: {
                profile: {
                    role: UserRole.DELIVERER
                }
            },
            include: {
                profile: true
            }
        });
        res.status(200).json(deliverers);
    } catch (error: any) {
        console.error("Error getting deliverers:", error);
        res.status(500).send("Internal Server Error");
    }
};

const get_deliverer_by_id = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deliverer = await prisma.user.findUnique({
            where: {
                id: parseInt(id),
                profile: {
                    role: UserRole.DELIVERER
                }
            },
            include: {
                profile: true
            },
        });
        if (!deliverer) {
            return res.status(404).send("Deliverer not found");
        }
        res.status(200).json(deliverer);
    } catch (error: any) {
        console.error("Error getting deliverer by id:", error);
        res.status(500).send("Internal Server Error");
    }
};

const add_deliverer = async (req: Request, res: Response) => {
     try {
        const { first_name, last_name, email, password, phone_number, date_of_birth, id_number, vehicle_type, license_number, status } = req.body;

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
                        role: UserRole.DELIVERER,
                        profile_data: {
                            vehicle_type,
                            license_number,
                            status
                        }
                    }
                }
            },
            include: {
                profile: true
            }
        });
        res.status(201).json(newUser);
    } catch (error: any) {
        console.error("Error adding deliverer:", error);
        res.status(500).send("Internal Server Error");
    }
};

const remove_deliverer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // Deactivate the user instead of deleting
        await prisma.user.update({
            where: {
                id: parseInt(id),
                profile: {
                    role: UserRole.DELIVERER
                }
            },
            data: {
                is_active: false
            },
        });
        res.status(204).send("Deliverer deactivated");
    } catch (error: any) {
        console.error("Error removing deliverer:", error);
        res.status(500).send("Internal Server Error");
    }
};

const update_deliverer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, phone_number, date_of_birth, id_number, vehicle_type, license_number, status } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: { profile: true }
        });

        if (!existingUser || existingUser.profile?.role !== UserRole.DELIVERER) {
            return res.status(404).send("Deliverer not found");
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
                        profile_data: {
                            ...(existingUser.profile?.profile_data as object || {}),
                            vehicle_type: vehicle_type || (existingUser.profile?.profile_data as any)?.vehicle_type,
                            license_number: license_number || (existingUser.profile?.profile_data as any)?.license_number,
                            status: status || (existingUser.profile?.profile_data as any)?.status,
                        }
                    }
                }
            },
            include: { profile: true }
        });
        res.status(200).json(updatedUser);
    } catch (error: any) {
        console.error("Error updating deliverer:", error);
        res.status(500).send("Internal Server Error");
    }
};

export default {
    get_deliverers,
    get_deliverer_by_id,
    add_deliverer,
    remove_deliverer,
    update_deliverer,
};
