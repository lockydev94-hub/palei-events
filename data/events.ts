export type EventType =
  | "wedding"
  | "birthday"
  | "corporate"
  | "school"
  | "college"
  | "government"
  | "conference"
  | "cultural"
  | "sports"
  | "community";

export interface EventTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontHeading: string;
  fontBody: string;
  animation?: string;
}

export interface Venue {
  name: string;
  address: string;
  city: string;
  mapQuery: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}

export interface Wish {
  name: string;
  message: string;
  relation?: string;
}

export interface Event {
  id: string;
  slug: string;
  type: EventType;
  name: string;
  tagline: string;
  description: string;
  startDate: string;
  endDate?: string;
  venue?: Venue;
  theme: EventTheme;
  heroImage?: string;
  heroVideo?: string;
  gallery: GalleryItem[];
  schedule: ScheduleItem[];
  wishes: Wish[];
}

export const eventTypeMeta: Record<
  EventType,
  { label: string; description: string; icon: string }
> = {
  wedding: {
    label: "Wedding",
    description: "Beautiful event pages for weddings and the journey that surrounds them.",
    icon: "ring",
  },
  birthday: {
    label: "Birthday",
    description: "Playful, personal pages that make every birthday feel special.",
    icon: "cake",
  },
  corporate: {
    label: "Corporate",
    description: "Professional event pages for launches, retreats and summits.",
    icon: "briefcase",
  },
  school: {
    label: "School",
    description: "Annual functions and celebrations shared with parents and families.",
    icon: "school",
  },
  college: {
    label: "College",
    description: "Fests, competitions and convocations with full registration support.",
    icon: "graduation",
  },
  government: {
    label: "Government",
    description: "Formal pages for public programmes and organised gatherings.",
    icon: "landmark",
  },
  conference: {
    label: "Conference",
    description: "Agendas, speakers and registration for professional conferences.",
    icon: "mic",
  },
  cultural: {
    label: "Cultural",
    description: "Folk, music and community celebrations told beautifully online.",
    icon: "music",
  },
  sports: {
    label: "Sports",
    description: "Fixtures, results and teams for tournaments and meets.",
    icon: "trophy",
  },
  community: {
    label: "Community",
    description: "Neighbourhood and public events that bring people together.",
    icon: "users",
  },
};

export const eventCategories = Object.entries(eventTypeMeta).map(([key, meta]) => ({
  type: key as EventType,
  ...meta,
}));

