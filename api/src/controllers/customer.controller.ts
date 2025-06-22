import { PrismaClient, UserRole } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

const get_customers = async (req: Request, res: Response) => {
    try {
        const customers = await prisma.user.findMany({
            where: {
                profile: {
                    role: UserRole.CUSTOMER
                }
            },
            include: {
                profile: true
            }
        });
        res.status(200).json(customers);
    } catch (error: any) {
        console.error("Error getting customers:", error);
        res.status(500).send("Internal Server Error");
    }
};

const get_customer_by_id = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const customer = await prisma.user.findUnique({
            where: {
                id: parseInt(id),
                profile: {
                    role: UserRole.CUSTOMER
                }
            },
            include: {
                profile: true
            },
        });
        if (!customer) {
            return res.status(404).send("Customer not found");
        }
        res.status(200).json(customer);
    } catch (error: any) {
        console.error("Error getting customer by id:", error);
        res.status(500).send("Internal Server Error");
    }
};

const add_customer = async (req: Request, res: Response) => {
    try {
        const { first_name, last_name, email, password, phone_number, date_of_birth } = req.body;

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
                        role: UserRole.CUSTOMER,
                    }
                }
            },
            include: {
                profile: true
            }
        });
        res.status(201).json(newUser);
    } catch (error: any) {
        console.error("Error adding customer:", error);
        res.status(500).send("Internal Server Error");
    }
};

const remove_customer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // Deactivate the user instead of deleting
        await prisma.user.update({
            where: {
                id: parseInt(id),
                profile: {
                    role: UserRole.CUSTOMER
                }
            },
            data: {
                is_active: false
            },
        });
        res.status(204).send("Customer deactivated");
    } catch (error: any) {
        console.error("Error removing customer:", error);
        res.status(500).send("Internal Server Error");
    }
};

const update_customer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, phone_number, date_of_birth } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: { profile: true }
        });

        if (!existingUser || existingUser.profile?.role !== UserRole.CUSTOMER) {
            return res.status(404).send("Customer not found");
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
                    }
                }
            },
            include: { profile: true }
        });
        res.status(200).json(updatedUser);
    } catch (error: any) {
        console.error("Error updating customer:", error);
        res.status(500).send("Internal Server Error");
    }
};

export default {
    get_customers,
    get_customer_by_id,
    add_customer,
    remove_customer,
    update_customer,
};
