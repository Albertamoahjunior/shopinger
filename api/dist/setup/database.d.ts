import { PrismaClient } from '@prisma/client';
declare const connectWithDatabase: () => Promise<void>;
export declare const database: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export { connectWithDatabase, };
