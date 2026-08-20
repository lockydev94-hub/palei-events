export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "A simple event page to get started.",
    features: [
      "1 event page",
      "Mobile-friendly design",
      "Share link",
      "Basic gallery",
    ],
    cta: "Start Free",
  },
  {
    id: "celebration",
    name: "Celebration",
    price: "₹999",
    period: "per event",
    description: "Everything a personal celebration needs.",
    features: [
      "Photo gallery & guest uploads",
      "RSVP management",
      "QR code access",
      "Custom theme colours",
      "Guest wishes",
    ],
    cta: "Choose Celebration",
    featured: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹2,999",
    period: "per event",
    description: "Advanced features for bigger events.",
    features: [
      "Advanced gallery & storage",
      "Custom branding",
      "Event analytics",
      "Live updates",
      "Priority support",
    ],
    cta: "Choose Premium",
  },
  {
    id: "business",
    name: "Business",
    price: "₹1,999",
    period: "per month",
    description: "For photographers and event planners.",
    features: [
      "Multiple events",
      "Client management",
      "Deliverable galleries",
      "Advanced analytics",
      "Team accounts",
    ],
    cta: "Choose Business",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    description: "For companies, institutions and large organisations.",
    features: [
      "Unlimited events",
      "Registration at scale",
      "Custom integrations",
      "Dedicated support",
      "SLA & security",
    ],
    cta: "Contact Sales",
  },
];

export const pricingNote =
  "Demo pricing shown for product demonstration only. The final business model will be confirmed before launch.";
