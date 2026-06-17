import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import Link from "next/link";
import { Heart, Users, Home, Stethoscope, ShieldCheck, PawPrint } from "lucide-react";

export const metadata: Metadata = {
  title: "About Vets On Door | Pakistan's First Mobile Vet Service in Lahore",
  description:
    "Vets On Door is Lahore's premier mobile veterinary service. Dr. Muhammad Ahmad DVM (RVMP) delivers professional animal healthcare to your doorstep across all major Lahore areas — stress-free pet care at home.",
  keywords: [
    "about Vets On Door",
    "mobile vet Lahore",
    "home vet service Lahore",
    "Pakistan mobile veterinary",
    "Dr Muhammad Ahmad vet Lahore",
    "RVMP vet Pakistan",
  ],
  alternates: {
    canonical: "https://vetsondoor.com/about",
  },
  openGraph: {
    title: "About Vets On Door | Pakistan's #1 Mobile Vet Service in Lahore",
    description: "Lahore's first premium mobile veterinary service — professional pet care at your doorstep.",
    url: "https://vetsondoor.com/about",
    siteName: "Vets On Door",
    type: "website",
  },
};

export default function AboutPage() {
  const values = [
    {
      title: "Compassion",
      desc: "We treat every pet and animal with love, kindness, and respect.",
      icon: <Heart size={28} className="text-white" />,
      color: "bg-rose-500"
    },
    {
      title: "Customer Care",
      desc: "We are dedicated to providing a convenient, reliable, and satisfying experience for every client in Lahore.",
      icon: <Users size={28} className="text-white" />,
      color: "bg-blue-500"
    },
    {
      title: "Stress-Free Service",
      desc: "We believe animals deserve quality veterinary care in the comfort of their own environment, reducing stress and minimizing exposure to diseases.",
      icon: <Home size={28} className="text-white" />,
      color: "bg-amber-500"
    },
    {
      title: "Professional Excellence",
      desc: "Our team is committed to delivering ethical, high-quality, and evidence-based veterinary services.",
      icon: <Stethoscope size={28} className="text-white" />,
      color: "bg-teal-500"
    },
    {
      title: "Trust & Transparency",
      desc: "We build lasting relationships through honesty, clear communication, and dependable care.",
      icon: <ShieldCheck size={28} className="text-white" />,
      color: "bg-indigo-500"
    },
    {
      title: "Animal Welfare",
      desc: "The health, safety, and well-being of every animal are at the heart of our mission.",
      icon: <PawPrint size={28} className="text-white" />,
      color: "bg-primary"
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://vetsondoor.com/#organization",
        name: "Vets On Door",
        url: "https://vetsondoor.com",
        logo: "https://vetsondoor.com/logo.png",
        description: "Pakistan's first mobile veterinary service. Dr. Muhammad Ahmad DVM (RVMP) delivers clinic-grade pet care to your home across all Lahore areas.",
        foundingDate: "2023",
        slogan: "Professional Vet Care, At Your Doorstep",
        founder: {
          "@type": "Person",
          "@id": "https://vetsondoor.com/#doctor",
          name: "Dr. Muhammad Ahmad",
          jobTitle: "Founder & Lead Veterinarian",
          alumniOf: "Riphah International University",
        },
        knowsAbout: [
          "Veterinary Medicine",
          "Mobile Veterinary Services",
          "Pet Vaccination",
          "Pet Healthcare in Pakistan",
          "Emergency Animal Care",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lahore",
          addressRegion: "Punjab",
          addressCountry: "PK",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+923078517122",
          contactType: "customer service",
          availableLanguage: ["en", "ur"],
          areaServed: "PK",
        },
        sameAs: [
          "https://www.instagram.com/vetsondoor",
          "https://www.tiktok.com/@vetsondoor",
          "https://www.linkedin.com/company/vetsondoors/",
        ],
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
            "name": "About Us",
            "item": "https://vetsondoor.com/about"
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
      {/* Hero */}
      <section className="bg-primary/5 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 rounded-l-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-primary/10 rounded-r-full blur-[100px] pointer-events-none" />
        
        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-gray-500 max-w-4xl mx-auto">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-dark font-medium">About</span>
          </nav>
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-widest mb-6">About Us</span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-dark mb-8 leading-tight">
              Professional Veterinary Care, <br/><span className="text-primary">Delivered to Your Doorstep in Lahore.</span>
            </h1>
            
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-left space-y-6 text-gray-600 text-lg leading-relaxed relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-primary rounded-b-full"></div>
              <p>
                VetsonDoor is Pakistan’s first mobile veterinary team, dedicated to bringing professional animal healthcare directly to your doorstep. We believe that pets and livestock deserve quality medical care without the stress and risk of unnecessary travel.
              </p>
              <p>
                Our experienced veterinarians provide a wide range of services, including health checkups, vaccinations, treatment, emergency care, and consultations—all in the comfort of your home or farm.
              </p>
              <p>
                Booking an appointment is quick and convenient through the VetsonDoor website or the VetsonDoor mobile app, allowing you to access trusted veterinary care whenever you need it.
              </p>
              <p className="font-bold text-dark text-xl pt-2">
                At VetsonDoor, our mission is to make veterinary services more accessible, convenient, and stress-free while ensuring the health and well-being of every animal we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Journey */}
      <section className="py-24">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="flex flex-col gap-12">
            
            {/* Vision Card */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary group-hover:w-3 transition-all"></div>
              <div className="pl-6">
                <span className="text-primary font-bold text-sm uppercase tracking-widest flex items-center gap-2 mb-2">
                  <div className="w-8 h-px bg-primary"></div>
                  Our Vision
                </span>
                <h2 className="font-display text-3xl font-bold text-dark mb-6">
                  Redefining Accessible Pet Care
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                  <p>
                    Our vision is to provide stress-free, high-quality veterinary services at your doorstep, eliminating the need for animals to travel to clinics where they may be exposed to infectious diseases. 
                  </p>
                  <p>
                    We are committed to making professional veterinary care convenient, safe, and accessible for every pet and livestock owner in Lahore, ensuring better health and welfare for all animals.
                  </p>
                </div>
              </div>
            </div>

            {/* Journey Card */}
            <div className="bg-dark rounded-3xl p-8 md:p-12 shadow-md relative overflow-hidden group text-white">
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-primary group-hover:w-3 transition-all"></div>
              <div className="pr-6">
                <span className="text-primary-light font-bold text-sm uppercase tracking-widest flex items-center gap-2 mb-2">
                  Our Journey
                  <div className="w-8 h-px bg-primary-light"></div>
                </span>
                <h2 className="font-display text-3xl font-bold text-white mb-6">
                  From a Simple Vision to Reality
                </h2>
                <div className="space-y-5 text-gray-300 leading-relaxed">
                  <p>
                    VetsonDoor was founded in Lahore in 2026 with a simple yet powerful vision: to make professional veterinary care more accessible, convenient, and stress-free for animals and their owners. We recognized that transporting pets and livestock to clinics can cause anxiety and increase their exposure to infectious diseases.
                  </p>
                  <p>
                    With this mission, we introduced a doorstep veterinary service where qualified professionals visit animals in the comfort of their homes or farms. By combining modern technology with compassionate care, we made it easy for clients to book appointments through the VetsonDoor website and mobile app.
                  </p>
                  <p>
                    From our beginnings in Lahore, our journey has been driven by a commitment to animal welfare, customer satisfaction, and innovation. Every home visit reflects our dedication to providing trusted, high-quality veterinary care while reducing stress for both animals and their owners.
                  </p>
                  <p className="font-bold text-white text-xl pt-2">
                    As we continue to grow, our goal is to become Pakistan’s leading mobile veterinary service, bringing expert care to every doorstep.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-widest mb-4">Our Values</span>
            <h2 className="font-display text-4xl font-bold text-dark mb-4">Guiding Everything We Do</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">At VetsonDoor, our core values are the foundation of our exceptional veterinary service.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className={`w-16 h-16 rounded-2xl ${v.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                  {v.icon}
                </div>
                <h3 className="font-display font-bold text-2xl text-dark mb-3">{v.title}</h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Terms Links */}
      <section className="py-20">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl font-bold text-dark mb-8">Legal Information</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/privacy" className="bg-white border-2 border-gray-200 text-dark hover:border-primary hover:text-primary font-bold py-4 px-8 rounded-2xl transition-all shadow-sm">
              Read Privacy Policy
            </Link>
            <Link href="/terms" className="bg-white border-2 border-gray-200 text-dark hover:border-primary hover:text-primary font-bold py-4 px-8 rounded-2xl transition-all shadow-sm">
              Read Terms of Service
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
