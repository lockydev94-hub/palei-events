/**
 * Firestore Data Service
 *
 * Provides CRUD operations for all Firestore collections.
 * Falls back to hardcoded data from /data/*.ts when Firestore is unavailable
 * or has no data for a given collection.
 *
 * Conventions enforced here so admin code never has to think about them:
 *   - Every write injects a `metadata: { version, createdAt?, updatedAt }` envelope.
 *   - Updates bump `metadata.version` monotonically.
 *   - On `status: "published"` transitions, `metadata.publishedAt` is stamped.
 *   - Audit log entries are written alongside every mutation when an actor
 *     is provided (so the admin UI doesn't have to remember).
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
  Timestamp,
  type FieldValue,
  type Firestore,
} from "firebase/firestore"
import { db as publicDb, adminDb } from "./firebase"

// ── Types ──────────────────────────────────────────────────────
/**
 * Which session's credentials a Firestore call should use.
 *
 * The admin console and the customer portal hold SEPARATE Firebase Auth
 * sessions (separate app instances in lib/firebase.ts), so every operation
 * must be routed through the right one — an admin billing action run with a
 * customer token would fail the rules with "Missing or insufficient
 * permissions", and public reads must stay on the public session.
 */
export type FirestoreContext = "public" | "admin"

import type { Event, EventType } from "@/data/events"
import type { Template } from "@/data/templates"
import type { Template as TemplateType } from "@/data/templates"
import type { BlogPost as BlogPostType } from "@/data/blog"

/** Admin-only lifecycle fields stored on blogPost docs but not part of the
 *  public content shape. Kept here so admin UIs can edit them type-safely. */
export type BlogPostStatus = "draft" | "published" | "archived"
export interface FirestoreBlogPost extends BlogPostType {
  status: BlogPostStatus
  createdBy?: string
  createdAt?: string
  updatedAt?: string
  metadata?: { version: number; viewCount?: number }
}
import type { Feature as FeatureType } from "@/data/features"
import type { PricingPlan as PricingPlanType } from "@/data/pricing"
import type { Solution as SolutionType } from "@/data/solutions"

// ── Hardcoded fallback data ────────────────────────────────────
import { demoEvents } from "@/data/events"
import { templates } from "@/data/templates"
import { blogPosts } from "@/data/blog"
import { features } from "@/data/features"
import { pricingPlans } from "@/data/pricing"
import { solutions } from "@/data/solutions"
import { site } from "@/data/site"

// ── Helpers ────────────────────────────────────────────────────

function tsToISO(ts: any): string {
  if (!ts) return new Date().toISOString()
  if (typeof ts === "string") return ts
  if (ts instanceof Timestamp) return ts.toDate().toISOString()
  if (ts?.toDate) return ts.toDate().toISOString()
  return new Date().toISOString()
}

function stripUndefined(obj: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  )
}

/**
 * Strip transient client-only fields from a doc body before writing.
 * These are recomputed on read so persisting them would just drift.
 */
function stripClientFields(obj: Record<string, any>): Record<string, any> {
  const {
    id, // Firestore doc id, never store it inside the doc
    createdAt, updatedAt, // we set our own via metadata envelope
    ...rest
  } = obj
  return rest
}

/** Audit-log actor. The admin UI passes its current user through here. */
export interface AuditActor {
  uid: string
  email?: string | null
}

interface WriteOptions {
  /** When provided, every mutation writes an audit-log entry. */
  actor?: AuditActor | null
  /** Which session to run with — admin pages pass "admin" here. */
  ctx?: FirestoreContext
}

/**
 * Build the metadata envelope for a new document.
 * `version` starts at 1; subsequent updates increment it.
 */
