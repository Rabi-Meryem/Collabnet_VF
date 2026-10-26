// lib/prisma.js
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

console.log('🔧 Initialisation Prisma...');
console.log('🔧 DATABASE_URL:', process.env.DATABASE_URL);

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

console.log('✅ Prisma initialisé:', !!prisma);

export { prisma };
