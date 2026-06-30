import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/chocobeecake?schema=public";

// Amplify SSR runs each request in a short-lived Lambda. Without RDS Proxy, a
// large per-instance pool would quickly exhaust Postgres connections, so keep
// the pool tiny and let idle connections close promptly.
const isLocalDb = /@(localhost|127\.0\.0\.1)\b/.test(connectionString);
const pool = new Pool({
  connectionString,
  max: Number(process.env.PG_POOL_MAX ?? 2),
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
  // RDS requires TLS (rds.force_ssl). The cert is signed by the Amazon RDS CA,
  // which isn't in the default trust store, so don't verify the chain.
  ssl: isLocalDb ? undefined : { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
