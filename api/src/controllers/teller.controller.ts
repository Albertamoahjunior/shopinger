import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

const get_tellers = async (req: Request, res: Response) => {
    try {
        const tellers = await prisma.workers.findMany({
            where: {
                role: "teller"
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
        const teller = await prisma.workers.findUnique({
            where: {
                id: parseInt(teller_id),
                role: "teller"
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
        const { first_name, last_name, tel_number, email, password, dob, id_number } = req.body;
        const teller = await prisma.workers.create({
            data: {
                first_name,
                last_name,
                tel_number,
                email,
                password,
                dob,
                id_number,
                role: "teller"
            },
        });
        res.status(201).json(teller);
    } catch (error: any) {
        console.error("Error adding teller:", error);
        res.status(500).send("Internal Server Error");
    }
};

const remove_teller = async (req: Request, res: Response) => {
    try {
        const { teller_id } = req.params;
        await prisma.workers.delete({
            where: {
                id: parseInt(teller_id),
                role: "teller"
            },
        });
        res.status(204).send("Teller deleted");
    } catch (error: any) {
        console.error("Error removing teller:", error);
        res.status(500).send("Internal Server Error");
    }
};

const update_teller = async (req: Request, res: Response) => {
    try {
        const { first_name, last_name, tel_number, email, password, dob, id_number } = req.body;
        const { teller_id: id } = req.params;
        const teller = await prisma.workers.update({
            where: {
                id: parseInt(id),
                role: "teller"
            },
            data: {
                first_name,
                last_name,
                tel_number,
                email,
                password,
                dob,
                id_number,
                role: "teller"
            },
        });
        res.status(200).json(teller);
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
