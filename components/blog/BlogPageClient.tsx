"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import {
  ArrowRight, Clock, Calendar, BookOpen,
  Sparkles, TrendingUp, Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { blogPosts as fallbackPosts } from "@/data/blog";
import type { BlogPost } from "@/data/blog";
import { getBlogPosts } from "@/lib/firestore";

/* ══════════════════════════════════════════════════
   CATEGORY → accent colour
══════════════════════════════════════════════════ */
const CAT_STYLE: Record<string, { pill: string; dot: string }> = {
  Wedding:   { pill: "bg-gold/12 text-gold-dark border-gold/30",       dot: "#c89b3c" },
  Product:   { pill: "bg-purple/10 text-purple border-purple/25",      dot: "#9b7acb" },
  School:    { pill: "bg-sage/12 text-sage border-sage/30",            dot: "#93a88a" },
  Corporate: { pill: "bg-navy/8 text-navy border-navy/20",             dot: "#172033" },
  College:   { pill: "bg-coral/12 text-coral border-coral/30",         dot: "#f29b7a" },
};
const DEFAULT_CAT = { pill: "bg-champagne/50 text-gold-dark border-gold/20", dot: "#c89b3c" };
function catStyle(cat: string) { return CAT_STYLE[cat] ?? DEFAULT_CAT; }

/* ══════════════════════════════════════════════════
   CATEGORY PILL (filter bar)
══════════════════════════════════════════════════ */
function CatPill({ label, active, count, onClick }: {
  label: string; active: boolean; count: number; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold
        whitespace-nowrap transition-all duration-250
        ${active
          ? "bg-gold text-navy-dark shadow-[0_0_18px_rgba(200,155,60,0.4)] scale-[1.04]"
          : "border border-navy/12 text-navy/55 hover:border-gold/35 hover:text-navy hover:bg-gold/5"
        }`}
    >
      {label}
      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none
        ${active ? "bg-navy-dark/20 text-navy-dark" : "bg-navy/8 text-navy/40"}`}>
        {count}
      </span>
    </button>
  );
}

