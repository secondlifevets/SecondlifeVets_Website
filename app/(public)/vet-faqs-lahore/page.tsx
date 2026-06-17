import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQs About Home Vet Service in Lahore | Vets On Door",
  description:
    "Answers to the most common questions about Vets On Door's mobile veterinary service in Lahore — pricing, areas covered, pet types, emergency care, booking, and more.",
  keywords: [
    "vet FAQ Lahore",
    "home vet questions Pakistan",
    "mobile vet cost Lahore",
    "vet at home Lahore price",
    "pet doctor FAQ Lahore",
    "how to book vet at home Lahore",
  ],
  alternates: {
    canonical: "https://vetsondoor.com/vet-faqs-lahore",
  },
  openGraph: {
    title: "FAQs | Vets On Door — Home Vet Service in Lahore",
    description: "Common questions answered about our mobile vet service across all Lahore areas.",
    url: "https://vetsondoor.com/vet-faqs-lahore",
    siteName: "Vets On Door",
    type: "website",
  },
};

const faqs = [
  {
    category: "About the Service",
    items: [
      {
        question: "What is Vets On Door?",
        answer:
          "Vets On Door is Lahore's first fully equipped mobile veterinary service. Dr. Muhammad Ahmad DVM (RVMP) travels directly to your home to provide premium veterinary care, eliminating the stress of clinic visits for your pets.",
      },
      {
        question: "Which areas of Lahore do you serve?",
        answer:
          "We serve all major areas of Lahore including DHA Lahore, Bahria Town, Gulberg, Johar Town, Model Town, Wapda Town, Lahore Cantt, Askari, Lake City, Valencia Town, Township, Garden Town, Cavalry Ground, Paragon City, EME Society, Canal View, Sabzazar, Samanabad, Shadman, Faisal Town, and Allama Iqbal Town. See our full coverage map at /locations.",
      },
      {
        question: "What pets do you treat?",
        answer:
          "We treat dogs, cats, rabbits, guinea pigs, hamsters, birds, turtles, and most other domestic pets. Dr. Ahmad has specialist experience in small animal medicine and surgery.",
      },
      {
        question: "Is this a real licensed veterinary service?",
        answer:
          "Yes. Dr. Muhammad Ahmad holds a Doctor of Veterinary Medicine (DVM) degree from Riphah International University and is a Registered Veterinary Medical Practitioner (RVMP) under the Pakistan Veterinary Medical Council. He is fully licensed to practice in Pakistan.",
      },
    ],
  },
  {
    category: "Booking & Pricing",
    items: [
      {
        question: "How much does a home vet visit cost in Lahore?",
        answer:
          "Our prices vary by service: General checkup starts from PKR 1,500. Vaccination from PKR 800. Deworming from PKR 600. Emergency care from PKR 3,500. Dental cleaning from PKR 3,000. Diagnostic tests from PKR 2,500. Exact pricing depends on your pet's condition and what's required. Contact us for a quote.",
      },
      {
        question: "How do I book a vet visit at home in Lahore?",
        answer:
          "Simply go to vetsondoor.com/book, fill in your pet's details, your address in Lahore, and select your preferred time slot. Our team will confirm via WhatsApp within minutes. You can also WhatsApp us directly at 0307-8517122.",
      },
      {
        question: "How far in advance do I need to book?",
        answer:
          "For regular appointments, we recommend booking at least 24 hours in advance as slots fill up quickly. For emergencies, call 0307-8517122 immediately — we dispatch as fast as possible regardless of prior booking.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept cash on delivery and bank transfers. Payment is collected after the visit is completed. We do not currently accept credit card payments at the doorstep.",
      },
    ],
  },
  {
    category: "Emergency Care",
    items: [
      {
        question: "Do you offer emergency vet care at home in Lahore?",
        answer:
          "Yes. We provide 24/7 emergency veterinary care at your doorstep across all of Lahore. Call 0307-8517122 immediately — our team will assess the situation and dispatch Dr. Ahmad as quickly as possible.",
      },
      {
        question: "What emergencies can you handle at home?",
        answer:
          "We handle: difficulty breathing, collapse, seizures, severe bleeding, suspected poisoning, fractures, extreme lethargy, persistent vomiting, eye injuries, and inability to walk. We carry IV fluids, oxygen, emergency medications, and diagnostic tools.",
      },
      {
        question: "How quickly can you reach my home in Lahore for an emergency?",
        answer:
          "Response time depends on location and traffic conditions, but we dispatch immediately. For the fastest response, call us directly — do not wait to book online during an emergency.",
      },
    ],
  },
  {
    category: "Services",
    items: [
      {
        question: "Do you offer cat vaccination at home in DHA Lahore?",
        answer:
          "Yes! We offer cat vaccinations at home across all Lahore areas including DHA. We administer feline core vaccines (panleukopenia, rhinotracheitis, calicivirus) and maintain strict cold-chain protocols for vaccine efficacy.",
      },
      {
        question: "Can you do blood tests for my pet at home in Lahore?",
        answer:
          "Yes. We perform complete blood counts, biochemistry panels, urinalysis, and rapid point-of-care tests at your home. Results for rapid tests are available within 30 minutes. External lab samples typically take 24–48 hours.",
      },
      {
        question: "Do you deworm pets at home in Lahore?",
        answer:
          "Yes. We provide comprehensive deworming for internal parasites (roundworms, tapeworms, hookworms) and external parasites (fleas, ticks, mites) using pharmaceutical-grade medications dosed accurately for your pet's weight.",
      },
    ],
  },
];

export default function FAQsPage() {
  const allFaqItems = faqs.flatMap((cat) => cat.items);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": "https://vetsondoor.com/vet-faqs-lahore#faq",
        mainEntity: allFaqItems.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://vetsondoor.com" },
          { "@type": "ListItem", position: 2, name: "FAQs", item: "https://vetsondoor.com/vet-faqs-lahore" },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-dark text-white py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/20 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-white/60 max-w-3xl mx-auto">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white font-medium">FAQs</span>
            </nav>
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-white/70 font-sans">
                Everything you need to know about our home vet service in Lahore.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto space-y-14">
            {faqs.map((category) => (
              <div key={category.category}>
                <h2 className="font-display text-2xl font-bold text-dark mb-6 pb-3 border-b border-gray-200 flex items-center gap-3">
                  <span className="w-6 h-1 bg-primary rounded-full" />
                  {category.category}
                </h2>
                <div className="grid gap-5">
                  {category.items.map((faq, i) => (
                    <article
                      key={i}
                      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                    >
                      <h3 className="font-display text-lg font-bold text-primary mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </article>
                  ))}
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 text-center">
              <h2 className="font-display text-2xl font-bold text-dark mb-3">
                Still Have Questions?
              </h2>
              <p className="text-gray-600 mb-6">
                Our team is available via WhatsApp and responds within minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/923078517122"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-md inline-flex items-center justify-center gap-2"
                >
                  💬 WhatsApp Us
                </a>
                <Link
                  href="/contact-vet-lahore"
                  className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-3.5 rounded-full transition-all inline-flex items-center justify-center"
                >
                  Contact Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