function newMetadata(): Record<string, any> {
  return {
    metadata: {
      version: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  }
}

/**
 * Build the metadata delta for an update. Reads the current version and
 * bumps it by 1. If the doc doesn't exist (race), starts at 1.
 */
async function bumpMetadata(
  ref: ReturnType<typeof doc>
): Promise<Record<string, any>> {
  try {
    const snap = await getDoc(ref)
    const current = snap.exists()
      ? Number(snap.data()?.metadata?.version ?? 0)
      : 0
    return {
      metadata: {
        version: current + 1,
        updatedAt: serverTimestamp(),
      },
    }
  } catch {
    return {
      metadata: {
        version: 1,
        updatedAt: serverTimestamp(),
      },
    }
  }
}

/**
 * Best-effort audit log; never throws so it can't break the main write.
 * Audit entries are admin-console artifacts — the rules only allow writes
 * with the admin claim, so this always runs on the admin session.
 */
async function safeAudit(
  collectionName: string,
  documentId: string,
  action: string,
  actor: AuditActor | null | undefined,
  after: any,
  before?: any
) {
  if (!actor) return
  try {
    const ref = doc(collection(adminDb, "auditLogs"))
    await setDoc(ref, stripUndefined({
      actor: actor.email || actor.uid,
      actorId: actor.uid,
      action,
      collection: collectionName,
      documentId,
      before: before ?? null,
      after: after ?? null,
      timestamp: new Date().toISOString(),
    }))
  } catch (err) {
    console.warn("audit log write failed", err)
  }
}

/**
 * Resolve the Firestore instance for a call site.
 *
 * "public" → the default app's session (customer portal / anonymous).
 * "admin"  → the admin console's session (separate Firebase app — both
 *             sessions can coexist in one browser; see lib/firebase.ts).
 *
 * Every helper below binds a local `const db = dbFor(opts?.ctx ?? ctx)` — refs and
 * queries created from it carry the right credentials for all reads,
 * writes and listener results.
 */
function dbFor(ctx: FirestoreContext): Firestore {
  return ctx === "admin" ? adminDb : publicDb
}

// ── Events ─────────────────────────────────────────────────────

export interface FirestoreEvent extends Event {
  status: "draft" | "published" | "archived"
  createdBy?: string
  createdAt?: string
  updatedAt?: string
  rsvpCount?: number
  wishCount?: number
  galleryItemCount?: number
  metadata?: {
    version: number
    publishedAt?: string
    rsvpCount?: number
    wishCount?: number
    galleryItemCount?: number
  }
}

export type { BlogPostType as BlogPost, TemplateType as Template, FeatureType as Feature, PricingPlanType as PricingPlan, SolutionType as Solution }

const EVENTS_COLLECTION = "events"

export async function getEvents(status?: string, ctx: FirestoreContext = "public"): Promise<FirestoreEvent[]> {
  const db = dbFor(ctx)
  try {
    let q
    if (status) {
      q = query(
        collection(db, EVENTS_COLLECTION),
        where("status", "==", status),
        orderBy("createdAt", "desc")
      )
    } else {
      q = query(
        collection(db, EVENTS_COLLECTION),
        orderBy("createdAt", "desc")
      )
    }
    const snap = await getDocs(q)
    if (snap.empty) return demoEvents as FirestoreEvent[]
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as FirestoreEvent[]
  } catch (err) {
    console.warn("Firestore events fetch failed, using fallback data:", err)
    return demoEvents as FirestoreEvent[]
  }
}

export async function getEventBySlug(slug: string, ctx: FirestoreContext = "public"): Promise<FirestoreEvent | null> {
  const db = dbFor(ctx)
  try {
    // IMPORTANT: filter by status here. Firestore security rules reject any
    // list query that *could* return a draft for a caller without the admin
    // claim — including anonymous visitors and the build-time server. A
    // slug-only query is therefore always permission-denied for the public
    // site, and every event page silently fell back to demo data. With the
    // status filter the rules engine can verify the query only returns
    // published docs and allows it.
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where("slug", "==", slug),
      where("status", "==", "published")
    )
    const snap = await getDocs(q)
    if (!snap.empty) {
      const chosen = snap.docs[0]
      return { id: chosen.id, ...chosen.data() } as FirestoreEvent
    }
    return demoEvents.find((e) => e.slug === slug) as FirestoreEvent | null
  } catch (err) {
    console.warn("Firestore event fetch failed, using fallback:", err)
    return demoEvents.find((e) => e.slug === slug) as FirestoreEvent | null
  }
}

