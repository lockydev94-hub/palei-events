import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Firebase configuration — values are read from public env vars so the same
// build can target different Firebase projects (dev / staging / prod) without
// code changes. NEVER commit a populated `.env.local`.
//
// IMPORTANT: each `process.env.NEXT_PUBLIC_*` reference must appear here as a
// direct property access (not passed through a helper) so Next.js' static
// analyzer inlines the value at build time. Indirection (e.g. a `readEnv`
// function that takes the name as an argument) defeats the inliner and the
// browser ends up with `undefined`, which Firebase rejects with
// `auth/api-key-not-valid`.
const PLACEHOLDER_API_KEY = "test-key"
const PLACEHOLDER_APP_ID = "test-app-id"
const PLACEHOLDER_SENDER_ID = "1234567890"

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ""
const authDomain =
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "palei-events.firebaseapp.com"
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "palei-events"
const storageBucket =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
  "palei-events.firebasestorage.app"
const messagingSenderId =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || ""
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""

// Catch the "I forgot to copy .env.example to .env.local" case early.
// Without this guard the build silently falls back to "test-key" and
// Firebase rejects it with `auth/api-key-not-valid`. Surface a clear
// console error in the browser when the placeholder values are detected.
const missing: string[] = []
if (!apiKey || apiKey === PLACEHOLDER_API_KEY) missing.push("NEXT_PUBLIC_FIREBASE_API_KEY")
if (!messagingSenderId || messagingSenderId === PLACEHOLDER_SENDER_ID)
  missing.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID")
if (!appId || appId === PLACEHOLDER_APP_ID) missing.push("NEXT_PUBLIC_FIREBASE_APP_ID")

if (missing.length > 0 && typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.error(
    "[firebase] Missing or placeholder env vars: " +
      missing.join(", ") +
      ". Copy `website/.env.example` to `website/.env.local` and fill them in."
  )
}

const firebaseConfig = {
  apiKey: apiKey || PLACEHOLDER_API_KEY,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId: messagingSenderId || PLACEHOLDER_SENDER_ID,
  appId: appId || PLACEHOLDER_APP_ID,
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Server-side service account (used by admin-side scripts / Cloud Functions).
// Falls back to empty when running in a pure browser context.
export const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || firebaseConfig.projectId,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "",
  // The private key often contains escaped newlines (\n) in env vars — restore them.
  privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
}
