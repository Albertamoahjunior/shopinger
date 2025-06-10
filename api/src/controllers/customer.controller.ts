import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

const get_customers = async (req: Request, res: Response) => {
    try {
        const customers = await prisma.customers.findMany();
        res.status(200).json(customers);
    } catch (error: any) {
        console.error("Error getting customers:", error);
        res.status(500).send("Internal Server Error");
    }
};

const get_customer_by_id = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const customer = await prisma.customers.findUnique({
            where: {
                id: parseInt(id),
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
        const { first_name, last_name, tel_number, email, password } = req.body;
        const customer = await prisma.customers.create({
            data: {
                first_name,
                last_name,
                tel_number,
                email,
                password,
            },
        });
        res.status(201).json(customer);
    } catch (error: any) {
        console.error("Error adding customer:", error);
        res.status(500).send("Internal Server Error");
    }
};

const remove_customer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.customers.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(204).send("Customer deleted");
    } catch (error: any) {
        console.error("Error removing customer:", error);
        res.status(500).send("Internal Server Error");
    }
};

const update_customer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, tel_number, email, password } = req.body;
        const customer = await prisma.customers.update({
            where: {
                id: parseInt(id),
            },
            data: {
                first_name,
                last_name,
                tel_number,
                email,
                password,
            },
        });
        res.status(200).json(customer);
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