export async function getEventById(id: string, ctx: FirestoreContext = "public"): Promise<FirestoreEvent | null> {
  const db = dbFor(ctx)
  try {
    const snap = await getDoc(doc(db, EVENTS_COLLECTION, id))
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as FirestoreEvent
    }
    return demoEvents.find((e) => e.id === id) as FirestoreEvent | null
  } catch (err) {
    console.warn("Firestore event fetch failed:", err)
    return demoEvents.find((e) => e.id === id) as FirestoreEvent | null
  }
}

export async function createEvent(
  event: Partial<FirestoreEvent>,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<string> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(collection(db, EVENTS_COLLECTION))
  const body = stripUndefined({
    ...stripClientFields(event as Record<string, any>),
    status: event.status || "draft",
    // Top-level convenience counts — match the schema's metadata block too.
    rsvpCount: 0,
    wishCount: 0,
    galleryItemCount: 0,
    ...newMetadata(),
    // On initial create, if the admin picks "published" right away, stamp it.
    ...(event.status === "published"
      ? { "metadata.publishedAt": serverTimestamp() }
      : {}),
  })
  await setDoc(ref, body)
  await safeAudit(EVENTS_COLLECTION, ref.id, "event.created", opts.actor, body)
  return ref.id
}

export async function updateEvent(
  id: string,
  data: Partial<FirestoreEvent>,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, EVENTS_COLLECTION, id)
  const before = (await getDoc(ref)).data() ?? null
  const meta = await bumpMetadata(ref)
  const statusChangedToPublished =
    data.status === "published" && before?.status !== "published"
  const body = stripUndefined({
    ...stripClientFields(data as Record<string, any>),
    ...meta,
    ...(statusChangedToPublished
      ? { "metadata.publishedAt": serverTimestamp() }
      : {}),
  })
  await updateDoc(ref, body)
  await safeAudit(
    EVENTS_COLLECTION,
    id,
    statusChangedToPublished ? "event.published" : "event.updated",
    opts.actor,
    { ...(before || {}), ...body },
    before
  )
}

export async function deleteEvent(
  id: string,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, EVENTS_COLLECTION, id)
  const before = (await getDoc(ref)).data() ?? null
  await deleteDoc(ref)
  await safeAudit(EVENTS_COLLECTION, id, "event.deleted", opts.actor, null, before)
}

// ── Templates ──────────────────────────────────────────────────

const TEMPLATES_COLLECTION = "templates"

export async function getTemplates(category?: string, ctx: FirestoreContext = "public"): Promise<Template[]> {
  const db = dbFor(ctx)
  try {
    let q
    if (category && category !== "All") {
      q = query(
        collection(db, TEMPLATES_COLLECTION),
        where("category", "==", category.toLowerCase())
      )
    } else {
      q = query(collection(db, TEMPLATES_COLLECTION), orderBy("name"))
    }
    const snap = await getDocs(q)
    if (snap.empty) return templates
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Template[]
  } catch (err) {
    console.warn("Firestore templates fetch failed, using fallback:", err)
    return templates
  }
}

export async function getTemplateById(id: string, ctx: FirestoreContext = "public"): Promise<Template | null> {
  const db = dbFor(ctx)
  try {
    const snap = await getDoc(doc(db, TEMPLATES_COLLECTION, id))
    if (snap.exists()) return { id: snap.id, ...snap.data() } as Template
    return templates.find((t) => t.id === id) || null
  } catch {
    return templates.find((t) => t.id === id) || null
  }
}

export async function createTemplate(
  template: Partial<Template>,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<string> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(collection(db, TEMPLATES_COLLECTION))
  const body = stripUndefined({
    ...stripClientFields(template as Record<string, any>),
    featured: template.featured ?? false,
    ...newMetadata(),
  })
  await setDoc(ref, body)
  await safeAudit(TEMPLATES_COLLECTION, ref.id, "template.created", opts.actor, body)
  return ref.id
}

export async function updateTemplate(
  id: string,
  data: Partial<Template>,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, TEMPLATES_COLLECTION, id)
  const before = (await getDoc(ref)).data() ?? null
  const body = stripUndefined({
    ...stripClientFields(data as Record<string, any>),
    ...(await bumpMetadata(ref)),
  })
  await updateDoc(ref, body)
  await safeAudit(TEMPLATES_COLLECTION, id, "template.updated", opts.actor, { ...(before || {}), ...body }, before)
}

