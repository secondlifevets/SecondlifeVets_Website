import { Metadata } from "next";
import Link from "next/link";
import { 
  Stethoscope, 
  Syringe, 
  Bug, 
  Scissors, 
  Activity, 
  AlertTriangle, 
  Bone, 
  Microscope,
  ArrowRight,
  Clock,
  PhoneCall,
  Shield
} from "lucide-react";
import WhatsappIcon from "@/components/ui/WhatsappIcon";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Veterinary Services in Lahore | Home Vet Care | Vets On Door",
  description:
    "Professional mobile veterinary services in Lahore at your doorstep. Checkups, vaccinations, deworming, dental cleaning, emergency care & more — all areas of Lahore covered by Dr. Muhammad Ahmad DVM (RVMP).",
  keywords: [
    "veterinary services Lahore",
    "home vet services Lahore",
    "mobile vet services Pakistan",
    "pet checkup at home Lahore",
    "pet vaccination Lahore",
    "emergency vet Lahore",
    "dental cleaning pet Lahore",
    "pet deworming Lahore",
  ],
  alternates: {
    canonical: "https://vetsondoor.com/services",
  },
  openGraph: {
    title: "Veterinary Services in Lahore | Home Vet Care | Vets On Door",
    description: "Professional mobile vet services across all Lahore areas. Book online today.",
    url: "https://vetsondoor.com/services",
    siteName: "Vets On Door",
    type: "website",
  },
};

const servicesList = [
  { 
    id: "general-checkup",
    slug: "home-vet-checkup-lahore",
    icon: Stethoscope, 
    name: "General Checkup", 
    desc: "Full physical examination, vital signs, and overall health assessment for your pet at home.",
    duration: "30-45 mins"
  },
  { 
    id: "vaccination",
    slug: "pet-vaccination-lahore",
    icon: Syringe, 
    name: "Vaccination", 
    desc: "Core and non-core vaccines for cats and dogs, with strict cold-chain protocols maintained.",
    duration: "20-30 mins"
  },
  { 
    id: "deworming",
    slug: "pet-deworming-lahore",
    icon: Bug, 
    name: "Deworming", 
    desc: "Safe and effective internal and external parasite treatment at your doorstep.",
    duration: "20 mins"
  },
  { 
    id: "surgical",
    slug: "surgical-consultation-lahore",
    icon: Scissors, 
    name: "Surgical Consultation", 
    desc: "Pre-surgical assessment, post-operative wound care, and suture removal at home.",
    duration: "45-60 mins"
  },
  { 
    id: "dental",
    slug: "dental-cleaning-lahore",
    icon: Activity, 
    name: "Dental Cleaning", 
    desc: "Professional oral examination and dental scaling for healthier teeth and gums.",
    duration: "30-45 mins"
  },
  { 
    id: "emergency",
    slug: "emergency-vet-lahore",
    icon: AlertTriangle, 
    name: "Emergency Care", 
    desc: "Critical care for urgent cases with 24/7 availability and rapid dispatch across Lahore.",
    duration: "Varies"
  },
  { 
    id: "nutrition",
    slug: "pet-nutrition-lahore",
    icon: Bone, 
    name: "Pet Nutrition Consultation", 
    desc: "Personalised dietary plans tailored for your pet's specific health needs and life stage.",
    duration: "30 mins"
  },
  { 
    id: "diagnostic",
    slug: "diagnostic-lab-tests-lahore",
    icon: Microscope, 
    name: "Diagnostic & Lab Tests", 
    desc: "On-site blood work, urinalysis, and rapid diagnostic tests collected at your home.",
    duration: "30-45 mins"
  },
  { 
    id: "tick-flea",
    slug: "tick-flea-treatments-lahore",
    icon: Shield, 
    name: "Tick & Flea Treatments", 
    desc: "Complete eradication and prevention of external parasites.",
    duration: "20-30 mins"
  }
];

export default function ServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
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
            "name": "Services",
            "item": "https://vetsondoor.com/services"
          }
        ]
      },
      {
        "@type": "ItemList",
        "itemListElement": servicesList.map((service, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": service.name,
          "url": `https://vetsondoor.com/services/${service.slug}`
        }))
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
      <section className="bg-hero-gradient pt-24 pb-20 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-primary-light/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-primary-mid/20 blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-center gap-2 text-sm text-white/60">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-white font-medium">Services</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-sm">
            Veterinary Services in Lahore
          </h1>
          <p className="text-xl md:text-2xl text-primary-light font-medium font-sans">
            Clinic-grade home vet care across all areas of Lahore
          </p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {servicesList.map((service, index) => (
              <div 
                key={service.id} 
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 flex flex-col h-full group"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
                    <service.icon size={32} className="text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold text-dark mb-3">{service.name}</h3>
                    <p className="text-gray-600 mb-6 font-sans leading-relaxed min-h-[48px]">
                      {service.desc}
                    </p>
                    
                    <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                        <Clock size={16} /> <span>Typical Duration: {service.duration}</span>
                      </div>
                      
                      <div className="flex gap-2 flex-wrap">
                        <Link 
                          href={`/services/${service.slug}`} 
                          className="inline-flex items-center gap-2 text-primary hover:text-primary-mid font-bold transition-colors group/btn bg-primary/5 hover:bg-primary/10 px-3 py-2 rounded-xl text-sm"
                        >
                          Learn More <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                        <Link 
                          href={`/book?service=${encodeURIComponent(service.name)}`} 
                          className="inline-flex items-center gap-2 text-white bg-primary hover:bg-primary-mid font-bold transition-colors px-3 py-2 rounded-xl text-sm"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency CTA Banner */}
      <section className="bg-emergency py-16 relative overflow-hidden mt-auto">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 text-white backdrop-blur-sm">
            <PhoneCall size={32} className="animate-pulse" />
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Life-threatening emergency?
          </h2>
          <p className="text-xl text-white/90 mb-10 font-sans max-w-2xl mx-auto">
            Don't book — WhatsApp immediately. Our rapid response team is available 24/7 for critical cases.
          </p>
          
          <a 
            href={BRAND.whatsapp_url} 
            target="_blank" rel="noopener noreferrer"
            className="inline-flex bg-[#25D366] hover:bg-[#20bd5a] text-white px-10 py-5 rounded-full font-bold text-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 items-center justify-center gap-3"
          >
            <WhatsappIcon className="w-6 h-6" /> WhatsApp 0307-8517122
          </a>
        </div>
      </section>
    </div>
  );
}
