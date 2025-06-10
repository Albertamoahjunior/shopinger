import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

const get_suppliers = async (req: Request, res: Response) => {
    try {
        const suppliers = await prisma.supplier.findMany();
        res.status(200).json(suppliers);
    } catch (error: any) {
        console.error("Error getting suppliers:", error);
        res.status(500).send("Internal Server Error");
    }
};

const get_supplier_by_id = async (req: Request, res: Response) => {
    try {
        const { supplier_name } = req.params;
        const supplier = await prisma.supplier.findUnique({
            where: {
                supplier_name: supplier_name,
            },
        });
        if (!supplier) {
            return res.status(404).send("Supplier not found");
        }
        res.status(200).json(supplier);
    } catch (error: any) {
        console.error("Error getting supplier by id:", error);
        res.status(500).send("Internal Server Error");
    }
};

const add_supplier = async (req: Request, res: Response) => {
    try {
        const { supplier_name, contact } = req.body;
        const supplier = await prisma.supplier.create({
            data: {
                supplier_name,
                contact: contact ? String(contact) : null,
            },
        });
        res.status(201).json(supplier);
    } catch (error: any) {
        console.error("Error adding supplier:", error);
        res.status(500).send("Internal Server Error");
    }
};

const remove_supplier = async (req: Request, res: Response) => {
    try {
        const { supplier_name } = req.params;
        await prisma.supplier.delete({
            where: {
                supplier_name: supplier_name,
            },
        });
        res.status(204).send("Supplier deleted");
    } catch (error: any) {
        console.error("Error removing supplier:", error);
        res.status(500).send("Internal Server Error");
    }
};

const update_supplier = async (req: Request, res: Response) => {
    try {
        const { supplier_name, contact } = req.body;
         const { supplier_name: old_supplier_name } = req.params;
        const supplier = await prisma.supplier.update({
            where: {
                supplier_name: old_supplier_name,
            },
            data: {
                supplier_name,
                contact: contact ? String(contact) : null,
            },
        });
        res.status(200).json(supplier);
    } catch (error: any) {
        console.error("Error updating supplier:", error);
        res.status(500).send("Internal Server Error");
    }
};

export default {
    get_suppliers,
    get_supplier_by_id,
    add_supplier,
    remove_supplier,
    update_supplier,
};
