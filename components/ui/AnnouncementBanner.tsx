"use client";

/**
 * AnnouncementBanner — public-site top banner driven by Firestore.
 *
 * Reads active announcements via `getActiveAnnouncements()` (the helpers in
 * `lib/firestore.ts` filter on `startsAt`/`endsAt` server-side… well,
 * client-side on the SDK query result, but the server controls the
 * envelope). Dismissals are persisted per-user via
 * `recordAnnouncementDismissal()` and survive across sessions.
 *
 * Why this is a banner (not a modal/toast): the audit flagged the
 * notifications collection as missing a consumer. A banner is the lowest-
 * friction way to surface admin-pushed messages (outages, feature
 * launches, plan promos) without breaking the existing nav layout.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getActiveAnnouncements,
  recordAnnouncementDismissal,
  type Announcement,
} from "@/lib/firestore";

type BannerItem = Announcement & { dismissed: boolean };

const ANNOUNCEMENT_DISMISSED_PREFIX = "palei:announcement-dismissed:";

// Anonymous-but-stable id used for visitors who haven't logged in. Stored in
// localStorage so dismissal persists across reloads without forcing a sign-in.
function getOrCreateClientId(): string {
  if (typeof window === "undefined") return "";
  const key = "palei:visitor-id";
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = `anon-${Math.random().toString(36).slice(2, 12)}-${Date.now().toString(36)}`;
    try {
      window.localStorage.setItem(key, id);
    } catch {
      /* private mode — fall back to per-tab dismissal */
    }
  }
  return id;
}

// Track which announcements the current visitor has dismissed in this tab.
// We merge two sources: localStorage (per-browser, anonymous) and the doc's
// `dismissedBy` array (per-account, cross-device) so the UI never shows a
// banner the user already dismissed.
function loadLocalDismissals(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const out = new Set<string>();
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(ANNOUNCEMENT_DISMISSED_PREFIX)) {
      out.add(k.slice(ANNOUNCEMENT_DISMISSED_PREFIX.length));
    }
  }
  return out;
}

const TYPE_STYLES: Record<Announcement["type"], { bg: string; border: string; icon: string }> = {
  info: {
    bg: "linear-gradient(135deg, rgba(56,89,153,0.95), rgba(36,59,108,0.95))",
    border: "rgba(120,170,255,0.45)",
    icon: "ℹ",
  },
  success: {
    bg: "linear-gradient(135deg, rgba(34,110,73,0.95), rgba(20,80,52,0.95))",
    border: "rgba(120,220,160,0.45)",
    icon: "✓",
  },
  warning: {
    bg: "linear-gradient(135deg, rgba(176,118,28,0.95), rgba(132,86,18,0.95))",
    border: "rgba(255,205,120,0.55)",
    icon: "!",
  },
  error: {
    bg: "linear-gradient(135deg, rgba(176,46,46,0.95), rgba(132,30,30,0.95))",
    border: "rgba(255,140,140,0.55)",
    icon: "✕",
  },
};

export function AnnouncementBanner() {
  const [items, setItems] = useState<BannerItem[]>([]);
  const [clientId, setClientId] = useState<string>("");
  const [localDismissals, setLocalDismissals] = useState<Set<string>>(
    () => new Set()
  );

  // Pull the active announcements on mount. We don't auto-poll — the banner
  // only re-evaluates on next page load, which matches the admin's expected
  // "publish a banner, visitors see it on next refresh" workflow.
  useEffect(() => {
    let cancelled = false;
    setClientId(getOrCreateClientId());
    setLocalDismissals(loadLocalDismissals());
    (async () => {
      const active = await getActiveAnnouncements();
      if (cancelled) return;
      setItems(
        active.map((a) => ({
          ...a,
          dismissed: false, // will be filtered below
        }))
      );
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    return items.filter((a) => {
      if (localDismissals.has(a.id)) return false;
      if (Array.isArray(a.dismissedBy) && clientId && a.dismissedBy.includes(clientId)) {
        return false;
      }
      return true;
    });
  }, [items, localDismissals, clientId]);

  // Toggle a body attribute so the CSS rule in globals.css can offset the
  // fixed navbar + hero. Avoids the banner covering the nav.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (visible.length > 0) {
      document.body.setAttribute("data-has-announcement", "true");
    } else {
      document.body.removeAttribute("data-has-announcement");
    }
    return () => {
      document.body.removeAttribute("data-has-announcement");
    };
  }, [visible.length]);

  const dismiss = useCallback(
    async (id: string) => {
      // 1. Persist in localStorage so the banner doesn't reappear on reload.
      try {
        window.localStorage.setItem(
          ANNOUNCEMENT_DISMISSED_PREFIX + id,
          new Date().toISOString()
        );
      } catch {
        /* ignore */
      }
      setLocalDismissals((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      // 2. Persist on the doc so cross-device dismissal works.
      if (clientId) {
        await recordAnnouncementDismissal(id, clientId);
      }
      setItems((prev) => prev.filter((a) => a.id !== id));
    },
    [clientId]
  );

  if (visible.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Site announcements"
      className="announcement-banner-stack"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60, // above fixed navbar (z-50)
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {visible.map((a) => {
        const style = TYPE_STYLES[a.type] || TYPE_STYLES.info;
        return (
          <div
            key={a.id}
            role="status"
            className="announcement-banner"
            style={{
              pointerEvents: "auto",
              margin: "8px auto 0",
              maxWidth: 980,
              width: "calc(100% - 24px)",
              borderRadius: 12,
              border: `1px solid ${style.border}`,
              background: style.bg,
              color: "#f5f1e6",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              padding: "10px 14px",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              fontSize: 14,
              lineHeight: 1.45,
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              aria-hidden
              style={{
                flexShrink: 0,
                width: 22,
                height: 22,
                borderRadius: 999,
                background: "rgba(255,255,255,0.16)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {style.icon}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              {a.title && (
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: 2,
                    color: "#fff8e1",
                  }}
                >
                  {a.title}
                </div>
              )}
              <div style={{ color: "rgba(255,255,255,0.92)" }}>{a.body}</div>
            </div>
            <button
              type="button"
              onClick={() => dismiss(a.id)}
              aria-label={`Dismiss announcement: ${a.title || "notification"}`}
              style={{
                flexShrink: 0,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 6,
                color: "rgba(255,255,255,0.85)",
                padding: "2px 8px",
                fontSize: 12,
                cursor: "pointer",
                lineHeight: 1.4,
              }}
            >
              Dismiss
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default AnnouncementBanner;
