export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  visual?: string;
  comingSoon?: boolean;
}

export const features: Feature[] = [
  {
    id: "event-website",
    title: "Event Website",
    description:
      "A beautiful, mobile-friendly event page for every celebration — from weddings to conferences.",
    icon: "globe",
    category: "Event Creation",
    visual: "/full-width-animation/PE-BG-01-golden-odisha.gif",
  },
  {
    id: "rsvp",
    title: "RSVP",
    description:
      "Know who is attending. Collect responses, guest counts and dietary preferences in one place.",
    icon: "check",
    category: "RSVP",
  },
  {
    id: "qr-code",
    title: "QR Code",
    description:
      "Give guests instant access to your event page with a scannable QR code for invitations and posters.",
    icon: "qr",
    category: "QR",
  },
  {
    id: "photo-gallery",
    title: "Photo Gallery",
    description:
      "Collect and share event memories in a gallery that stays with you long after the celebration ends.",
    icon: "image",
    category: "Gallery",
    visual: "/animation/Floating Floral Petals.gif",
  },
  {
    id: "guest-uploads",
    title: "Guest Uploads",
    description:
      "Let guests contribute their own photos and moments to create a shared memory wall.",
    icon: "upload",
    category: "Guest Upload",
  },
  {
    id: "schedule",
    title: "Schedule",
    description:
      "Keep everyone informed with a clear programme of events, timings and sessions.",
    icon: "calendar",
    category: "Schedule",
  },
  {
    id: "live-updates",
    title: "Live Updates",
    description:
      "Share announcements and real-time updates with every guest the moment they happen.",
    icon: "bell",
    category: "Notifications",
  },
  {
    id: "analytics",
    title: "Event Analytics",
    description:
      "Understand registrations, page visits and engagement with a simple, clear dashboard.",
    icon: "chart",
    category: "Analytics",
  },
  {
    id: "custom-branding",
    title: "Custom Branding",
    description:
      "Bring your own colours, logo and style so every event page feels truly yours.",
    icon: "palette",
    category: "Custom Branding",
  },
  {
    id: "ai-assistant",
    title: "AI Event Assistant",
    description:
      "Let AI help draft invitations, plan schedules and build content for your event page.",
    icon: "sparkles",
    category: "AI Features",
    comingSoon: true,
  },
];

export const featureGroups = [
  {
    title: "Event Creation",
    description: "Stand up a complete event page in minutes.",
    features: features.filter((f) => f.category === "Event Creation"),
  },
  {
    title: "Guest Experience",
    description: "Everything your guests need to plan, attend and participate.",
    features: features.filter(
      (f) => ["RSVP", "QR", "Gallery", "Guest Upload", "Schedule", "Notifications"].includes(f.category)
    ),
  },
  {
    title: "Insights & Brand",
    description: "Understand your event and make it yours.",
    features: features.filter(
      (f) => ["Analytics", "Custom Branding", "AI Features"].includes(f.category)
    ),
  },
];