export async function deleteTemplate(
  id: string,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, TEMPLATES_COLLECTION, id)
  const before = (await getDoc(ref)).data() ?? null
  await deleteDoc(ref)
  await safeAudit(TEMPLATES_COLLECTION, id, "template.deleted", opts.actor, null, before)
}

// ── Blog Posts ─────────────────────────────────────────────────

const BLOG_COLLECTION = "blogPosts"

export async function getBlogPosts(status?: string, ctx: FirestoreContext = "public"): Promise<FirestoreBlogPost[]> {
  const db = dbFor(ctx)
  try {
    let q
    if (status) {
      // Sort in memory instead of with orderBy: the `date` field holds a
      // display string ("August 10, 2026" for seeds, "2026-08-10" for
      // admin-created posts), so a server-side string orderBy is both
      // wrong across formats and unnecessary — collections are small.
      const snap = await getDocs(
        query(collection(db, BLOG_COLLECTION), where("status", "==", status))
      )
      if (snap.empty) return blogPosts as FirestoreBlogPost[]
      return (snap.docs.map((d) => ({ id: d.id, ...d.data() })) as FirestoreBlogPost[])
        .sort((a, b) =>
          (new Date(b.date || 0).getTime() || 0) -
          (new Date(a.date || 0).getTime() || 0)
        )
    }
    const snap = await getDocs(collection(db, BLOG_COLLECTION))
    if (snap.empty) return blogPosts as FirestoreBlogPost[]
    return (snap.docs.map((d) => ({ id: d.id, ...d.data() })) as FirestoreBlogPost[])
      .sort((a, b) =>
        (new Date(b.date || 0).getTime() || 0) -
        (new Date(a.date || 0).getTime() || 0)
      )
  } catch (err) {
    console.warn("Firestore blog fetch failed, using fallback:", err)
    return blogPosts as FirestoreBlogPost[]
  }
}

export async function getBlogPostBySlug(slug: string, ctx: FirestoreContext = "public"): Promise<FirestoreBlogPost | null> {
  const db = dbFor(ctx)
  try {
    const q = query(
      collection(db, BLOG_COLLECTION),
      where("slug", "==", slug)
    )
    const snap = await getDocs(q)
    if (!snap.empty) {
      const published = snap.docs.find((d) => d.data().status === "published")
      const chosen = published ?? snap.docs[0]
      return { id: chosen.id, ...chosen.data() } as FirestoreBlogPost
    }
    return (blogPosts.find((p) => p.slug === slug) as FirestoreBlogPost) || null
  } catch {
    return (blogPosts.find((p) => p.slug === slug) as FirestoreBlogPost) || null
  }
}

export async function createBlogPost(
  post: Partial<FirestoreBlogPost>,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<string> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(collection(db, BLOG_COLLECTION))
  const body = stripUndefined({
    ...stripClientFields(post as Record<string, any>),
    status: post.status || "draft",
    ...newMetadata(),
  })
  await setDoc(ref, body)
  await safeAudit(BLOG_COLLECTION, ref.id, "blogPost.created", opts.actor, body)
  return ref.id
}

export async function updateBlogPost(
  id: string,
  data: Partial<FirestoreBlogPost>,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, BLOG_COLLECTION, id)
  const before = (await getDoc(ref)).data() ?? null
  const body = stripUndefined({
    ...stripClientFields(data as Record<string, any>),
    ...(await bumpMetadata(ref)),
  })
  await updateDoc(ref, body)
  await safeAudit(BLOG_COLLECTION, id, "blogPost.updated", opts.actor, { ...(before || {}), ...body }, before)
}

export async function deleteBlogPost(
  id: string,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, BLOG_COLLECTION, id)
  const before = (await getDoc(ref)).data() ?? null
  await deleteDoc(ref)
  await safeAudit(BLOG_COLLECTION, id, "blogPost.deleted", opts.actor, null, before)
}

// ── Features ───────────────────────────────────────────────────

