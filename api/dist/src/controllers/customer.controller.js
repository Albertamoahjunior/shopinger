"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const get_customers = async (req, res) => {
    try {
        const customers = await prisma.customers.findMany();
        res.status(200).json(customers);
    }
    catch (error) {
        console.error("Error getting customers:", error);
        res.status(500).send("Internal Server Error");
    }
};
const get_customer_by_id = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error getting customer by id:", error);
        res.status(500).send("Internal Server Error");
    }
};
const add_customer = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error adding customer:", error);
        res.status(500).send("Internal Server Error");
    }
};
const remove_customer = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.customers.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(204).send("Customer deleted");
    }
    catch (error) {
        console.error("Error removing customer:", error);
        res.status(500).send("Internal Server Error");
    }
};
const update_customer = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.default = {
    get_customers,
    get_customer_by_id,
    add_customer,
    remove_customer,
    update_customer,
};
//# sourceMappingURL=customer.controller.js.map