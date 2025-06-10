"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const get_sales = async (req, res) => {
    try {
        const sales = await prisma.sold.findMany();
        res.status(200).json(sales);
    }
    catch (error) {
        console.error("Error getting sales:", error);
        res.status(500).send("Internal Server Error");
    }
};
const get_sale_by_id = async (req, res) => {
    try {
        const { sale_id } = req.params;
        const sale = await prisma.sold.findUnique({
            where: {
                sold_id: parseInt(sale_id),
            },
        });
        if (!sale) {
            return res.status(404).send("Sale not found");
        }
        res.status(200).json(sale);
    }
    catch (error) {
        console.error("Error getting sale by id:", error);
        res.status(500).send("Internal Server Error");
    }
};
const add_sale = async (req, res) => {
    try {
        const { product_id, product_qty, mode, transmission, receipt_id, unit_price } = req.body;
        const sale = await prisma.sold.create({
            data: {
                product_id,
                product_qty: parseInt(product_qty),
                mode,
                transmission,
                receipt_id: receipt_id ? parseInt(receipt_id) : null,
                unit_price: unit_price ? parseFloat(unit_price) : 0,
            },
        });
        res.status(201).json(sale);
    }
    catch (error) {
        console.error("Error adding sale:", error);
        res.status(500).send("Internal Server Error");
    }
};
const remove_sale = async (req, res) => {
    try {
        const { sale_id } = req.params;
        await prisma.sold.delete({
            where: {
                sold_id: parseInt(sale_id),
            },
        });
        res.status(204).send("Sale deleted");
    }
    catch (error) {
        console.error("Error removing sale:", error);
        res.status(500).send("Internal Server Error");
    }
};
const update_sale = async (req, res) => {
    try {
        const { product_id, product_qty, mode, transmission, receipt_id } = req.body;
        const { sale_id } = req.params;
        const sale = await prisma.sold.update({
            where: {
                sold_id: parseInt(sale_id),
            },
            data: {
                product_id,
                product_qty: parseInt(product_qty),
                mode,
                transmission,
                receipt_id: receipt_id ? parseInt(receipt_id) : null,
            },
        });
        res.status(200).json(sale);
    }
    catch (error) {
        console.error("Error updating sale:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.default = {
    get_sales,
    get_sale_by_id,
    add_sale,
    remove_sale,
    update_sale,
};
//# sourceMappingURL=sale.controller.js.map