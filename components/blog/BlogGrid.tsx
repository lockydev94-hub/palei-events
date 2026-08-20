import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/data/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-warmWhite shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-navy">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-mutedText">
          <span className="rounded-full bg-champagne/50 px-3 py-1 font-semibold text-gold-dark">
            {post.category}
          </span>
          <span>{post.readTime}</span>
        </div>
        <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-navy transition-colors group-hover:text-gold-dark">
          {post.title}
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-mutedText">{post.excerpt}</p>
        <span className="mt-4 text-sm font-semibold text-gold-dark">
          Read article <span aria-hidden className="transition-transform group-hover:translate-x-1 inline-block">→</span>
        </span>
      </div>
    </Link>
  );
}

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}