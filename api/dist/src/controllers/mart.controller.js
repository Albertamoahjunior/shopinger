"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const get_mart_items = async (req, res) => {
    try {
        const mart_items = await prisma.mart.findMany();
        res.status(200).json(mart_items);
    }
    catch (error) {
        console.error("Error getting mart_items:", error);
        res.status(500).send("Internal Server Error");
    }
};
const get_mart_item_by_id = async (req, res) => {
    try {
        const { customer_id, product_id, type } = req.params;
        const mart_item = await prisma.mart.findUnique({
            where: {
                customer_id_product_id_type: {
                    customer_id: parseInt(customer_id),
                    product_id: product_id,
                    type: type,
                },
            },
        });
        if (!mart_item) {
            return res.status(404).send("Mart item not found");
        }
        res.status(200).json(mart_item);
    }
    catch (error) {
        console.error("Error getting mart_item by id:", error);
        res.status(500).send("Internal Server Error");
    }
};
const add_mart_item = async (req, res) => {
    try {
        const { customer_id, product_id, type, qty } = req.body;
        const mart_item = await prisma.mart.create({
            data: {
                customer_id: parseInt(customer_id),
                product_id: product_id,
                type: type,
                qty: qty ? parseInt(qty) : null,
            },
        });
        res.status(201).json(mart_item);
    }
    catch (error) {
        console.error("Error adding mart_item:", error);
        res.status(500).send("Internal Server Error");
    }
};
const remove_mart_item = async (req, res) => {
    try {
        const { customer_id, product_id, type } = req.params;
        await prisma.mart.delete({
            where: {
                customer_id_product_id_type: {
                    customer_id: parseInt(customer_id),
                    product_id: product_id,
                    type: type,
                },
            },
        });
        res.status(204).send("Mart item deleted");
    }
    catch (error) {
        console.error("Error removing mart_item:", error);
        res.status(500).send("Internal Server Error");
    }
};
const update_mart_item = async (req, res) => {
    try {
        const { customer_id, product_id, type, qty } = req.body;
        const mart_item = await prisma.mart.update({
            where: {
                customer_id_product_id_type: {
                    customer_id: parseInt(customer_id),
                    product_id: product_id,
                    type: type,
                },
            },
            data: {
                qty: qty ? parseInt(qty) : null,
            },
        });
        res.status(200).json(mart_item);
    }
    catch (error) {
        console.error("Error updating mart_item:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.default = {
    get_mart_items,
    get_mart_item_by_id,
    add_mart_item,
    remove_mart_item,
    update_mart_item,
};
//# sourceMappingURL=mart.controller.js.map