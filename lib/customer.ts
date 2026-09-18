/**
 * Customer-portal data layer.
 *
 * Collections used here (see firestore.rules for the matching access rules):
 *  - planRequests  — customer → admin plan requests (the approval gate)
 *  - rsvps         — guest RSVPs written by the public event page
 *  - wishes        — guest wishes written by the public event page
 *  - events        — customer-owned events (createdBy = uid)
 *  - subscriptions — one active sub per customer, admin-managed
 */
import {
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  orderBy,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore"
import { db, adminDb } from "@/lib/firebase"
import {
  createEvent,
  deleteEvent,
  updateEvent,
  type FirestoreEvent,
} from "@/lib/firestore"

// ── Plan requests (the approval gate) ────────────────────────────

export type PlanRequestStatus = "pending" | "approved" | "rejected"
export type PlanTier = "celebration" | "premium" | "business" | "enterprise"

export interface PlanRequest {
  id: string
  uid: string
  email: string
  displayName?: string
  plan: PlanTier
  message?: string
  status: PlanRequestStatus
  createdAt?: string
  reviewedAt?: string
  reviewedBy?: string
  adminNote?: string
}

const PLAN_REQUESTS_COLLECTION = "planRequests"

/**
 * Submit a plan request. One *pending* request per customer at a time —
 * an earlier rejected request does not block a new one.
 */
export async function submitPlanRequest(input: {
  uid: string
  email: string
  displayName?: string
  plan: PlanTier
  message?: string
}): Promise<string> {
  const pending = await getMyPlanRequest(input.uid, "pending")
  if (pending) {
    throw new Error("You already have a plan request under review.")
  }

  const ref = doc(collection(db, PLAN_REQUESTS_COLLECTION))
  const body = {
    uid: input.uid,
    email: input.email,
    ...(input.displayName ? { displayName: input.displayName } : {}),
    plan: input.plan,
    ...(input.message ? { message: input.message } : {}),
    status: "pending" as const,
    createdAt: new Date().toISOString(),
  }
  await setDoc(ref, body)
  return ref.id
}

/** Latest request for this customer, optionally filtered by status. */
export async function getMyPlanRequest(
  uid: string,
  status?: PlanRequestStatus
): Promise<PlanRequest | null> {
  const all = await getMyPlanRequests(uid)
  const filtered = status ? all.filter((r) => r.status === status) : all
  return filtered[0] ?? null
}

/** All requests for this customer, newest first. */
export async function getMyPlanRequests(uid: string): Promise<PlanRequest[]> {
  try {
    const base = query(
      collection(db, PLAN_REQUESTS_COLLECTION),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    )
    const snap = await getDocs(base)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PlanRequest[]
  } catch (err) {
    console.warn("[customer] plan request fetch failed:", err)
    return []
  }
}

/** Live subscription to the customer's plan requests (status updates). */
export function subscribeToMyPlanRequests(
  uid: string,
  cb: (requests: PlanRequest[]) => void
): Unsubscribe {
  const q = query(
    collection(db, PLAN_REQUESTS_COLLECTION),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  )
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PlanRequest[]),
    (err) => console.warn("[customer] plan request listener failed:", err)
  )
}

// ── Admin review actions (admin claim required by rules) ─────────

/**
 * Admin review actions (admin claim required by rules).
 *
 * These always run on the ADMIN session (adminDb): the rules only let an
 * admin claim update planRequests, set users/{uid}.plan, or create
 * subscriptions. With both sessions living side by side (see
 * lib/firebase.ts), routing through adminDb keeps admin actions working
 * even when the browser also holds a customer session.
 */
export async function approvePlanRequest(
  request: PlanRequest,
  actor: { uid: string; email: string }
): Promise<void> {
  await updateDoc(doc(adminDb, PLAN_REQUESTS_COLLECTION, request.id), {
    status: "approved" as PlanRequestStatus,
    reviewedAt: new Date().toISOString(),
    reviewedBy: actor.email || actor.uid,
  })
  await updateDoc(doc(adminDb, "users", request.uid), {
    plan: request.plan,
    updatedAt: new Date().toISOString(),
  })
  await setDoc(doc(collection(adminDb, "subscriptions")), {
    userId: request.uid,
    plan: request.plan,
    status: "active",
    currentPeriodStart: new Date().toISOString(),
    // No billing integration yet — 1 year admin-managed period.
    currentPeriodEnd: new Date(Date.now() + 365 * 864e5).toISOString(),
    cancelAtPeriodEnd: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: { version: 1 },
  })
}

