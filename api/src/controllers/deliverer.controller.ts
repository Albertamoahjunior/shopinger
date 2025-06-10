import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

const get_deliverers = async (req: Request, res: Response) => {
    try {
        const deliverers = await prisma.workers.findMany({
            where: {
                role: "deliverer"
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
        const deliverer = await prisma.workers.findUnique({
            where: {
                id: parseInt(id),
                role: "deliverer"
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
        const { first_name, last_name, tel_number, email, password, dob, id_number } = req.body;
        const deliverer = await prisma.workers.create({
            data: {
                first_name,
                last_name,
                tel_number,
                email,
                password,
                dob,
                id_number,
                role: "deliverer"
            },
        });
        res.status(201).json(deliverer);
    } catch (error: any) {
        console.error("Error adding deliverer:", error);
        res.status(500).send("Internal Server Error");
    }
};

const remove_deliverer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.workers.delete({
            where: {
                id: parseInt(id),
                role: "deliverer"
            },
        });
        res.status(204).send("Deliverer deleted");
    } catch (error: any) {
        console.error("Error removing deliverer:", error);
        res.status(500).send("Internal Server Error");
    }
};

const update_deliverer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, tel_number, email, password, dob, id_number } = req.body;
        const deliverer = await prisma.workers.update({
            where: {
                id: parseInt(id),
                role: "deliverer"
            },
            data: {
                first_name,
                last_name,
                tel_number,
                email,
                password,
                dob,
                id_number,
                role: "deliverer"
            },
        });
        res.status(200).json(deliverer);
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
