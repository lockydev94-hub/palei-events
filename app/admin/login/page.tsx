"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/admin/auth/AuthContext"
import { Eye, EyeOff, Loader2 } from "lucide-react"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user, loading: authLoading, login, loginWithGoogle } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // ?next=/admin/whatever — the page RequireAdmin sent us here from
  // ?denied=1 — RequireAdmin already verified you're signed in but not an admin
  const nextPath = searchParams?.get("next") || "/admin/dashboard"
  const wasDenied = searchParams?.get("denied") === "1"

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.isAdmin) {
        router.replace(nextPath)
      } else if (!wasDenied) {
        // Logged in but not an admin — push them away from the login page
        router.replace("/admin/login?denied=1")
      }
    }
  }, [user, authLoading, router, nextPath, wasDenied])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      // After successful login, AuthContext re-runs and the effect above redirects.
    } catch (err: any) {
      const msg =
        err.code === "auth/user-not-found"
          ? "No account found with this email."
          : err.code === "auth/wrong-password"
          ? "Incorrect password."
          : err.code === "auth/invalid-email"
          ? "Invalid email address."
          : err.code === "auth/too-many-requests"
          ? "Too many attempts. Please try again later."
          : err.code === "auth/invalid-credential"
          ? "Invalid email or password."
          : err.message || "Login failed. Please try again."
      setError(msg)
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      await loginWithGoogle()
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.")
      setLoading(false)
    }
  }

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-dark">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  // Don't render form if already logged in
  if (user) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-dark p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <h1 className="text-3xl font-display font-bold text-gold-light">
              Palei <span className="text-gold">Events</span>
            </h1>
          </a>
          <p className="text-gold-light/50 text-sm mt-2">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-navy/80 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-display font-semibold text-gold-light mb-6">
            Sign in to your account
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-5">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {wasDenied && !error && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-5">
              <p className="text-amber-300 text-sm">
                Your account doesn't have admin access. Sign in with an admin
                account or contact your project owner.
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gold-light/70 text-sm font-medium mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 text-gold-light text-sm outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors placeholder:text-gold-light/30"
                placeholder="admin@paleievents.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-gold-light/70 text-sm font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-gold-light text-sm outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors placeholder:text-gold-light/30"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-light/40 hover:text-gold-light/70 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-light text-navy-dark font-semibold rounded-lg px-4 py-3 text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-navy px-3 text-gold-light/40">or continue with</span>
            </div>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full border border-white/10 hover:bg-white/5 text-gold-light rounded-lg px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gold-light/30 text-xs mt-6">
          © {new Date().getFullYear()} Palei Events. Admin access only.
        </p>
      </div>
    </div>
  )
}

// useSearchParams forces this page to be a client component, which in turn
// requires a Suspense boundary when statically rendered.
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-navy-dark">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
