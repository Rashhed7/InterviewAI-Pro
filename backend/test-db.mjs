import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    await prisma.$connect();
    console.log("✅ DB_CONNECTED: Connected to PostgreSQL Neon DB successfully!");
    const count = await prisma.user.count();
    console.log(`Current user count: ${count}`);
  } catch (error) {
    console.error("❌ DB_CONNECTION_FAILED:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
