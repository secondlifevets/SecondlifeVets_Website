import Link from "next/link";
import Image from "next/image";
import { 
  CheckCircle, 
  ArrowRight, 
  Stethoscope, 
  Syringe, 
  Activity, 
  MapPin,
  Clock,
  ShieldCheck,
  PhoneCall,
  Star
} from "lucide-react";
import WhatsappIcon from "@/components/ui/WhatsappIcon";
import { BRAND } from "@/lib/constants";

export const metadata = {
  title: "Best Vet in Lahore | Expert Veterinary Clinic & Home Vet Services",
  description:
    "Looking for the best vet in Lahore? Vets On Door provides expert home veterinary services, vaccinations, general checkups, and 24/7 emergency care across all areas of Lahore. Book your home visit today.",
  keywords: [
    "vet in Lahore",
    "best vet in Lahore",
    "veterinary clinic Lahore",
    "vet doctor in Lahore",
    "home vet Lahore",
    "dog vet Lahore",
    "cat vet Lahore",
    "emergency vet Lahore"
  ],
  alternates: {
    canonical: "https://vetsondoor.com/vet-in-lahore",
  },
  openGraph: {
    title: "Best Vet in Lahore | Mobile Veterinary Clinic",
    description: "Expert veterinary care delivered directly to your doorstep anywhere in Lahore. Rated as a top vet in Lahore by pet parents.",
    url: "https://vetsondoor.com/vet-in-lahore",
    siteName: "Vets On Door",
    images: [{ url: "/gallery-1.webp", alt: "Best Vet in Lahore - Home Checkup", width: 800, height: 600 }],
    type: "article",
  },
};

