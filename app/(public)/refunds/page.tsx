import { BRAND } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | " + BRAND.name,
  description: "Cancellation & Refund Policy for Vets On Door. Learn about our policies regarding appointment cancellations and service refunds.",
  keywords: ["refund policy", "cancellation policy", "vet appointment cancellation", "vets on door refunds"],
  alternates: {
    canonical: "https://vetsondoor.com/refunds",
  },
  openGraph: {
    title: "Cancellation & Refund Policy | Vets On Door",
    description: "Read our policies on appointment cancellations and service refunds.",
    url: "https://vetsondoor.com/refunds",
    type: "website",
  },
};

export default function RefundsPolicy() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-dark font-medium" aria-current="page">Cancellation & Refund Policy</span>
        </nav>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-card border border-gray-100">
          <h1 className="font-display text-4xl font-bold text-dark mb-8">Cancellation & Refund Policy</h1>
          
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p className="mb-6"><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
            
            <p className="mb-6">
              At {BRAND.name}, we strive to provide the best possible mobile veterinary care. Because our vets travel to your location, our schedule is carefully managed. Please review our policy regarding cancellations and refunds.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">1. Appointment Cancellations</h2>
            <p className="mb-4">
              We understand that plans change and emergencies happen. If you need to cancel or reschedule your appointment, we require a minimum of <strong>1 day (24 hours)</strong> notice.
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Cancellations with 1 day or more notice:</strong> Can be made without any penalty or fee.</li>
              <li><strong>Late Cancellations (less than 1 day notice):</strong> May be subject to a late cancellation fee equal to the base consultation charge. This covers the time and travel reserved for your appointment that could have been offered to another pet in need.</li>
            </ul>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">2. "No Show" Policy</h2>
            <p className="mb-6">
              If our veterinarian arrives at the designated location at the scheduled time and you or the pet are not available, this is considered a "No Show". A call-out fee will be invoiced to you to cover travel expenses and time.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">3. Refunds for Services</h2>
            <p className="mb-6">
              Due to the nature of medical services, medications, and diagnostics, <strong>we do not offer refunds</strong> for services rendered or dispensed medications. If you have concerns about the quality of care your pet received, please contact our management team within 48 hours of the visit so we can review your case and find a resolution.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">4. Emergencies</h2>
            <p className="mb-6">
              We waive cancellation fees if the cancellation is due to a severe, unforeseen emergency (e.g., your pet had to be rushed to an emergency hospital before we could arrive). Please communicate with us as soon as possible.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">5. Contact Us</h2>
            <p className="mb-6">
              To cancel or reschedule an appointment, please contact us immediately via WhatsApp or Phone at <strong>{BRAND.phone}</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
