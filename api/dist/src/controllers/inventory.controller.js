"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const get_inventory = async (req, res) => {
    try {
        const inventory = await prisma.inventory.findMany();
        res.status(200).json(inventory);
    }
    catch (error) {
        console.error("Error getting inventory:", error);
        res.status(500).send("Internal Server Error");
    }
};
const get_inventory_by_id = async (req, res) => {
    try {
        const { product_id } = req.params;
        const inventory = await prisma.inventory.findUnique({
            where: {
                product_id: product_id,
            },
        });
        if (!inventory) {
            return res.status(404).send("Inventory not found");
        }
        res.status(200).json(inventory);
    }
    catch (error) {
        console.error("Error getting inventory by id:", error);
        res.status(500).send("Internal Server Error");
    }
};
const add_inventory = async (req, res) => {
    try {
        const { product_id, product_name, product_qty, supplier_id, prod_desc, prod_spec, product_price } = req.body;
        const inventory = await prisma.inventory.create({
            data: {
                product_id: product_id,
                product_name: product_name,
                product_qty: product_qty,
                supplier_id: supplier_id,
                prod_desc: prod_desc,
                prod_spec: prod_spec,
                product_price: product_price,
            },
        });
        res.status(201).json(inventory);
    }
    catch (error) {
        console.error("Error adding inventory:", error);
        res.status(500).send("Internal Server Error");
    }
};
const remove_inventory = async (req, res) => {
    try {
        const { product_id } = req.params;
        await prisma.inventory.delete({
            where: {
                product_id: product_id,
            },
        });
        res.status(204).send("Inventory deleted");
    }
    catch (error) {
        console.error("Error removing inventory:", error);
        res.status(500).send("Internal Server Error");
    }
};
const update_inventory = async (req, res) => {
    try {
        const { product_name, product_id } = req.body;
        const inventory = await prisma.inventory.update({
            where: {
                product_id: product_id,
            },
            data: {
                product_name: product_name,
            },
        });
        res.status(200).json(inventory);
    }
    catch (error) {
        console.error("Error updating inventory:", error);
        res.status(500).send("Internal Server Error");
    }
};
const add_inventory_image = async (req, res) => {
    try {
        const { product_id, image } = req.body;
        const inventoryImage = await prisma.images.create({
            data: {
                product_id: product_id,
                image: image,
            },
        });
        res.status(201).json(inventoryImage);
    }
    catch (error) {
        console.error("Error adding inventory image:", error);
        res.status(500).send("Internal Server Error");
    }
};
const search_product = async (req, res) => {
    try {
        const { query } = req.params;
        const inventory = await prisma.inventory.findMany({
            where: {
                OR: [
                    {
                        product_name: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        prod_desc: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
        });
        res.status(200).json(inventory);
    }
    catch (error) {
        console.error("Error searching product:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.default = {
    get_inventory,
    get_inventory_by_id,
    add_inventory,
    remove_inventory,
    update_inventory,
    add_inventory_image,
    search_product,
};
//# sourceMappingURL=inventory.controller.js.map