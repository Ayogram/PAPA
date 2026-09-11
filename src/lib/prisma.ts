import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let dbUrl =
  process.env.DATABASE_URL ||
  process.env.PRISMA_DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  "";

if (!dbUrl) {
  if (process.env.NODE_ENV === "production") {
    console.error("CRITICAL: DATABASE_URL environment variable is missing on Vercel!");
  } else {
    dbUrl = "postgresql://postgres:admin123@localhost:5432/papas_web?schema=public";
  }
}

if (dbUrl && dbUrl.includes("-pooler") && !dbUrl.includes("pgbouncer=true")) {
  dbUrl += dbUrl.includes("?") ? "&pgbouncer=true" : "?pgbouncer=true";
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