const FEATURES_COLLECTION = "features"

export async function getFeatures(ctx: FirestoreContext = "public"): Promise<FeatureType[]> {
  const db = dbFor(ctx)
  try {
    const snap = await getDocs(collection(db, FEATURES_COLLECTION))
    if (snap.empty) return features
    // Features are stored as a single doc with an `items` array field.
    const firstDoc = snap.docs[0]
    const data = firstDoc?.data()
    if (data?.items) return data.items as FeatureType[]
    return features
  } catch (err) {
    console.warn("Firestore features fetch failed, using fallback:", err)
    return features
  }
}

/**
 * Update the entire feature list. The schema (01 §2.6) says features live
 * in a single `features/current` doc with an `items` array, so we replace
 * that array atomically and bump metadata.version.
 */
export async function updateFeatures(
  items: FeatureType[],opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, FEATURES_COLLECTION, "current")
  const before = (await getDoc(ref)).data() ?? null
  const body = stripUndefined({
    items,
    ...(await bumpMetadata(ref)),
  })
  await setDoc(ref, body, { merge: true })
  await safeAudit(FEATURES_COLLECTION, "current", "features.updated", opts.actor, { ...(before || {}), ...body }, before)
}

// ── Pricing Plans ──────────────────────────────────────────────

const PRICING_COLLECTION = "pricingPlans"

export async function getPricingPlans(ctx: FirestoreContext = "public"): Promise<PricingPlanType[]> {
  const db = dbFor(ctx)
  try {
    const snap = await getDocs(collection(db, PRICING_COLLECTION))
    if (snap.empty) return pricingPlans
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PricingPlanType[]
  } catch (err) {
    console.warn("Firestore pricing fetch failed, using fallback:", err)
    return pricingPlans
  }
}

export async function createPricingPlan(
  plan: Partial<PricingPlanType>,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<string> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(collection(db, PRICING_COLLECTION))
  const body = stripUndefined({
    ...stripClientFields(plan as Record<string, any>),
    ...newMetadata(),
  })
  await setDoc(ref, body)
  await safeAudit(PRICING_COLLECTION, ref.id, "pricingPlan.created", opts.actor, body)
  return ref.id
}

export async function updatePricingPlan(
  id: string,
  data: Partial<PricingPlanType>,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, PRICING_COLLECTION, id)
  const before = (await getDoc(ref)).data() ?? null
  const body = stripUndefined({
    ...stripClientFields(data as Record<string, any>),
    ...(await bumpMetadata(ref)),
  })
  await updateDoc(ref, body)
  await safeAudit(PRICING_COLLECTION, id, "pricingPlan.updated", opts.actor, { ...(before || {}), ...body }, before)
}

export async function deletePricingPlan(
  id: string,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, PRICING_COLLECTION, id)
  const before = (await getDoc(ref)).data() ?? null
  await deleteDoc(ref)
  await safeAudit(PRICING_COLLECTION, id, "pricingPlan.deleted", opts.actor, null, before)
}

// ── Solutions (singleton per schema 01 §2.5) ──────────────────

const SOLUTIONS_COLLECTION = "solutions"
const SOLUTIONS_DOC_ID = "current"

/**
 * Per schema 01 §2.5, solutions live in a SINGLE `solutions/current` doc
 * whose `items` field is the full array. This is what the admin UI must
 * write to, and what the public site reads from.
 *
 * (Earlier versions of this file returned multiple docs in the collection —
 * that was the schema drift the audit flagged. Reading + writing are
 * aligned now.)
 */
export async function getSolutions(ctx: FirestoreContext = "public"): Promise<SolutionType[]> {
  const db = dbFor(ctx)
  try {
    const snap = await getDoc(doc(db, SOLUTIONS_COLLECTION, SOLUTIONS_DOC_ID))
    if (snap.exists()) {
      const data = snap.data() as any
      if (Array.isArray(data?.items)) return data.items as SolutionType[]
    }
    return solutions
  } catch (err) {
    console.warn("Firestore solutions fetch failed, using fallback:", err)
    return solutions
  }
}