export default function VetInLahorePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "Finding the Best Vet in Lahore: Your Guide to Premium Pet Care",
        "description": "Discover why Vets On Door is considered the top choice for pet parents looking for a reliable vet in Lahore, offering clinic-grade home services.",
        "image": "https://vetsondoor.com/gallery-1.webp",
        "author": {
          "@type": "Person",
          "name": "Dr. Muhammad Ahmad"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Vets On Door",
          "logo": {
            "@type": "ImageObject",
            "url": "https://vetsondoor.com/favicon.ico"
          }
        },
        "datePublished": new Date().toISOString().split('T')[0],
        "dateModified": new Date().toISOString().split('T')[0]
      },
      {
        "@type": "VeterinaryCare",
        "@id": "https://vetsondoor.com/#business",
        "name": "Vets On Door - Best Vet in Lahore",
        "description": "Mobile Veterinary Clinic providing premium home vet visits in Lahore.",
        "url": "https://vetsondoor.com/vet-in-lahore",
        "telephone": BRAND.phone,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Lahore",
          "addressRegion": "Punjab",
          "addressCountry": "PK"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "31.5204",
          "longitude": "74.3587"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "00:00",
          "closes": "23:59"
        },
        "priceRange": "$$"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I find the best vet in Lahore?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Look for RVMP certified doctors, check patient reviews, and consider services like Vets On Door that bring clinic-grade equipment directly to your home for stress-free treatment."
            }
          },
          {
            "@type": "Question",
            "name": "Is there a 24/7 veterinary clinic in Lahore?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Vets On Door provides 24/7 emergency veterinary services across all major areas of Lahore. You can call their emergency line anytime."
            }
          },
          {
            "@type": "Question",
            "name": "What services do vets in Lahore provide?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Top vets in Lahore provide vaccinations, deworming, general checkups, surgical consultations, dental cleaning, and diagnostic lab tests."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section className="bg-primary pt-24 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] rounded-full bg-dark/10 blur-2xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white font-medium">Best Vet in Lahore</span>
            </nav>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6 border border-white/20">
              <Star className="text-warning fill-warning" size={16} />
              <span className="text-sm font-semibold">Rated #1 Mobile Vet Service in Lahore</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Finding the <span className="text-primary-light">Best Vet in Lahore</span> for Your Pet
            </h1>
            <p className="text-primary-light text-lg md:text-xl max-w-2xl mx-auto font-sans mb-8">
              Skip the stressful commute to a veterinary clinic. Get premium, RVMP-certified veterinary care delivered directly to your doorstep across all areas of Lahore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/book-vet-appointment-lahore" 
                className="bg-white text-primary hover:bg-primary-light px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                Book a Home Visit <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href={BRAND.whatsapp_url} 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <WhatsappIcon className="w-5 h-5" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Article Content */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-lg prose-primary max-w-none">
                <h2 className="font-display text-3xl font-bold text-dark mt-0 mb-6">Why Choose a Mobile Veterinary Clinic in Lahore?</h2>
                <p className="text-gray-600 font-sans leading-relaxed mb-6">
                  When searching for a <strong>vet in Lahore</strong>, pet parents often dread the idea of packing up their anxious dog or cat and driving through the city's notorious traffic. Finding a reliable <strong>veterinary clinic in Lahore</strong> shouldn't be a stressful ordeal for you or your furry friend. That's where <em>Vets On Door</em> revolutionizes pet care.
                </p>
                <p className="text-gray-600 font-sans leading-relaxed mb-8">
                  Led by Dr. Muhammad Ahmad (DVM, RVMP), we provide a fully equipped mobile veterinary unit that brings the clinic directly to your living room. Whether you are in DHA, Bahria Town, Gulberg, or Johar Town, our expert team ensures your pet receives top-tier medical attention in the environment where they feel most comfortable.
                </p>

                <div className="bg-primary-light/20 p-6 rounded-2xl border border-primary-light my-8">
                  <h3 className="font-display text-2xl font-bold text-primary mt-0 mb-4 flex items-center gap-2">
                    <ShieldCheck size={24} /> RVMP Certified Care
                  </h3>
                  <p className="text-gray-700 m-0 font-sans">
                    Never compromise on quality. Our lead vet is fully registered with the Pakistan Veterinary Medical Council, ensuring that every diagnosis, vaccination, and treatment adheres to strict medical standards.
                  </p>
                </div>

                <h2 className="font-display text-3xl font-bold text-dark mb-6">Comprehensive Veterinary Services</h2>
                <p className="text-gray-600 font-sans leading-relaxed mb-6">
                  As a leading <strong>vet doctor in Lahore</strong>, we provide a wide spectrum of services typically found only in traditional clinics:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0 mb-8">
                  {[
                    "Routine Health Checkups",
                    "Dog & Cat Vaccinations",
                    "Deworming & Tick Control",
                    "Diagnostic Lab Tests",
                    "Emergency Veterinary Care",
                    "Surgical Consultations"
                  ].map((service, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 m-0">
                      <CheckCircle size={20} className="text-success flex-shrink-0" />
                      <span className="font-medium">{service}</span>
                    </li>
                  ))}
                </ul>

                <h2 className="font-display text-3xl font-bold text-dark mb-6">24/7 Emergency Vet in Lahore</h2>
                <p className="text-gray-600 font-sans leading-relaxed mb-8">
                  Medical emergencies don't stick to business hours. If your pet is in distress at 2 AM, finding an open <strong>veterinary clinic in Lahore</strong> can be terrifying. Vets On Door operates a 24/7 emergency response service. We dispatch our highly trained vet directly to your location with life-saving equipment, saving you precious time during critical moments.
                </p>
              </div>

              {/* FAQs */}
              <div className="mt-12 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                <h2 className="font-display text-3xl font-bold text-dark mb-8">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-dark mb-2">How do I find the best vet in Lahore?</h3>
                    <p className="text-gray-600 font-sans">Look for doctors who are DVM qualified and RVMP registered. Reading reviews from other pet parents and ensuring they have modern diagnostic tools is crucial. Vets On Door meets all these criteria while adding the convenience of home visits.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark mb-2">Is a mobile vet as good as a physical veterinary clinic?</h3>
                    <p className="text-gray-600 font-sans">Yes! Our mobile units carry the same medical supplies, vaccines, and diagnostic tools as a traditional clinic. The added benefit is that your pet remains calm at home, which leads to more accurate heart rates and less behavioral stress.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark mb-2">Do you cover all areas of Lahore?</h3>
                    <p className="text-gray-600 font-sans">We cover 100% of Lahore, including DHA, Bahria Town, Gulberg, Model Town, Johar Town, Wapda Town, and surrounding neighborhoods.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              {/* Doctor Profile Widget */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary-light mb-4 relative">
                  <Image src="/dr-ahmad.webp" alt="Dr. Muhammad Ahmad - Best Vet in Lahore" fill className="object-cover" />
                </div>
                <h3 className="font-display text-2xl font-bold text-dark mb-1">Dr. Muhammad Ahmad</h3>
                <p className="text-primary font-bold text-sm mb-4">DVM (RVMP) - Lead Vet</p>
                <p className="text-gray-600 text-sm font-sans mb-6">
                  Specialist in small animal medicine and surgery, dedicated to bringing premium veterinary care to your doorstep.
                </p>
                <Link 
                  href="/veterinarian-lahore" 
                  className="inline-block w-full border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-full font-bold transition-colors"
                >
                  View Full Profile
                </Link>
              </div>

              {/* Quick Contact Widget */}
              <div className="bg-primary rounded-3xl p-6 shadow-lg text-white">
                <h3 className="font-display text-xl font-bold mb-4">Need a Vet Right Now?</h3>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-center gap-3">
                    <Clock size={20} className="text-primary-light" />
                    <span>Available 24/7</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <MapPin size={20} className="text-primary-light" />
                    <span>Serving all of Lahore</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Stethoscope size={20} className="text-primary-light" />
                    <span>Fully Equipped Unit</span>
                  </li>
                </ul>
                <a 
                  href={`tel:${BRAND.phone}`} 
                  className="w-full bg-emergency hover:bg-red-600 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <PhoneCall size={18} /> Call {BRAND.phone}
                </a>
              </div>

              {/* Service Areas Widget */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-display text-xl font-bold text-dark mb-4">Popular Service Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {["DHA Lahore", "Bahria Town", "Gulberg", "Model Town", "Johar Town", "Wapda Town", "Cantonment"].map(area => (
                    <span key={area} className="bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
