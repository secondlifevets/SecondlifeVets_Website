import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import Link from "next/link";
import WhatsappIcon from "@/components/ui/WhatsappIcon";

export const metadata: Metadata = {
  title: "24/7 Emergency Vet at Home in Lahore | Rapid Response | Vets On Door",
  description:
    "Pet emergency in Lahore? Call 0307-8517122 now. Vets On Door provides 24/7 emergency veterinary care at your home across DHA, Bahria Town, Gulberg & all Lahore areas. Rapid dispatch, life-saving equipment on board.",
  keywords: [
    "emergency vet Lahore",
    "24/7 vet Lahore",
    "emergency pet care Lahore",
    "urgent vet home visit Lahore",
    "pet emergency Lahore 24 hours",
    "emergency animal doctor Lahore",
  ],
  alternates: {
    canonical: "https://vetsondoor.com/emergency-vet-lahore",
  },
  openGraph: {
    title: "24/7 Emergency Vet at Home in Lahore | Vets On Door",
    description: "Pet emergency in Lahore? Call 0307-8517122 now — 24/7 rapid response across all Lahore areas.",
    url: "https://vetsondoor.com/emergency-vet-lahore",
    siteName: "Vets On Door",
    type: "website",
  },
};

const emergencySigns = [
  { icon: "😮‍💨", sign: "Difficulty breathing or rapid breathing" },
  { icon: "🤢", sign: "Continuous vomiting or diarrhea (3+ times)" },
  { icon: "😵", sign: "Loss of consciousness or collapse" },
  { icon: "🩸", sign: "Severe bleeding or deep wounds" },
  { icon: "💊", sign: "Suspected poisoning or toxin ingestion" },
  { icon: "🦴", sign: "Suspected fractures or broken bones" },
  { icon: "🌡️", sign: "Extreme lethargy and unresponsiveness" },
  { icon: "👁️", sign: "Eye injuries or sudden vision loss" },
  { icon: "🫀", sign: "Seizures or convulsions" },
  { icon: "🐾", sign: "Inability to walk or stand" },
];

export default function EmergencyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EmergencyService",
        "@id": "https://vetsondoor.com/emergency-vet-lahore#service",
        name: "Vets On Door — 24/7 Emergency Vet Lahore",
        description: "24/7 emergency veterinary care at your home in Lahore. Rapid dispatch by Dr. Muhammad Ahmad DVM (RVMP).",
        telephone: "+923078517122",
        url: "https://vetsondoor.com/emergency-vet-lahore",
        openingHours: "Mo-Su 00:00-23:59",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lahore",
          addressRegion: "Punjab",
          addressCountry: "PK",
        },
        areaServed: {
          "@type": "City",
          name: "Lahore",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://vetsondoor.com" },
          { "@type": "ListItem", position: 2, name: "Emergency Vet Lahore", item: "https://vetsondoor.com/emergency-vet-lahore" },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Emergency Hero */}
      <section className="bg-emergency-gradient text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 left-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container-custom relative z-10 text-center">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">Emergency</span>
          </nav>
          {/* Pulsing emergency icon */}
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-5xl mx-auto">
              🚨
            </div>
            <span className="absolute inset-0 rounded-full bg-white/20 emergency-ring" />
          </div>

          <h1 className="heading-xl text-white mb-4">
            24/7 Emergency Vet Care
          </h1>
          <p className="text-white/85 text-xl max-w-2xl mx-auto mb-10">
            Pet emergencies don't wait. Neither do we. Our rapid response team is available around the clock to reach you in the shortest possible time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${BRAND.emergency_line}`}
              id="emergency-call-now"
              className="bg-white text-emergency font-bold text-lg px-10 py-5 rounded-2xl hover:bg-white/90 transition-colors shadow-xl flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📞</span>
              Call Now: {BRAND.emergency_line}
            </a>
            <a
              href={`tel:${BRAND.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              id="emergency-whatsapp"
              className="bg-white/20 text-white font-semibold text-lg px-10 py-5 rounded-2xl border border-white/30 hover:bg-white/30 transition-colors flex items-center justify-center gap-3"
            >
              <WhatsappIcon className="w-6 h-6" />
              WhatsApp Emergency
            </a>
          </div>
        </div>
      </section>

      {/* Signs */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-md text-dark">Signs That Require Emergency Care</h2>
            <p className="text-dark/60 mt-3 max-w-xl mx-auto">
              If your pet is showing any of these symptoms, contact us immediately. Do not wait.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {emergencySigns.map((item, i) => (
              <div
                key={i}
                className="card p-5 text-center hover-lift border-emergency/10"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="text-dark/70 text-sm leading-snug">{item.sign}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-emergency/5 border border-emergency/20 p-6 text-center">
            <p className="text-emergency font-semibold">
              🚨 When in doubt — call! It's always better to be safe than sorry.
            </p>
            <p className="text-dark/60 text-sm mt-2">
              Our emergency team will assess your pet's condition over the phone and guide you while they're en route.
            </p>
          </div>
        </div>
      </section>

      {/* What to Do While Waiting */}
      <section className="section-padding bg-primary-light">
        <div className="container-custom max-w-3xl">
          <h2 className="heading-md text-dark text-center mb-10">
            What To Do While Waiting for the Vet
          </h2>

          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Stay Calm",
                desc: "Your pet can sense your anxiety. Stay calm and speak in a soothing tone to help them feel secure.",
              },
              {
                step: "2",
                title: "Keep Them Warm & Still",
                desc: "Place your pet in a warm, quiet area. Avoid excessive movement that could worsen injuries.",
              },
              {
                step: "3",
                title: "Don't Give Medications",
                desc: "Avoid giving human medications or home remedies without vet guidance — many are toxic to pets.",
              },
              {
                step: "4",
                title: "Control Bleeding If Any",
                desc: "Apply gentle pressure with a clean cloth to any bleeding wounds. Don't use tourniquets.",
              },
              {
                step: "5",
                title: "Share Location Clearly",
                desc: "When calling, clearly share your full address and a nearby landmark so the vet reaches you fastest.",
              },
            ].map((item) => (
              <div key={item.step} className="card p-5 flex gap-5">
                <div className="w-10 h-10 rounded-full bg-primary-mid/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-dark mb-1">{item.title}</h3>
                  <p className="text-dark/60 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating emergency call */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={`tel:${BRAND.emergency_line}`}
          id="emergency-floating-call"
          className="flex items-center gap-3 bg-emergency-gradient text-white font-bold px-5 py-3.5 rounded-2xl shadow-glow-emergency hover:opacity-90 transition-opacity animate-pulse"
        >
          <span className="text-lg">📞</span>
          Emergency Call
        </a>
      </div>
    </>
  );
}
