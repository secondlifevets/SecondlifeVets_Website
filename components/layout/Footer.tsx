import Link from "next/link";
import Image from "next/image";
import { PawPrint, MapPin, Phone, Mail, Clock, Star } from "lucide-react";
import { lahoreLocations } from "@/lib/lahore-locations";

// Simple SVGs for icons since some lucide versions lack them natively
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      {/* Emergency Strip */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-primary rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
            <PawPrint size={200} />
          </div>
          
          <div className="relative z-10 text-center md:text-left">
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">Pet Emergency?</h3>
            <p className="text-primary-light text-lg">Our mobile vet unit is ready to assist you 24/7.</p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4">
            <Link 
              href="https://wa.me/923078517122"
              className="bg-emergency hover:bg-red-600 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              Call 0307-8517122
            </Link>
            <Link 
              href="/book-vet-appointment-lahore"
              className="bg-white hover:bg-gray-50 text-primary px-8 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-center"
            >
              Book Regular Visit
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1: About */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group inline-flex">
              <div className="relative w-10 h-10 bg-white p-1 rounded-xl">
                <Image src="/logo.png" alt="Vets On Door Logo" fill className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-2xl text-white leading-tight">
                  Vets On Door
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Lahore's first premium mobile veterinary service. Bringing professional, medical-grade pet care directly to your doorstep with compassion and expertise.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://www.instagram.com/vetsondoor" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-primary p-2 rounded-full transition-colors text-white flex items-center justify-center w-10 h-10">
                <InstagramIcon className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://www.tiktok.com/@vetsondoor" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-primary p-2 rounded-full transition-colors text-white flex items-center justify-center w-10 h-10">
                <TikTokIcon className="w-5 h-5" />
                <span className="sr-only">TikTok</span>
              </a>
              <a href="https://www.linkedin.com/company/vetsondoors/" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-primary p-2 rounded-full transition-colors text-white flex items-center justify-center w-10 h-10">
                <LinkedinIcon className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
            
            <div className="pt-4">
              <a 
                href="https://maps.app.goo.gl/B3MtDNy6kVCMpx8T8?g_st=iw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 px-5 rounded-full transition-all border border-white/10 hover:border-white/20 w-full sm:w-auto justify-center group"
              >
                <Star size={16} className="text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
                Review us on Google Maps
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white flex items-center gap-2">
              <span className="w-4 h-[2px] bg-primary rounded-full"></span>
              Our Services
            </h4>
            <ul className="space-y-3">
              {[
                "Routine Health Checks",
                "Vaccinations",
                "Microchipping",
                "Dental Care",
                "Minor Surgeries",
                "Palliative Care"
              ].map((service) => (
                <li key={service}>
                  <Link href="/services" className="text-gray-400 hover:text-primary-light transition-colors text-sm flex items-center gap-2">
                    <span className="text-primary text-xs">▹</span> {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white flex items-center gap-2">
              <span className="w-4 h-[2px] bg-primary rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "/about" },
                { name: "Our Team", href: "/veterinarian-lahore" },
                { name: "Book Appointment", href: "/book-vet-appointment-lahore" },
                { name: "FAQs", href: "/vet-faqs-lahore" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Cancellation Policy", href: "/refunds" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-primary-light transition-colors text-sm flex items-center gap-2">
                    <span className="text-primary text-xs">▹</span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white flex items-center gap-2">
              <span className="w-4 h-[2px] bg-primary rounded-full"></span>
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <Phone className="text-primary shrink-0 mt-0.5" size={18} />
                <div>
                  <a href="https://wa.me/923078517122" target="_blank" rel="noopener noreferrer" className="hover:text-primary-light transition-colors block mb-1">
                    0307-8517122
                  </a>
                  <span className="text-xs text-gray-500">Available 24/7 for Emergencies</span>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <Mail className="text-primary shrink-0 mt-0.5" size={18} />
                <a href="mailto:contact@vetsondoor.com" className="hover:text-primary-light transition-colors break-all">
                  contact@vetsondoor.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="text-primary shrink-0 mt-0.5" size={18} />
                <span>Mobile Service covering all major areas in Lahore</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <Clock className="text-primary shrink-0 mt-0.5" size={18} />
                <span>Mon - Sun: 9:00 AM - 10:00 PM<br/>(Emergency: 24/7)</span>
              </li>
            </ul>
          </div>
        </div>


        {/* Service Areas (SEO Internal Linking) */}
        <div className="pt-8 border-t border-white/10 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <span className="w-4 h-[2px] bg-primary rounded-full"></span>
              Service Areas in Lahore
            </h4>
            <Link href="/locations" className="text-primary text-sm font-semibold hover:text-primary-light transition-colors">
              View All →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {lahoreLocations.map((loc) => (
              <Link
                key={loc.id}
                href={`/locations/${loc.id}`}
                className="text-xs text-gray-500 hover:text-primary transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full"
              >
                {loc.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Legal */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Vets On Door. All rights reserved.
          </p>
          <div className="text-gray-500 text-sm flex flex-col sm:flex-row items-center gap-1 sm:gap-4 text-center">
            <span>Made with <span className="text-emergency">♥</span> for pets in Lahore</span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span itemScope itemType="https://schema.org/Person">
              Developed by{" "}
              <a
                href="https://sobanrafique.com"
                target="_blank"
                rel="noopener noreferrer author"
                className="text-primary hover:text-white transition-colors font-medium"
                itemProp="url"
              >
                <span itemProp="name">Soban Rafique</span>
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
