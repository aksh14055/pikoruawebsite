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
import { LazyVirtualTours } from "@/components/home/LazyVirtualTours";
import { StatsStrip } from "@/components/ui/StatsStrip";
import { MEDIA } from "@/lib/media";
import { getSupabaseAboutPageContent, getPageSeoData, getSupabaseHomePageContent } from "@/lib/supabase/queries";
import { FOUNDER_NAME, DEFAULT_FOUNDER_STORY } from "@/lib/data/about";
import { getFirstSentence } from "@/lib/utils";
import { createMetadata, serializeJsonLd } from "@/lib/seo";

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
  const heroPoster = "/images/hero-living.jpg";
  const stats = homeContent?.stats || undefined;
  const tours = homeContent?.virtualTours || undefined;

  const homepageFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is PIKORUA Realty?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PIKORUA Realty is Ahmedabad's private luxury residential real estate advisory. We curate exclusive apartments, penthouses, duplexes, villas, and bungalows for HNI and NRI buyers across premium corridors including Iskon-Ambli Road, Sindhu Bhavan Road, Thaltej, Shilaj, and SG Highway.",
        },
      },
      {
        "@type": "Question",
        name: "Which areas in Ahmedabad does PIKORUA Realty cover?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PIKORUA Realty specialises in Ahmedabad's top luxury residential corridors: Iskon-Ambli Road (Billionaires' Row), Sindhu Bhavan Road, Thaltej, Shilaj, Vaishno Devi Circle, and SG Highway. These are the most sought-after addresses for HNI families and NRI buyers in Gujarat.",
        },
      },
      {
        "@type": "Question",
        name: "Does PIKORUA Realty assist NRI buyers purchasing property in Ahmedabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. PIKORUA Realty has extensive experience advising NRI clients — including Gujarati diaspora based in the US, UK, UAE, Canada, Singapore, and Australia — on purchasing residential property in Ahmedabad. We handle end-to-end advisory: property selection, legal due diligence, RERA verification, and transaction coordination.",
        },
      },
      {
        "@type": "Question",
        name: "What types of luxury properties are available in Ahmedabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PIKORUA Realty's curated collection includes 3 BHK, 4 BHK, and 5 BHK luxury apartments, duplex penthouses, sky villas, independent bungalows, and premium residential plots — all in Ahmedabad's most exclusive western corridors. Properties range from ₹2.5 crore to over ₹15 crore.",
        },
      },
      {
        "@type": "Question",
        name: "How do I find the best luxury real estate agent in Ahmedabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PIKORUA Realty is among Ahmedabad's most trusted private luxury real estate advisories. Unlike large portals, we work with a select number of clients at a time, ensuring deeply personalised advisory. You can reach us via WhatsApp, email at connect@pikorua.in, or by filling our private consultation form at pikorua.in/contact.",
        },
      },
      {
        "@type": "Question",
        name: "What is the price of luxury apartments on Iskon-Ambli Road, Ahmedabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Premium apartments on Iskon-Ambli Road, Ahmedabad currently trade between ₹11,000 and ₹15,000 per sq.ft. A typical 4 BHK of 3,500–4,500 sq.ft ranges from ₹4 crore to ₹7 crore. Larger penthouses and sky villas can exceed ₹10 crore. Prices vary by floor, tower, and developer. Contact PIKORUA Realty for current off-market availability.",
        },
      },
      {
        "@type": "Question",
        name: "Does PIKORUA Realty list properties on 99acres or MagicBricks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PIKORUA Realty operates as a private advisory and does not list properties on public portals like 99acres, MagicBricks, or Housing.com. Our curated collection is shared exclusively with registered clients who contact us directly. This ensures complete privacy for both buyers and sellers.",
        },
      },
      {
        "@type": "Question",
        name: "How do I contact PIKORUA Realty to enquire about a luxury property in Ahmedabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can reach PIKORUA Realty by WhatsApp, by emailing connect@pikorua.in, or by submitting an enquiry at pikorua.in/contact. We respond to all qualified enquiries within 24 hours and schedule a private consultation to understand your requirements before sharing curated options.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(homepageFaqSchema) }}
      />
      <Header />
      <main id="main-content">

        {/* bg video */}
        <HeroSection
          headlineLines={heroLines}
          videoUrl={heroVideo}
          posterUrl={heroPoster}
          mobilePosterUrl="/images/hero-mobile.jpg"
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
        <LazyVirtualTours tours={tours} />

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
