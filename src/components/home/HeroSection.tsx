import Image from "next/image";
import { cn } from "@/lib/utils";
import { MEDIA } from "@/lib/media";
import { HeroDesktopVideo } from "./HeroDesktopVideo";

interface HeroSectionProps {
  headlineLines?: string[];
  videoUrl?: string;
  posterUrl?: string;
  mobilePosterUrl?: string;
  posterBlur?: string;
}

export function HeroSection({
  headlineLines = ["Private luxury", "residences,", "quietly curated."],
  videoUrl = MEDIA.videos.bg,
  posterUrl,
  mobilePosterUrl,
  posterBlur,
}: HeroSectionProps) {
  const desktopSrc = posterUrl ?? MEDIA.videos.heroPoster;
  const mobileSrc = mobilePosterUrl ?? desktopSrc;

  return (
    <section
      className="relative flex h-screen min-h-[640px] max-h-[1000px] flex-col justify-end overflow-hidden bg-lux-black"
      aria-label="Hero"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-soft-black via-lux-black to-lux-black"
        aria-hidden="true"
      />

      {/* Mobile hero image (hidden on md+) */}
      <div className="absolute inset-0 md:hidden">
        <Image
          src={mobileSrc}
          alt="Luxury residential property in Ahmedabad"
          fill
          priority
          unoptimized
          quality={60}
          sizes="100vw"
          className="object-cover object-center brightness-75"
          aria-hidden="true"
        />
      </div>

      {/* Desktop hero image (hidden below md) */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src={desktopSrc}
          alt="Luxury residential property in Ahmedabad"
          fill
          priority
          unoptimized
          quality={40}
          sizes="100vw"
          {...(posterBlur ? { placeholder: "blur" as const, blurDataURL: posterBlur } : {})}
          className="object-cover object-center brightness-75"
          aria-hidden="true"
        />
      </div>

      <HeroDesktopVideo videoUrl={videoUrl} />

      <div
        className="absolute inset-0 bg-gradient-to-r from-lux-black/70 via-lux-black/35 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-lux-black/65 via-lux-black/10 to-transparent"
        aria-hidden="true"
      />

      <div
        className="absolute left-0 top-1/4 hidden h-1/2 w-px bg-gradient-to-b from-transparent via-champagne-gold/40 to-transparent lg:block"
        aria-hidden="true"
      />

      <div className="relative w-full px-6 pb-20 sm:px-8 lg:px-12 lg:pb-24">
        <h1 className="mb-5 max-w-3xl font-display text-[clamp(1.75rem,3.8vw,3.25rem)] font-normal leading-[1.15] tracking-wide text-ivory">
          {headlineLines.map((line, i) => {
            const isGold = line.toLowerCase().includes("most luxury buyers");

            return (
              <span
                key={i}
                className={cn("block min-h-[1.15em]", isGold ? "text-champagne-gold" : "text-ivory")}
              >
                <span className="inline">{line}</span>
              </span>
            );
          })}
        </h1>
      </div>

      <div
        className="absolute bottom-8 right-8 flex flex-col items-center gap-2.5 opacity-100 lg:right-12"
        aria-hidden="true"
      >
        <div className="h-10 w-px animate-[scrollCue_2s_ease-in-out_infinite] bg-gradient-to-b from-champagne-gold/50 to-transparent" />
        <span className="origin-center translate-x-4 rotate-90 font-sans text-[9px] uppercase tracking-[0.3em] text-ivory/25">
          Scroll
        </span>
      </div>
    </section>
  );
}
