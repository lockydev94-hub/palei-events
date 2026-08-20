import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Palei Events privacy policy — how we collect, use and protect your information when you create and share digital event experiences.",
  keywords: ["Palei Events privacy", "privacy policy", "data protection", "event platform privacy"],
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: (
      <>
        <p>
          Palei Events is designed to help you create, share and remember beautiful digital
          event experiences. To make that possible, we collect information you provide directly,
          information collected automatically, and information from third-party services you choose
          to connect.
        </p>
        <p>
          <strong style={{ color: "#172033" }}>Information you provide.</strong> When you create an
          account, build an event page, respond to an RSVP, or contact our support team, we collect
          the details you share — such as your name, email address, phone number, event details,
          guest lists and any content you upload like photos, videos or messages.
        </p>
        <p>
          <strong style={{ color: "#172033" }}>Information collected automatically.</strong> When you
          visit our website, we collect basic usage data including your IP address, browser type,
          device information, pages viewed and the date and time of your visit. This helps us keep
          the platform fast, secure and reliable.
        </p>
        <p>
          <strong style={{ color: "#172033" }}>Information from third parties.</strong> If you use
          integrated features such as WhatsApp invitations, payment links or social sharing, we may
          receive basic details from those providers in line with their own privacy policies.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: (
      <>
        <p>We use the information we collect to provide, maintain and improve our services:</p>
        <p>
          • To power your event pages — displaying schedules, galleries, wishes, RSVPs and
          invitations to the people you share them with.<br />
          • To communicate with you about your account, events, updates and support requests.<br />
          • To personalise your experience and recommend templates, event types and features.<br />
          • To improve our platform through analytics, diagnostics and feature development.<br />
          • To keep the service safe by detecting, preventing and addressing abuse or security
          issues.
        </p>
        <p>
          We never sell your personal information to third parties, and we never use your event
          content for advertising.
        </p>
      </>
    ),
  },
  {
    id: "sharing-disclosure",
    title: "Sharing & Disclosure",
    content: (
      <>
        <p>
          We only share your information in limited, clearly-described situations:
        </p>
        <p>
          • <strong style={{ color: "#172033" }}>With people you choose.</strong> Event pages are
          shared with the guests and viewers you invite. What they can see is controlled by the
          visibility you set.<br />
          • <strong style={{ color: "#172033" }}>With service providers.</strong> We rely on trusted
          vendors for hosting, analytics, email delivery and payment processing. They only access
          data needed to perform their role and are bound by confidentiality.<br />
          • <strong style={{ color: "#172033" }}>For legal reasons.</strong> We may disclose
          information when required by law, legal process or to protect the rights, property and
          safety of Palei Events, our users or the public.
        </p>
        <p>
          If Palei Events is ever involved in a merger, acquisition or sale of assets, your data
          may be transferred as part of that transaction — we will notify you before it happens.
        </p>
      </>
    ),
  },
  {
    id: "cookies-analytics",
    title: "Cookies & Analytics",
    content: (
      <>
        <p>
          We use cookies and similar technologies to remember your preferences, keep you signed in
          and understand how visitors use the platform. Most browsers let you block or delete
          cookies — but some parts of Palei Events may not work as well without them.
        </p>
        <p>
          We use analytics tools to understand aggregate behaviour, such as which templates are
          popular and where visitors spend time. This data is collected in a way that does not
          identify individual visitors and helps us build a better experience for every event.
        </p>
      </>
    ),
  },
  {
    id: "data-security",
    title: "Data Security",
    content: (
      <>
        <p>
          Protecting your data is a priority. We use industry-standard technical and organisational
          measures — including encrypted connections, secure storage and restricted access controls —
          to safeguard your information against unauthorised access, alteration, disclosure or loss.
        </p>
        <p>
          While no method of transmission over the internet is 100% secure, we work continuously to
          keep our safeguards up to date. You also play a part: please keep your account credentials
          private and log out when using shared devices.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: (
      <>
        <p>
          We keep your information only as long as needed to provide the services you use, fulfil
          the purposes described in this policy, and satisfy legal, accounting or reporting
          requirements.
        </p>
        <p>
          When you close your account or request deletion, we will remove or anonymise your personal
          data within a reasonable period, except where we are required to retain it by law.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your Rights & Choices",
    content: (
      <>
        <p>You have control over your information:</p>
        <p>
          • <strong style={{ color: "#172033" }}>Access & correction.</strong> Review and update your
          account details and event content at any time.<br />
          • <strong style={{ color: "#172033" }}>Deletion.</strong> Request removal of your account or
          specific event data.<br />
          • <strong style={{ color: "#172033" }}>Objection & restriction.</strong> Ask us to limit how
          we process your data in certain circumstances.<br />
          • <strong style={{ color: "#172033" }}>Marketing opt-out.</strong> Unsubscribe from
          promotional communications at any time.
        </p>
        <p>
          To exercise any of these rights, reach out to us using the contact details below — we will
          respond within a reasonable time.
        </p>
      </>
    ),
  },
  {
    id: "children-privacy",
    title: "Children's Privacy",
    content: (
      <>
        <p>
          Palei Events is intended for general audiences and is not directed at children under 13.
          We do not knowingly collect personal information from children. If you believe a child has
          provided us with personal data, please contact us and we will promptly remove it.
        </p>
        <p>
          Schools and colleges using Palei Events to celebrate events should ensure they have the
          appropriate consent from parents or guardians where required.
        </p>
      </>
    ),
  },
  {
    id: "third-party-links",
    title: "Third-Party Links",
    content: (
      <>
        <p>
          Event pages may contain links to external websites, such as venue maps, payment providers
          or social platforms. We do not control these sites and are not responsible for their
          content or privacy practices. We encourage you to review the privacy policy of any external
          service you visit.
        </p>
      </>
    ),
  },
  {
    id: "policy-updates",
    title: "Changes to This Policy",
    content: (
      <>
        <p>
          We may update this privacy policy from time to time to reflect changes in our practices,
          technology or legal requirements. When we do, we will revise the &ldquo;Last updated&rdquo;
          date at the top of this page and, where appropriate, notify you of significant changes.
        </p>
        <p>
          Your continued use of Palei Events after changes take effect means you accept the updated
          policy. We encourage you to review this page periodically.
        </p>
      </>
    ),
  },
  {
    id: "contact-us",
    title: "Contact Us",
    content: (
      <>
        <p>If you have any questions, concerns or requests regarding this privacy policy or your data, we&rsquo;d love to hear from you:</p>
        <p>
          • Email:{" "}
          <a href={`mailto:${site.email}`} style={{ color: "#c89b3c", textDecoration: "underline" }}>
            {site.email}
          </a>
          <br />
          • Phone:{" "}
          <a href={`tel:${site.phone}`} style={{ color: "#c89b3c", textDecoration: "underline" }}>
            {site.phone}
          </a>
          <br />
          • Address: {site.address}
        </p>
        <p>
          Our team is available Monday to Saturday, 9 AM to 7 PM IST, and typically responds within
          24 hours.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      eyebrow="Privacy Policy"
      title="Your privacy,"
      highlight="protected with care."
      description="We believe trust is the foundation of every celebration. This policy explains what information we collect, how we use it, and the choices you have over your data."
      lastUpdated="20 August 2026"
      sections={sections}
      ctaTitle="Questions about your data? We're here to help."
    />
  );
}