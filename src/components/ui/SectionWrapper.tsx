import { cn } from "@/lib/utils";

type BgVariant = "black" | "soft-black" | "ivory" | "transparent";

interface SectionWrapperProps {
  children: React.ReactNode;
  bg?: BgVariant;
  className?: string;
  id?: string;
  as?: "section" | "div" | "article";
}

const bgClasses: Record<BgVariant, string> = {
  black: "bg-lux-black",
  "soft-black": "bg-soft-black",
  ivory: "bg-ivory text-lux-black",
  transparent: "bg-transparent",
};

export function SectionWrapper({
  children,
  bg = "black",
  className,
  id,
  as: Tag = "section",
}: SectionWrapperProps) {
  return (
    <Tag
      id={id}
      className={cn(
        bgClasses[bg],
        "px-4 sm:px-6 lg:px-8 py-24 lg:py-32",
        className
      )}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </Tag>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-champagne-gold text-xs uppercase tracking-[0.15em] font-sans mb-4",
        className
      )}
    >
      {children}
    </p>
  );
}

export function GoldDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("w-10 h-px bg-champagne-gold my-6", className)}
      aria-hidden="true"
    />
  );
}
