/**
 * Invoice module — admin-generated at plan approval.
 *
 * Flow: admin approves a plan request → an invoice doc is created
 * (status "unpaid") → the admin collects payment any way the customer
 * prefers (Cash / UPI / Online bank transfer) → the admin records the
 * payment and the invoice flips to "paid" (or "partial" until fully
 * collected). Customers can see their own invoices on the Plan page.
 *
 * Firestore: `invoices` collection (rules: admin write, owner read).
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import { adminDb, db } from "@/lib/firebase"

export type PaymentMethod = "cash" | "upi" | "online" | "card" | "other"
export type InvoiceStatus = "unpaid" | "partial" | "paid" | "cancelled"

export interface InvoiceLineItem {
  description: string
  amount: number
}

export interface Invoice {
  id: string
  /** Sequential business number, e.g. "PE-2026-0001". */
  number: string
  customerUid: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  plan: string
  /** Billing period in months (default 12 for admin-managed plans). */
  months: number
  lineItems: InvoiceLineItem[]
  /** Amount in ₹ (whole rupees). */
  amount: number
  discount?: number
  /** amount - discount. */
  total: number
  amountPaid: number
  status: InvoiceStatus
  paymentMethod?: PaymentMethod
  paymentReference?: string
  paidAt?: string
  issuedAt: string
  dueDate?: string
  notes?: string
  createdBy: string
  /** The plan request that triggered this invoice, for traceability. */
  planRequestId?: string
}

const INVOICES_COLLECTION = "invoices"

const METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  upi: "UPI",
  online: "Online transfer",
  card: "Card",
  other: "Other",
}

export function paymentMethodLabel(m: PaymentMethod): string {
  return METHOD_LABELS[m] ?? m
}

/** Parse "₹2,999" | "₹999" | "Custom" → number (0 for unpriced tiers). */
export function parsePlanPrice(price: string | undefined): number {
  if (!price) return 0
  const digits = price.replace(/[^\d]/g, "")
  return digits ? parseInt(digits, 10) : 0
}

/** Next sequential invoice number for the year: PE-2026-0007. */
async function nextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `PE-${year}-`
  try {
    const snap = await getDocs(
      query(
        collection(adminDb, INVOICES_COLLECTION),
        where("number", ">=", prefix),
        where("number", "<=", prefix + "\uf8ff")
      )
    )
    let max = 0
    snap.docs.forEach((d) => {
      const n = parseInt(d.data().number?.slice(prefix.length) ?? "0", 10)
      if (!isNaN(n) && n > max) max = n
    })
    return prefix + String(max + 1).padStart(4, "0")
  } catch {
    // Fallback: timestamp-based so approval never blocks on numbering.
    return prefix + Date.now().toString().slice(-6)
  }
}

export interface GenerateInvoiceInput {
  request: {
    id: string
    uid: string
    email: string
    displayName?: string
    plan: string
  }
  planName: string
  planPrice: string
  customerPhone?: string
  months?: number
  discount?: number
  notes?: string
  adminActor: { uid: string; email: string }
}

/**
 * Called by the admin when approving a plan request: creates an unpaid
 * invoice for the selected plan.
 */
export async function generateInvoiceForPlanRequest(
  input: GenerateInvoiceInput
): Promise<string> {
  const number = await nextInvoiceNumber()
  const amount = parsePlanPrice(input.planPrice)
  const discount = input.discount ?? 0
  const months = input.months ?? 12
  const now = new Date()
  const due = new Date(now.getTime() + 7 * 864e5)

  const ref = doc(collection(adminDb, INVOICES_COLLECTION))
  const body: Omit<Invoice, "id"> = {
    number,
    customerUid: input.request.uid,
    customerName: input.request.displayName || input.request.email.split("@")[0],
    customerEmail: input.request.email,
    ...(input.customerPhone ? { customerPhone: input.customerPhone } : {}),
    plan: input.request.plan,
    months,
    lineItems: [
      {
        description: `${input.planName} plan — ${months} month${months > 1 ? "s" : ""}`,
        amount,
      },
      ...(discount > 0
        ? [{ description: "Discount", amount: -discount }]
        : []),
    ],
    amount,
    ...(discount > 0 ? { discount } : {}),
    total: Math.max(amount - discount, 0),
    amountPaid: 0,
    status: "unpaid",
    issuedAt: now.toISOString(),
    dueDate: due.toISOString(),
    ...(input.notes ? { notes: input.notes } : {}),
    createdBy: input.adminActor.email || input.adminActor.uid,
    planRequestId: input.request.id,
  }
  await setDoc(ref, body)
  return ref.id
}

/** All invoices (admin console view), newest first. */
export async function getInvoices(): Promise<Invoice[]> {
  try {
    const snap = await getDocs(
      query(collection(adminDb, INVOICES_COLLECTION), orderBy("issuedAt", "desc"))
    )
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Invoice[]
  } catch (err) {
    console.warn("[admin] invoices fetch failed:", err)
    return []
  }
}

/** The customer's own invoices (Plan page), newest first. */
export async function getMyInvoices(uid: string): Promise<Invoice[]> {
  try {
    const snap = await getDocs(
      query(
        collection(db, INVOICES_COLLECTION),
        where("customerUid", "==", uid),
        orderBy("issuedAt", "desc")
      )
    )
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Invoice[]
  } catch (err) {
    console.warn("[customer] invoices fetch failed:", err)
    return []
  }
}

