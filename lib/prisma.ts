import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
neonConfig.webSocketConstructor = ws;

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma: PrismaClient = (global as any).prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV === 'development') (global as any).prisma = prisma;
export default prisma;
