"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const get_workers = async (req, res) => {
    try {
        const workers = await prisma.workers.findMany();
        res.status(200).json(workers);
    }
    catch (error) {
        console.error("Error getting workers:", error);
        res.status(500).send("Internal Server Error");
    }
};
const get_worker_by_id = async (req, res) => {
    try {
        const { id } = req.params;
        const worker = await prisma.workers.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        if (!worker) {
            return res.status(404).send("Worker not found");
        }
        res.status(200).json(worker);
    }
    catch (error) {
        console.error("Error getting worker by id:", error);
        res.status(500).send("Internal Server Error");
    }
};
const add_worker = async (req, res) => {
    try {
        const { first_name, last_name, role, dob, id_number, email, password, tel_number } = req.body;
        const worker = await prisma.workers.create({
            data: {
                first_name,
                last_name,
                role,
                dob,
                id_number,
                email,
                password,
                tel_number,
            },
        });
        res.status(201).json(worker);
    }
    catch (error) {
        console.error("Error adding worker:", error);
        res.status(500).send("Internal Server Error");
    }
};
const remove_worker = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.workers.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(204).send("Worker deleted");
    }
    catch (error) {
        console.error("Error removing worker:", error);
        res.status(500).send("Internal Server Error");
    }
};
const update_worker = async (req, res) => {
    try {
        const { first_name, last_name, role, dob, id_number, email, password, tel_number } = req.body;
        const { id } = req.params;
        const worker = await prisma.workers.update({
            where: {
                id: parseInt(id),
            },
            data: {
                first_name,
                last_name,
                role,
                dob,
                id_number,
                email,
                password,
                tel_number,
            },
        });
        res.status(200).json(worker);
    }
    catch (error) {
        console.error("Error updating worker:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.default = {
    get_workers,
    get_worker_by_id,
    add_worker,
    remove_worker,
    update_worker,
};
//# sourceMappingURL=worker.controller.js.map