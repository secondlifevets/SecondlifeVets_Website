import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Vet Appointment Lahore | Vets On Door",
  description: "Book a home visit with Lahore's premium mobile veterinary service. Expert vet care, vaccinations, and checkups at your doorstep.",
  keywords: ["book vet appointment Lahore", "mobile vet booking", "vets on door booking", "schedule vet visit", "veterinary home service"],
  alternates: {
    canonical: "https://vetsondoor.com/book-vet-appointment-lahore",
  },
  openGraph: {
    title: "Book Vet Appointment Lahore | Vets On Door",
    description: "Book a home visit with Lahore's premium mobile veterinary service.",
    url: "https://vetsondoor.com/book-vet-appointment-lahore",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Vet Appointment Lahore | Vets On Door",
    description: "Book a home visit with Lahore's premium mobile veterinary service.",
  }
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
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
        "name": "Book Vet Appointment Lahore",
        "item": "https://vetsondoor.com/book-vet-appointment-lahore"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
