import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "niyi-aniya-ministry-secure-secret-2026";
const COOKIE_NAME = "admin_session";

// Create HMAC signature for the session cookie
export function generateToken(): string {
  const payload = `admin_${Date.now()}`;
  const hmac = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

export function verifyToken(token?: string | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, hmac] = parts;
  const expectedHmac = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac));
}

export async function loginAdminAction(password: string): Promise<{ success: boolean; error?: string }> {
  if (!password) {
    return { success: false, error: "Password is required" };
  }

  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: "Incorrect admin password" };
  }

  const token = generateToken();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { success: true };
}

export async function logoutAdminAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifyToken(token);
}
