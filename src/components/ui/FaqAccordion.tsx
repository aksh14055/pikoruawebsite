import type { FaqItem } from "@/lib/data/faq";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
      {items.map((item) => (
        <details key={item.question} className="group py-5">
          <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-sans text-sm sm:text-base text-ivory">
            <span>{item.question}</span>
            <span
              className="shrink-0 text-champagne-gold/70 transition-transform duration-200 group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <p className="mt-3 font-sans text-sm text-ivory/60 leading-relaxed">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
