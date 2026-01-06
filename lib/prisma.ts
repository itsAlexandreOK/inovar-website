import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const datasourceUrl = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";

const pool = new Pool({ connectionString: datasourceUrl });
const adapter = new PrismaPg(pool);

// Ensure a single PrismaClient instance across hot reloads
const globalForPrisma = (globalThis as any);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
