import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPageClient } from "@/components/contact/LoginPageClient";
import { CustomerAuthProvider } from "@/components/customer/CustomerAuthContext";

export const metadata: Metadata = {
  title: "Login — Palei Events",
  description: "Log in to your Palei Events account to manage your events, galleries and guest lists.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <CustomerAuthProvider>
      {/* LoginPageClient reads the ?next= search param → needs Suspense. */}
      <Suspense>
        <LoginPageClient />
      </Suspense>
    </CustomerAuthProvider>
  );
}
