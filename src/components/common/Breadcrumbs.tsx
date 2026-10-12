import React, { useEffect } from "react";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  // Inject or update BreadcrumbList Schema.org structured data
  useEffect(() => {
    if (typeof window === "undefined" || items.length === 0) return;

    const origin = window.location.origin;
    const breadcrumbListSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: item.href ? `${origin}${item.href}` : `${origin}${window.location.pathname}`,
      })),
    };

    let scriptEl = document.getElementById("breadcrumb-jsonld") as HTMLScriptElement;
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.id = "breadcrumb-jsonld";
      scriptEl.type = "application/ld+json";
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(breadcrumbListSchema);

    return () => {
      const el = document.getElementById("breadcrumb-jsonld");
      if (el) el.remove();
    };
  }, [items]);

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs font-mono text-zinc-500 dark:text-zinc-400 py-2.5 ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5 list-none p-0 m-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-zinc-600 shrink-0 select-none" aria-hidden="true" />
              )}

              {index === 0 && (
                <Home className="w-3.5 h-3.5 mr-0.5 text-zinc-400 dark:text-zinc-500 shrink-0 select-none" aria-hidden="true" />
              )}

              {item.href && !isLast ? (
                <a
                  href={item.href}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer underline-offset-4 hover:underline"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "font-semibold text-zinc-900 dark:text-zinc-100 truncate" : ""}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
