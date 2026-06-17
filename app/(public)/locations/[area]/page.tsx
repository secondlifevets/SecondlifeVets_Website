import { Metadata } from "next";
import { notFound } from "next/navigation";
import { lahoreLocations, getLocationById } from "@/lib/lahore-locations";
import Link from "next/link";
import {
  CheckCircle,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Stethoscope,
  Star,
  ArrowRight,
  Clock,
} from "lucide-react";
import { BRAND } from "@/lib/constants";

export async function generateStaticParams() {
  return lahoreLocations.map((loc) => ({
    area: loc.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { area: string };
}): Promise<Metadata> {
  const location = getLocationById(params.area);

  if (!location) {
    return { title: "Location Not Found" };
  }

  const title = `Home Vet Service in ${location.name} | Vets On Door`;
  const description = `Looking for a vet in ${location.name}? Dr. Muhammad Ahmad DVM (RVMP) provides elite mobile veterinary care — pet checkups, vaccinations & 24/7 emergencies delivered to your home in ${location.short}. Call now.`;

  return {
    title,
    description,
    keywords: [
      `vet ${location.short}`,
      `vet ${location.name}`,
      `home vet ${location.name}`,
      `mobile vet ${location.short}`,
      `pet doctor ${location.name}`,
      `veterinary doctor ${location.short}`,
      `cat vet ${location.name}`,
      `dog vet ${location.name}`,
      `pet vaccination ${location.short}`,
      `emergency vet ${location.name}`,
      `vet near me ${location.short}`,
    ],
    alternates: {
      canonical: `https://vetsondoor.com/locations/${location.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://vetsondoor.com/locations/${location.id}`,
      siteName: "Vets On Door",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `Vets On Door — Home Vet in ${location.name}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default function LocationPage({
  params,
}: {
  params: { area: string };
}) {
  const location = getLocationById(params.area);

  if (!location) {
    notFound();
  }

  const faqs = [
    {
      q: `What is the best home vet service in ${location.name}?`,
      a: `Vets On Door is highly rated as a premier mobile veterinary service in ${location.name}. Dr. Muhammad Ahmad DVM (RVMP) provides clinic-grade pet checkups, vaccinations, and deworming directly at your home.`,
    },
    {
      q: `How quickly can a vet arrive at my house in ${location.short}?`,
      a: `For scheduled visits in ${location.name}, we arrive within your selected time slot. For medical emergencies, Vets On Door provides rapid dispatch to your location—call 0307-8517122 for immediate assistance.`,
    },
    {
      q: `Which animals does Dr. Muhammad Ahmad treat in ${location.name}?`,
      a: `Dr. Ahmad is a small animal specialist treating all common pets including dogs, cats, rabbits, birds, hamsters, and guinea pigs. He handles both routine wellness checks and complex medical procedures.`,
    },
    {
      q: `How can I schedule a mobile vet appointment in ${location.short}?`,
      a: `To book a home visit in ${location.name}, simply click "Book a Home Visit" on our website, enter your address and pet details, and choose an available time slot. Our team will confirm instantly via WhatsApp.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VeterinaryCare",
        "@id": `https://vetsondoor.com/locations/${location.id}#business`,
        name: `Vets On Door — ${location.name}`,
        description: `Elite mobile veterinary services operating directly in ${location.name}, Lahore. Home visits by Dr. Muhammad Ahmad DVM (RVMP).`,
        image: "https://vetsondoor.com/og-image.png",
        url: `https://vetsondoor.com/locations/${location.id}`,
        telephone: "+923078517122",
        email: "contact@vetsondoor.com",
        priceRange: "PKR 1500 - PKR 8000",
        address: {
          "@type": "PostalAddress",
          addressLocality: location.name,
          addressRegion: "Punjab",
          addressCountry: "PK",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: location.lat,
          longitude: location.lng,
        },
        areaServed: {
          "@type": "Neighborhood",
          name: location.name,
          containedInPlace: {
            "@type": "City",
            name: "Lahore",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "127",
          bestRating: "5",
        },
        openingHours: "Mo-Su 09:00-22:00",
        availableService: [
          "General Health Checkup",
          "Vaccination",
          "Deworming & Parasite Control",
          "Emergency Care (24/7)",
          "Dental Cleaning",
          "Pet Nutrition Consultation",
          "Diagnostic & Lab Tests",
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://vetsondoor.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Locations",
            item: "https://vetsondoor.com/locations",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: location.name,
            item: `https://vetsondoor.com/locations/${location.id}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
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
        {/* Hero Section */}
        <section className="bg-dark text-white pt-24 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient opacity-90 z-0" />
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/30 blur-3xl z-0" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex items-center justify-center gap-2 text-sm text-white/60"
            >
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/locations"
                className="hover:text-white transition-colors"
              >
                Locations
              </Link>
              <span>/</span>
              <span className="text-white font-medium">{location.name}</span>
            </nav>

            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-light px-4 py-2 rounded-full mb-6 border border-primary/30">
              <MapPin size={16} />
              <span className="font-semibold text-sm tracking-widest uppercase">
                Available in {location.name}
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              Elite Home Vet Service in{" "}
              <span className="text-primary">{location.name}</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 font-sans">
              Skip the stressful clinic travel. Dr. Muhammad Ahmad DVM (RVMP) brings
              professional, clinic-grade veterinary expertise directly to your home in{" "}
              {location.short}. Available for regular visits and 24/7 emergencies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-vet-appointment-lahore" className="btn-primary py-4 px-8 text-lg font-bold">
                Book a Home Visit in {location.short}
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

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-dark mb-4">
                Why Choose Vets On Door in {location.short}?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                We are proud to serve the {location.name} community with premium,
                stress-free veterinary care for pets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Stethoscope size={32} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-dark">
                  Expert RVMP Doctor
                </h3>
                <p className="text-gray-600">
                  Fully licensed veterinary physician treating your pets directly in{" "}
                  {location.short} with clinic-grade expertise.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-dark">
                  Stress-Free Care
                </h3>
                <p className="text-gray-600">
                  No travel anxiety for your pets. They get treated in the comfort
                  and safety of their own home in {location.name}.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-dark">
                  Premium Equipment
                </h3>
                <p className="text-gray-600">
                  We carry medical-grade diagnostic equipment and medicines
                  directly to your doorstep in {location.name}.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="py-20 border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
              <div>
                <h2 className="font-display text-3xl font-bold text-dark mb-6">
                  Services Offered in {location.name}
                </h2>
                <div className="space-y-4">
                  {[
                    { name: "Comprehensive Pet Health Checkups", href: "/services/home-vet-checkup-lahore" },
                    { name: "At-Home Vaccinations (Dogs & Cats)", href: "/services/pet-vaccination-lahore" },
                    { name: "24/7 Emergency Medical Response", href: "/services/emergency-vet-lahore" },
                    { name: "Deworming & Parasite Control", href: "/services/pet-deworming-lahore" },
                    { name: "Dental Cleaning & Oral Care", href: "/services/dental-cleaning-lahore" },
                    { name: "Dietary & Nutritional Consultations", href: "/services/pet-nutrition-lahore" },
                    { name: "Diagnostic & Lab Tests", href: "/services/diagnostic-lab-tests-lahore" },
                    { name: "Surgical Consultations", href: "/services/surgical-consultation-lahore" },
                  ].map((service) => (
                    <Link
                      key={service.name}
                      href={service.href}
                      className="flex items-center gap-3 group"
                    >
                      <Star
                        size={18}
                        className="text-primary flex-shrink-0"
                        fill="currentColor"
                      />
                      <span className="text-gray-700 font-medium group-hover:text-primary transition-colors">
                        {service.name}
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                      />
                    </Link>
                  ))}
                </div>
                <div className="mt-8">
                  <Link
                    href="/services"
                    className="text-primary font-bold hover:underline"
                  >
                    View full list of services →
                  </Link>
                </div>
              </div>

              <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={24} className="text-primary" />
                  <h3 className="font-bold text-2xl text-dark">
                    Book Your Visit in {location.short}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Our mobile veterinary unit is actively serving clients in{" "}
                  {location.name} and surrounding areas. Slots fill up quickly — book
                  ahead of time!
                </p>
                <Link
                  href="/book-vet-appointment-lahore"
                  className="btn-primary w-full text-center py-4 text-lg block"
                >
                  Schedule Appointment
                </Link>
                <p className="text-center text-gray-400 text-sm mt-4">
                  Or call us at{" "}
                  <a
                    href="tel:+923078517122"
                    className="text-primary font-bold hover:underline"
                  >
                    0307-8517122
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Location-specific FAQ */}
        <section className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <h2 className="font-display text-3xl font-bold text-dark mb-10 text-center">
              Frequently Asked Questions — {location.name}
            </h2>
            <div className="space-y-5">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                  <h3 className="font-bold text-dark text-lg mb-3">{faq.q}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nearby Locations */}
        <section className="py-16 border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-dark mb-8 text-center">
              We Also Serve Nearby Areas
            </h2>
            <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
              {lahoreLocations
                .filter((l) => l.id !== location.id)
                .slice(0, 10)
                .map((loc) => (
                  <Link
                    key={loc.id}
                    href={`/locations/${loc.id}`}
                    className="bg-white border border-gray-200 hover:border-primary hover:text-primary text-gray-600 px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-md"
                  >
                    {loc.name}
                  </Link>
                ))}
              <Link
                href="/locations"
                className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-primary-mid transition-colors"
              >
                View All 21 Areas →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
