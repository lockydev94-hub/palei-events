import type { EventType } from "./events";

export interface Template {
  id: string;
  name: string;
  category: EventType;
  style: string;
  description: string;
  preview: string;
  demoSlug?: string;
  featured?: boolean;
}

export const templates: Template[] = [
  {
    id: "royal-wedding",
    name: "Royal Wedding",
    category: "wedding",
    style: "Classic · Gold",
    description: "A regal gold-and-ivory page for grand ceremonies and timeless love stories.",
    preview: "/full-width-animation/PE-BG-01-golden-odisha.gif",
    demoSlug: "aarav-ananya-wedding",
    featured: true,
  },
  {
    id: "modern-wedding",
    name: "Modern Wedding",
    category: "wedding",
    style: "Minimal · Contemporary",
    description: "Clean lines, big typography and a focused page for modern couples.",
    preview: "/animation/Subtle Ring _ Celebration Wave.gif",
    demoSlug: "aarav-ananya-wedding",
  },
  {
    id: "birthday-celebration",
    name: "Birthday Celebration",
    category: "birthday",
    style: "Playful · Bright",
    description: "Confetti energy and cheerful layouts made for unforgettable birthdays.",
    preview: "/animation/Floating Confetti.gif",
    demoSlug: "aarav-turns-eight",
    featured: true,
  },
  {
    id: "corporate-conference",
    name: "Corporate Conference",
    category: "corporate",
    style: "Formal · Professional",
    description: "Agendas, speakers and registration in a clean, credible layout.",
    preview: "/full-width-animation/PE-BG-02 — Elegant Odisha Celebration Flow.gif",
    demoSlug: "odisha-business-summit-2026",
    featured: true,
  },
  {
    id: "school-annual-day",
    name: "School Annual Day",
    category: "school",
    style: "Warm · Family",
    description: "Share the pride of students, teachers and families in one place.",
    preview: "/full-width-animation/PE-BG-01-golden-odisha.gif",
    demoSlug: "dav-annual-cultural-2026",
  },
  {
    id: "college-fest",
    name: "College Fest",
    category: "college",
    style: "Energetic · Modern",
    description: "Vibrant pages with competition line-ups, pro shows and registrations.",
    preview: "/animation/Floating Abstract Event Shapes.gif",
    demoSlug: "bhubaneswar-youth-fest",
  },
  {
    id: "government-event",
    name: "Government Event",
    category: "government",
    style: "Formal · Credible",
    description: "Structured, accessible pages for public programmes and notices.",
    preview: "/full-width-animation/PE-BG-02 — Elegant Odisha Celebration Flow.gif",
    demoSlug: "odisha-community-development-conference-2026",
  },
  {
    id: "cultural-festival",
    name: "Cultural Festival",
    category: "cultural",
    style: "Folk · Artistic",
    description: "Colourful storytelling for music, folk and community celebrations.",
    preview: "/animation/Odisha Sambalpuri Pattern Motion.gif",
    demoSlug: "bhubaneswar-youth-fest",
    featured: true,
  },
  {
    id: "sports-meet",
    name: "Sports Meet",
    category: "sports",
    style: "Bold · Dynamic",
    description: "Fixtures, teams and results laid out for tournaments and meets.",
    preview: "/animation/Elegant Light Sweep.gif",
    demoSlug: "odisha-business-summit-2026",
  },
];

export const templateCategories = [
  "All",
  "Wedding",
  "Birthday",
  "Corporate",
  "School",
  "College",
  "Government",
  "Cultural",
  "Sports",
] as const;

export const templateStyles = [
  "All",
  "Classic",
  "Minimal",
  "Playful",
  "Formal",
  "Energetic",
  "Folk",
  "Bold",
] as const;
