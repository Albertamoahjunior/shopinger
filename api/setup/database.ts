import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const connectWithDatabase = async () => {
    try {
        await prisma.$connect();
        console.log("db connected");
    } catch (error: any) {
        console.error("db not connected", error);
    }
};

export const database = prisma;
export {
    connectWithDatabase,
};
