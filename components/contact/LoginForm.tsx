"use client";

export function LoginForm() {
  return (
    <form
      className="mt-6 grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        alert("Login will be available at launch.");
      }}
    >
      <div>
        <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-navy">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-navy/15 bg-ivory px-4 py-3 text-sm outline-none transition-colors focus:border-gold"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-navy">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          required
          placeholder="••••••••"
          className="w-full rounded-lg border border-navy/15 bg-ivory px-4 py-3 text-sm outline-none transition-colors focus:border-gold"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-ivory shadow-soft transition-all hover:bg-navy-dark hover:-translate-y-0.5"
      >
        Log in
      </button>
    </form>
  );
}