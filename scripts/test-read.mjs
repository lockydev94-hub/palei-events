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

const { initializeApp, applicationDefault, cert, getApps } = await import("firebase-admin/app");
const { getAuth } = await import("firebase-admin/auth");
const { getFirestore } = await import("firebase-admin/firestore");

// Use the JSON service account explicitly so we have full perms.
const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
console.log("Using service account:", saPath);

const app = getApps()[0] || initializeApp({ credential: applicationDefault() });
const auth = getAuth(app);
const db = getFirestore(app);

// 1. Get the user
const user = await auth.getUserByEmail("paleievents@gmail.com");
console.log("uid:", user.uid);
console.log("claims:", user.customClaims);

// 2. Mint a custom token with admin claim
const customToken = await auth.createCustomToken(user.uid, { admin: true });
console.log("custom token created (admin claim embedded)");

// 3. Verify the profile doc exists
const profileRef = db.collection("users").doc(user.uid);
const profileSnap = await profileRef.get();
console.log("profile exists:", profileSnap.exists);
if (profileSnap.exists) console.log("role:", profileSnap.data().role);

// 4. Try reading the profile with Admin SDK privileges — this bypasses rules
console.log("\nreading profile with admin privs (should always work):");
try {
  const data = (await profileRef.get()).data();
  console.log("OK:", JSON.stringify(data).slice(0, 200));
} catch (e) {
  console.log("FAILED:", e.message);
}

// 5. Print all collections at top level
console.log("\nlisting top-level collections:");
const collections = await db.listCollections();
for (const col of collections) {
  console.log("  -", col.id);
}