/** Admin rejects a plan request with an optional note to the customer. */
export async function rejectPlanRequest(
  request: PlanRequest,
  actor: { uid: string; email: string },
  adminNote?: string
): Promise<void> {
  await updateDoc(doc(adminDb, PLAN_REQUESTS_COLLECTION, request.id), {
    status: "rejected" as PlanRequestStatus,
    reviewedAt: new Date().toISOString(),
    reviewedBy: actor.email || actor.uid,
    ...(adminNote?.trim() ? { adminNote: adminNote.trim() } : {}),
  })
}

/** All plan requests, newest first (admin queue). */
export async function getPlanRequests(): Promise<PlanRequest[]> {
  try {
    const snap = await getDocs(
      query(collection(adminDb, PLAN_REQUESTS_COLLECTION), orderBy("createdAt", "desc"))
    )
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PlanRequest[]
  } catch (err) {
    console.warn("[admin] plan requests fetch failed:", err)
    return []
  }
}

// ── Plan access gate ─────────────────────────────────────────────

export interface PlanAccess {
  /** true once an admin has approved a plan (or profile.plan != "free"). */
  approved: boolean
  plan: string
  /** Current pending/approved/rejected request status, if any. */
  requestStatus: PlanRequestStatus | null
  /** The plan the pending/approved request is for, when present. */
  requestedPlan?: PlanTier
  adminNote?: string
}

/**
 * Decide whether the customer may use the dashboard.
 *
 * A customer is approved when their profile carries a paid plan, an active
 * subscription doc exists, or an admin approved one of their requests.
 */
export async function getPlanAccess(uid: string): Promise<PlanAccess> {
  // 1. Profile plan (admin sets users/{uid}.plan on approval).
  let plan = "free"
  try {
    const userSnap = await getDoc(doc(db, "users", uid))
    if (userSnap.exists()) {
      plan = (userSnap.data() as { plan?: string }).plan || "free"
    }
  } catch {
    // Profile may not exist yet for brand-new registrations.
  }
  if (plan !== "free") {
    return { approved: true, plan, requestStatus: null }
  }

  // 2. Any request history — pending means "under review", approved (rare
  //    here because approval flips the profile) still counts, rejected
  //    allows re-applying.
  const latest = await getMyPlanRequest(uid)
  if (latest) {
    if (latest.status === "approved") {
      return {
        approved: true,
        plan: latest.plan,
        requestStatus: "approved",
        requestedPlan: latest.plan,
      }
    }
    return {
      approved: false,
      plan,
      requestStatus: latest.status,
      requestedPlan: latest.plan,
      adminNote: latest.adminNote,
    }
  }

  return { approved: false, plan, requestStatus: null }
}

// ── RSVPs (live, per event owner) ────────────────────────────────

export interface Rsvp {
  id: string
  eventId: string
  ownerId: string
  name: string
  guests: string
  message?: string
  createdAt?: string
}

/** Live RSVP feed across all of the customer's events. */
export function subscribeToRsvps(
  ownerId: string,
  cb: (rsvps: Rsvp[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "rsvps"),
    where("ownerId", "==", ownerId),
    orderBy("createdAt", "desc")
  )
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Rsvp[]),
    (err) => console.warn("[customer] rsvp listener failed:", err)
  )
}

// ── Wishes (live, per event owner) ───────────────────────────────

export interface Wish {
  id: string
  eventId: string
  ownerId: string
  name: string
  relation?: string
  message: string
  createdAt?: string
}

/** Live wish feed across all of the customer's events. */
export function subscribeToWishes(
  ownerId: string,
  cb: (wishes: Wish[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "wishes"),
    where("ownerId", "==", ownerId),
    orderBy("createdAt", "desc")
  )
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Wish[]),
    (err) => console.warn("[customer] wish listener failed:", err)
  )
}

/** The event owner may remove a wish from their wall. */
export async function deleteWish(id: string): Promise<void> {
  await deleteDoc(doc(db, "wishes", id))
}

// ── Customer-owned events ────────────────────────────────────────

/** Live list of the customer's own events (drafts included). */
export function subscribeToMyEvents(
  uid: string,
  cb: (events: FirestoreEvent[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "events"),
    where("createdBy", "==", uid),
    orderBy("createdAt", "desc")
  )
  return onSnapshot(
    q,
    (snap) =>
      cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as FirestoreEvent[]),
    (err) => console.warn("[customer] events listener failed:", err)
  )
}

/** Create an event owned by this customer (always starts as a draft). */
export function createMyEvent(
  uid: string,
  data: Partial<FirestoreEvent>
): Promise<string> {
  return createEvent({
    ...data,
    createdBy: uid,
    status: "draft",
  })
}

/** Edit one of the customer's own events. */
export function updateMyEvent(
  id: string,
  data: Partial<FirestoreEvent>
): Promise<void> {
  return updateEvent(id, data)
}

/** Delete one of the customer's own events. */
export function deleteMyEvent(id: string): Promise<void> {
  return deleteEvent(id)
}
