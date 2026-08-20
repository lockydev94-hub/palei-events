import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the Palei Events terms & conditions — the guidelines that govern your use of our platform, accounts, event pages and services.",
  keywords: ["Palei Events terms", "terms and conditions", "terms of service", "event platform terms"],
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    id: "acceptance-of-terms",
    title: "Acceptance of Terms",
    content: (
      <>
        <p>
          Welcome to Palei Events, a digital event experience platform for weddings, birthdays,
          corporate events, schools, colleges and every celebration in between. By accessing or
          using our website and services, you agree to be bound by these Terms &amp; Conditions and
          our Privacy Policy.
        </p>
        <p>
          If you do not agree with any part of these terms, please do not use our services. Your
          continued use of Palei Events after any changes to these terms constitutes acceptance of
          the updated terms.
        </p>
      </>
    ),
  },
  {
    id: "description-of-service",
    title: "Description of Service",
    content: (
      <>
        <p>
          Palei Events provides tools to create, customise and share digital event pages — including
          invitations, schedules, galleries, RSVP forms, wish walls and more. We offer a range of
          templates designed to celebrate every kind of event with a premium, memorable experience.
        </p>
        <p>
          We reserve the right to modify, suspend or discontinue any part of the service at any time,
          with or without notice. We will not be liable to you for any such change.
        </p>
      </>
    ),
  },
  {
    id: "accounts-registration",
    title: "Accounts & Registration",
    content: (
      <>
        <p>
          To create events you may need to register an account. You agree to provide accurate,
          current and complete information and to keep your account credentials secure. You are
          responsible for all activity that occurs under your account.
        </p>
        <p>
          You must be at least 13 years old to use Palei Events. If you are using the service on
          behalf of an organisation, school or business, you represent that you have the authority
          to bind that organisation to these terms.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    content: (
      <>
        <p>You agree not to use Palei Events for any unlawful, harmful or inappropriate purpose, including but not limited to:</p>
        <p>
          • Posting content that is illegal, defamatory, harassing, hateful or infringes on the
          rights of others.<br />
          • Uploading malicious code, viruses or attempting to disrupt, overload or compromise our
          servers or other users&rsquo; accounts.<br />
          • Scraping, mining or collecting data from the platform without authorisation.<br />
          • Impersonating another person or entity, or misrepresenting your affiliation.<br />
          • Using the service to send unsolicited messages or spam.
        </p>
        <p>
          We may remove content and suspend or terminate accounts that violate these standards,
          without prior notice when necessary.
        </p>
      </>
    ),
  },
  {
    id: "user-content",
    title: "User Content & Intellectual Property",
    content: (
      <>
        <p>
          You retain ownership of the content you upload to Palei Events, including event pages,
          photos, videos, guest lists and messages. By uploading content, you grant us a limited,
          non-exclusive, worldwide licence to host, store and display that content solely to provide
          and improve the services you use.
        </p>
        <p>
          The Palei Events platform itself — including its design, templates, logos, text, graphics
          and software — is the property of Palei Events and is protected by copyright and other
          intellectual property laws. You may not copy, modify, distribute or create derivative works
          from our platform without our written permission.
        </p>
      </>
    ),
  },
  {
    id: "payments-subscriptions",
    title: "Payments & Subscriptions",
    content: (
      <>
        <p>
          Certain features, templates or plans may be offered on a paid basis. All payments are
          processed securely through trusted third-party payment providers.
        </p>
        <p>
          Prices are displayed clearly before purchase. Unless otherwise stated, payments are
          non-refundable except where required by law or where a service failure is our fault. We
          may change our pricing or introduce new fees at any time, and we will update this page and
          notify you of material changes.
        </p>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "Third-Party Services & Links",
    content: (
      <>
        <p>
          Event pages may include integrations with or links to third-party services such as payment
          gateways, WhatsApp, mapping services and social platforms. These services are governed by
          their own terms and privacy policies, and Palei Events is not responsible for their
          operation or content.
        </p>
        <p>
          Your use of any third-party service is at your own risk and subject to that provider&rsquo;s
          own terms and conditions.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer-of-warranties",
    title: "Disclaimer of Warranties",
    content: (
      <>
        <p>
          Palei Events is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis.
          To the fullest extent permitted by law, we make no warranties of any kind, whether express
          or implied, including warranties of merchantability, fitness for a particular purpose or
          non-infringement.
        </p>
        <p>
          We do not warrant that the service will be uninterrupted, secure or error-free, or that
          defects will be corrected. Any reliance on the service is at your own discretion and risk.
        </p>
      </>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          To the maximum extent permitted by law, Palei Events and its team shall not be liable for
          any indirect, incidental, special, consequential or punitive damages, or any loss of
          profits, data, goodwill or other intangible losses arising from your use of the service.
        </p>
        <p>
          In no event shall our total liability to you for all claims relating to the service exceed
          the amount you paid us, if any, during the twelve months preceding the claim.
        </p>
      </>
    ),
  },
  {
    id: "indemnification",
    title: "Indemnification",
    content: (
      <>
        <p>
          You agree to indemnify and hold harmless Palei Events and its team from any claims,
          damages, liabilities and expenses (including legal fees) arising out of your use of the
          service, your violation of these terms, or your infringement of any rights of a third
          party.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "Termination",
    content: (
      <>
        <p>
          We may suspend or terminate your access to Palei Events at any time, with or without cause
          or notice, if we believe you have violated these terms or that your conduct poses a risk to
          the platform or other users.
        </p>
        <p>
          Upon termination, your right to use the service ceases immediately. Provisions of these
          terms that by their nature should survive termination — including intellectual property,
          disclaimers and limitation of liability — will remain in effect.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law",
    content: (
      <>
        <p>
          These terms are governed by and construed in accordance with the laws of India. Any
          disputes arising out of these terms or your use of the service shall be subject to the
          exclusive jurisdiction of the courts of Bhubaneswar, Odisha.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-terms",
    title: "Changes to These Terms",
    content: (
      <>
        <p>
          We may revise these terms from time to time. When we do, we will update the &ldquo;Last
          updated&rdquo; date and, where significant, notify you through the platform or by email.
        </p>
        <p>
          By continuing to use Palei Events after revised terms take effect, you agree to be bound by
          them. We encourage you to review this page regularly to stay informed.
        </p>
      </>
    ),
  },
  {
    id: "contact-us",
    title: "Contact Us",
    content: (
      <>
        <p>If you have any questions about these terms, please reach out to our team:</p>
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
          We&rsquo;re available Monday to Saturday, 9 AM to 7 PM IST, and typically respond within
          24 hours.
        </p>
      </>
    ),
  },
];

export default function TermsConditionsPage() {
  return (
    <LegalLayout
      eyebrow="Terms & Conditions"
      title="Clear terms,"
      highlight="fair experience."
      description="These terms set out the guidelines for using Palei Events — covering accounts, content, payments and your responsibilities, so everyone enjoys a safe and joyful celebration."
      lastUpdated="20 August 2026"
      sections={sections}
      ctaTitle="Need help understanding these terms?"
    />
  );
}