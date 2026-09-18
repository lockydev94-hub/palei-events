import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import { SiteSettingsProvider } from "@/components/layout/SiteSettingsProvider";
import { ChromeGate } from "@/components/layout/ChromeGate";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/ui/FloatingContact";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageLoader } from "@/components/ui/PageLoader";
import { PublicAnnouncementLayer } from "@/components/ui/PublicAnnouncementLayer";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE, APP_URL } from "@/lib/constants";
import "../styles/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s — ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable}`}>
      <head>
        {/*
         * Strip `bis_skin_checked="1"` (injected by the Honey browser extension
         * on every DOM element before React loads) so it doesn't trigger
         * hydration mismatches. This script runs synchronously during HTML
         * parsing, before React's hydration script — see
         * node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
         * for the same pattern. Uses TreeWalker so it handles a full document,
         * not just <body>.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var d=document,n=d.documentElement;" +
              "function w(r){var e=d.createTreeWalker(r||n,NodeFilter.SHOW_ELEMENT,null);var x;while(x=e.nextNode()){if(x.hasAttribute&&x.hasAttribute('bis_skin_checked'))x.removeAttribute('bis_skin_checked');}};" +
              "w();" +
              "if(d.readyState==='loading'){d.addEventListener('DOMContentLoaded',function(){w();});}" +
              "}catch(e){}})();",
          }}
        />
      </head>
      {/*
       * Inline style on <body> is rendered synchronously in the initial HTML
       * shell — before any CSS file is parsed. This kills the white/ivory flash
       * that appears when body { background-color: ivory } from globals.css
       * hasn't loaded yet.
       */}
      {/*
       * `suppressHydrationWarning` on <body>: client components
       * (AnnouncementBanner → `data-has-announcement`, ThemeToggle → `class="dark"`,
       * CallbackModal → inline `overflow: hidden`) mutate <body> from useEffect.
       * React 19's hydration tracker flags those mutations on the live DOM as a
       * mismatch against the SSR shell; this prop tells React to keep the DOM's
       * attributes and not tear down to client-render. See
       * node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
       * (Themes section) for the same pattern on <html data-theme="…">.
       */}
      <body
        className="font-body antialiased"
        style={{ backgroundColor: "#0f1522" }}
        suppressHydrationWarning
      >
        <SiteSettingsProvider>
          <PageLoader />
          <PublicAnnouncementLayer />
          {/* The customer dashboard is a full app shell — no public chrome. */}
          <ChromeGate>
            <Navbar />
          </ChromeGate>
          <main id="main">{children}</main>
          <ChromeGate>
            <Footer />
            <FloatingContact />
            <ScrollToTop />
          </ChromeGate>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
