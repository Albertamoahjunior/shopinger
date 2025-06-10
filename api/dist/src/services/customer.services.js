"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_customer = exports.exist = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const exist = async (email) => {
    try {
        const customer = await prisma.customers.findMany({
            where: {
                email: email,
            }
        });
        return customer;
    }
    catch (error) {
        console.error("Error finding customer:", error);
        throw error;
    }
};
exports.exist = exist;
const add_customer = async (first_name, last_name, tel_number, email, password) => {
    try {
        const customer = await prisma.customers.create({
            data: {
                first_name: first_name,
                last_name: last_name,
                tel_number: tel_number,
                email: email,
                password: password,
            }
        });
        return customer;
    }
    catch (error) {
        console.error("Error adding customer:", error);
        throw error;
    }
};
exports.add_customer = add_customer;
//# sourceMappingURL=customer.services.js.map