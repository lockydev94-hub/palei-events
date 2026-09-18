import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  light?: boolean; // true = ivory text (for dark backgrounds)
}

export function Breadcrumb({ items, light = false }: BreadcrumbProps) {
  const textColor = light ? "rgba(255,253,248,0.50)" : "rgba(23,32,51,0.45)";
  const activeColor = light ? "#e0c584" : "#c89b3c";
  const hoverColor = light ? "rgba(255,253,248,0.80)" : "#172033";

  // JSON-LD structured data for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `https://paleievents.com${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <svg
                  className="h-3 w-3 flex-shrink-0"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                  style={{ color: light ? "rgba(255,253,248,0.22)" : "rgba(23,32,51,0.22)" }}
                >
                  <path d="M4 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {isLast || !item.href ? (
                <span
                  className="text-[0.75rem] font-medium"
                  style={{ color: isLast ? activeColor : textColor }}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[0.75rem] font-medium transition-colors duration-200"
                  style={{ color: textColor }}
                >
                  {item.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}