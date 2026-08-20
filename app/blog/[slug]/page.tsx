import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);
  const sections = post.sections ?? [];
  const tips = post.tips ?? [];

  /* split sections for inline image placement */
  const firstHalf = sections.slice(0, Math.ceil(sections.length / 2));
  const secondHalf = sections.slice(Math.ceil(sections.length / 2));

  return (
    <>
      {/* JSON-LD Article structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            image: post.image,
            datePublished: post.date,
            author: { "@type": "Person", name: post.author },
            publisher: {
              "@type": "Organization",
              name: "Palei Events",
              url: "https://paleievents.com",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://paleievents.com/blog/${post.slug}`,
            },
          }),
        }}
      />
      {/* ═══════════════════════════════════════════════════════
          HERO BANNER
      ═══════════════════════════════════════════════════════ */}
      <div className="relative h-[72vh] min-h-[500px] max-h-[720px] overflow-hidden bg-navy-dark">
        <Image
          src={post.image}
          alt={post.title}
          fill
          unoptimized
          className="object-cover scale-105"
          priority
          style={{ transform: "scale(1.05)" }}
        />
        {/* dark gradient — heavy at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(170deg, rgba(10,15,28,0.25) 0%, rgba(10,15,28,0.55) 45%, rgba(10,15,28,0.96) 88%, #0f1522 100%)",
          }}
        />
        {/* gold ambient glow from bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 45% at 50% 105%, rgba(200,155,60,0.22) 0%, transparent 65%)",
          }}
        />

        {/* all text pinned to bottom */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center px-6 pb-16">
          {/* breadcrumb */}
          <div className="mb-5">
            <Breadcrumb
              light
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: post.category, href: `/blog?category=${encodeURIComponent(post.category)}` },
                { label: post.title.length > 40 ? post.title.slice(0, 40) + "…" : post.title },
              ]}
            />
          </div>

          {/* category pill */}
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em] mb-5"
            style={{
              background: "rgba(200,155,60,0.16)",
              border: "1px solid rgba(200,155,60,0.42)",
              color: "#e0c584",
              backdropFilter: "blur(10px)",
            }}
          >
            ✦ {post.category}
          </span>

          <h1
            className="font-display font-semibold text-ivory leading-[1.08] tracking-tight max-w-3xl"
            style={{ fontSize: "clamp(1.85rem, 4.5vw, 3.5rem)" }}
          >
            {post.title}
          </h1>

          {/* meta row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 font-body">
            {post.author && (
              <span className="flex items-center gap-2 text-sm text-ivory/50">
                <span
                  className="h-7 w-7 rounded-full flex items-center justify-center text-[0.65rem] font-bold text-navy-dark"
                  style={{ background: "linear-gradient(135deg, #e0c584, #c89b3c)" }}
                  aria-hidden
                >
                  {post.author.name.charAt(0)}
                </span>
                {post.author.name}
              </span>
            )}
            <span className="h-3.5 w-px rounded-full bg-ivory/15 hidden sm:block" aria-hidden />
            <span className="flex items-center gap-1.5 text-sm text-ivory/45">
              <svg className="h-3.5 w-3.5 text-gold/55" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
              </svg>
              {post.readTime}
            </span>
            <span className="h-3.5 w-px rounded-full bg-ivory/15 hidden sm:block" aria-hidden />
            <span className="flex items-center gap-1.5 text-sm text-ivory/45">
              <svg className="h-3.5 w-3.5 text-gold/55" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2z" clipRule="evenodd" />
              </svg>
              {post.date}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          ARTICLE BODY
      ═══════════════════════════════════════════════════════ */}
      <article
        className="relative"
        style={{ background: "linear-gradient(180deg, #0f1522 0%, #faf8f3 200px)" }}
      >
        {/* vertical gold thread */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(200,155,60,0.7) 0%, transparent 100%)" }}
          aria-hidden
        />

        <div className="max-w-[720px] mx-auto px-6 pt-14 pb-24">

          {/* ── Lead excerpt ─────────────────────────────────── */}
          <p
            className="font-display text-[1.22rem] leading-[1.75] text-navy/70 text-balance pb-10 mb-10"
            style={{ borderBottom: "1px solid rgba(23,32,51,0.1)" }}
          >
            {post.excerpt}
          </p>

          {/* ── Tags ─────────────────────────────────────────── */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gold-dark"
                  style={{
                    background: "rgba(200,155,60,0.08)",
                    border: "1px solid rgba(200,155,60,0.2)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* ── FIRST HALF of sections ───────────────────────── */}
          {firstHalf.map((section, i) => (
            <div key={i} className="mb-9">
              <h2
                className="font-display text-[1.55rem] font-semibold text-navy mb-4 leading-snug"
              >
                {section.heading}
              </h2>
              {section.body.map((para, j) => (
                <p
                  key={j}
                  className="text-[1.05rem] leading-[1.88] text-navy/78 font-body mb-4 last:mb-0"
                >
                  {para}
                </p>
              ))}
            </div>
          ))}

          {/* ── PULL QUOTE ───────────────────────────────────── */}
          {post.pullQuote && (
            <div
              className="my-12 rounded-2xl px-8 py-7 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(23,32,51,0.05) 0%, rgba(200,155,60,0.08) 100%)",
                border: "1px solid rgba(200,155,60,0.22)",
              }}
            >
              {/* decorative quote mark */}
              <span
                className="absolute -top-3 left-6 font-display text-[5rem] leading-none select-none pointer-events-none"
                style={{ color: "rgba(200,155,60,0.18)" }}
                aria-hidden
              >
                &ldquo;
              </span>
              <p className="font-display text-[1.2rem] font-semibold text-navy italic leading-relaxed relative z-10">
                {post.pullQuote}
              </p>
              <div
                className="mt-4 h-px w-12"
                style={{ background: "linear-gradient(90deg, #c89b3c, transparent)" }}
              />
            </div>
          )}

          {/* ── INLINE IMAGE — mid-article ───────────────────── */}
          {post.inlineImage && (
            <div className="my-12 -mx-6 sm:mx-0 sm:rounded-2xl overflow-hidden relative">
              <div className="relative aspect-[16/7]">
                <Image
                  src={post.inlineImage}
                  alt={`${post.title} — visual`}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 40%, rgba(10,15,28,0.55) 100%)",
                  }}
                />
              </div>
              <p className="mt-2.5 px-1 text-[0.72rem] text-mutedText/60 font-body text-center italic">
                Every moment of your event, beautifully preserved.
              </p>
            </div>
          )}

          {/* ── TIPS GRID ────────────────────────────────────── */}
          {tips.length > 0 && (
            <div className="my-12">
              <h3
                className="font-display text-lg font-semibold text-navy mb-5 flex items-center gap-2"
              >
                <span
                  className="h-px flex-1"
                  style={{ background: "linear-gradient(90deg, rgba(200,155,60,0.4), transparent)" }}
                  aria-hidden
                />
                Quick Tips
                <span
                  className="h-px flex-1"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(200,155,60,0.4))" }}
                  aria-hidden
                />
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {tips.map((tip) => (
                  <div
                    key={tip.title}
                    className="flex gap-4 rounded-xl p-5"
                    style={{
                      background: "rgba(255,253,248,0.7)",
                      border: "1px solid rgba(23,32,51,0.09)",
                      boxShadow: "0 2px 12px rgba(23,32,51,0.04)",
                    }}
                  >
                    <span className="text-2xl mt-0.5 shrink-0">{tip.icon}</span>
                    <div>
                      <p className="font-semibold text-navy text-[0.9rem] mb-1">{tip.title}</p>
                      <p className="text-[0.82rem] leading-snug text-mutedText">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECOND HALF of sections ──────────────────────── */}
          {secondHalf.map((section, i) => (
            <div key={i} className="mb-9">
              <h2 className="font-display text-[1.55rem] font-semibold text-navy mb-4 leading-snug">
                {section.heading}
              </h2>
              {section.body.map((para, j) => (
                <p
                  key={j}
                  className="text-[1.05rem] leading-[1.88] text-navy/78 font-body mb-4 last:mb-0"
                >
                  {para}
                </p>
              ))}
            </div>
          ))}

          {/* ── CLOSING IMAGE ────────────────────────────────── */}
          {post.closingImage && (
            <div className="my-12 -mx-6 sm:mx-0 sm:rounded-2xl overflow-hidden relative">
              <div className="relative aspect-[21/8]">
                <Image
                  src={post.closingImage}
                  alt={`${post.category} event atmosphere`}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(10,15,28,0.6) 0%, rgba(10,15,28,0.2) 50%, rgba(10,15,28,0.6) 100%)",
                  }}
                />
                {/* floating label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="rounded-full px-5 py-2.5 text-sm font-semibold text-ivory font-body"
                    style={{
                      background: "rgba(10,15,28,0.55)",
                      border: "1px solid rgba(255,253,248,0.15)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    ✦ {post.category} Event Experience
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── DIVIDER ──────────────────────────────────────── */}
          <div
            className="my-12 flex items-center gap-4"
            aria-hidden
          >
            <span className="h-px flex-1" style={{ background: "rgba(23,32,51,0.1)" }} />
            <span className="text-gold/40 text-sm">✦</span>
            <span className="h-px flex-1" style={{ background: "rgba(23,32,51,0.1)" }} />
          </div>

          {/* ── CTA CARD ─────────────────────────────────────── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #172033 0%, #22304d 100%)",
              border: "1px solid rgba(200,155,60,0.22)",
              boxShadow: "0 24px 64px rgba(10,15,28,0.14)",
            }}
          >
            {/* cover image strip */}
            <div className="relative h-28 overflow-hidden">
              <Image
                src={post.image}
                alt=""
                fill
                unoptimized
                className="object-cover opacity-40"
                aria-hidden
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, transparent 0%, rgba(23,32,51,0.9) 100%)",
                }}
              />
            </div>
            <div className="px-8 pb-9 pt-2 text-center -mt-6 relative z-10">
              <span
                className="inline-block rounded-full px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-4"
                style={{
                  background: "rgba(200,155,60,0.16)",
                  border: "1px solid rgba(200,155,60,0.32)",
                  color: "#e0c584",
                }}
              >
                Ready to begin?
              </span>
              <h3 className="font-display text-[1.55rem] font-semibold text-ivory mb-3">
                Create your event page today
              </h3>
              <p className="text-ivory/50 text-[0.9rem] mb-7 max-w-sm mx-auto leading-relaxed">
                Join thousands of event creators across India who've made their celebrations
                unforgettable with Palei Events.
              </p>
              <Link
                href="/create-event"
                className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl px-8 py-4 font-semibold text-navy-dark transition-all duration-300 ease-out hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #e0c584 0%, #c89b3c 100%)",
                  boxShadow: "0 0 36px rgba(200,155,60,0.45), 0 4px 16px rgba(0,0,0,0.25)",
                }}
              >
                <span
                  className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-out"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)" }}
                  aria-hidden
                />
                Start creating your event
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          {/* ── SHARE + BACK ─────────────────────────────────── */}
          <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-[0.7rem] uppercase tracking-[0.16em] text-mutedText/60 font-body">Share</span>
              {[
                { label: "𝕏", title: "Share on X" },
                { label: "in", title: "Share on LinkedIn" },
                { label: "🔗", title: "Copy link" },
              ].map(({ label, title }) => (
                <button
                  key={title}
                  title={title}
                  className="h-8 w-8 flex items-center justify-center rounded-full text-xs text-mutedText hover:text-navy hover:border-navy/30 transition-all"
                  style={{ border: "1px solid rgba(23,32,51,0.12)" }}
                  aria-label={title}
                >
                  {label}
                </button>
              ))}
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold text-gold-dark hover:text-gold transition-colors flex items-center gap-1.5 group"
            >
              <svg
                className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-0.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All articles
            </Link>
          </div>
        </div>
      </article>

      {/* ═══════════════════════════════════════════════════════
          RELATED POSTS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: "#faf8f3" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-5 mb-10">
            <span
              className="h-px flex-1"
              style={{ background: "linear-gradient(90deg, rgba(200,155,60,0.45), transparent)" }}
              aria-hidden
            />
            <h2 className="font-display text-2xl font-semibold text-navy whitespace-nowrap">
              More from the blog
            </h2>
            <span
              className="h-px flex-1"
              style={{ background: "linear-gradient(90deg, transparent, rgba(200,155,60,0.45))" }}
              aria-hidden
            />
          </div>
          <BlogGrid posts={related} />
        </div>
      </section>
    </>
  );
}
