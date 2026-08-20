export interface Solution {
  id: string;
  audience: string;
  title: string;
  description: string;
  benefits: string[];
  features: string[];
  icon: string;
  image: string;
}

export const solutions: Solution[] = [
  {
    id: "individuals",
    audience: "For Individuals",
    title: "Celebrations made simple",
    description:
      "Create a beautiful page for your wedding, birthday or anniversary — share it, collect RSVPs and keep every memory in one place.",
    benefits: [
      "A stunning page in minutes",
      "Easy sharing with family and friends",
      "RSVPs and guest wishes in one place",
    ],
    features: ["Event Website", "RSVP", "Photo Gallery", "QR Code"],
    icon: "heart",
    image: "/full-width-animation/PE-BG-01-golden-odisha.gif",
  },
  {
    id: "photographers",
    audience: "For Photographers",
    title: "Deliver galleries your clients love",
    description:
      "Manage multiple clients and events, deliver beautiful galleries and let guests collect their own memories alongside your shots.",
    benefits: [
      "Professional delivery for every shoot",
      "Guest uploads complement your work",
      "A branded page for each client",
    ],
    features: ["Photo Gallery", "Guest Upload", "Custom Branding", "Analytics"],
    icon: "camera",
    image: "/animation/Soft Golden Bokeh.gif",
  },
  {
    id: "event-planners",
    audience: "For Event Planners",
    title: "Run many events without the chaos",
    description:
      "Manage every client event from one dashboard — pages, schedules, guest lists and updates all in sync.",
    benefits: [
      "Multiple events in one account",
      "Consistent, professional pages",
      "Clear guest and RSVP management",
    ],
    features: ["Event Website", "RSVP", "Schedule", "Live Updates"],
    icon: "planner",
    image: "/full-width-animation/PE-BG-02 — Elegant Odisha Celebration Flow.gif",
  },
  {
    id: "companies",
    audience: "For Companies",
    title: "Corporate events, done properly",
    description:
      "Conferences, launches and summits with structured agendas, registration and professional presentation.",
    benefits: [
      "Credible pages for professional events",
      "Registration and attendance tracking",
      "Announcements reach every attendee",
    ],
    features: ["Registration", "Analytics", "Schedule", "Live Updates"],
    icon: "briefcase",
    image: "/full-width-animation/PE-BG-02 — Elegant Odisha Celebration Flow.gif",
  },
  {
    id: "schools",
    audience: "For Schools",
    title: "Share the pride with every family",
    description:
      "Annual functions, sports days and cultural celebrations shared beautifully with parents, teachers and the community.",
    benefits: [
      "Warm pages families will love",
      "Simple parent RSVPs",
      "A lasting memory for every event",
    ],
    features: ["Event Website", "Photo Gallery", "RSVP", "Notifications"],
    icon: "school",
    image: "/full-width-animation/PE-BG-01-golden-odisha.gif",
  },
  {
    id: "colleges",
    audience: "For Colleges",
    title: "Fests that feel as big as they are",
    description:
      "Competitions, pro shows and convocations with registration, schedules and huge galleries.",
    benefits: [
      "Handle thousands of registrations",
      "Keep participants updated in real time",
      "Showcase the energy of your fest",
    ],
    features: ["Registration", "Schedule", "Photo Gallery", "Live Updates"],
    icon: "graduation",
    image: "/animation/Floating Confetti.gif",
  },
  {
    id: "institutions",
    audience: "For Institutions & Government",
    title: "Organised events at scale",
    description:
      "Public programmes and large gatherings with clear, accessible, credible pages for every participant.",
    benefits: [
      "Structured, accessible pages",
      "Simple public registration",
      "Reliable announcements at scale",
    ],
    features: ["Event Website", "Registration", "Analytics", "Live Updates"],
    icon: "landmark",
    image: "/full-width-animation/PE-BG-02 — Elegant Odisha Celebration Flow.gif",
  },
];
