import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { BRAND } from "@/lib/constants";
import ToastProvider from "@/components/ui/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const BASE_URL = "https://vetsondoor.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Vets On Door | #1 Home Vet Service in Lahore",
    template: "%s | Vets On Door Lahore",
  },
  description:
    "Lahore's #1 mobile veterinary service. Dr. Muhammad Ahmad DVM (RVMP) visits your home in DHA, Bahria Town, Gulberg, Johar Town & all Lahore areas. Pet checkups, vaccinations, emergencies & more. Book online 24/7.",
  keywords: [
    // Primary local
    "vet near me Lahore",
    "home vet Lahore",
    "mobile vet Lahore",
    "veterinary doctor home visit Lahore",
    "pet doctor at home Lahore",
    // Service specific
    "dog vaccination at home Lahore",
    "cat vaccination Lahore",
    "pet checkup at home Lahore",
    "emergency vet Lahore",
    "vet on call Lahore",
    "24/7 emergency vet Lahore",
    // Area specific
    "vet DHA Lahore",
    "vet Bahria Town Lahore",
    "vet Gulberg Lahore",
    "vet Johar Town Lahore",
    "vet Model Town Lahore",
    // Animal specific
    "cat vet at home Lahore",
    "dog vet at home Lahore",
    "rabbit vet Lahore",
    "home pet vaccination Pakistan",
    // Brand / Doctor
    "Dr Muhammad Ahmad vet Lahore",
    "RVMP vet Lahore",
    "DVM doctor home visit Lahore",
    "Vets On Door",
    "mobile veterinary service Pakistan",
  ],
  authors: [{ name: "Soban Rafique", url: "https://sobanrafique.com" }],
  creator: "Soban Rafique",
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-PK": BASE_URL,
    },
  },
  openGraph: {
    title: "Vets On Door | #1 Home Vet Service in Lahore",
    description:
      "Lahore's premier mobile veterinary service. Dr. Muhammad Ahmad DVM (RVMP) visits your home across DHA, Bahria Town, Gulberg & all Lahore areas. Available 24/7.",
    url: BASE_URL,
    siteName: "Vets On Door",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vets On Door — Home Vet Service in Lahore",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vets On Door | #1 Home Vet Service in Lahore",
    description:
      "Lahore's premier mobile veterinary service — Dr. Ahmad brings clinic-grade care to your doorstep. Book online 24/7.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VeterinaryCare",
        "@id": `${BASE_URL}/#business`,
        name: "Vets On Door",
        description:
          "Lahore's #1 mobile home veterinary service. Dr. Muhammad Ahmad DVM (RVMP) provides professional pet care at your doorstep across all major areas in Lahore.",
        telephone: "+923078517122",
        email: "contact@vetsondoor.com",
        url: BASE_URL,
        priceRange: "PKR 1500 - PKR 8000",
        image: `${BASE_URL}/og-image.png`,
        logo: `${BASE_URL}/logo.png`,
        foundingDate: "2023",
        sameAs: [
          "https://www.instagram.com/vetsondoor",
          "https://www.tiktok.com/@vetsondoor",
          "https://www.linkedin.com/company/vetsondoors/",
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "09:00",
            closes: "22:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Sunday",
            opens: "10:00",
            closes: "22:00",
          },
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lahore",
          addressRegion: "Punjab",
          addressCountry: "PK",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 31.5204,
          longitude: 74.3587,
        },
        hasMap: "https://maps.google.com/?q=Lahore,+Punjab,+Pakistan",
        areaServed: [
          { "@type": "City", name: "Lahore", containedInPlace: { "@type": "State", name: "Punjab" } },
          { "@type": "Neighborhood", name: "DHA Lahore" },
          { "@type": "Neighborhood", name: "Bahria Town Lahore" },
          { "@type": "Neighborhood", name: "Gulberg Lahore" },
          { "@type": "Neighborhood", name: "Johar Town Lahore" },
          { "@type": "Neighborhood", name: "Model Town Lahore" },
          { "@type": "Neighborhood", name: "Lahore Cantt" },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "127",
          bestRating: "5",
          worstRating: "1",
        },
        availableService: [
          {
            "@type": "MedicalProcedure",
            name: "General Checkup",
            url: `${BASE_URL}/services/home-vet-checkup-lahore`,
          },
          {
            "@type": "MedicalProcedure",
            name: "Vaccination",
            url: `${BASE_URL}/services/pet-vaccination-lahore`,
          },
          {
            "@type": "MedicalProcedure",
            name: "Deworming",
            url: `${BASE_URL}/services/pet-deworming-lahore`,
          },
          {
            "@type": "MedicalProcedure",
            name: "Emergency Care",
            url: `${BASE_URL}/services/emergency-vet-lahore`,
          },
          {
            "@type": "MedicalProcedure",
            name: "Dental Cleaning",
            url: `${BASE_URL}/services/dental-cleaning-lahore`,
          },
          {
            "@type": "MedicalProcedure",
            name: "Diagnostic & Lab Tests",
            url: `${BASE_URL}/services/diagnostic-lab-tests-lahore`,
          },
          {
            "@type": "MedicalProcedure",
            name: "Tick & Flea Treatments",
            url: `${BASE_URL}/services/tick-flea-treatments-lahore`,
          },
        ],
        employee: {
          "@type": "Person",
          name: "Dr. Muhammad Ahmad",
          jobTitle: "Veterinarian",
          description: "DVM (Doctor of Veterinary Medicine) and RVMP (Registered Veterinary Medical Practitioner).",
          knowsAbout: ["Veterinary Medicine", "Animal Surgery", "Pet Vaccination", "Small Animal Care", "Veterinary Dentistry"],
          url: `${BASE_URL}/#doctor`,
        },
        founder: {
          "@type": "Person",
          name: "Dr. Muhammad Ahmad",
          jobTitle: "Founder & Lead Veterinarian",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "Vets On Door",
        description: "Lahore's #1 mobile veterinary service — home vet visits across all areas.",
        inLanguage: "en-PK",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE_URL}/services?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        publisher: {
          "@id": `${BASE_URL}/#business`,
        },
      },
      {
        "@type": "Person",
        "@id": `${BASE_URL}/#developer`,
        name: "Soban Rafique",
        jobTitle: "Web Developer",
        description: "Full-stack web developer who designed and built vetsondoor.com.",
        url: "https://sobanrafique.com",
        sameAs: ["https://sobanrafique.com"],
      },
    ],
  };

  return (
    <html lang="en-PK" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="alternate" hrefLang="en-PK" href={BASE_URL} />
      </head>
      <body className="font-sans bg-background text-dark antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NJTB4KVK9Q"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-NJTB4KVK9Q');
          `}
        </Script>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
