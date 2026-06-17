import { BRAND } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Vets On Door",
  description: "Privacy Policy for Vets On Door. Learn how we handle and protect your personal information and pet data.",
  keywords: ["privacy policy", "data protection", "vetson door privacy", "pet data privacy", "veterinary privacy policy"],
  alternates: {
    canonical: "https://vetsondoor.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Vets On Door",
    description: "Learn how Vets On Door protects your personal information and pet data.",
    url: "https://vetsondoor.com/privacy",
    type: "website",
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container-custom max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-dark font-medium" aria-current="page">Privacy Policy</span>
        </nav>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h1 className="font-display text-4xl font-bold text-dark mb-4">Privacy Policy</h1>
          <p className="text-gray-500 mb-10 pb-6 border-b border-gray-100">
            At VetsonDoor, we value your trust and are committed to protecting your personal information. Your privacy is important to us, and we handle your data responsibly and securely.
          </p>
          
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                Information We Collect
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                When you use our website or mobile app, we may collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed marker:text-primary">
                <li>Your name and contact information (phone number and email address).</li>
                <li>Your address for doorstep veterinary services.</li>
                <li>Your pet or animal’s information, including species, age, medical history, and service requirements.</li>
                <li>Appointment and payment-related information, where applicable.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We use your information only to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed marker:text-primary">
                <li>Schedule and manage appointments.</li>
                <li>Provide veterinary consultations and doorstep services.</li>
                <li>Communicate with you regarding bookings, updates, and customer support.</li>
                <li>Improve the quality and efficiency of our services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
                Data Protection
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We take appropriate security measures to protect your personal information from unauthorized access, misuse, or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">4</span>
                No Sale of Personal Data
              </h2>
              <p className="text-gray-600 leading-relaxed">
                VetsonDoor does not sell, rent, or trade your personal information to third parties. Your data is used solely for providing and improving our veterinary services and fulfilling your requests.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">5</span>
                Your Rights
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You may request to access, update, or delete your personal information at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">6</span>
                Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or wish to request deletion of your data, please contact us at:
              </p>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-dark font-bold">Email: <a href="mailto:contact@vetsondoor.com" className="text-primary hover:underline">contact@vetsondoor.com</a></p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">
              By using the VetsonDoor website or mobile app, you agree to the terms of this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
