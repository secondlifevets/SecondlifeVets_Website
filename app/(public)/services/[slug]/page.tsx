import { Metadata } from "next";
import { notFound } from "next/navigation";
import { servicesData, getServiceBySlug } from "@/lib/services-data";
import Link from "next/link";
import { ArrowRight, PhoneCall, CheckCircle, Clock, MapPin } from "lucide-react";
import { lahoreLocations } from "@/lib/lahore-locations";

export async function generateStaticParams() {
  return servicesData.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: {
      canonical: `https://vetsondoor.com/services/${service.slug}`,
    },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `https://vetsondoor.com/services/${service.slug}`,
      siteName: "Vets On Door",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${service.name} | Vets On Door`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle,
      description: service.metaDescription,
      images: ["/og-image.png"],
    },
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalProcedure",
        "@id": `https://vetsondoor.com/services/${service.slug}#service`,
        name: service.name,
        description: service.metaDescription,
        url: `https://vetsondoor.com/services/${service.slug}`,
        provider: {
          "@type": "VeterinaryCare",
          "@id": "https://vetsondoor.com/#business",
          name: "Vets On Door",
          telephone: "+923078517122",
          url: "https://vetsondoor.com",
        },
        areaServed: {
          "@type": "City",
          name: "Lahore",
          containedInPlace: { "@type": "State", name: "Punjab" },
        },
        offers: {
          "@type": "Offer",
          priceRange: service.priceRange,
          priceCurrency: "PKR",
          availability: "https://schema.org/InStock",
          areaServed: "Lahore, Pakistan",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://vetsondoor.com" },
          { "@type": "ListItem", position: 2, name: "Services", item: "https://vetsondoor.com/services" },
          { "@type": "ListItem", position: 3, name: service.shortName, item: `https://vetsondoor.com/services/${service.slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
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

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl text-center">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              <span>/</span>
              <span className="text-white font-medium">{service.shortName}</span>
            </nav>

            <div className="inline-flex items-center gap-3 bg-primary/20 text-primary-light px-5 py-2.5 rounded-full mb-6 border border-primary/30">
              <Icon size={18} />
              <span className="font-semibold text-sm tracking-widest uppercase">
                {service.tagline}
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              {service.heroHeading}
            </h1>

            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 font-sans max-w-2xl mx-auto">
              {service.heroSub}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <div className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Clock size={15} className="text-primary-light" />
                <span>Duration: {service.duration}</span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium">
                💰 Starting from {service.priceRange}
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <MapPin size={15} className="text-primary-light" />
                All Lahore Areas
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/book?service=${encodeURIComponent(service.shortName)}`} className="btn-primary py-4 px-8 text-lg font-bold">
                Book This Service
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

        {/* What We Offer */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="font-display text-3xl font-bold text-dark mb-8">
                  What&apos;s Included in {service.shortName}
                </h2>
                <div className="space-y-4">
                  {service.whatWeOffer.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <h2 className="font-display text-3xl font-bold text-dark mb-4">
                  Benefits of Home Service
                </h2>
                {service.benefits.map((b, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-dark mb-2">{b.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <h2 className="font-display text-3xl font-bold text-dark mb-10 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-5">
              {service.faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-dark text-lg mb-3">{faq.q}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Available Across Lahore */}
        <section className="py-16 border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-dark mb-3 text-center">
              {service.shortName} Available Across All of Lahore
            </h2>
            <p className="text-center text-gray-500 mb-8 max-w-xl mx-auto">
              We cover all major neighbourhoods — book in your area for a home visit.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-5xl mx-auto">
              {lahoreLocations.map((loc) => (
                <Link
                  key={loc.id}
                  href={`/locations/${loc.id}`}
                  className="bg-white border border-gray-200 hover:border-primary hover:text-primary text-gray-600 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:shadow-sm"
                >
                  {loc.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Other Services */}
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-dark mb-8 text-center">
              Explore Other Services
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {servicesData
                .filter((s) => s.slug !== service.slug)
                .slice(0, 4)
                .map((s) => {
                  const SIcon = s.icon;
                  return (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all group text-center"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary transition-colors">
                        <SIcon size={20} className="text-primary group-hover:text-white transition-colors" />
                      </div>
                      <p className="font-semibold text-dark text-sm group-hover:text-primary transition-colors">
                        {s.shortName}
                      </p>
                    </Link>
                  );
                })}
            </div>
            <div className="text-center mt-8">
              <Link href="/services" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                View All Services <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Ready to Book {service.shortName} in Lahore?
            </h2>
            <p className="text-primary-light mb-8">
              Slots fill up fast. Book now and our team will confirm via WhatsApp within minutes.
            </p>
            <Link
              href={`/book?service=${encodeURIComponent(service.shortName)}`}
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-10 py-4 rounded-full shadow-xl hover:bg-primary-light transition-all hover:-translate-y-1"
            >
              Book Now <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
