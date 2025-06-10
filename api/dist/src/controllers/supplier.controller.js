"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const get_suppliers = async (req, res) => {
    try {
        const suppliers = await prisma.supplier.findMany();
        res.status(200).json(suppliers);
    }
    catch (error) {
        console.error("Error getting suppliers:", error);
        res.status(500).send("Internal Server Error");
    }
};
const get_supplier_by_id = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error getting supplier by id:", error);
        res.status(500).send("Internal Server Error");
    }
};
const add_supplier = async (req, res) => {
    try {
        const { supplier_name, contact } = req.body;
        const supplier = await prisma.supplier.create({
            data: {
                supplier_name,
                contact: contact ? String(contact) : null,
            },
        });
        res.status(201).json(supplier);
    }
    catch (error) {
        console.error("Error adding supplier:", error);
        res.status(500).send("Internal Server Error");
    }
};
const remove_supplier = async (req, res) => {
    try {
        const { supplier_name } = req.params;
        await prisma.supplier.delete({
            where: {
                supplier_name: supplier_name,
            },
        });
        res.status(204).send("Supplier deleted");
    }
    catch (error) {
        console.error("Error removing supplier:", error);
        res.status(500).send("Internal Server Error");
    }
};
const update_supplier = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error updating supplier:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.default = {
    get_suppliers,
    get_supplier_by_id,
    add_supplier,
    remove_supplier,
    update_supplier,
};
//# sourceMappingURL=supplier.controller.js.map