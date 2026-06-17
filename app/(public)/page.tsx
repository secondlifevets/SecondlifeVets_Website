import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import WhatsappIcon from "@/components/ui/WhatsappIcon";
import { BRAND } from "@/lib/constants";
import { 
  Stethoscope, 
  Syringe, 
  Bug, 
  Scissors, 
  Activity, 
  AlertTriangle, 
  Bone, 
  Microscope,
  CheckCircle,
  Truck,
  Award,
  Clock,
  ArrowRight,
  UserRound,
  MapPin,
  Star,
  Shield
} from "lucide-react";
import PassportSearchBar from "@/components/ui/PassportSearchBar";
import GoogleReviews from "@/components/ui/GoogleReviews";

export const metadata: Metadata = {
  title: "Vets On Door | #1 Home Vet Service in Lahore",
  description: "Professional Vet Care, At Your Doorstep in Lahore. Dr. Muhammad Ahmad DVM (RVMP) provides mobile veterinary care across DHA, Bahria Town, Gulberg, Johar Town & all Lahore areas. Book online 24/7.",
  alternates: {
    canonical: "https://vetsondoor.com",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative w-full bg-hero-gradient overflow-hidden pt-4 pb-20 lg:pt-8 lg:pb-24">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
        
        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-primary-light/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-primary-mid/20 blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left side: Text Content */}
            <div className="flex flex-col gap-6 animate-slide-in-right mt-8 lg:mt-0">
              {/* Passport Quick Access Search Bar */}
              <div className="w-full mb-2">
                <p className="text-white/90 text-sm font-bold mb-2">Already a patient? Access your Digital Pet Passport:</p>
                <PassportSearchBar />
              </div>

              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-primary px-4 py-2 rounded-full w-fit shadow-sm border border-white/20">
                <CheckCircle size={16} className="text-success" />
                <span className="text-sm font-semibold tracking-wide">RVMP Registered Veterinarian</span>
              </div>
              
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1]">
                Professional Vet Care, <br />
                <span className="text-primary-light relative inline-block">
                  At Your Doorstep
                  <div className="absolute bottom-2 left-0 w-full h-3 bg-primary-mid/40 -z-10 rounded-full"></div>
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl font-sans">
                Skip the stressful clinic travel. Dr. Muhammad Ahmad brings Lahore's trusted veterinary expertise directly to your home. Available exclusively in Lahore.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link 
                  href="/book-vet-appointment-lahore" 
                  className="bg-white text-primary hover:bg-primary-light px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
                >
                  Book Home Visit <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href={`tel:${BRAND.phone}`} 
                  className="bg-emergency hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl shadow-emergency/30 hover:-translate-y-1 flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  🚨 Emergency? Call Now
                </a>
              </div>

              <div className="flex flex-wrap gap-4 sm:gap-6 mt-6 pt-6 border-t border-white/20">
                {["24/7 Available", "RVMP Certified", "Fully Equipped Mobile Unit", "All Pets Welcome"].map((trust) => (
                  <div key={trust} className="flex items-center gap-2 text-white/90 text-sm font-medium">
                    <CheckCircle size={16} className="text-success bg-white rounded-full" />
                    <span>{trust}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Doctor Card */}
            <div className="lg:justify-self-end animate-slide-up w-full max-w-md mx-auto lg:mx-0">
              <div className="bg-white rounded-3xl p-6 shadow-2xl border border-white/50 backdrop-blur-xl relative transform transition-transform hover:scale-[1.02] duration-300">
                <div className="absolute -top-6 -right-6 bg-warning text-white font-bold py-2 px-4 rounded-full shadow-lg transform rotate-12 z-20 text-sm">
                  Top Rated ⭐
                </div>
                
                {/* Photo */}
                <div className="w-full h-64 bg-gray-100 rounded-2xl mb-6 relative overflow-hidden border-2 border-primary-light">
                  <Image src="/dr-ahmad.webp" alt="Dr. Muhammad Ahmad" fill priority className="object-cover object-top" />
                </div>
                
                <div className="text-center">
                  <h3 className="font-display text-2xl font-bold text-dark mb-1">Dr. Muhammad Ahmad</h3>
                  <p className="text-primary font-bold font-sans">DVM (RVMP)</p>
                  <p className="text-gray-500 text-sm mb-4">Lead Veterinarian & Founder</p>
                  
                  <div className="flex justify-center gap-2 mb-6">
                    <span className="bg-primary-light text-primary text-xs font-bold px-3 py-1 rounded-full">RVMP Registered</span>
                    <span className="bg-primary-light text-primary text-xs font-bold px-3 py-1 rounded-full">DVM Certified</span>
                  </div>
                  
                  <a 
                    href={BRAND.whatsapp_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <WhatsappIcon className="w-5 h-5" /> Consult on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 Quick Facts for GEO (AI Engine Optimization) */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="font-display text-4xl font-bold text-primary mb-2">24/7</span>
              <span className="text-gray-600 font-sans text-sm font-medium">Emergency Vet Response</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display text-4xl font-bold text-primary mb-2">100%</span>
              <span className="text-gray-600 font-sans text-sm font-medium">Lahore Area Coverage</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display text-4xl font-bold text-primary mb-2">RVMP</span>
              <span className="text-gray-600 font-sans text-sm font-medium">Certified Practitioner</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display text-4xl font-bold text-primary mb-2">Mobile</span>
              <span className="text-gray-600 font-sans text-sm font-medium">Fully Equipped Unit</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Services Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl font-bold text-dark mb-4">Our Veterinary Services</h2>
            <p className="text-lg text-gray-600 font-sans">Comprehensive home vet care for all your pets, delivered with compassion and professional expertise.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Stethoscope, name: "General Checkup", desc: "Routine wellness exams to keep your pet healthy." },
              { icon: Syringe, name: "Vaccination", desc: "Essential immunizations in the comfort of home." },
              { icon: Bug, name: "Deworming", desc: "Safe and effective parasite control treatments." },
              { icon: Scissors, name: "Surgical Consultation", desc: "Pre and post-operative care and minor procedures." },
              { icon: Activity, name: "Dental Cleaning", desc: "Professional oral care for healthy teeth and gums." },
              { icon: AlertTriangle, name: "Emergency Care", desc: "Rapid response for urgent medical situations." },
              { icon: Bone, name: "Pet Nutrition", desc: "Dietary planning for optimal pet health." },
              { icon: Microscope, name: "Diagnostic & Lab Tests", desc: "On-the-spot sample collection and testing." },
              { icon: Shield, name: "Tick & Flea Treatments", desc: "Complete eradication and prevention of external parasites." },
            ].map((service, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-card-hover hover:border-primary-light transition-all duration-300 group">
                <div className="w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  <service.icon size={28} className="text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-display font-bold text-xl text-dark mb-2">{service.name}</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2">{service.desc}</p>
                <Link href={`/book?service=${encodeURIComponent(service.name)}`} className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Book This Service <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl font-bold text-dark mb-4">Why Pet Parents Trust Vets On Door</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Truck, 
                title: "Fully Equipped Mobile Unit", 
                desc: "We bring the clinic to you. Our vehicles carry advanced diagnostic tools, emergency surgical setups, and a full medicine inventory."
              },
              { 
                icon: Award, 
                title: "RVMP Certified Expert", 
                desc: "Dr. Muhammad Ahmad, DVM, is fully registered with the Pakistan Veterinary Medical Council, guaranteeing standard-compliant medical care."
              },
              { 
                icon: Clock, 
                title: "24/7 Emergency Response", 
                desc: "Medical emergencies don't wait for office hours. We provide rapid dispatch for critical cases, ensuring care is there when you need it most."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-background rounded-3xl p-8 text-center hover:-translate-y-2 transition-transform duration-300 border border-transparent hover:border-primary/20 shadow-sm hover:shadow-xl">
                <div className="w-20 h-20 bg-white shadow-md rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon size={40} className="text-primary" />
                </div>
                <h3 className="font-display font-bold text-2xl text-dark mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-sans">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="py-24 bg-primary-light/50 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl font-bold text-dark mb-4">Book in 3 Simple Steps</h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-primary-light via-primary to-primary-light z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {[
                { step: "1", title: "Fill Booking Form", desc: "Provide your pet's details, your address, and select a preferred time slot." },
                { step: "2", title: "Confirm Appointment", desc: "Our team will confirm your appointment via WhatsApp instantly." },
                { step: "3", title: "Doctor Arrives", desc: "Dr. Ahmad arrives at your door fully equipped to treat your pet." }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-glow mb-6 border-4 border-primary">
                    <span className="font-display text-4xl font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-dark mb-3">{item.title}</h3>
                  <p className="text-gray-600 font-sans">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Meet The Doctor Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="bg-dark rounded-[2.5rem] p-8 md:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden">
            {/* Decorative background paw */}
            <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-1/4 translate-y-1/4 pointer-events-none">
              <Stethoscope size={400} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              {/* Photo */}
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/5] bg-gray-200 rounded-3xl overflow-hidden border-4 border-primary/30 relative shadow-glow">
                  <Image src="/dr-ahmad.webp" alt="Dr. Muhammad Ahmad" fill className="object-cover object-top" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-primary text-white p-4 rounded-2xl shadow-xl">
                  <div className="font-display font-bold text-3xl">5+</div>
                  <div className="text-sm font-sans">Years Experience</div>
                </div>
              </div>

              {/* Bio */}
              <div className="lg:col-span-7">
                <h2 className="font-display text-4xl font-bold mb-2 text-white">Meet Your Veterinarian</h2>
                <div className="w-20 h-1 bg-primary rounded-full mb-8"></div>
                
                <h3 className="font-display text-3xl font-bold text-primary-light mb-1">Dr. Muhammad Ahmad</h3>
                <p className="text-lg font-medium text-gray-300 mb-6">DVM (RVMP) — Doctor of Veterinary Medicine, Registered Veterinary Medical Practitioner</p>
                
                <p className="text-gray-300 leading-relaxed mb-8 text-lg font-sans">
                  "With a Doctor of Veterinary Medicine degree and full RVMP registration, Dr. Ahmad brings clinic-grade expertise to your home. Specialising in small animals, he founded Vets On Door to eliminate the stress of clinic visits for pets and their owners."
                </p>

                <div className="flex flex-wrap gap-3 mb-10">
                  <span className="bg-white/10 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/10">DVM</span>
                  <span className="bg-white/10 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/10">RVMP Registered</span>
                  <span className="bg-white/10 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/10">Small Animals Specialist</span>
                </div>

                <a 
                  href={BRAND.whatsapp_url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg inline-flex items-center gap-2 group w-fit"
                >
                  <WhatsappIcon className="w-5 h-5" /> WhatsApp Consultation <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Gallery Section */}
      <section className="py-24 bg-primary-light/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl font-bold text-dark mb-4">Our Work in Action</h2>
            <p className="text-lg text-gray-600 font-sans">See Dr. Ahmad delivering compassionate, professional vet care directly to pets in their local communities.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { src: "/gallery-1.webp", alt: "Dr. Muhammad Ahmad performing a home vet checkup on a dog in Lahore" },
              { src: "/gallery-2.webp", alt: "Mobile vet administering vaccination to a cat at home in DHA Lahore" },
              { src: "/gallery-3.webp", alt: "Veterinarian examining a pet rabbit during a home visit in Gulberg Lahore" },
              { src: "/gallery-4.webp", alt: "Dr. Ahmad providing emergency veterinary care to a dog at a Lahore residence" },
            ].map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                <Image 
                  src={img.src} 
                  alt={img.alt} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 7. Google Reviews Section */}
      <section className="bg-white border-t border-gray-100">
        <GoogleReviews />
      </section>

      {/* 8. Emergency CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-dark/10 blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="font-display text-5xl font-bold text-white mb-6">Pet Emergency?</h2>
          <p className="text-xl text-primary-light mb-10 max-w-2xl mx-auto font-sans">
            Don't wait. Our team is available 24/7 for critical cases. We respond rapidly with life-saving equipment.
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <a 
              href={`tel:${BRAND.phone}`} 
              className="bg-emergency hover:bg-red-600 text-white px-10 py-5 rounded-full font-bold text-2xl transition-all shadow-xl hover:shadow-2xl shadow-emergency/40 hover:-translate-y-2 flex items-center justify-center gap-3 relative"
            >
              <span className="relative flex h-4 w-4 pointer-events-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
              </span>
              Call 0307-8517122
            </a>
            
            <a href="mailto:contact@vetsondoor.com" className="text-primary-light hover:text-white transition-colors mt-4 border-b border-primary-light/30 hover:border-white pb-1">
              or email contact@vetsondoor.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
