import Image from "next/image";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { sanityImageProps } from "@/lib/sanity/image";
import { RESIDENTIAL_CATEGORY_LABELS, PROPERTY_STATUS_LABELS } from "@/types";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const { slug, title, category, configuration, locationLabel, price, priceOnRequest, status, shortDescriptor, heroImage } = property;

  const displayPrice = priceOnRequest || !price ? "Price on Request" : formatPrice(price);
  const imageProps = heroImage ? sanityImageProps(heroImage, 640, 480) : null;

  return (
    <Link
      href={`/properties/${slug}`}
      className={cn(
        "group block transition-all duration-300 focus-visible:outline-2 focus-visible:outline-champagne-gold focus-visible:outline-offset-[-2px]",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-lux-black rounded-sm border border-white/[0.04] shadow-md">
        {imageProps ? (
          <Image
            {...imageProps}
            alt={heroImage?.alt ?? title}
            fill={false}
            className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-sans text-ivory/25 uppercase tracking-widest">Image Coming Soon</span>
          </div>
        )}

        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-lux-black/35 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Inset Gold Frame Overlay on Hover */}
        <div className="absolute inset-3 border border-white/5 pointer-events-none z-20 transition-all duration-500 group-hover:inset-4 group-hover:border-[#C8A45D]/30" />

        {/* Badges */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[8px] uppercase tracking-[0.15em] font-sans bg-lux-black/85 text-ivory/80 backdrop-blur-sm border border-white/[0.08] rounded-sm">
          {PROPERTY_STATUS_LABELS[status]}
        </span>
        <span className="absolute top-3 right-3 px-2.5 py-1 text-[8px] uppercase tracking-[0.15em] font-sans text-champagne-gold bg-lux-black/70 backdrop-blur-sm border border-white/[0.08] rounded-sm">
          {RESIDENTIAL_CATEGORY_LABELS[category]}
        </span>
      </div>

      {/* Body */}
      <div className="pt-5 pb-2 text-left">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="font-display text-xl lg:text-2xl font-light tracking-wide text-ivory group-hover:text-champagne-gold transition-colors duration-200">
            {title}
          </h3>
          <span className="text-xs text-champagne-gold/80 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>

        <p className="text-[10px] font-sans text-champagne-gold font-medium uppercase tracking-[0.18em] mb-2">
          {locationLabel}
        </p>

        {shortDescriptor && (
          <p className="text-xs font-sans text-ivory/40 leading-relaxed line-clamp-2 mb-4 pr-4">
            {shortDescriptor}
          </p>
        )}

        <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 mt-3">
          <span className="font-display text-base text-champagne-gold">{displayPrice}</span>
          <span className="text-xs font-sans text-ivory/50">{configuration}</span>
        </div>
      </div>
    </Link>
  );
}
