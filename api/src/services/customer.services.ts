import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const exist = async (email: string) => {
    try {
        const customer = await prisma.customers.findMany({
            where: {
                email: email,
            }
        });
        return customer;
    } catch (error: any) {
        console.error("Error finding customer:", error);
        throw error;
    }
};

const add_customer = async (first_name: string, last_name: string, tel_number: string, email: string, password: string) => {
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
    } catch (error: any) {
        console.error("Error adding customer:", error);
        throw error;
    }
};

export {
    exist,
    add_customer,
};
