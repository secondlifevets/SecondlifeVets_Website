import { BRAND } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Vets On Door",
  description: "Terms of Service for Vets On Door. Read the terms and conditions for our mobile veterinary services in Lahore.",
  keywords: ["terms of service", "terms and conditions", "vetson door terms", "veterinary terms"],
  alternates: {
    canonical: "https://vetsondoor.com/terms",
  },
  openGraph: {
    title: "Terms of Service | Vets On Door",
    description: "Terms of Service for Vets On Door mobile veterinary services.",
    url: "https://vetsondoor.com/terms",
    type: "website",
  },
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container-custom max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-dark font-medium" aria-current="page">Terms of Service</span>
        </nav>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h1 className="font-display text-4xl font-bold text-dark mb-4">Terms of Service</h1>
          <p className="text-gray-500 mb-10 pb-6 border-b border-gray-100 leading-relaxed">
            Welcome to VetsonDoor, a veterinary doorstep service operating in Lahore, Pakistan. By accessing or using our website or mobile application, you agree to comply with and be bound by the following Terms of Service.
          </p>
          
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                Services
              </h2>
              <p className="text-gray-600 leading-relaxed">
                VetsonDoor provides veterinary consultation, treatment, vaccination, and related services at your doorstep. All services are delivered by qualified veterinary professionals based on appointments booked through our website or mobile application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                Appointments and Bookings
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed marker:text-primary">
                <li>Users can book appointments online through our website or app.</li>
                <li>Appointment confirmation is subject to availability.</li>
                <li>We reserve the right to reschedule or cancel appointments due to unforeseen circumstances, emergencies, or operational reasons.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
                User Responsibilities
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed marker:text-primary">
                <li>You agree to provide accurate and complete information about yourself, your pets, and your location.</li>
                <li>You must ensure safe access for our veterinary team at the time of service.</li>
                <li>You are responsible for following any post-treatment instructions provided by our veterinarians.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">4</span>
                Payments
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed marker:text-primary">
                <li>Service charges will be communicated before or during booking.</li>
                <li>Payment methods and terms may vary depending on service type.</li>
                <li>All payments must be completed as per the agreed terms at the time of service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">5</span>
                Limitation of Liability
              </h2>
              <p className="text-gray-600 leading-relaxed">
                VetsonDoor strives to provide high-quality veterinary care. However, we are not liable for any indirect, incidental, or unforeseen outcomes that may arise despite proper treatment and care.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">6</span>
                Cancellation Policy
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed marker:text-primary">
                <li>Users may cancel or reschedule appointments within the allowed time frame.</li>
                <li>Late cancellations may be subject to charges depending on service type and scheduling.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">7</span>
                Privacy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Your personal and pet-related data is handled according to our Privacy Policy. We do not sell or share your data with third parties without consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">8</span>
                Service Area
              </h2>
              <p className="text-gray-600 leading-relaxed">
                VetsonDoor currently operates in Lahore and surrounding areas. Service availability may vary depending on location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">9</span>
                Changes to Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to update or modify these Terms of Service at any time. Continued use of our services implies acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">10</span>
                Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                For any questions or support, please contact:
              </p>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-dark font-bold">Email: <a href="mailto:contact@vetsondoor.com" className="text-primary hover:underline">contact@vetsondoor.com</a></p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
              By using VetsonDoor services, you agree to these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
