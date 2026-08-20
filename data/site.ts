export const site = {
  name: "Palei Events",
  domain: "paleievents.com",
  tagline: "Every Event. One Digital Experience.",
  supporting: "Create. Celebrate. Remember.",
  description:
    "Create beautiful digital event experiences for weddings, birthdays, corporate events, schools, colleges and celebrations with Palei Events.",
  url: "https://paleievents.com",
  email: "paleievents.service@gmail.com",
  phone: "9437739550",
  location: "Bhubaneswar, Odisha, India",
  address: "101, Avinue Apartment, Gothapatana, Bhubaneswar, Odisha-751003",
};

export const navLinks = [
  { label: "Events", href: "/templates" },
  { label: "Solutions", href: "/solutions" },
  { label: "Features", href: "/features" },
  { label: "Templates", href: "/templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/blog" },
] as const;

export const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Templates", href: "/templates" },
      { label: "Pricing", href: "/pricing" },
      { label: "Solutions", href: "/solutions" },
    ],
  },
  {
    title: "Event Types",
    links: [
      { label: "Wedding", href: "/templates?category=wedding" },
      { label: "Birthday", href: "/templates?category=birthday" },
      { label: "Corporate", href: "/templates?category=corporate" },
      { label: "School", href: "/templates?category=school" },
      { label: "College", href: "/templates?category=college" },
      { label: "Government", href: "/templates?category=government" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
] as const;
