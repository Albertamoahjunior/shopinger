"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectWithDatabase = exports.database = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const connectWithDatabase = async () => {
    try {
        await prisma.$connect();
        console.log("db connected");
    }
    catch (error) {
        console.error("db not connected", error);
    }
};
exports.connectWithDatabase = connectWithDatabase;
exports.database = prisma;
//# sourceMappingURL=database.js.map