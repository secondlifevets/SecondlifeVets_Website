import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";
import WhatsappIcon from "@/components/ui/WhatsappIcon";
import { Mail, AlertCircle, Clock } from "lucide-react";

const InstagramIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const TiktokIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
);

export const metadata: Metadata = {
  title: "Contact Us | Mobile Vet in Lahore | Vets On Door",
  description:
    "Contact Vets On Door — Lahore's home vet service. Reach us via WhatsApp, call, or email. We cover DHA, Bahria Town, Gulberg, Johar Town & all Lahore areas. Typically responds in under 5 minutes.",
  keywords: [
    "contact vet Lahore",
    "book home vet Lahore",
    "vet phone number Lahore",
    "mobile vet contact Pakistan",
    "Vets On Door contact",
  ],
  alternates: {
    canonical: "https://vetsondoor.com/contact-vet-lahore",
  },
  openGraph: {
    title: "Contact Vets On Door | Mobile Vet Service in Lahore",
    description: "Reach us via WhatsApp, phone, or email. We respond within minutes.",
    url: "https://vetsondoor.com/contact-vet-lahore",
    siteName: "Vets On Door",
    type: "website",
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://vetsondoor.com/contact-vet-lahore#business",
        "name": "Vets On Door",
        "description": "Mobile veterinary service in Lahore — home vet visits by Dr. Muhammad Ahmad DVM (RVMP).",
        "telephone": "+923078517122",
        "email": "contact@vetsondoor.com",
        "url": "https://vetsondoor.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Lahore",
          "addressRegion": "Punjab",
          "addressCountry": "PK"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 31.5204,
          "longitude": 74.3587
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "20:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "10:00",
            "closes": "18:00"
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vetsondoor.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Contact",
            "item": "https://vetsondoor.com/contact-vet-lahore"
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header */}
      <section className="bg-dark text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary-mid/15 blur-3xl" />
        </div>
        <div className="container-custom relative z-10 text-center">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">Contact</span>
          </nav>
          <span className="text-primary-mid font-semibold text-sm uppercase tracking-widest">Get In Touch</span>
          <h1 className="heading-xl text-white mt-3 mb-4">Contact Vets On Door</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Have questions? Need to book a home vet visit in Lahore? We&apos;re available via WhatsApp, email, and social media — typically responding within minutes.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div>
              <h2 className="heading-md text-dark mb-8">Reach Us Directly</h2>

              <div className="space-y-4">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${BRAND.whatsapp}?text=Hi! I have a question about Vets On Door.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-whatsapp"
                  className="card p-5 flex items-center gap-5 hover-lift group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <WhatsappIcon className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">WhatsApp</p>
                    <p className="text-dark/60 text-sm">{BRAND.phone}</p>
                    <p className="text-success text-xs mt-1">● Typically replies in under 5 minutes</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${BRAND.email}`}
                  id="contact-email"
                  className="card p-5 flex items-center gap-5 hover-lift group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Email</p>
                    <p className="text-dark/60 text-sm">{BRAND.email}</p>
                    <p className="text-dark/40 text-xs mt-1">Replies within 24 hours</p>
                  </div>
                </a>

                {/* Emergency */}
                <a
                  href={`tel:${BRAND.emergency_line}`}
                  id="contact-emergency"
                  className="card p-5 flex items-center gap-5 hover-lift group border-emergency/20"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emergency/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <AlertCircle className="w-7 h-7 text-emergency" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark flex items-center gap-2">
                      Emergency Hotline
                      <span className="badge bg-emergency/10 text-emergency border-emergency/30 text-[10px] animate-pulse">24/7</span>
                    </p>
                    <p className="text-dark/60 text-sm">{BRAND.emergency_line}</p>
                    <p className="text-emergency text-xs mt-1">Available around the clock</p>
                  </div>
                </a>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="font-semibold text-dark mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {[
                    { label: "Instagram", href: BRAND.instagram, icon: <InstagramIcon size={18} />, bg: "bg-pink-50", text: "text-pink-600" },
                    { label: "TikTok", href: BRAND.tiktok, icon: <TiktokIcon size={18} />, bg: "bg-gray-100", text: "text-gray-700" },
                    { label: "LinkedIn", href: BRAND.linkedin, icon: <LinkedinIcon size={18} />, bg: "bg-blue-50", text: "text-blue-600" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={`contact-${social.label.toLowerCase()}`}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl ${social.bg} ${social.text} font-medium text-sm hover-lift transition-all duration-200`}
                    >
                      {social.icon}
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div className="card p-6 mt-8">
                <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-primary" /> Business Hours
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-dark/70">
                    <span>Monday – Saturday</span>
                    <span className="font-medium text-dark">9:00 AM – 8:00 PM</span>
                  </div>
                  <div className="flex justify-between text-dark/70">
                    <span>Sunday</span>
                    <span className="font-medium text-dark">10:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-emergency font-medium">Emergency Services</span>
                    <span className="font-bold text-emergency">24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
