// Run via:  firebase emulators:exec --only firestore --project palei-events "node scripts/test-rule.mjs"
//
// Sets up: writes a fake users/{uid} doc, signs in a fake auth user with
// admin:true claim, tries the same getDoc that AuthContext does, and prints
// whether the read succeeded or was denied.

import { initializeApp, applicationDefault, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// The emulators ignore the service-account JSON; we just need an init call.
const app = getApps()[0] || initializeApp({ projectId: "demo-test" });
const auth = getAuth(app);
const db = getFirestore(app);

const TEST_UID = "test-admin-uid";

// 1. Seed the user profile (Admin SDK bypasses rules, so this always works).
await db.collection("users").doc(TEST_UID).set({
  uid: TEST_UID,
  email: "test@example.com",
  role: "super-admin",
  plan: "enterprise",
  createdAt: new Date().toISOString(),
});
console.log("seeded users/" + TEST_UID);

// 2. Mint a custom token with admin:true claim (simulates a signed-in admin).
const customToken = await auth.createCustomToken(TEST_UID, { admin: true });
console.log("custom token minted");

// 3. Use the regular firebase JS SDK (the one the browser uses) to sign in
//    with that custom token, then read users/{uid} as that user. This goes
//    through the emulator's rule engine.
const { initializeApp: initClientApp } = await import("firebase/app");
const { getAuth: getClientAuth, signInWithCustomToken } = await import("firebase/auth");
const { getFirestore: getClientDb, doc, getDoc } = await import("firebase/firestore");

// Connect to the emulator (host/port set by FIREBASE_EMULATOR_HUB env vars,
// but the JS SDK auto-connects when FIREBASE_FIRESTORE_EMULATOR_HOST and
// FIREBASE_AUTH_EMULATOR_HOST are set).
const clientApp = initClientApp({
  apiKey: "fake-api-key",
  projectId: "demo-test",
});
const clientAuth = getClientAuth(clientApp);
const clientDb = getClientDb(clientApp);

const cred = await signInWithCustomToken(clientAuth, customToken);
console.log("signed in as:", cred.user.uid);

// 4. Try the read that AuthContext does
try {
  const snap = await getDoc(doc(clientDb, "users", TEST_UID));
  if (snap.exists()) {
    console.log("READ OK — profile found:", JSON.stringify(snap.data()));
  } else {
    console.log("READ OK — but doc doesn't exist");
  }
} catch (e) {
  console.log("READ DENIED:", e.code, e.message);
}

process.exit(0);
