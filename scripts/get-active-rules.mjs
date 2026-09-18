/**
 * Fetch the ACTIVE Firestore rules (the ruleset pointed to by the active release).
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

// Get active release
const releaseRes = await fetch(
  `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases/cloud.firestore`,
  { headers: { Authorization: "Bearer " + accessToken } }
);
const releaseBody = await releaseRes.json();
console.log("Active release:", JSON.stringify(releaseBody, null, 2));

const activeRulesetName = releaseBody.rulesetName;
console.log("\nActive ruleset name:", activeRulesetName);

// Fetch the ACTIVE ruleset content
if (activeRulesetName) {
  const rulesetRes = await fetch(
    `https://firebaserules.googleapis.com/v1/${activeRulesetName}`,
    { headers: { Authorization: "Bearer " + accessToken } }
  );
  const rulesetBody = await rulesetRes.json();
  console.log("\n=== ACTIVE Deployed Rules Content ===");
  for (const file of (rulesetBody.source?.files || [])) {
    console.log("File:", file.name);
    console.log(file.content);
  }
}
