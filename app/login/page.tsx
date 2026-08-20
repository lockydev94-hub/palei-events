import type { Metadata } from "next";
import { LoginPageClient } from "@/components/contact/LoginPageClient";

export const metadata: Metadata = {
  title: "Login — Palei Events",
  description: "Log in to your Palei Events account to manage your events, galleries and guest lists.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginPageClient />;
}
