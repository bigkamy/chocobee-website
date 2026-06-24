import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash, randomBytes } from "node:crypto";
import { compare, hash } from "bcryptjs";

// This site has no database, so the single admin account's password override and
// password-reset token live in a local JSON file alongside data/cms.json.
const storePath = path.join(process.cwd(), "data", "admin-auth.json");
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

type ResetState = {
  tokenHash: string;
  expiresAt: number;
};

type AdminAuthStore = {
  passwordHash?: string | null;
  reset?: ResetState | null;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

async function readStore(): Promise<AdminAuthStore> {
  try {
    const raw = await readFile(storePath, "utf8");
    return JSON.parse(raw) as AdminAuthStore;
  } catch {
    return {};
  }
}

async function writeStore(store: AdminAuthStore) {
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2));
}

/** Validate a login attempt against the stored password (if set) or the env password. */
export async function verifyAdminLogin(email: string, password: string) {
  const adminEmail = getAdminEmail();
  if (!adminEmail || email.trim().toLowerCase() !== adminEmail) return false;

  const store = await readStore();
  if (store.passwordHash) {
    return compare(password, store.passwordHash);
  }

  const envPassword = process.env.ADMIN_PASSWORD;
  return Boolean(envPassword) && password === envPassword;
}

/** Persist a new admin password (hashed) and clear any pending reset token. */
export async function setAdminPassword(plainPassword: string) {
  const store = await readStore();
  store.passwordHash = await hash(plainPassword, 10);
  store.reset = null;
  await writeStore(store);
}

/** Create a single-use reset token, store its hash + expiry, and return the raw token. */
export async function createResetToken() {
  const token = randomBytes(32).toString("hex");
  const store = await readStore();
  store.reset = { tokenHash: hashToken(token), expiresAt: Date.now() + RESET_TOKEN_TTL_MS };
  await writeStore(store);
  return token;
}

/** True if the raw token matches the stored, unexpired reset token. */
export async function isResetTokenValid(token: string) {
  if (!token) return false;
  const store = await readStore();
  if (!store.reset) return false;
  if (store.reset.expiresAt < Date.now()) return false;
  return store.reset.tokenHash === hashToken(token);
}

/** Validate a reset token and, if valid, set the new password. Returns success. */
export async function resetPasswordWithToken(token: string, newPassword: string) {
  if (!(await isResetTokenValid(token))) return false;
  await setAdminPassword(newPassword);
  return true;
}
