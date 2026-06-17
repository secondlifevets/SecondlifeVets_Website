import Link from "next/link";
import Image from "next/image";
import { 
  UserRound, 
  CheckCircle, 
  ArrowRight, 
  MessageCircle, 
  GraduationCap, 
  Award, 
  ShieldCheck,
  Stethoscope,
  Briefcase,
  FileText
} from "lucide-react";
import WhatsappIcon from "@/components/ui/WhatsappIcon";
import { BRAND } from "@/lib/constants";

export const metadata = {
  title: "Dr. Muhammad Ahmad DVM RVMP | Lead Vet Lahore | Vets On Door",
  description:
    "Meet Dr. Muhammad Ahmad, Lead Veterinarian and Founder of Vets On Door. DVM (RVMP) — specialist in small animal medicine and surgery, providing home vet visits across all areas of Lahore.",
  keywords: [
    "Dr Muhammad Ahmad vet Lahore",
    "DVM vet Lahore",
    "RVMP veterinarian Lahore",
    "home vet doctor Lahore",
    "small animal vet Lahore",
    "veterinary team Lahore",
  ],
  alternates: {
    canonical: "https://vetsondoor.com/veterinarian-lahore",
  },
  openGraph: {
    title: "Dr. Muhammad Ahmad DVM RVMP | Mobile Vet Lahore | Vets On Door",
    description: "Meet the lead veterinarian behind Lahore's #1 home vet service.",
    url: "https://vetsondoor.com/veterinarian-lahore",
    siteName: "Vets On Door",
    images: [{ url: "/dr-ahmad.webp", alt: "Dr. Muhammad Ahmad DVM", width: 400, height: 500 }],
    type: "website",
  },
};

