import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

const get_reciepts = async (req: Request, res: Response) => {
    try {
        const reciepts = await prisma.receipt.findMany();
        res.status(200).json(reciepts);
    } catch (error: any) {
        console.error("Error getting reciepts:", error);
        res.status(500).send("Internal Server Error");
    }
};

const get_reciept_by_id = async (req: Request, res: Response) => {
    try {
        const { reciept_id } = req.params;
        const reciept = await prisma.receipt.findUnique({
            where: {
                receipt_id: parseInt(reciept_id),
            },
        });
        if (!reciept) {
            return res.status(404).send("Reciept not found");
        }
        res.status(200).json(reciept);
    } catch (error: any) {
        console.error("Error getting reciept by id:", error);
        res.status(500).send("Internal Server Error");
    }
};

const add_reciept = async (req: Request, res: Response) => {
    try {
        const { customer_id, teller_id } = req.body;
        const reciept = await prisma.receipt.create({
            data: {
                customer_id: parseInt(customer_id),
                teller_id: parseInt(teller_id),
            },
        });
        res.status(201).json(reciept);
    } catch (error: any) {
        console.error("Error adding reciept:", error);
        res.status(500).send("Internal Server Error");
    }
};

const remove_reciept = async (req: Request, res: Response) => {
    try {
        const { reciept_id } = req.params;
        await prisma.receipt.delete({
            where: {
                receipt_id: parseInt(reciept_id),
            },
        });
        res.status(204).send("Reciept deleted");
    } catch (error: any) {
        console.error("Error removing reciept:", error);
        res.status(500).send("Internal Server Error");
    }
};

export default {
    get_reciepts,
    get_reciept_by_id,
    add_reciept,
    remove_reciept,
};
