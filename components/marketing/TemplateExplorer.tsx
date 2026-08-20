"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TemplateCard } from "./TemplateCard";
import { templates, templateCategories, templateStyles } from "@/data/templates";

export function TemplateExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [style, setStyle] = useState<string>("All");

  const filtered = useMemo(() => {
    return templates.filter((template) => {
      const matchesQuery =
        query.trim() === "" ||
        template.name.toLowerCase().includes(query.toLowerCase()) ||
        template.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || template.category === category.toLowerCase();
      const matchesStyle = style === "All" || template.style.toLowerCase().includes(style.toLowerCase());
      return matchesQuery && matchesCategory && matchesStyle;
    });
  }, [query, category, style]);

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mutedText" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates…"
            aria-label="Search templates"
            className="w-full rounded-xl border border-navy/15 bg-ivory py-3 pl-12 pr-4 text-sm outline-none transition-colors focus:border-gold"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {templateCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                category === cat
                  ? "bg-navy text-champagne shadow-soft"
                  : "border border-navy/15 text-navy hover:border-navy/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-mutedText">
            Style
          </span>
          {templateStyles.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStyle(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                style === s
                  ? "bg-gold text-navy-dark"
                  : "border border-navy/15 text-navy hover:border-gold/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-mutedText">
          No templates match your search. Try a different category or style.
        </p>
      )}
    </div>
  );
}