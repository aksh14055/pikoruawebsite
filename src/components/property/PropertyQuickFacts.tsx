interface QuickFact {
  label: string;
  value: string;
}

export function PropertyQuickFacts({ facts, note }: { facts: QuickFact[]; note?: string }) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="bg-soft-black border border-white/[0.06] rounded-md p-5 space-y-1.5"
          >
            <span className="block text-[9px] uppercase tracking-[0.18em] text-champagne-gold font-sans font-medium">
              {fact.label}
            </span>
            <span className="block text-sm font-sans text-ivory/85 leading-relaxed">
              {fact.value}
            </span>
          </div>
        ))}
      </div>
      {note && (
        <p className="mt-2 text-[11px] font-sans text-ivory/40 italic">{note}</p>
      )}
    </div>
  );
}
