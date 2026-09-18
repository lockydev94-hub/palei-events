"use client";

/**
 * SiteSettingsProvider — loads site settings from Firestore
 * (`projects/current`) once on mount and exposes them via
 * `useSiteSettings()`. This makes admin edits to Site Settings
 * (name, phone, email, address, social, SEO) show up on the public
 * website (footer, floating contact) instead of the hardcoded defaults.
 *
 * Falls back to the static `site` object from data/site.ts while loading,
 * if Firestore is unreachable, or when the doc has no data yet — so the
 * website never renders blank contact/footer content.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getSiteSettings } from "@/lib/firestore";
import { site as fallbackSite } from "@/data/site";

export interface SiteSettings {
  name?: string;
  domain?: string;
  tagline?: string;
  supporting?: string;
  description?: string;
  url?: string;
  email?: string;
  phone?: string;
  location?: string;
  address?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  seo?: {
    defaultTitle?: string;
    defaultDescription?: string;
    defaultImage?: string;
  };
}

const SiteSettingsContext = createContext<SiteSettings>(fallbackSite);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(fallbackSite);

  useEffect(() => {
    let cancelled = false;
    getSiteSettings()
      .then((data) => {
        if (cancelled || !data) return;
        // Merge DB values over the static defaults so any field the admin
        // hasn't set still has a sensible value.
        setSettings({ ...fallbackSite, ...(data as object) } as SiteSettings);
      })
      .catch(() => {
        /* keep static fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

/** Returns live site settings (Firestore-backed) or static defaults. */
export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext);
}
