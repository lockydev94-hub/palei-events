"use client"

/**
 * Customer profile page — update display name / photo, change password,
 * sign out. Only non-privileged fields (rules-enforced).
 */
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, LogOut, UserRound } from "lucide-react"
import {
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useCustomerAuth } from "@/components/customer/CustomerAuthContext"
import { PageHeader, Card } from "@/components/customer/DashboardShell"
import { ImageUploader } from "@/components/admin/ImageUploader"

export default function CustomerProfilePage() {
  const { user, logout } = useCustomerAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.displayName || "")
      setPhotoURL(user.photoURL || "")
    }
  }, [user?.uid])

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    if (!auth.currentUser) return
    setSavingProfile(true)
    setProfileError(null)
    setProfileSaved(false)
    try {
      await updateProfile(auth.currentUser, { displayName: name, photoURL })
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        displayName: name,
        photoURL,
        updatedAt: new Date().toISOString(),
      })
      setProfileSaved(true)
    } catch (err) {
      console.error("[customer] profile update failed:", err)
      setProfileError("Could not save your profile. Please try again.")
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    if (!auth.currentUser || !auth.currentUser.email) return
    setPasswordError(null)
    setPasswordSaved(false)
    setSavingPassword(true)
    try {
      // Re-authenticate first (Firebase requires recent login).
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      )
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, newPassword)
      setPasswordSaved(true)
      setCurrentPassword("")
      setNewPassword("")
    } catch (err: any) {
      const code = err?.code || ""
      setPasswordError(
        code === "auth/wrong-password" || code === "auth/invalid-credential"
          ? "Current password is incorrect."
          : code === "auth/weak-password"
          ? "New password is too weak (min 6 characters)."
          : "Could not change password. Please try again."
      )
    } finally {
      setSavingPassword(false)
    }
  }

  async function handleLogout() {
    await logout()
    router.replace("/login")
  }

  const labelCls = "mb-1.5 block text-[0.78rem] font-semibold text-navy"
  const inputCls =
    "w-full rounded-xl px-4 py-3 text-[0.9rem] text-navy outline-none transition-all placeholder:text-mutedText/50 focus:border-gold focus:ring-2 focus:ring-gold/15"
  const inputStyle = {
    background: "rgba(255,253,248,0.95)",
    border: "1px solid rgba(23,32,51,0.12)",
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Profile"
        subtitle="Your account details and security."
      />

      {/* Identity card */}
      <Card className="mb-6 flex flex-wrap items-center gap-5 p-6">
        {photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoURL} alt="Avatar" className="h-16 w-16 rounded-2xl object-cover" />
        ) : (
          <span
            className="flex h-16 w-16 items-center justify-center rounded-2xl font-display text-xl font-bold text-navy-dark"
            style={{ background: "linear-gradient(135deg, #e0c584, #c89b3c)" }}
          >
            {(name || user?.email || "?").slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-semibold text-navy">
            {name || "Customer"}
          </p>
          <p className="text-[0.85rem] text-mutedText">{user?.email}</p>
        </div>
        <span
          className="rounded-full px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-wider"
          style={{ background: "rgba(200,155,60,0.12)", color: "#a67f2e" }}
        >
          {user?.plan === "free" ? "No plan" : `${user?.plan} plan`}
        </span>
      </Card>

      <div className="grid gap-6">
        {/* Edit profile */}
        <Card className="p-6 sm:p-8">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
            <UserRound className="h-4.5 w-4.5 text-gold" />
            Personal details
          </h2>

          <form onSubmit={handleProfileSave} className="mt-5 grid gap-5">
            <div>
              <label className={labelCls}>Profile photo</label>
              <ImageUploader
                value={photoURL}
                onUpload={(url) => setPhotoURL(url)}
                label="Avatar"
                folder="customers/avatars"
                aspectRatio={1}
                targetWidth={400}
              />
            </div>
            <div>
              <label htmlFor="pf-name" className={labelCls}>Display name</label>
              <input
                id="pf-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="pf-email" className={labelCls}>Email</label>
              <input
                id="pf-email"
                value={user?.email || ""}
                disabled
                className={`${inputCls} opacity-60`}
                style={inputStyle}
              />
              <p className="mt-1 text-[0.72rem] text-mutedText">
                Email can&apos;t be changed here — contact support if needed.
              </p>
            </div>

            {profileSaved && (
              <p
                className="rounded-xl px-4 py-3 text-[0.83rem]"
                style={{ background: "rgba(16,185,129,0.08)", color: "#047857" }}
                role="status"
              >
                Profile saved ✓
              </p>
            )}
            {profileError && (
              <p
                className="rounded-xl px-4 py-3 text-[0.83rem]"
                style={{ background: "rgba(239,68,68,0.08)", color: "#b91c1c" }}
                role="alert"
              >
                {profileError}
              </p>
            )}

            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex w-fit items-center gap-2 rounded-xl px-7 py-3 text-[0.86rem] font-semibold text-navy-dark transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #e0c584, #c89b3c)" }}
            >
              {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </button>
          </form>
        </Card>

        {/* Password */}
        <Card className="p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold text-navy">Change password</h2>
          <form onSubmit={handlePasswordChange} className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pw-current" className={labelCls}>Current password</label>
              <input
                id="pw-current"
                type="password"
                required
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="pw-new" className={labelCls}>New password</label>
              <input
                id="pw-new"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>

            {passwordSaved && (
              <p
                className="sm:col-span-2 rounded-xl px-4 py-3 text-[0.83rem]"
                style={{ background: "rgba(16,185,129,0.08)", color: "#047857" }}
                role="status"
              >
                Password updated ✓
              </p>
            )}
            {passwordError && (
              <p
                className="sm:col-span-2 rounded-xl px-4 py-3 text-[0.83rem]"
                style={{ background: "rgba(239,68,68,0.08)", color: "#b91c1c" }}
                role="alert"
              >
                {passwordError}
              </p>
            )}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="rounded-xl border px-6 py-3 text-[0.86rem] font-semibold text-navy transition-colors hover:bg-gold/10 disabled:opacity-60"
                style={{ borderColor: "rgba(200,155,60,0.4)" }}
              >
                {savingPassword ? "Updating…" : "Update password"}
              </button>
            </div>
          </form>
        </Card>

        {/* Sign out */}
        <Card className="flex items-center justify-between p-6">
          <div>
            <p className="font-semibold text-navy">Sign out</p>
            <p className="text-[0.8rem] text-mutedText">End this session on this device.</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[0.84rem] font-semibold transition-colors"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#dc2626",
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </Card>
      </div>
    </div>
  )
}
