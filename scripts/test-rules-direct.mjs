/**
 * Test Firestore rules by:
 * 1. Using Admin SDK to create a custom token for the admin user
 * 2. Exchanging the custom token for an ID token via Firebase REST API
 * 3. Using that ID token to hit the Firestore REST API
 * 4. Decoding the token to confirm claims
 */
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

const { initializeApp, cert, getApps } = await import("firebase-admin/app");
const { getAuth } = await import("firebase-admin/auth");

const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const sa = JSON.parse(await readFile(saPath, "utf8"));
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "palei-events";
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

const app = getApps()[0] || initializeApp({ credential: cert(sa) });
const auth = getAuth(app);

const ADMIN_EMAIL = "paleievents@gmail.com";
const user = await auth.getUserByEmail(ADMIN_EMAIL);
console.log("uid:", user.uid);
console.log("customClaims:", JSON.stringify(user.customClaims));
console.log("tokensValidAfterTime:", user.tokensValidAfterTime);
console.log("");

// Create a custom token WITH the admin claim
const customToken = await auth.createCustomToken(user.uid, { admin: true });
console.log("Custom token created (first 80 chars):", customToken.slice(0, 80) + "...");

// Decode to verify claims
const parts = customToken.split(".");
const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
console.log("Custom token claims field:", JSON.stringify(payload.claims));
console.log("Custom token uid:", payload.uid);
console.log("");

// Exchange the custom token for an ID token via Firebase Auth REST API
console.log("Exchanging custom token for ID token via REST API...");
const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`;
const signInRes = await fetch(signInUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ token: customToken, returnSecureToken: true }),
});
const signInText = await signInRes.text();
console.log("Sign-in response status:", signInRes.status);

let idToken;
let refreshToken;
try {
  const signInBody = JSON.parse(signInText);
  idToken = signInBody.idToken;
  refreshToken = signInBody.refreshToken;
  if (idToken) {
    console.log("Got ID token (first 80 chars):", idToken.slice(0, 80) + "...");
    // Decode to check claims
    const [, b64] = idToken.split(".");
    const claims = JSON.parse(Buffer.from(b64, "base64").toString());
    console.log("ID token claims.admin:", claims.admin);
    console.log("ID token uid:", claims.user_id || claims.sub);
    console.log("ID token iat:", new Date(claims.iat * 1000).toISOString());
    console.log("ID token exp:", new Date(claims.exp * 1000).toISOString());
  } else {
    console.error("No idToken in response:", signInText.slice(0, 300));
    process.exit(1);
  }
} catch (e) {
  console.error("Failed to parse sign-in response:", signInText.slice(0, 300));
  process.exit(1);
}

// Test Firestore REST API with this ID token
console.log("\nTesting Firestore REST API...");
const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${user.uid}`;
const fsRes = await fetch(firestoreUrl, {
  headers: { Authorization: "Bearer " + idToken },
});
const fsBody = await fsRes.text();
console.log("Firestore REST GET status:", fsRes.status, fsRes.statusText);
if (fsRes.ok) {
  console.log("SUCCESS - Firestore read allowed!");
  const doc = JSON.parse(fsBody);
  const fields = doc.fields || {};
  console.log("Document role:", fields.role?.stringValue);
  console.log("Document plan:", fields.plan?.stringValue);
} else {
  console.log("FAILED - body:", fsBody.slice(0, 400));
}

// Now test without admin claim (as just an owner)
console.log("\n--- Testing as owner (no admin claim override) ---");
const customTokenNoAdmin = await auth.createCustomToken(user.uid, {});
const signInRes2 = await fetch(signInUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ token: customTokenNoAdmin, returnSecureToken: true }),
});
const signInBody2 = await signInRes2.json();
const idToken2 = signInBody2.idToken;
if (idToken2) {
  const [, b64_2] = idToken2.split(".");
  const claims2 = JSON.parse(Buffer.from(b64_2, "base64").toString());
  console.log("Token2 claims.admin:", claims2.admin, "uid:", claims2.user_id || claims2.sub);
  
  const fsRes2 = await fetch(firestoreUrl, {
    headers: { Authorization: "Bearer " + idToken2 },
  });
  const fsBody2 = await fsRes2.text();
  console.log("Firestore REST GET (as owner, no admin claim) status:", fsRes2.status, fsRes2.statusText);
  if (!fsRes2.ok) {
    console.log("FAILED body:", fsBody2.slice(0, 200));
  } else {
    console.log("SUCCESS - isOwner rule works!");
  }
}