export const demoEvents: Event[] = [
  {
    id: "aarav-ananya-wedding",
    slug: "aarav-ananya-wedding",
    type: "wedding",
    name: "Aarav & Ananya",
    tagline: "The Beginning of Forever",
    description:
      "Join us as we celebrate the beginning of forever. With our families beside us, we would be honoured to share this day of joy, music and togetherness with you.",
    startDate: "2026-12-14T18:30:00+05:30",
    endDate: "2026-12-16T23:00:00+05:30",
    venue: {
      name: "The Celebration Gardens",
      address: "Near Kalinga Stadium, Patia",
      city: "Bhubaneswar, Odisha",
      mapQuery: "Kalinga Stadium, Bhubaneswar",
    },
    theme: {
      primaryColor: "#c89b3c",
      secondaryColor: "#e88c9b",
      backgroundColor: "#fffdf8",
      fontHeading: "Playfair Display",
      fontBody: "Manrope",
      animation: "/full-width-animation/PE-BG-01-golden-odisha.gif",
    },
    heroImage: "/full-width-animation/PE-BG-01-golden-odisha.gif",
    gallery: [
      {
        src: "/full-width-animation/PE-BG-01-golden-odisha.gif",
        alt: "Aarav and Ananya wedding celebration",
        caption: "The golden hour before the ceremony",
      },
      {
        src: "/animation/Floating Floral Petals.gif",
        alt: "Floral petals at the wedding venue",
        caption: "Petals from our families",
      },
      {
        src: "/animation/Golden Light Particles.gif",
        alt: "Golden light at the evening reception",
        caption: "Evening lights over the mandap",
      },
    ],
    schedule: [
      {
        time: "4:30 PM",
        title: "Welcome Reception",
        description: "Meet and greet with both families over refreshments.",
      },
      {
        time: "6:00 PM",
        title: "Haldi & Mehndi",
        description: "Traditional ceremonies with music and colour.",
      },
      {
        time: "8:00 PM",
        title: "The Wedding Ceremony",
        description: "Sacred vows with the presence of both families.",
      },
      {
        time: "9:30 PM",
        title: "Dinner & Celebration",
        description: "Dinner and dancing into the night.",
      },
    ],
    wishes: [
      {
        name: "Priya & Rohit",
        message: "Wishing you both a lifetime of love, laughter and beautiful memories!",
        relation: "Family friends",
      },
      {
        name: "Odisha Bikers Club",
        message: "Congratulations to the wonderful couple! May your journey be blessed.",
      },
      {
        name: "Sourav",
        message: "So happy for you both. Can't wait to celebrate with you!",
        relation: "College friend",
      },
    ],
  },
  {
    id: "odisha-business-summit-2026",
    slug: "odisha-business-summit-2026",
    type: "corporate",
    name: "Odisha Business & Innovation Summit 2026",
    tagline: "Building the Next Decade Together",
    description:
      "A two-day summit bringing together entrepreneurs, industry leaders, startups and policymakers to shape the future of business and innovation in Odisha.",
    startDate: "2026-11-21T09:00:00+05:30",
    endDate: "2026-11-22T18:00:00+05:30",
    venue: {
      name: "Convention Centre",
      address: "Janpath Road",
      city: "Bhubaneswar, Odisha",
      mapQuery: "Janpath Road Bhubaneswar",
    },
    theme: {
      primaryColor: "#172033",
      secondaryColor: "#c89b3c",
      backgroundColor: "#faf8f3",
      fontHeading: "Playfair Display",
      fontBody: "Manrope",
    },
    heroImage: "/full-width-animation/PE-BG-02 — Elegant Odisha Celebration Flow.gif",
    gallery: [
      {
        src: "/full-width-animation/PE-BG-02 — Elegant Odisha Celebration Flow.gif",
        alt: "Odisha Business Summit stage",
        caption: "Main stage at the summit",
      },
      {
        src: "/animation/Golden Light Particles.gif",
        alt: "Lighting at the summit",
        caption: "Evening networking session",
      },
    ],
    schedule: [
      {
        time: "9:00 AM",
        title: "Registration & Welcome Coffee",
      },
      {
        time: "10:00 AM",
        title: "Inaugural Keynote",
        description: "The state of innovation in Odisha.",
      },
      {
        time: "11:30 AM",
        title: "Panel: Startups & Investment",
      },
      {
        time: "2:00 PM",
        title: "Breakout Sessions & Expo",
      },
      {
        time: "5:00 PM",
        title: "Networking Reception",
      },
    ],
    wishes: [
      {
        name: "Delegates of 2026",
        message: "An incredible gathering. See you next year!",
      },
    ],
  },
  {
    id: "bhubaneswar-youth-fest",
    slug: "bhubaneswar-youth-fest",
    type: "college",
    name: "Bhubaneswar Youth Fest 2026",
    tagline: "Dream. Perform. Inspire.",
    description:
      "Three days of dance, music, drama, debates and creativity — the biggest student festival in the region. Register now to compete or celebrate with us.",
    startDate: "2026-10-02T10:00:00+05:30",
    endDate: "2026-10-04T22:00:00+05:30",
    venue: {
      name: "University Campus Grounds",
      address: "Khandagiri",
      city: "Bhubaneswar, Odisha",
      mapQuery: "Khandagiri Bhubaneswar",
    },
    theme: {
      primaryColor: "#9b7acb",
      secondaryColor: "#f29b7a",
      backgroundColor: "#faf8f3",
      fontHeading: "Playfair Display",
      fontBody: "Manrope",
      animation: "/animation/Floating Confetti.gif",
    },
    heroImage: "/animation/Floating Confetti.gif",
    gallery: [
      {
        src: "/animation/Floating Confetti.gif",
        alt: "Confetti at the youth fest opening",
        caption: "Opening ceremony confetti",
      },
      {
        src: "/animation/Floating Abstract Event Shapes.gif",
        alt: "Stage visuals at the fest",
        caption: "Main stage performances",
      },
    ],
    schedule: [
      {
        time: "10:00 AM",
        title: "Inauguration & Flag Off",
      },
      {
        time: "12:00 PM",
        title: "Dance Competition — Round 1",
      },
      {
        time: "3:00 PM",
        title: "Battle of Bands",
      },
      {
        time: "7:00 PM",
        title: "Pro Show & DJ Night",
      },
    ],
    wishes: [
      {
        name: "Student Council",
        message: "Bring your energy! This year will be the biggest yet.",
      },
    ],
  },
  {
    id: "aarav-turns-eight",
    slug: "aarav-turns-eight",
    type: "birthday",
    name: "Aarav Turns 8",
    tagline: "A Superhero Adventure",
    description:
      "Come join Aarav as he turns eight! A superhero-themed birthday with games, cake and plenty of adventures waiting at the party.",
    startDate: "2026-09-06T16:00:00+05:30",
    venue: {
      name: "Little Sprouts Playhouse",
      address: "Sahid Nagar",
      city: "Bhubaneswar, Odisha",
      mapQuery: "Sahid Nagar Bhubaneswar",
    },
    theme: {
      primaryColor: "#f29b7a",
      secondaryColor: "#e88c9b",
      backgroundColor: "#fffdf8",
      fontHeading: "Playfair Display",
      fontBody: "Manrope",
      animation: "/animation/Floating Confetti.gif",
    },
    heroImage: "/animation/Floating Confetti.gif",
    gallery: [
      {
        src: "/animation/Floating Confetti.gif",
        alt: "Birthday party confetti",
        caption: "Party time!",
      },
    ],
    schedule: [
      {
        time: "4:00 PM",
        title: "Games & Activities",
      },
      {
        time: "5:30 PM",
        title: "Cake Cutting",
      },
      {
        time: "6:00 PM",
        title: "Dinner & Goodbye Bags",
      },
    ],
    wishes: [
      {
        name: "Mom & Dad",
        message: "Happy birthday, Aarav! You are our greatest adventure.",
      },
      {
        name: "Grandpa",
        message: "Eight years of joy! Love you, champ.",
      },
    ],
  },
  {
    id: "dav-annual-cultural-2026",
    slug: "dav-annual-cultural-2026",
    type: "school",
    name: "DAV Annual Cultural Celebration 2026",
    tagline: "Roots of Tomorrow",
    description:
      "Our students present an evening of dance, drama and music celebrating the roots that shape tomorrow. Families are warmly invited.",
    startDate: "2026-12-05T17:00:00+05:30",
    venue: {
      name: "DAV School Auditorium",
      address: "Unit 8",
      city: "Bhubaneswar, Odisha",
      mapQuery: "DAV School Unit 8 Bhubaneswar",
    },
    theme: {
      primaryColor: "#172033",
      secondaryColor: "#93a88a",
      backgroundColor: "#faf8f3",
      fontHeading: "Playfair Display",
      fontBody: "Manrope",
    },
    heroImage: "/full-width-animation/PE-BG-01-golden-odisha.gif",
    gallery: [
      {
        src: "/full-width-animation/PE-BG-01-golden-odisha.gif",
        alt: "School cultural programme stage",
        caption: "Stage prepared for the evening",
      },
    ],
    schedule: [
      {
        time: "5:00 PM",
        title: "Welcome & Lamp Lighting",
      },
      {
        time: "5:30 PM",
        title: "Folk Dance Performances",
      },
      {
        time: "7:00 PM",
        title: "Drama & Award Ceremony",
      },
    ],
    wishes: [
      {
        name: "Parent Community",
        message: "So proud of every child performing tonight!",
      },
    ],
  },
  {
    id: "odisha-community-development-conference-2026",
    slug: "odisha-community-development-conference-2026",
    type: "government",
    name: "Odisha Community Development Conference 2026",
    tagline: "Progress, Together",
    description:
      "A public conference (demo event) on community development, open dialogue and regional progress. Fictional content for demonstration purposes only.",
    startDate: "2026-08-28T10:00:00+05:30",
    venue: {
      name: "District Auditorium",
      address: "Government College Road",
      city: "Bhubaneswar, Odisha",
      mapQuery: "Government College Road Bhubaneswar",
    },
    theme: {
      primaryColor: "#172033",
      secondaryColor: "#c89b3c",
      backgroundColor: "#faf8f3",
      fontHeading: "Playfair Display",
      fontBody: "Manrope",
    },
    heroImage: "/full-width-animation/PE-BG-02 — Elegant Odisha Celebration Flow.gif",
    gallery: [
      {
        src: "/full-width-animation/PE-BG-02 — Elegant Odisha Celebration Flow.gif",
        alt: "Community conference hall",
        caption: "Main conference hall",
      },
    ],
    schedule: [
      {
        time: "10:00 AM",
        title: "Inaugural Address",
      },
      {
        time: "11:00 AM",
        title: "Session: Rural Development",
      },
      {
        time: "2:00 PM",
        title: "Session: Digital Inclusion",
      },
      {
        time: "4:00 PM",
        title: "Open House & Summary",
      },
    ],
    wishes: [
      {
        name: "Community Volunteers",
        message: "Thank you for organising this important conversation.",
      },
    ],
  },
];