/**
 * Record a payment collected by the admin (cash / UPI / online…).
 * Partial payments set status "partial"; the balance remains due.
 */
export async function recordInvoicePayment(
  invoiceId: string,
  input: {
    amount: number
    method: PaymentMethod
    reference?: string
    actor: { uid: string; email: string }
  }
): Promise<void> {
  const ref = doc(adminDb, INVOICES_COLLECTION, invoiceId)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error("Invoice not found")

  const inv = snap.data() as Invoice
  const paid = Math.max(0, Math.min(inv.amountPaid + input.amount, inv.total))
  const status: InvoiceStatus = paid >= inv.total ? "paid" : paid > 0 ? "partial" : "unpaid"

  await updateDoc(ref, {
    amountPaid: paid,
    status,
    paymentMethod: input.method,
    ...(input.reference?.trim() ? { paymentReference: input.reference.trim() } : {}),
    paidAt: new Date().toISOString(),
  })
}

/** Cancel an unpaid invoice (admin void). */
export async function cancelInvoice(invoiceId: string): Promise<void> {
  await updateDoc(doc(adminDb, INVOICES_COLLECTION, invoiceId), {
    status: "cancelled",
  })
}

/** Print-friendly window for the admin to print/save the invoice as PDF. */
export function printInvoice(inv: Invoice, siteInfo?: { name?: string; phone?: string; email?: string }) {
  const fmt = (n: number) =>
    "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 })
  const dateFmt = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"

  const win = window.open("", "_blank", "width=800,height=900")
  if (!win) return
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${inv.number}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, 'Times New Roman', serif; color: #1a2233; padding: 40px; max-width: 780px; margin: 0 auto; }
    .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #c89b3c; padding-bottom: 18px; }
    .brand { font-size: 26px; font-weight: bold; color: #0f1522; letter-spacing: 0.5px; }
    .brand span { color: #c89b3c; }
    .muted { color: #6b7280; font-size: 12px; line-height: 1.6; }
    .inv-meta { text-align: right; }
    .inv-meta h2 { font-size: 15px; letter-spacing: 3px; color: #c89b3c; text-transform: uppercase; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px;
      ${inv.status === "paid" ? "background: #d1fae5; color: #047857;" : inv.status === "partial" ? "background: #fef3c7; color: #92400e;" : "background: #fee2e2; color: #b91c1c;"} }
    .parties { display: flex; justify-content: space-between; margin: 28px 0; gap: 40px; }
    .party h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #c89b3c; margin-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #6b7280; border-bottom: 2px solid #1a2233; padding: 10px 8px; }
    td { padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    .totals { margin-top: 18px; margin-left: auto; width: 260px; }
    .totals div { display: flex; justify-content: space-between; padding: 6px 8px; font-size: 14px; }
    .totals .grand { border-top: 2px solid #1a2233; margin-top: 6px; padding-top: 10px; font-weight: bold; font-size: 17px; }
    .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="head">
    <div>
      <div class="brand">Palei <span>Events</span></div>
      <div class="muted">
        ${siteInfo?.phone ? `+91 ${siteInfo.phone}<br/>` : ""}
        ${siteInfo?.email ? siteInfo.email : "paleievents.service@gmail.com"}
      </div>
    </div>
    <div class="inv-meta">
      <h2>Invoice</h2>
      <div class="muted">${inv.number}</div>
      <div class="muted">Issued ${dateFmt(inv.issuedAt)}</div>
      ${inv.dueDate ? `<div class="muted">Due ${dateFmt(inv.dueDate)}</div>` : ""}
      <span class="badge">${inv.status}</span>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <h4>Billed to</h4>
      <div style="font-weight: bold;">${inv.customerName}</div>
      <div class="muted">${inv.customerEmail}</div>
      ${inv.customerPhone ? `<div class="muted">+91 ${inv.customerPhone}</div>` : ""}
    </div>
    <div class="party" style="text-align: right;">
      <h4>Payment</h4>
      <div class="muted">${inv.paymentMethod ? paymentMethodLabel(inv.paymentMethod) : "Not recorded"}</div>
      ${inv.paymentReference ? `<div class="muted">Ref: ${inv.paymentReference}</div>` : ""}
      ${inv.paidAt ? `<div class="muted">Paid ${dateFmt(inv.paidAt)}</div>` : ""}
    </div>
  </div>

  <table>
    <thead><tr><th>Description</th><th style="text-align:right;">Amount</th></tr></thead>
    <tbody>
      ${inv.lineItems
        .map(
          (li) =>
            `<tr><td>${li.description}</td><td style="text-align:right;">${fmt(li.amount)}</td></tr>`
        )
        .join("")}
    </tbody>
  </table>

  <div class="totals">
    ${inv.discount ? `<div><span>Subtotal</span><span>${fmt(inv.amount)}</span></div><div><span>Discount</span><span>− ${fmt(inv.discount)}</span></div>` : ""}
    <div class="grand"><span>Total</span><span>${fmt(inv.total)}</span></div>
    <div><span>Paid</span><span>${fmt(inv.amountPaid)}</span></div>
    ${inv.total - inv.amountPaid > 0 ? `<div><span>Balance due</span><span>${fmt(inv.total - inv.amountPaid)}</span></div>` : ""}
  </div>

  ${inv.notes ? `<p class="muted" style="margin-top:24px;">Note: ${inv.notes}</p>` : ""}

  <div class="footer">Thank you for choosing Palei Events — Every Event. One Digital Experience.</div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`)
  win.document.close()
}
