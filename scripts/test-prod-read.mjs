// Final authoritative test against production rules:
// 1. Load service-account JSON from .env.local
// 2. Mint a Firebase ID token via the Identity Toolkit REST endpoint
//    using the service account (admin-issued tokens always carry the
//    current custom claims).
// 3. Use that token in a Firestore REST GET on users/{uid}.
// 4. Print the HTTP status — this is exactly what AuthContext's
//    `[auth] REST GET` line will show.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import crypto from "node:crypto";

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
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
console.log("project:", projectId);

function b64url(b) {
  return Buffer.from(b).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

const now = Math.floor(Date.now() / 1000);
const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
const payload = b64url(
  JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })
);
const signer = crypto.createSign("RSA-SHA256");
signer.update(`${header}.${payload}`);
const sig = b64url(signer.sign(sa.private_key));
const assertion = `${header}.${payload}.${sig}`;

const tokRes = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  }),
});
const { access_token: accessToken } = await tokRes.json();

// Look up the admin user so we have their UID.
const lookupRes = await fetch(
  `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:lookup`,
  {
    method: "POST",
    headers: { Authorization: "Bearer " + accessToken, "Content-Type": "application/json" },
    body: JSON.stringify({ localId: ["paleievents@gmail.com"] }),
  }
);
// Above won't work — lookup is by uid, not email. Use Admin SDK via fetch on Auth REST:
const userRes = await fetch(
  `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:query`,
  {
    method: "POST",
    headers: { Authorization: "Bearer " + accessToken, "Content-Type": "application/json" },
    body: JSON.stringify({ returnUserInfo: true, expression: [{ email: "paleievents@gmail.com" }] }),
  }
);
const userBody = await userRes.json();
console.log("user lookup:", userRes.status, JSON.stringify(userBody).slice(0, 200));
const uid = userBody?.userInfo?.[0]?.localId;
console.log("uid:", uid);

if (!uid) {
  console.error("no uid found, aborting");
  process.exit(1);
}

// Issue a custom token (this only works if IAM Credentials API is enabled; otherwise fall back).
let idToken;
try {
  const sa2 = JSON.parse(await readFile(saPath, "utf8"));
  const now2 = Math.floor(Date.now() / 1000);
  const h2 = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const p2 = b64url(JSON.stringify({
    iss: sa2.client_email,
    sub: sa2.client_email,
    aud: `https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit`,
    iat: now2,
    exp: now2 + 3600,
    uid,
  }));
  const s2 = crypto.createSign("RSA-SHA256");
  s2.update(`${h2}.${p2}`);
  const sig2 = b64url(s2.sign(sa2.private_key));
  const assertion2 = `${h2}.${p2}.${sig2}`;
  const ct = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:signInWithCustomToken?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: assertion2, returnSecureToken: true }),
    }
  );
  const ctBody = await ct.json();
  idToken = ctBody.idToken;
  console.log("custom-token exchange:", ct.status, "expiresIn:", ctBody.expiresIn);
  if (!idToken) console.log("ct body:", JSON.stringify(ctBody).slice(0, 200));
} catch (e) {
  console.log("custom token failed:", e.message);
}

if (!idToken) {
  console.error("no idToken; can't test");
  process.exit(1);
}

// Decode the ID token to confirm admin:true is in it.
const [, payloadB64] = idToken.split(".");
const claims = JSON.parse(Buffer.from(payloadB64, "base64").toString());
console.log("idToken claims.admin:", claims.admin, "uid:", claims.user_id || claims.sub);

// Now hit Firestore REST with that idToken.
const restUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`;
const r = await fetch(restUrl, { headers: { Authorization: "Bearer " + idToken } });
const body = await r.text();
console.log("\nFirestore REST GET status:", r.status, r.statusText);
console.log("body(first 400):", body.slice(0, 400));