export default function OurTeamPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://vetsondoor.com/#doctor",
        "name": "Dr. Muhammad Ahmad",
        "givenName": "Muhammad",
        "familyName": "Ahmad",
        "honorificPrefix": "Dr.",
        "jobTitle": "Lead Veterinarian & Founder",
        "description": "Dr. Muhammad Ahmad is a DVM (Doctor of Veterinary Medicine) and RVMP (Registered Veterinary Medical Practitioner) specializing in small animal medicine and surgery. He founded Vets On Door, Lahore's first mobile home veterinary service.",
        "image": "https://vetsondoor.com/dr-ahmad.webp",
        "url": "https://vetsondoor.com/veterinarian-lahore",
        "worksFor": {
          "@type": "VeterinaryCare",
          "@id": "https://vetsondoor.com/#business",
          "name": "Vets On Door"
        },
        "alumniOf": {
          "@type": "CollegeOrUniversity",
          "name": "Riphah International University",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "PK"
          }
        },
        "hasCredential": [
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "degree",
            "name": "Doctor of Veterinary Medicine (DVM)"
          },
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "professional-license",
            "name": "Registered Veterinary Medical Practitioner (RVMP)",
            "recognizedBy": {
              "@type": "Organization",
              "name": "Pakistan Veterinary Medical Council"
            }
          }
        ],
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Veterinarian",
          "occupationLocation": {
            "@type": "City",
            "name": "Lahore"
          }
        },
        "knowsAbout": [
          "Veterinary Medicine",
          "Small Animal Medicine",
          "Veterinary Surgery",
          "Pet Vaccination",
          "Emergency Veterinary Care",
          "Veterinary Dentistry",
          "Animal Diagnostics",
          "Preventive Veterinary Medicine"
        ],
        "sameAs": [
          "https://www.instagram.com/vetsondoor",
          "https://www.linkedin.com/company/vetsondoors/"
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
            "name": "Veterinarian in Lahore",
            "item": "https://vetsondoor.com/veterinarian-lahore"
          }
        ]
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="bg-primary pt-24 pb-16 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] rounded-full bg-dark/10 blur-2xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">Our Veterinarian</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Meet Our Veterinary Team</h1>
          <p className="text-primary-light text-lg max-w-2xl mx-auto font-sans">
            Dedicated professionals committed to delivering clinic-grade veterinary care directly to your doorstep.
          </p>
        </div>
      </section>

      {/* Featured Doctor Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Photo Area */}
              <div className="lg:col-span-5 relative bg-primary-light/50 p-8 flex items-center justify-center min-h-[400px]">
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm text-primary font-bold text-sm flex items-center gap-2">
                  <Award size={16} /> Lead Vet
                </div>
                
                {/* Photo */}
                <div className="w-full max-w-sm aspect-[4/5] bg-gray-200 rounded-2xl shadow-glow overflow-hidden relative border-4 border-white group">
                  <Image 
                    src="/dr-ahmad.webp" 
                    alt="Dr. Muhammad Ahmad" 
                    fill 
                    priority 
                    fetchPriority="high" 
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              </div>

              {/* Bio & Details Area */}
              <div className="lg:col-span-7 p-8 md:p-12 flex flex-col">
                <div className="mb-2 flex items-center gap-2">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wide">FOUNDER</span>
                </div>
                
                <h2 className="font-display text-3xl md:text-4xl font-bold text-dark mb-1">Dr. Muhammad Ahmad</h2>
                <p className="text-primary font-bold text-lg mb-6 flex items-center gap-2">
                  DVM (RVMP) <span className="text-gray-300">|</span> Lead Veterinarian
                </p>

                <p className="text-gray-600 leading-relaxed mb-8 font-sans">
                  Dr. Muhammad Ahmad holds a Doctor of Veterinary Medicine (DVM) degree and is a Registered Veterinary Medical Practitioner (RVMP) under the Pakistan Veterinary Medical Council. With deep expertise in small animal medicine and surgery, he founded Vets On Door to revolutionise veterinary care delivery in Pakistan — bringing clinic-grade treatment directly to pets in the comfort of their homes.
                </p>

                {/* Specialisations */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Stethoscope size={16} className="text-primary" /> Specialisations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["Small Animals", "General Surgery", "Preventive Medicine", "Emergency Care"].map(spec => (
                      <span key={spec} className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Badges */}
                <div className="mb-10 flex flex-wrap gap-3">
                  <span className="bg-success/10 text-success border border-success/20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <ShieldCheck size={14} /> DVM
                  </span>
                  <span className="bg-success/10 text-success border border-success/20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle size={14} /> RVMP Registered
                  </span>
                  <span className="bg-success/10 text-success border border-success/20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <Award size={14} /> Pakistan Veterinary Medical Council
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-auto flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/book-vet-appointment-lahore" 
                    className="bg-primary hover:bg-primary-mid text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-md flex items-center justify-center gap-2 group"
                  >
                    Book with Dr. Ahmad <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a 
                    href={BRAND.whatsapp_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-md flex items-center justify-center gap-2 group"
                  >
                    <WhatsappIcon className="w-5 h-5" /> WhatsApp Direct
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CV Attachment Section */}
          <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden max-w-4xl mx-auto">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-5">
              <GraduationCap size={150} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
              <h3 className="font-display text-2xl font-bold text-dark flex items-center gap-2">
                <Briefcase className="text-primary" /> Credentials & Qualifications
              </h3>
              <a 
                href="/Muhammad-Ahmad-CV.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary-light/50 hover:bg-primary-light text-primary font-bold px-5 py-2.5 rounded-full transition-colors"
              >
                <FileText size={18} /> View Full CV
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Education</p>
                <p className="font-bold text-dark">Riphah International University (DVM)</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Clinical Experience</p>
                <p className="font-bold text-dark">Safari Veterinary Hospital & Second Life Vet Hospital</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Clinical Skills</p>
                <p className="font-bold text-dark">Veterinary Surgery, Diagnostics, IV Therapy, Radiology</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Specialisation</p>
                <p className="font-bold text-dark">Small & Large Animal Medicine, Farm Management</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-primary-light/30 rounded-3xl p-8 md:p-12 text-center border border-primary-light shadow-sm">
            <h2 className="font-display text-3xl font-bold text-dark mb-4">We're Growing</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto font-sans">
              Interested in joining Pakistan's first mobile vet service? We're always looking for passionate veterinary professionals to join our mission.
            </p>
            <a 
              href="mailto:contact@vetsondoor.com" 
              className="inline-block bg-white hover:bg-gray-50 border-2 border-primary text-primary px-8 py-4 rounded-full font-bold transition-all shadow-sm hover:shadow-md"
            >
              Email us at contact@vetsondoor.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
