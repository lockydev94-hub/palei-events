import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const setIfMissing = (k, v) => { if (v && !process.env[k]) process.env[k] = v; };
try {
  const raw = await readFile(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    setIfMissing(m[1], v);
  }
} catch {}

const { initializeApp, applicationDefault, getApps } = await import("firebase-admin/app");
const { getAuth } = await import("firebase-admin/auth");
const app = getApps()[0] || initializeApp({ credential: applicationDefault() });
const auth = getAuth(app);

const user = await auth.getUserByEmail("paleievents@gmail.com");
console.log("uid:", user.uid);
const customToken = await auth.createCustomToken(user.uid, { admin: true });
console.log("custom token (with admin claim):", customToken.slice(0, 60) + "...");
const idToken = await auth.createSessionCookie
  ? null
  : null;
console.log("\nverify by decoding token claims:");
const parts = customToken.split(".");
const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
console.log("claims:", JSON.stringify(payload.claims || {}, null, 2));
console.log("uid in token:", payload.uid);