export async function updateSolutions(
  items: SolutionType[],opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, SOLUTIONS_COLLECTION, SOLUTIONS_DOC_ID)
  const before = (await getDoc(ref)).data() ?? null
  const body = stripUndefined({
    items,
    ...(await bumpMetadata(ref)),
  })
  await setDoc(ref, body, { merge: true })
  await safeAudit(SOLUTIONS_COLLECTION, SOLUTIONS_DOC_ID, "solutions.updated", opts.actor, { ...(before || {}), ...body }, before)
}

// ── Users ──────────────────────────────────────────────────────

export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role: "super-admin" | "admin" | "editor" | "viewer"
  plan: string
  createdAt?: string
  lastLogin?: string
  eventsCreated?: number
}

const USERS_COLLECTION = "users"

export async function getUsers(ctx: FirestoreContext = "public"): Promise<UserProfile[]> {
  const db = dbFor(ctx)
  try {
    const snap = await getDocs(collection(db, USERS_COLLECTION))
    return snap.docs.map((d) => ({ uid: d.id, ...d.data() })) as UserProfile[]
  } catch (err) {
    console.warn("Firestore users fetch failed:", err)
    return []
  }
}

export async function getUser(uid: string, ctx: FirestoreContext = "public"): Promise<UserProfile | null> {
  const db = dbFor(ctx)
  try {
    const snap = await getDoc(doc(db, USERS_COLLECTION, uid))
    if (snap.exists()) return { uid: snap.id, ...snap.data() } as UserProfile
    return null
  } catch {
    return null
  }
}

export async function updateUser(
  uid: string,
  data: Partial<UserProfile>,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, USERS_COLLECTION, uid)
  const before = (await getDoc(ref)).data() ?? null
  const body = stripUndefined({
    ...stripClientFields(data as Record<string, any>),
    updatedAt: serverTimestamp(),
  })
  await updateDoc(ref, body)
  await safeAudit(USERS_COLLECTION, uid, "user.updated", opts.actor, { ...(before || {}), ...body }, before)
}

// ── Site Settings ──────────────────────────────────────────────

const PROJECT_COLLECTION = "projects"
const PROJECT_DOC_ID = "current"

export async function getSiteSettings(ctx: FirestoreContext = "public") {
  const db = dbFor(ctx)
  try {
    const snap = await getDoc(doc(db, PROJECT_COLLECTION, PROJECT_DOC_ID))
    if (snap.exists()) return snap.data()
    return site
  } catch (err) {
    console.warn("Firestore site settings fetch failed, using fallback:", err)
    return site
  }
}

export async function updateSiteSettings(
  data: Record<string, any>,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, PROJECT_COLLECTION, PROJECT_DOC_ID)
  const before = (await getDoc(ref)).data() ?? null
  // site.ts has extra fields the schema (01 §2.1) doesn't define
  // (navLinks, footerColumns, url, supporting). We persist only schema
  // fields + anything the admin form explicitly submitted.
  const allowed = stripUndefined({
    name: data.name,
    domain: data.domain,
    tagline: data.tagline,
    description: data.description,
    email: data.email,
    phone: data.phone,
    location: data.location,
    address: data.address,
    social: data.social,
    seo: data.seo,
    ...(await bumpMetadata(ref)),
  })
  await setDoc(ref, allowed, { merge: true })
  await safeAudit(PROJECT_COLLECTION, PROJECT_DOC_ID, "siteSettings.updated", opts.actor, { ...(before || {}), ...allowed }, before)
}

// ── Audit Logs ─────────────────────────────────────────────────

export interface AuditLog {
  id: string
  actor: string
  actorId: string
  action: string
  collection: string
  documentId: string
  before?: any
  after?: any
  timestamp: string
}

const AUDIT_COLLECTION = "auditLogs"

