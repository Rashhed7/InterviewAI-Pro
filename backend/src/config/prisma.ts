import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function withDbRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || "";
      if (i < retries - 1 && (errMsg.includes("Can't reach database server") || errMsg.includes("Engine not started") || errMsg.includes("Connection pool"))) {
        console.log(`⚠️ Database waking up... Retrying query attempt ${i + 1}/${retries}...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
  throw lastError;
}

export default prisma;