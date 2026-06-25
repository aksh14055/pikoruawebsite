import type { Metadata } from "next";
import { env } from "@/lib/env";

// Layout
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Home sections
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedResidences } from "@/components/home/FeaturedResidences";
import { FounderTeaser } from "@/components/home/FounderTeaser";
import { TestimonialsTeaser } from "@/components/home/TestimonialsTeaser";
import { FinalCTABand } from "@/components/home/FinalCTABand";
import { VirtualTours } from "@/components/home/VirtualTours";
import { StatsStrip } from "@/components/ui/StatsStrip";
import { MEDIA } from "@/lib/media";
import { getSupabaseAboutPageContent, getPageSeoData, getSupabaseHomePageContent } from "@/lib/supabase/queries";
import { FOUNDER_NAME, DEFAULT_FOUNDER_STORY } from "@/lib/data/about";
import { getFirstSentence } from "@/lib/utils";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoData("home");
  const defaultTitle = "Private Luxury Real Estate Advisory in Ahmedabad";
  const defaultDesc = "PIKORUA Realty is Ahmedabad's private luxury real estate advisory with a strong residential-first focus. We curate exclusive apartments, penthouses, duplexes, villas, and bungalows for HNI and NRI buyers across Sindhu Bhavan, Iskon-Ambli, Thaltej, SG Highway, and Shilaj.";

  return createMetadata({
    title: seo?.seoTitle || defaultTitle,
    description: seo?.seoDescription || defaultDesc,
    path: "/",
  });
}

export const revalidate = 300;

export default async function HomePage() {
  if (!env.SITE_LIVE) {
    return <HoldingPage />;
  }

  const [aboutContent, homeContent] = await Promise.all([
    getSupabaseAboutPageContent(),
    getSupabaseHomePageContent()
  ]);

  const founderStory = aboutContent?.founderStory?.length ? aboutContent.founderStory : DEFAULT_FOUNDER_STORY;
  const founderGlimpse = getFirstSentence(founderStory[0]);
  const founderAvatar = aboutContent?.founderAvatar || MEDIA.founder;

  // Dynamic hero content from database, falling back to static defaults
  const heroLines = homeContent?.heroHeadline1
    ? [homeContent.heroHeadline1, homeContent.heroHeadline2, homeContent.heroHeadline3].filter(Boolean)
    : ["Trust what", "most luxury buyers", "have trusted."];

  const heroVideo = homeContent?.heroVideoUrl || undefined;
  const heroPoster = homeContent?.heroPosterUrl || undefined;
  const stats = homeContent?.stats || undefined;
  const tours = homeContent?.virtualTours || undefined;

  return (
    <>
      <Header />
      <main id="main-content">

        {/* bg video */}
        <HeroSection
          headlineLines={heroLines}
          videoUrl={heroVideo}
          posterUrl={heroPoster}
        />


        <FeaturedResidences />

        {/* About the Founder */}
        <FounderTeaser
          founderImageUrl={founderAvatar}
          founderName={FOUNDER_NAME}
          quote={founderGlimpse}
        />

        <StatsStrip stats={stats} pauseOnHover={false} size="sm" className="pt-0 lg:pt-0 border-t-0" />

        {/* Take a virtual tour of our exclusive luxury properties */}
        <VirtualTours tours={tours} />

        {/* What Our Clients Say */}
        <TestimonialsTeaser />

        {/* Contact Us */}
        <FinalCTABand />

      </main>
      <Footer />
    </>
  );
}

// ─── Pre-launch Holding Page ─────────────────────────────────────────────────

function HoldingPage() {
  const whatsappUrl = `https://wa.me/${env.WHATSAPP_NUMBER.replace(/\D/g, "")}`;

  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center bg-lux-black text-ivory px-6 py-16 text-center gap-6"
    >
      <p className="text-xs font-sans uppercase tracking-[0.2em] text-champagne-gold">
        PIKORUA Realty
      </p>
      <h1 className="font-display text-[clamp(1.75rem,4vw,3.5rem)] font-normal leading-[1.25] max-w-2xl">
        Ahmedabad&rsquo;s finest residences —<br />found quietly.
      </h1>
      <div className="w-10 h-px bg-champagne-gold/40" aria-hidden="true" />
      <p className="text-ivory/40 font-sans text-sm">
        In the meantime, reach us at{" "}
        <a
          href="mailto:connect@pikorua.in"
          className="text-champagne-gold hover:text-muted-gold transition-colors duration-150"
        >
          connect@pikorua.in
        </a>
      </p>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 px-7 py-3.5 border border-champagne-gold/50 text-champagne-gold text-xs font-sans tracking-[0.15em] uppercase hover:bg-champagne-gold hover:text-lux-black transition-all duration-200 focus-visible:outline-2 focus-visible:outline-champagne-gold"
      >
        Speak on WhatsApp
      </a>
    </main>
  );
}