export async function getAuditLogs(limitCount: number = 50, ctx: FirestoreContext = "public"): Promise<AuditLog[]> {
  const db = dbFor(ctx)
  try {
    const q = query(
      collection(db, AUDIT_COLLECTION),
      orderBy("timestamp", "desc"),
      firestoreLimit(limitCount)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as AuditLog[]
  } catch (err) {
    console.warn("Firestore audit logs fetch failed:", err)
    return []
  }
}

/**
 * Public helper. Most callers should use the auto-audit baked into the
 * create/update/delete functions above, but this is exposed for one-off
 * admin actions (e.g. "feature flag flipped" where no doc is being changed).
 */
export async function logAudit(entry: {
    actor: AuditActor | string
    actorId?: string
    action: string
    collection: string
    documentId: string
    before?: any
    after?: any
  }, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(ctx)
  const ref = doc(collection(db, AUDIT_COLLECTION))
  const { actor, actorId, ...rest } = entry
  const actorStr = typeof actor === "string" ? actor : actor.email || actor.uid
  const resolvedActorId =
    actorId ?? (typeof actor === "string" ? actor : actor.uid)
  await setDoc(ref, stripUndefined({
    ...rest,
    actor: actorStr,
    actorId: resolvedActorId,
    timestamp: new Date().toISOString(),
  }))
}

// ── Announcements ──────────────────────────────────────────────

export interface Announcement {
  id: string
  title: string
  body: string
  type: "info" | "success" | "warning" | "error"
  roles?: string[]
  plans?: string[]
  startsAt: string
  endsAt?: string
  dismissedBy?: string[]
  metadata?: { createdAt: string; updatedAt: string }
}

const ANNOUNCEMENTS_COLLECTION = "announcements"

export async function getActiveAnnouncements(now: Date = new Date(), ctx: FirestoreContext = "public"): Promise<Announcement[]> {
  const db = dbFor(ctx)
  try {
    const snap = await getDocs(collection(db, ANNOUNCEMENTS_COLLECTION))
    if (snap.empty) return []
    return (snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((a: any) => {
        const start = a.startsAt ? new Date(a.startsAt) : null
        const end = a.endsAt ? new Date(a.endsAt) : null
        if (start && start > now) return false
        if (end && end < now) return false
        return true
      }) as Announcement[])
  } catch {
    return []
  }
}

export async function createAnnouncement(
  a: Partial<Announcement>,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<string> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(collection(db, ANNOUNCEMENTS_COLLECTION))
  const body = stripUndefined({
    ...stripClientFields(a as Record<string, any>),
    type: a.type || "info",
    startsAt: a.startsAt || new Date().toISOString(),
    dismissedBy: [],
    metadata: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  })
  await setDoc(ref, body)
  await safeAudit(ANNOUNCEMENTS_COLLECTION, ref.id, "announcement.created", opts.actor, body)
  return ref.id
}

export async function updateAnnouncement(
  id: string,
  data: Partial<Announcement>,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, ANNOUNCEMENTS_COLLECTION, id)
  const before = (await getDoc(ref)).data() ?? null
  const body = stripUndefined({
    ...stripClientFields(data as Record<string, any>),
    "metadata.updatedAt": new Date().toISOString(),
  })
  await updateDoc(ref, body)
  await safeAudit(ANNOUNCEMENTS_COLLECTION, id, "announcement.updated", opts.actor, { ...(before || {}), ...body }, before)
}

export async function deleteAnnouncement(
  id: string,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, ANNOUNCEMENTS_COLLECTION, id)
  const before = (await getDoc(ref)).data() ?? null
  await deleteDoc(ref)
  await safeAudit(ANNOUNCEMENTS_COLLECTION, id, "announcement.deleted", opts.actor, null, before)
}

/**
 * Public-site helper: record that `uid` (or an anonymous visitor identified by
 * `clientId`) dismissed an announcement. The banner reads `dismissedBy` to
 * know not to re-show it. We use `arrayUnion` so concurrent dismissals are
 * idempotent and we don't lose anyone in the race.
 */
export async function recordAnnouncementDismissal(
  id: string,uid: string, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(ctx)
  if (!uid) return
  try {
    const { arrayUnion } = await import("firebase/firestore")
    await updateDoc(doc(db, ANNOUNCEMENTS_COLLECTION, id), {
      dismissedBy: arrayUnion(uid),
    })
  } catch (err) {
    console.warn("announcement dismissal failed", err)
  }
}

// ── Campaigns ──────────────────────────────────────────────────

