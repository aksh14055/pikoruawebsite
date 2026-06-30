import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-[10px] font-sans uppercase tracking-[0.18em] mb-5 ${className}`}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="text-champagne-gold/30 select-none" aria-hidden="true">
                /
              </span>
            )}
            {!isLast && item.href ? (
              <Link
                href={item.href}
                className="text-ivory/40 hover:text-champagne-gold transition-colors duration-150"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-champagne-gold/70" : "text-ivory/40"}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}