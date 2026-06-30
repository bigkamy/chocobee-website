// Seeds the CmsDocument "cms" row in Postgres from the bundled data/cms.json.
// Idempotent: re-running overwrites the row. The app also self-seeds on first
// read, so this is mainly a connectivity check + immediate data load.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const isLocal = /@(localhost|127\.0\.0\.1)\b/.test(connectionString);
const pool = new Pool({ connectionString, ssl: isLocal ? undefined : { rejectUnauthorized: false } });

const raw = await readFile(path.join(process.cwd(), "data", "cms.json"), "utf8");
const data = JSON.parse(raw);

await pool.query(
  `INSERT INTO "CmsDocument" ("key", "data", "updatedAt")
   VALUES ($1, $2, now())
   ON CONFLICT ("key") DO UPDATE SET "data" = EXCLUDED."data", "updatedAt" = now()`,
  ["cms", data],
);

console.log("Seeded CmsDocument 'cms' from data/cms.json.");
await pool.end();