/* ══════════════════════════════════════════════════
   HERO / FEATURED CARD  (first post, full-width)
══════════════════════════════════════════════════ */
function FeaturedCard({ post }: { post: BlogPost }) {
  const cs = catStyle(post.category);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-navy/10
        bg-warmWhite shadow-soft transition-all duration-500
        hover:-translate-y-2 hover:shadow-elevated hover:border-navy/20
        lg:flex-row lg:min-h-[420px]"
    >
      {/* Image — left half on desktop */}
      <div className="relative aspect-[16/9] overflow-hidden bg-navy lg:aspect-auto lg:w-[52%] lg:shrink-0">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 1024px) 100vw, 52vw"
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          priority
        />
        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent lg:bg-gradient-to-r" />

        {/* Featured label */}
        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full
          bg-gold/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-navy-dark
          shadow-[0_4px_20px_rgba(200,155,60,0.45)]">
          <Sparkles className="h-3 w-3" aria-hidden />
          Featured
        </div>

        {/* Read time badge bottom-left */}
        <div className="absolute bottom-5 left-5 flex items-center gap-1.5 rounded-full
          bg-black/40 px-3 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur-sm">
          <Clock className="h-3 w-3" aria-hidden />
          {post.readTime}
        </div>
      </div>

      {/* Content — right half */}
      <div className="relative flex flex-1 flex-col justify-center p-8 lg:p-12">
        {/* Top gradient accent bar */}
        <div className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-gradient-to-b from-gold/60 via-gold/20 to-transparent
          opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />

        {/* Bottom hover glow */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 opacity-0
          transition-opacity duration-400 group-hover:opacity-100"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(200,155,60,0.08), transparent 70%)" }}
          aria-hidden />

        <div className="relative">
          {/* Category + date */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1
              text-[10px] font-bold uppercase tracking-[0.14em] ${cs.pill}`}>
              <Tag className="h-2.5 w-2.5" aria-hidden />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-mutedText">
              <Calendar className="h-3 w-3" aria-hidden />
              {post.date}
            </span>
          </div>

          <h2 className="font-display text-[clamp(1.5rem,2.8vw,2.2rem)] font-semibold
            text-navy leading-[1.12] text-balance transition-colors duration-300
            group-hover:text-navy-dark">
            {post.title}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-mutedText text-pretty max-w-lg">
            {post.excerpt}
          </p>

          <div className="mt-8 flex items-center gap-2 font-bold text-gold-dark
            group-hover:gap-3 transition-all duration-300">
            <BookOpen className="h-4 w-4" aria-hidden />
            Read article
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════
   STANDARD BLOG CARD
══════════════════════════════════════════════════ */
function BlogCard({ post }: { post: BlogPost }) {
  const cs = catStyle(post.category);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy/10
        bg-warmWhite shadow-soft transition-all duration-500
        hover:-translate-y-2 hover:shadow-elevated hover:border-navy/18"
    >
      {/* Top accent line */}
      <div className="h-0.5 w-0 rounded-full bg-gradient-to-r from-gold/60 via-gold-light/30 to-transparent
        transition-all duration-500 group-hover:w-full" aria-hidden />

      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-navy">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/15 to-transparent" />

        {/* Mouse-follow shimmer */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(280px circle at 50% 50%, rgba(200,155,60,0.15), transparent 70%)" }}
          aria-hidden />

        {/* Read time */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full
          bg-black/40 px-3 py-1 text-[11px] font-semibold text-white/75 backdrop-blur-sm">
          <Clock className="h-3 w-3" aria-hidden />
          {post.readTime}
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-1 flex-col p-6">
        {/* Bottom hover glow */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 opacity-0
          transition-opacity duration-400 group-hover:opacity-100"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(200,155,60,0.07), transparent 70%)" }}
          aria-hidden />

        {/* Category + date row */}
        <div className="relative flex flex-wrap items-center gap-3 mb-4">
          <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1
            text-[10px] font-bold uppercase tracking-[0.14em] ${cs.pill}`}>
            {post.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-mutedText">
            <Calendar className="h-3 w-3" aria-hidden />
            {post.date}
          </span>
        </div>

        <h2 className="relative font-display text-lg font-semibold leading-snug text-navy
          transition-colors duration-300 group-hover:text-navy-dark">
          {post.title}
        </h2>

        <p className="relative mt-2 flex-1 text-sm leading-relaxed text-mutedText">
          {post.excerpt}
        </p>

        <div className="relative mt-5 flex items-center gap-1.5 text-sm font-bold text-gold-dark
          group-hover:gap-2.5 transition-all duration-300">
          Read article
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </div>

        {/* Growing bottom accent */}
        <div className="mt-4 h-0.5 w-0 rounded-full bg-gradient-to-r from-gold/50 to-gold-light/20
          transition-all duration-500 group-hover:w-full" aria-hidden />
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════
   NEWSLETTER CTA CARD
══════════════════════════════════════════════════ */
function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-navy-dark p-8 flex flex-col justify-between gap-6">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(200,155,60,0.2) 0%, transparent 65%)", filter: "blur(30px)" }}
        aria-hidden />
      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)", backgroundSize: "22px 22px" }}
        aria-hidden />

      <div className="relative">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold/15 ring-1 ring-gold/25 mb-4">
          <TrendingUp className="h-5 w-5 text-gold" aria-hidden />
        </span>
        <h3 className="font-display text-xl font-semibold text-ivory leading-snug">
          Get event ideas in your inbox
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ivory/55">
          Practical tips for creating events people remember — no spam, ever.
        </p>
      </div>

      {sent ? (
        <div className="relative flex items-center gap-2 text-sm font-semibold text-gold">
          <Sparkles className="h-4 w-4" aria-hidden />
          You're in! We'll be in touch.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full rounded-xl border border-ivory/12 bg-white/6 px-4 py-3 text-sm
              text-ivory placeholder:text-ivory/35 backdrop-blur-sm outline-none
              focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors"
          />
          <button
            type="submit"
            className="group relative w-full overflow-hidden rounded-xl bg-gold py-3 text-sm font-bold
              text-navy-dark shadow-[0_0_20px_rgba(200,155,60,0.3)]
              hover:bg-gold-light hover:shadow-[0_0_32px_rgba(200,155,60,0.5)]
              transition-all duration-300"
          >
            <span className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%]
              group-hover:translate-x-[110%] transition-transform duration-700"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }}
              aria-hidden />
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   STAT PILL (hero)
══════════════════════════════════════════════════ */
function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-display text-2xl font-bold text-gold-light leading-none tracking-tight">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ivory/40">{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════ */
const ALL = "All";

export function BlogPageClient() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(fallbackPosts)
  const [activeCategory, setActiveCategory] = useState(ALL);

  useEffect(() => {
    let cancelled = false
    getBlogPosts("published")
      .then((data) => {
        if (cancelled) return
        if (data && data.length > 0) setBlogPosts(data)
      })
      .catch(() => {/* keep fallback */})
    return () => { cancelled = true }
  }, [])

  const categories = useMemo(() => {
    const cats = [ALL, ...Array.from(new Set(blogPosts.map((p) => p.category)))];
    return cats;
  }, [blogPosts]);

  const countMap = useMemo(() => {
    const m: Record<string, number> = { All: blogPosts.length };
    blogPosts.forEach((p) => { m[p.category] = (m[p.category] ?? 0) + 1; });
    return m;
  }, [blogPosts]);

  const filtered = useMemo(() =>
    activeCategory === ALL ? blogPosts : blogPosts.filter((p) => p.category === activeCategory),
    [activeCategory, blogPosts]
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const heroSr  = useScrollReveal({ threshold: 0.04 });
  const gridSr  = useScrollReveal({ threshold: 0.04 });
  const ctaSr   = useScrollReveal({ threshold: 0.1 });

  const delays = ["", "sr-delay-100", "sr-delay-200", "sr-delay-150", "sr-delay-250", "sr-delay-300"];

  return (
    <>
      {/* ════════════════════════════════════════════════
          DARK HERO
      ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-navy-dark pt-32 pb-28 md:pt-44 md:pb-36">
        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.055]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)", backgroundSize: "28px 28px" }}
          aria-hidden />
        {/* Gold orb top-right */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[700px] w-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(200,155,60,0.20) 0%, rgba(200,155,60,0.05) 50%, transparent 70%)", filter: "blur(50px)" }}
          aria-hidden />
        {/* Sage orb bottom-left */}
        <div className="pointer-events-none absolute -left-28 bottom-0 h-[380px] w-[380px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(147,168,138,0.10) 0%, transparent 65%)", filter: "blur(70px)" }}
          aria-hidden />

        <div className="container-shell relative">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb
              light
              items={[
                { label: "Home", href: "/" },
                { label: "Blog & Resources" },
              ]}
            />
          </div>

          {/* Eyebrow */}
          <div className="animate-fade-up flex items-center gap-3">
            <Badge tone="navy">Blog & Resources</Badge>
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold/55">
              <BookOpen className="h-3 w-3 text-gold" aria-hidden />
              {blogPosts.length} articles
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mt-7 max-w-4xl font-display font-semibold text-ivory leading-[1.06] tracking-tight animate-fade-up text-balance"
            style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.8rem)", animationDelay: "100ms" }}
          >
            Ideas for{" "}
            <span className="relative inline-block">
              <span className="text-gradient-gold">better celebrations</span>
              <span
                className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full"
                style={{ background: "linear-gradient(90deg, #c89b3c 0%, #e0c584 60%, transparent 100%)", opacity: 0.45 }}
                aria-hidden
              />
            </span>
          </h1>

          {/* Sub */}
          <p
            className="mt-7 max-w-2xl text-[1.15rem] leading-[1.8] text-ivory/60 text-pretty animate-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            Practical guides, tips and inspiration for creating events{" "}
            <span className="font-medium text-ivory/85">people remember.</span>
          </p>

          {/* Stats glass bar */}
          <div
            className="mt-10 inline-flex items-stretch gap-0 rounded-2xl border border-ivory/10 bg-white/5
              backdrop-blur-lg overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.25)] animate-fade-up"
            style={{ animationDelay: "260ms" }}
          >
            {[
              { value: String(blogPosts.length), label: "Articles" },
              { value: String(categories.length - 1), label: "Categories" },
              { value: "Free", label: "Always" },
            ].map((s, i, arr) => (
              <div key={s.label} className="flex items-center">
                <div className="px-7 py-4 flex flex-col items-center gap-1">
                  <HeroStat value={s.value} label={s.label} />
                </div>
                {i < arr.length - 1 && (
                  <span className="h-10 w-px bg-gradient-to-b from-transparent via-ivory/15 to-transparent" aria-hidden />
                )}
              </div>
            ))}
          </div>

          {/* Category dot indicators */}
          <div className="mt-10 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "340ms" }}>
            {categories.filter((c) => c !== ALL).map((cat) => {
              const cs = catStyle(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    document.getElementById("blog-grid")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`flex items-center gap-2 rounded-full border px-4 py-1.5
                    text-xs font-semibold transition-all duration-250
                    hover:-translate-y-0.5 hover:shadow-md ${cs.pill}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: cs.dot }} aria-hidden />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          STICKY FILTER BAR
      ════════════════════════════════════════════════ */}
      <div className="sticky top-[72px] z-30 border-b border-navy/8 bg-ivory/96 backdrop-blur-lg
        shadow-[0_2px_20px_rgba(23,32,51,0.05)]">
        <div className="container-shell py-3 overflow-x-auto">
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <CatPill
                key={cat}
                label={cat}
                active={activeCategory === cat}
                count={countMap[cat] ?? 0}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          BLOG GRID
      ════════════════════════════════════════════════ */}
      <section id="blog-grid" className="bg-ivory section-pad">
        <div className="container-shell">

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-28 text-center">
              <span className="text-4xl" aria-hidden>📝</span>
              <p className="font-display text-xl font-semibold text-navy">No articles yet in this category</p>
              <button
                type="button"
                onClick={() => setActiveCategory(ALL)}
                className="mt-2 rounded-xl bg-gold px-6 py-2.5 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors"
              >
                View all articles
              </button>
            </div>
          ) : (
            <div ref={heroSr.ref} className={`sr-fade-up ${heroSr.visible ? "sr-visible" : ""}`}>

              {/* Featured card (first result) */}
              {featured && (
                <div className="mb-10">
                  <FeaturedCard post={featured} />
                </div>
              )}

              {/* Rest of articles + newsletter card in a mixed grid */}
              {rest.length > 0 && (
                <div ref={gridSr.ref} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <div
                      key={post.id}
                      className={`sr-rise ${delays[i] ?? ""} ${gridSr.visible ? "sr-visible" : ""}`}
                    >
                      <BlogCard post={post} />
                    </div>
                  ))}

                  {/* Newsletter card slots into the grid naturally */}
                  {rest.length >= 2 && (
                    <div className={`sr-rise sr-delay-300 ${gridSr.visible ? "sr-visible" : ""}`}>
                      <NewsletterCard />
                    </div>
                  )}
                </div>
              )}

              {/* If only featured post, show newsletter below */}
              {rest.length === 0 && (
                <div className="mt-10 max-w-md">
                  <NewsletterCard />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FINAL CTA BANNER
      ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-navy-dark py-28">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(200,155,60,0.6) 0%, transparent 65%)", filter: "blur(60px)" }}
          aria-hidden />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #e8d5a8 1px, transparent 0)", backgroundSize: "28px 28px" }}
          aria-hidden />

        <div
          ref={ctaSr.ref}
          className={`container-shell relative z-10 text-center sr-fade-up ${ctaSr.visible ? "sr-visible" : ""}`}
        >
          <Badge tone="navy" className="mb-6">Ready to create?</Badge>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold text-ivory leading-[1.1] text-balance">
            Turn your next event into{" "}
            <span className="text-gradient-gold">a lasting memory.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ivory/60 text-pretty">
            Everything you read about — event pages, galleries, RSVP, QR access — is ready for you to use today.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/create-event"
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden
                rounded-2xl bg-gold px-9 py-4 font-bold text-lg text-navy-dark
                shadow-[0_0_32px_rgba(200,155,60,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]
                hover:bg-gold-light hover:-translate-y-1 hover:shadow-[0_0_56px_rgba(200,155,60,0.7)]
                transition-all duration-300"
            >
              <span className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-110%]
                group-hover:translate-x-[110%] transition-transform duration-700"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }}
                aria-hidden />
              Create Your Event
            </Link>
            <Link href="/templates"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-ivory/25
                bg-white/5 backdrop-blur-md px-9 py-4 font-bold text-lg text-ivory
                hover:border-ivory/50 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
            >
              Browse Templates <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
