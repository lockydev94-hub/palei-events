export interface BlogSection {
  heading: string;
  body: string[];
}

export interface BlogTip {
  icon: string;
  title: string;
  desc: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  /** Secondary image shown inline mid-article */
  inlineImage?: string;
  /** Third image shown near the end of the article */
  closingImage?: string;
  pullQuote?: string;
  author?: { name: string; role: string };
  tags?: string[];
  sections?: BlogSection[];
  tips?: BlogTip[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "digital-wedding-event-page",
    slug: "digital-wedding-event-page",
    title: "How to Create a Digital Wedding Event Page",
    excerpt:
      "From the save-the-date to the thank-you note, here's how a single event page can carry your entire wedding journey.",
    category: "Wedding",
    date: "August 10, 2026",
    readTime: "5 min read",
    image: "/full-width-animation/PE-BG-01-golden-odisha.gif",
    inlineImage: "/animation/Floating Floral Petals.gif",
    closingImage: "/animation/Soft Golden Bokeh.gif",
    pullQuote:
      "A wedding page isn't just an invite — it's the first chapter of a story your guests will return to for years.",
    author: { name: "Palei Editorial", role: "Events Team" },
    tags: ["Wedding", "Digital Invite", "Guest Experience", "Memories"],
    sections: [
      {
        heading: "Why Every Wedding Needs a Digital Home",
        body: [
          "A wedding is one of the most documented moments in a person's life — yet most of that documentation is scattered across WhatsApp groups, individual camera rolls, and printed invitations that get lost in the mail. A digital wedding event page gathers everything in one link that every guest can access the moment they receive it.",
          "When you share a Palei Events wedding page, guests land on a beautifully branded space: your names, the date, the venue, a countdown, and everything they need to know — all styled to match the aesthetic of your celebration.",
        ],
      },
      {
        heading: "What to Include on Your Wedding Page",
        body: [
          "Start with the essentials: event name, date, time, and venue address with an embedded map. Add your wedding schedule so guests know when the baraat arrives, when the vows are exchanged, and when dinner begins. A well-structured schedule eliminates a dozen phone-call questions on the day itself.",
          "From there, build the experience. Add a photo gallery with engagement or pre-wedding shoot images so the page feels personal. Enable the RSVP form so you collect dietary preferences and attendance counts without a single spreadsheet. Finally, activate the Wishes Wall so guests can leave messages that you and your family can read even years later.",
        ],
      },
      {
        heading: "Sharing Your Page the Right Way",
        body: [
          "The most effective wedding pages are shared early — at least three to four weeks before the event. Send the link via WhatsApp, include it in your printed invitation as a QR code, and pin it in your family groups. Guests who can't make it in person especially appreciate having a page they can follow for live updates and memories.",
          "Palei Events automatically generates a QR code for every event page. Print it on the invitation card, the banquet menu, or a welcome standee at the venue entrance. Guests scan and they're inside — no logins, no apps to download.",
        ],
      },
      {
        heading: "After the Wedding: Preserving the Memory",
        body: [
          "The page doesn't have to go dark after the ceremony. Keep it live for a month and watch guest-uploaded photos populate your gallery in real time. You can download the entire collection in one click and share highlights to social media directly from your event dashboard.",
          "Many Palei couples tell us that the Wishes Wall becomes something they re-read on every anniversary. It is, in a small way, a digital heirloom — something that will still be readable long after the paper invitations have faded.",
        ],
      },
    ],
    tips: [
      { icon: "💌", title: "Send early", desc: "Share your page 3–4 weeks before the event for maximum RSVP time." },
      { icon: "📸", title: "Add real photos", desc: "Upload engagement or pre-wedding images to make the page feel personal." },
      { icon: "📲", title: "Use QR codes", desc: "Print your QR on invitations and venue standees for instant guest access." },
      { icon: "🎁", title: "Keep it live", desc: "Leave the page active post-wedding so guests can upload and browse memories." },
    ],
  },
  {
    id: "qr-codes-improve-event-experiences",
    slug: "qr-codes-improve-event-experiences",
    title: "How QR Codes Improve Event Experiences",
    excerpt:
      "One scan and a guest is inside your event — RSVP, schedule, gallery and updates. Here's why QR matters.",
    category: "Product",
    date: "July 28, 2026",
    readTime: "4 min read",
    image: "/animation/Golden Light Particles.gif",
    inlineImage: "/animation/Elegant Light Sweep.gif",
    closingImage: "/animation/Subtle Ring _ Celebration Wave.gif",
    pullQuote:
      "The best event technology is the kind your guests never have to think about — they just scan and they're in.",
    author: { name: "Palei Product Team", role: "Product" },
    tags: ["QR Code", "Guest Check-in", "Technology", "RSVP"],
    sections: [
      {
        heading: "The Problem with Traditional Invitations",
        body: [
          "Paper invitations get lost, URLs are too long to type, and phone calls asking for the venue address happen right up until the morning of the event. QR codes solve all of this in a single printed square that any smartphone camera can read in under a second.",
          "For event organisers, the benefit goes further: you can update the event page after the invitation has already been printed and distributed. Change the venue, adjust the schedule, add a parking note — the QR code always points to the current version of the page.",
        ],
      },
      {
        heading: "Where to Place Your Event QR Code",
        body: [
          "On the invitation card is obvious, but think beyond that. A QR code on the event backdrop gives guests a way to find the photo gallery while they're still at the venue. A QR on the table card links to the menu and the seating arrangement. A QR on the thank-you card takes guests to the post-event photo collection.",
          "Every Palei Events page generates its own downloadable QR code the moment you publish. It's a PNG you can drop into any design tool, or hand directly to your printer.",
        ],
      },
      {
        heading: "QR Check-in for Managed Attendance",
        body: [
          "For corporate events, school functions, and college fests where attendance needs to be tracked, Palei's QR check-in feature lets organisers scan each guest's personal QR code as they arrive. The dashboard updates in real time so you always know exactly how many people are inside.",
          "This replaces printed guest lists, manual sign-in sheets, and the bottleneck that forms at a registration desk when three hundred people arrive in the first twenty minutes.",
        ],
      },
    ],
    tips: [
      { icon: "🖨️", title: "High-res print", desc: "Download the QR at 300 DPI minimum so it scans cleanly even at large print sizes." },
      { icon: "🎨", title: "Brand it", desc: "Add your event colours around the QR — just keep the centre clear for reliable scanning." },
      { icon: "📍", title: "Multiple placements", desc: "Put QR codes on invites, venue signage, and thank-you cards for maximum reach." },
      { icon: "🔄", title: "Update freely", desc: "Change event details anytime — the QR always points to the latest version." },
    ],
  },
  {
    id: "schools-share-event-memories",
    slug: "schools-share-event-memories",
    title: "How Schools Can Share Event Memories",
    excerpt:
      "Annual days build pride in students and families. A digital page turns one evening into a lasting memory.",
    category: "School",
    date: "July 14, 2026",
    readTime: "4 min read",
    image: "/full-width-animation/PE-BG-01-golden-odisha.gif",
    inlineImage: "/animation/Floating Confetti.gif",
    closingImage: "/animation/Odisha Sambalpuri Pattern Motion.gif",
    pullQuote:
      "Every child deserves to see their performance celebrated — not just on the night, but for years to come.",
    author: { name: "Palei Editorial", role: "Events Team" },
    tags: ["School Events", "Annual Day", "Parent Engagement", "Memory Gallery"],
    sections: [
      {
        heading: "The Annual Day Problem Schools Face",
        body: [
          "School annual days bring together hundreds of families, but the experience often ends the moment the auditorium lights go up. Parents captured blurry videos on their phones, teachers collected RSVPs in registers, and the only record of the event is a folder of photos sitting on the principal's laptop.",
          "A digital event page changes this. It gives the annual day a permanent online home where every performance, award, and memory is preserved and accessible to every family — whether they attended in person or watched from another city.",
        ],
      },
      {
        heading: "Setting Up Your School Event Page",
        body: [
          "Start with the programme schedule — list each performance, the performing class, and the approximate time. This lets parents know when their child is on stage, reducing the noise in the auditorium as families arrive late trying to catch a specific act.",
          "Add the RSVP form so the school knows how many seats to arrange. Collect parent names and their child's class so you can send targeted updates. When the programme changes — and it always does — you push one update to the page and every RSVP'd parent gets notified automatically.",
        ],
      },
      {
        heading: "Building a Living Memory After the Event",
        body: [
          "The real magic happens after the event is over. Enable the photo upload feature and share the page link to parent WhatsApp groups. Families start adding their own photos and videos — a candid of the dance rehearsal, a group photo backstage, a video of the prize distribution.",
          "Within 48 hours you have a crowd-sourced gallery that no professional photographer could have captured alone. The school can then curate the best images and publish an official album that lives permanently on the event page.",
        ],
      },
    ],
    tips: [
      { icon: "📅", title: "Publish early", desc: "Go live 2 weeks before so families can RSVP and mark calendars." },
      { icon: "📣", title: "Use WhatsApp", desc: "Share the page link in parent groups for the fastest reach." },
      { icon: "🏆", title: "List performers", desc: "Name each act and performing class so parents know when to arrive." },
      { icon: "🖼️", title: "Crowd-source photos", desc: "Invite families to upload — you'll get ten times more coverage than any single camera." },
    ],
  },
  {
    id: "corporate-digital-registration",
    slug: "corporate-digital-registration",
    title: "How Corporate Events Can Use Digital Registration",
    excerpt:
      "Replace spreadsheets and queues with a clean registration flow that updates in real time.",
    category: "Corporate",
    date: "June 30, 2026",
    readTime: "5 min read",
    image: "/full-width-animation/PE-BG-02 — Elegant Odisha Celebration Flow.gif",
    inlineImage: "/animation/Floating Abstract Event Shapes.gif",
    closingImage: "/animation/Golden Light Particles.gif",
    pullQuote:
      "The first impression of a corporate event happens before a single guest walks through the door — it happens at registration.",
    author: { name: "Palei Product Team", role: "Product" },
    tags: ["Corporate", "Registration", "Check-in", "Dashboard"],
    sections: [
      {
        heading: "Why Spreadsheets Fail at Scale",
        body: [
          "Every corporate event coordinator knows the feeling: the registration spreadsheet has seventeen versions, three people have editing access at the same time, and on the morning of the event nobody is sure which column has the final attendance count.",
          "Digital registration on Palei Events replaces this with a single source of truth. Every registration goes directly into your event dashboard. You see the live count, the dietary preferences, the company affiliations — all in one place, updated the moment someone submits the form.",
        ],
      },
      {
        heading: "Building a Professional Registration Flow",
        body: [
          "Your registration form is the first branded touchpoint attendees see. On Palei Events, you can customise the form fields to capture exactly what your event needs: designation, company name, session preferences for multi-track events, dietary requirements, and whether the delegate needs an accommodation recommendation.",
          "Each registrant receives an automated confirmation with a personalised QR code. At the venue, your team scans the QR and the attendee is checked in — no paper list, no searching through rows, no bottleneck at the registration desk.",
        ],
      },
      {
        heading: "Live Dashboard on the Day",
        body: [
          "Corporate events move fast. A session fills up. A speaker changes. A room needs to move. With a live event dashboard, every one of these changes can be communicated to all registered attendees with a single push notification — no mass WhatsApp message, no frantic phone calls.",
          "After the event, download the complete attendance report in one click. It includes check-in times, session attendance, and any notes your team added at the registration desk. Exactly what you need for the post-event report.",
        ],
      },
    ],
    tips: [
      { icon: "📋", title: "Custom fields", desc: "Capture company name, designation, and session preferences at registration." },
      { icon: "📱", title: "QR check-in", desc: "Each registrant gets a personal QR — scan it at the door for instant check-in." },
      { icon: "📊", title: "Live dashboard", desc: "Watch attendance update in real time from any device your team is holding." },
      { icon: "📤", title: "Export reports", desc: "Download a full attendance and session report after the event in one click." },
    ],
  },
  {
    id: "modern-college-fest",
    slug: "modern-college-fest",
    title: "Planning a Modern College Fest",
    excerpt:
      "Competitions, pro shows and thousands of registrations — how digital tools keep a fest organised and fun.",
    category: "College",
    date: "June 12, 2026",
    readTime: "6 min read",
    image: "/animation/Floating Confetti.gif",
    inlineImage: "/animation/Odisha Sambalpuri Pattern Motion.gif",
    closingImage: "/animation/Floating Floral Petals.gif",
    pullQuote:
      "A college fest is organised chaos — the right digital tools turn the chaos into an experience people talk about all semester.",
    author: { name: "Palei Editorial", role: "Events Team" },
    tags: ["College Fest", "Competitions", "Registrations", "Pro Show"],
    sections: [
      {
        heading: "The Scale Challenge of a College Fest",
        body: [
          "A college fest is unlike any other event type. You might have forty events running across three days, twenty different registration forms, a thousand students registering from your own campus and another five hundred from visiting colleges. Managing this with Google Forms and a committee WhatsApp group is where most fest organisations begin to crack.",
          "Palei Events gives your fest a single page that links to every event, every registration form, and every schedule update — and it looks good enough to share on your social media as the official fest platform.",
        ],
      },
      {
        heading: "Managing Multi-Event Registrations",
        body: [
          "Create individual event pages under your fest umbrella — one for the dance competition, one for the hackathon, one for the pro show ticket booking — and link them all from the main fest page. Each event tracks its own registrations, waitlists, and participant counts independently.",
          "Team events let participants register as a group with one team leader managing the submission. Solo events accept individual entries and automatically assign participant codes that double as check-in QR codes at the venue.",
        ],
      },
      {
        heading: "Keeping the Crowd Engaged",
        body: [
          "A live event page is also a live communication channel. Push schedule updates as events run ahead or behind. Announce results on the page the moment judges deliver them. Share backstage photos from the pro show in the gallery so the crowd at the venue and the followers watching from home both feel part of the experience.",
          "After the fest, the page becomes the official archive: results, highlights, leaderboards, and the photo gallery all in one URL you can link in next year's promotional material.",
        ],
      },
    ],
    tips: [
      { icon: "🗂️", title: "One hub page", desc: "Link all your fest events from a single main page for easy navigation." },
      { icon: "🏅", title: "Team registrations", desc: "Use team event forms so one leader submits for the whole group." },
      { icon: "📢", title: "Live updates", desc: "Push schedule changes and results instantly — no separate announcements needed." },
      { icon: "🗃️", title: "Archive it", desc: "Keep the page live as the official fest record for results and highlights." },
    ],
  },
  {
    id: "create-event-in-minutes",
    slug: "create-event-in-minutes",
    title: "How to Create an Event Page in Minutes",
    excerpt:
      "The four-step flow that turns an idea into a shareable, beautiful event page — fast.",
    category: "Product",
    date: "May 25, 2026",
    readTime: "3 min read",
    image: "/animation/Floating Abstract Event Shapes.gif",
    inlineImage: "/animation/Elegant Light Sweep.gif",
    closingImage: "/animation/Soft Golden Bokeh.gif",
    pullQuote:
      "The gap between 'I need an event page' and 'my event page is live and shareable' should be measured in minutes, not days.",
    author: { name: "Palei Product Team", role: "Product" },
    tags: ["Getting Started", "Templates", "Quick Setup", "How To"],
    sections: [
      {
        heading: "Step 1 — Pick a Template",
        body: [
          "Palei Events has over fifty templates organised by event type: weddings, birthdays, corporate events, school functions, college fests, and cultural celebrations. Each template is designed by the Palei team and comes pre-loaded with the right sections for that event type — you're not starting from a blank page.",
          "Wedding templates include a couple introduction section, ceremony schedule, RSVP form, and a Wishes Wall. Corporate templates include an agenda block, speaker profiles, and a registration form. Pick the one closest to your vision and customise from there.",
        ],
      },
      {
        heading: "Step 2 — Add Your Details",
        body: [
          "Replace the template placeholders with your event name, date, time, and venue. Upload your own photo or choose from the Palei image library. The preview updates in real time so you see exactly what your guests will see as you type.",
          "The rich text editor lets you format your event description, add bold headings, and embed links. If you want to include a map, paste the Google Maps link and it embeds automatically.",
        ],
      },
      {
        heading: "Step 3 — Configure RSVPs and Access",
        body: [
          "Toggle the RSVP form on, choose which fields to show (name, phone, dietary preference, number of guests), and set the capacity limit. You can make the event page public, password-protected for private family events, or invite-only.",
          "For events with an entry fee or ticket bookings, connect your payment method and set ticket tiers. Palei handles the payment flow and sends each buyer a personalised ticket with their QR check-in code.",
        ],
      },
      {
        heading: "Step 4 — Publish and Share",
        body: [
          "Hit Publish. Your event page goes live instantly at a shareable link and generates a downloadable QR code. Share the link on WhatsApp, copy it into your email, or download the QR and hand it to your printer.",
          "From your dashboard, watch RSVPs come in, update event details whenever plans change, and keep guests informed with one-click notifications. The whole setup — from template to live page — takes under ten minutes.",
        ],
      },
    ],
    tips: [
      { icon: "🖼️", title: "Use a real photo", desc: "Upload a personal image — a venue shot, a logo, or a couple photo — to instantly personalise any template." },
      { icon: "🔒", title: "Set access level", desc: "Public for open events, password-protected for private celebrations, invite-only for exclusive gatherings." },
      { icon: "🎟️", title: "Enable tickets early", desc: "If the event needs tickets, set up tiers before you share the link so early guests can book immediately." },
      { icon: "📊", title: "Watch your dashboard", desc: "RSVP counts, attendee names, and payment statuses update live — check it daily in the run-up to your event." },
    ],
  },
];
