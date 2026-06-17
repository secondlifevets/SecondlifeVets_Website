import { Metadata } from "next";
import Link from "next/link";
import { lahoreLocations } from "@/lib/lahore-locations";
import { MapPin, PhoneCall, CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Home Vet Service in All Areas of Lahore | Vets On Door",
  description:
    "Vets On Door provides elite mobile veterinary care across all major areas of Lahore — DHA, Bahria Town, Gulberg, Johar Town, Model Town & 16 more. Book a home vet visit today.",
  keywords: [
    "vet Lahore",
    "home vet all areas Lahore",
    "mobile vet service Lahore",
    "veterinary doctor home visit Lahore",
    "vet near me Lahore",
    "pet doctor Lahore all areas",
  ],
  alternates: {
    canonical: "https://vetsondoor.com/locations",
  },
  openGraph: {
    title: "Home Vet Service Across All Areas of Lahore | Vets On Door",
    description:
      "Dr. Muhammad Ahmad DVM (RVMP) serves all major Lahore neighborhoods. Professional mobile veterinary care at your doorstep.",
    url: "https://vetsondoor.com/locations",
    siteName: "Vets On Door",
    type: "website",
  },
};

export default function LocationsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VeterinaryCare",
    "@id": "https://vetsondoor.com/locations#business",
    name: "Vets On Door — Lahore Coverage",
    description:
      "Mobile veterinary service covering all major areas of Lahore, Pakistan. Home visits by Dr. Muhammad Ahmad DVM (RVMP).",
    url: "https://vetsondoor.com/locations",
    telephone: "+923078517122",
    areaServed: lahoreLocations.map((loc) => ({
      "@type": "Neighborhood",
      name: loc.name,
      containedInPlace: {
        "@type": "City",
        name: "Lahore",
        containedInPlace: { "@type": "State", name: "Punjab" },
      },
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://vetsondoor.com" },
        { "@type": "ListItem", position: 2, name: "Locations", item: "https://vetsondoor.com/locations" },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col min-h-screen">
        {/* Hero */}
        <section className="bg-dark text-white pt-24 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient opacity-90 z-0" />
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/30 blur-3xl z-0" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white font-medium">Locations</span>
            </nav>

            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-light px-4 py-2 rounded-full mb-6 border border-primary/30">
              <MapPin size={16} />
              <span className="font-semibold text-sm tracking-widest uppercase">
                Serving All of Lahore
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              Home Vet Services Across{" "}
              <span className="text-primary">All of Lahore</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 font-sans max-w-2xl mx-auto">
              Dr. Muhammad Ahmad DVM (RVMP) covers{" "}
              <strong className="text-white">{lahoreLocations.length}+ areas</strong> across
              Lahore. No travel stress — we come to you with full clinic-grade equipment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-vet-appointment-lahore" className="btn-primary py-4 px-8 text-lg font-bold">
                Book a Home Visit
              </Link>
              <a
                href="tel:+923078517122"
                className="bg-white/10 hover:bg-white/20 text-white py-4 px-8 rounded-full font-bold flex items-center justify-center gap-2 transition-all"
              >
                <PhoneCall size={20} />
                Call +92 307 8517122
              </a>
            </div>
          </div>
        </section>

        {/* Why we cover all of Lahore */}
        <section className="py-16 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                { icon: "🚗", title: "Fully Mobile Unit", desc: "Our van is equipped with medical-grade diagnostic tools, medicines & emergency equipment." },
                { icon: "🕐", title: "24/7 Availability", desc: "We serve all Lahore areas round the clock — emergency calls answered any time of day or night." },
                { icon: "📍", title: "21 Areas Covered", desc: "From DHA to Bahria Town, from Gulberg to Samanabad — we cover Lahore end to end." },
              ].map((f) => (
                <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="text-4xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-dark mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Location Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-dark mb-4">
                Select Your Area in Lahore
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                Click your neighbourhood to see specific services, pricing information, and to
                book a home vet visit directly in your area.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {lahoreLocations.map((loc) => (
                <Link
                  key={loc.id}
                  href={`/locations/${loc.id}`}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-primary" />
                    </div>
                    <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle size={11} /> Active
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-dark mb-2 group-hover:text-primary transition-colors">
                    {loc.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
                    {loc.description}
                  </p>

                  <div className="flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                    View vet services in {loc.short}
                    <ArrowRight size={15} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Don't See Your Area?
            </h2>
            <p className="text-primary-light text-lg mb-8 max-w-xl mx-auto">
              We're constantly expanding. Call us or WhatsApp — we'll tell you if we can reach
              you and aim to include your area soon.
            </p>
            <a
              href="tel:+923078517122"
              className="inline-flex items-center gap-3 bg-white text-primary font-bold px-10 py-4 rounded-full shadow-xl hover:bg-primary-light transition-all hover:-translate-y-1"
            >
              <PhoneCall size={22} />
              Call 0307-8517122
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
