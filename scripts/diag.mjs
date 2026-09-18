import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const envRaw = await readFile(resolve(process.cwd(), ".env.local"), "utf8");
for (const line of envRaw.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
  if (!m) continue;
  let v = m[2].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  process.env[m[1]] = v;
}
const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const sa = JSON.parse(await readFile(saPath, "utf8"));

const { initializeApp, cert, getApps } = await import("firebase-admin/app");
const { getAuth } = await import("firebase-admin/auth");
const { getFirestore } = await import("firebase-admin/firestore");
const app = getApps()[0] || initializeApp({ credential: cert(sa) });
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = "paleievents@gmail.com";
const user = await auth.getUserByEmail(ADMIN_EMAIL);
console.log("=== USER ===");
console.log("uid:", user.uid);
console.log("email:", user.email);
console.log("emailVerified:", user.emailVerified);
console.log("disabled:", user.disabled);
console.log("validSince:", user.tokensValidAfterTime, "=>", new Date(user.tokensValidAfterTime).toISOString());
console.log("metadata:", JSON.stringify({
  creationTime: user.metadata.creationTime,
  lastRefreshTime: user.metadata.lastRefreshTime,
  lastSignInTime: user.metadata.lastSignInTime,
}));

// Print the user doc as it actually exists in Firestore.
const docSnap = await db.collection("users").doc(user.uid).get();
console.log("\n=== USER DOC ===");
console.log("exists:", docSnap.exists);
if (docSnap.exists) {
  console.log("data:", JSON.stringify(docSnap.data(), null, 2));
}
