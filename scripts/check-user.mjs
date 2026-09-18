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
const { getFirestore } = await import("firebase-admin/firestore");

const app = getApps()[0] || initializeApp({ credential: applicationDefault() });
const auth = getAuth(app);
const db = getFirestore(app);

const targetEmail = "paleievents@gmail.com";
const user = await auth.getUserByEmail(targetEmail);
console.log("uid:", user.uid);
console.log("email:", user.email);
console.log("custom claims:", JSON.stringify(user.customClaims));
console.log("tokensValidAfterTime:", user.tokensValidAfterTime);

const userDoc = await db.collection("users").doc(user.uid).get();
console.log(`users/${user.uid} exists:`, userDoc.exists);
if (userDoc.exists) console.log("data:", JSON.stringify(userDoc.data(), null, 2));

const emailDoc = await db.collection("users").doc(targetEmail).get();
console.log(`users/${targetEmail} exists:`, emailDoc.exists);

// Test what rules see: a tokenResult from a simulated signed-in user.
// We can't do that without a real signed-in session, so just print what
// the rule would see for this uid.
console.log("\nrules will see: request.auth.uid =", user.uid, "request.auth.token.admin =", user.customClaims?.admin === true);
