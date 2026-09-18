/**
 * Fetch the currently deployed Firestore rules via the Firebase Rules REST API.
 * This will show exactly what rules are active in production.
 */
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
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "palei-events";

// Mint a Google OAuth2 access token from the service account
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
  body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
});
const { access_token: accessToken } = await tokRes.json();

// Fetch the latest deployed Firestore rules
const rulesRes = await fetch(
  `https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets?pageSize=5`,
  { headers: { Authorization: "Bearer " + accessToken } }
);
const rulesBody = await rulesRes.json();
console.log("=== Latest Rulesets ===");
if (rulesBody.rulesets) {
  for (const rs of rulesBody.rulesets) {
    console.log("Name:", rs.name, "Created:", rs.createTime);
  }
  
  // Fetch the most recent ruleset content
  const latestName = rulesBody.rulesets[0]?.name;
  if (latestName) {
    const latestRes = await fetch(
      `https://firebaserules.googleapis.com/v1/${latestName}`,
      { headers: { Authorization: "Bearer " + accessToken } }
    );
    const latestBody = await latestRes.json();
    console.log("\n=== Latest Deployed Rules ===");
    for (const file of (latestBody.source?.files || [])) {
      console.log("File:", file.name);
      console.log(file.content);
    }
  }
} else {
  console.log("Rules response:", JSON.stringify(rulesBody, null, 2).slice(0, 1000));
}

// Also check the active release
const releaseRes = await fetch(
  `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases`,
  { headers: { Authorization: "Bearer " + accessToken } }
);
const releaseBody = await releaseRes.json();
console.log("\n=== Active Releases ===");
if (releaseBody.releases) {
  for (const rel of releaseBody.releases) {
    console.log("Release:", rel.name);
    console.log("  Ruleset:", rel.rulesetName);
    console.log("  Updated:", rel.updateTime);
  }
} else {
  console.log(JSON.stringify(releaseBody, null, 2).slice(0, 500));
}
