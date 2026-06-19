import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms of Use",
  description:
    "Terms for using the PIKORUA Realty website and submitting private luxury real estate enquiries in Ahmedabad.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <Header alwaysSolid />
      <main id="main-content" className="bg-lux-black text-ivory min-h-screen">
        <section className="pt-28 pb-16 lg:pt-36 lg:pb-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-4">
              PIKORUA Realty
            </p>
            <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-light uppercase tracking-wider">
              Terms of Use
            </h1>
            <div className="mt-10 space-y-8 text-sm leading-7 text-ivory/65 font-sans">
              <section>
                <h2 className="text-xs uppercase tracking-[0.2em] text-champagne-gold mb-3">Website Content</h2>
                <p>
                  The information on this website is provided for general advisory and discovery purposes. Property availability, pricing, specifications, possession status, and documentation details can change without notice.
                </p>
              </section>
              <section>
                <h2 className="text-xs uppercase tracking-[0.2em] text-champagne-gold mb-3">No Public Offer</h2>
                <p>
                  Website content does not constitute a public offer, legal advice, financial advice, or a binding representation. Specific property details are confirmed during a private consultation.
                </p>
              </section>
              <section>
                <h2 className="text-xs uppercase tracking-[0.2em] text-champagne-gold mb-3">User Enquiries</h2>
                <p>
                  By submitting an enquiry, you confirm that the information provided is accurate and that PIKORUA Realty may contact you by phone, email, or WhatsApp to respond to your request.
                </p>
              </section>
              <section>
                <h2 className="text-xs uppercase tracking-[0.2em] text-champagne-gold mb-3">Contact</h2>
                <p>
                  For questions about these terms, contact{" "}
                  <a className="text-champagne-gold hover:underline" href="mailto:connect@pikorua.in">
                    connect@pikorua.in
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