export interface Campaign {
  id: string
  code: string
  discountPercent?: number
  discountAmount?: string
  maxUses?: number
  usesCount: number
  applicableTo: string[]
  startsAt: string
  endsAt?: string
  metadata?: { createdAt: string; updatedAt: string }
}

const CAMPAIGNS_COLLECTION = "campaigns"

export async function getCampaigns(ctx: FirestoreContext = "public"): Promise<Campaign[]> {
  const db = dbFor(ctx)
  try {
    const snap = await getDocs(collection(db, CAMPAIGNS_COLLECTION))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Campaign[]
  } catch {
    return []
  }
}

export async function createCampaign(
  c: Partial<Campaign>,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<string> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(collection(db, CAMPAIGNS_COLLECTION))
  const body = stripUndefined({
    ...stripClientFields(c as Record<string, any>),
    usesCount: c.usesCount ?? 0,
    applicableTo: c.applicableTo ?? [],
    startsAt: c.startsAt || new Date().toISOString(),
    metadata: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  })
  await setDoc(ref, body)
  await safeAudit(CAMPAIGNS_COLLECTION, ref.id, "campaign.created", opts.actor, body)
  return ref.id
}

export async function updateCampaign(
  id: string,
  data: Partial<Campaign>,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, CAMPAIGNS_COLLECTION, id)
  const before = (await getDoc(ref)).data() ?? null
  const body = stripUndefined({
    ...stripClientFields(data as Record<string, any>),
    "metadata.updatedAt": new Date().toISOString(),
  })
  await updateDoc(ref, body)
  await safeAudit(CAMPAIGNS_COLLECTION, id, "campaign.updated", opts.actor, { ...(before || {}), ...body }, before)
}

export async function deleteCampaign(
  id: string,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, CAMPAIGNS_COLLECTION, id)
  const before = (await getDoc(ref)).data() ?? null
  await deleteDoc(ref)
  await safeAudit(CAMPAIGNS_COLLECTION, id, "campaign.deleted", opts.actor, null, before)
}

// ── Subscriptions ──────────────────────────────────────────────

export interface Subscription {
  id: string
  userId: string
  plan: "celebration" | "premium" | "business" | "enterprise"
  status: "active" | "canceled" | "past_due" | "trialing"
  stripeSubscriptionId?: string
  stripeCustomerId?: string
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  createdAt: string
  updatedAt: string
  metadata?: { version: number }
}

const SUBS_COLLECTION = "subscriptions"

export async function getSubscriptions(ctx: FirestoreContext = "public"): Promise<Subscription[]> {
  const db = dbFor(ctx)
  try {
    const snap = await getDocs(collection(db, SUBS_COLLECTION))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Subscription[]
  } catch {
    return []
  }
}

export async function createSubscription(
  s: Partial<Subscription>,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<string> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(collection(db, SUBS_COLLECTION))
  const now = new Date().toISOString()
  const body = stripUndefined({
    ...stripClientFields(s as Record<string, any>),
    status: s.status || "active",
    cancelAtPeriodEnd: s.cancelAtPeriodEnd ?? false,
    createdAt: now,
    updatedAt: now,
    metadata: { version: 1 },
  })
  await setDoc(ref, body)
  await safeAudit(SUBS_COLLECTION, ref.id, "subscription.created", opts.actor, body)
  return ref.id
}

export async function updateSubscription(
  id: string,
  data: Partial<Subscription>,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  const ref = doc(db, SUBS_COLLECTION, id)
  const before = (await getDoc(ref)).data() ?? null
  const current = Number(before?.metadata?.version ?? 0)
  const body = stripUndefined({
    ...stripClientFields(data as Record<string, any>),
    updatedAt: new Date().toISOString(),
    "metadata.version": current + 1,
  })
  await updateDoc(ref, body)
  await safeAudit(SUBS_COLLECTION, id, "subscription.updated", opts.actor, { ...(before || {}), ...body }, before)
}

export async function cancelSubscription(
  id: string,opts: WriteOptions = {}, ctx: FirestoreContext = "public"): Promise<void> {
  const db = dbFor(opts?.ctx ?? ctx)
  await updateSubscription(id, { status: "canceled", cancelAtPeriodEnd: true }, opts)
}
