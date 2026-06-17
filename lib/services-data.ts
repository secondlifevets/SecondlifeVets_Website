import { Stethoscope, Syringe, Bug, Scissors, Activity, AlertTriangle, Bone, Microscope, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ServiceData {
  slug: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroSub: string;
  priceRange: string;
  duration: string;
  keywords: string[];
  whatWeOffer: string[];
  benefits: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  schemaServiceType: string;
}

export const servicesData: ServiceData[] = [
  {
    slug: "home-vet-checkup-lahore",
    name: "Home Vet Checkup in Lahore",
    shortName: "General Checkup",
    icon: Stethoscope,
    tagline: "Comprehensive Health Assessment at Your Doorstep",
    metaTitle: "Home Vet Checkup in Lahore | Pet Health Exam at Home | Vets On Door",
    metaDescription:
      "Book a professional home vet checkup in Lahore. Dr. Muhammad Ahmad DVM (RVMP) visits your home for a full health assessment — dogs, cats, rabbits & more. Same-day slots available.",
    heroHeading: "Home Vet Checkup in Lahore",
    heroSub:
      "Dr. Muhammad Ahmad DVM (RVMP) performs a thorough, clinic-grade physical examination of your pet, right in the comfort of your home — no stressful car rides, no waiting rooms.",
    priceRange: "PKR 1,500 – 2,500",
    duration: "30–45 mins",
    keywords: [
      "home vet checkup Lahore",
      "pet health exam at home Lahore",
      "vet home visit Lahore",
      "pet doctor home visit Lahore",
      "animal doctor at home Lahore",
      "cat checkup at home Lahore",
      "dog checkup at home Lahore",
    ],
    whatWeOffer: [
      "Full physical examination (eyes, ears, teeth, skin, coat)",
      "Vital signs assessment (heart rate, temperature, respiration)",
      "Body condition scoring & weight check",
      "Lymph node & abdomen palpation",
      "Musculoskeletal & neurological assessment",
      "Tailored health report & recommendations",
    ],
    benefits: [
      { title: "Stress-Free for Your Pet", desc: "Pets are calmer at home — better for accurate assessment and their long-term wellbeing." },
      { title: "No Cross-Contamination", desc: "No exposure to sick animals at clinics. Your pet stays safe in their own environment." },
      { title: "Personalized Attention", desc: "100% focus on your pet — no interruptions, no rushed consultations." },
    ],
    faqs: [
      { q: "How often should I get my pet checked by a vet at home?", a: "We recommend a general checkup every 6 months for adult pets and every 3 months for senior pets or those with chronic conditions." },
      { q: "What pets can you examine at home in Lahore?", a: "We examine dogs, cats, rabbits, guinea pigs, birds, hamsters, and most other domestic pets." },
      { q: "Do I need to prepare anything before the vet arrives?", a: "Have a quiet, comfortable space ready. Keep your pet's previous vaccination records handy if available." },
    ],
    schemaServiceType: "VeterinaryService",
  },
  {
    slug: "pet-vaccination-lahore",
    name: "Pet Vaccination at Home in Lahore",
    shortName: "Vaccination",
    icon: Syringe,
    tagline: "Safe, Cold-Chain Vaccines Administered at Your Home",
    metaTitle: "Pet Vaccination at Home in Lahore | Dog & Cat Vaccines | Vets On Door",
    metaDescription:
      "Get your dog or cat vaccinated at home in Lahore. Dr. Muhammad Ahmad DVM (RVMP) administers all core vaccines maintaining proper cold-chain. Book online — all Lahore areas covered.",
    heroHeading: "Pet Vaccination at Home in Lahore",
    heroSub:
      "Protect your pet from deadly diseases without leaving home. We administer all core and non-core vaccines with strict cold-chain protocols — safely, professionally, and at your doorstep.",
    priceRange: "PKR 2,000 – 5,000",
    duration: "20–30 mins",
    keywords: [
      "pet vaccination at home Lahore",
      "dog vaccination Lahore",
      "cat vaccination Lahore",
      "home vaccination vet Lahore",
      "pet vaccine home visit Lahore",
      "anti-rabies vaccine at home Lahore",
      "puppy vaccination Lahore",
    ],
    whatWeOffer: [
      "Core vaccines: Rabies, Distemper, Parvovirus, Hepatitis",
      "Cat vaccines: Feline Panleukopenia, Rhinotracheitis, Calicivirus",
      "Bordetella (kennel cough) vaccination",
      "Leptospirosis vaccination",
      "Post-vaccination monitoring on-site",
      "Digital vaccination record provided",
    ],
    benefits: [
      { title: "Proper Cold-Chain Maintained", desc: "All vaccines are stored and transported with strict temperature control for maximum efficacy." },
      { title: "Less Stress, Better Immunity", desc: "A calm pet at home has a better immune response to vaccines than a stressed clinic visit." },
      { title: "Certified & Safe", desc: "All vaccinations performed by RVMP-registered Dr. Ahmad with pharmaceutical-grade vaccines." },
    ],
    faqs: [
      { q: "What vaccines does my dog need in Lahore?", a: "Core vaccines: Rabies, DA2PP (Distemper, Adenovirus, Parvovirus, Parainfluenza). Optional: Leptospirosis, Bordetella. We'll advise based on your dog's lifestyle." },
      { q: "How old should my puppy be for its first vaccine?", a: "Puppies can start their vaccination series at 6-8 weeks of age. A booster is given every 3-4 weeks until 16 weeks." },
      { q: "Do you maintain vaccine cold-chain for home visits?", a: "Yes, absolutely. We use insulated medical-grade carriers with ice packs to maintain the 2–8°C cold chain required for vaccine efficacy." },
    ],
    schemaServiceType: "VeterinaryService",
  },
  {
    slug: "pet-deworming-lahore",
    name: "Pet Deworming at Home in Lahore",
    shortName: "Deworming",
    icon: Bug,
    tagline: "Safe & Effective Parasite Treatment at Your Doorstep",
    metaTitle: "Pet Deworming at Home in Lahore | Parasite Control | Vets On Door",
    metaDescription:
      "Book pet deworming at home in Lahore. Dr. Muhammad Ahmad DVM treats internal and external parasites safely for dogs, cats & all pets. All areas of Lahore covered.",
    heroHeading: "Pet Deworming at Home in Lahore",
    heroSub:
      "Protect your pet and your family from harmful parasites. Dr. Ahmad provides safe, effective deworming and parasite control treatments right at your home in Lahore.",
    priceRange: "PKR 600 – 1,200",
    duration: "20–30 mins",
    keywords: [
      "pet deworming Lahore",
      "deworming at home Lahore",
      "dog deworming Lahore",
      "cat deworming Lahore",
      "parasite control pet Lahore",
      "tick treatment dog Lahore",
      "flea treatment cat Lahore",
    ],
    whatWeOffer: [
      "Internal parasite treatment (roundworms, tapeworms, hookworms)",
      "External parasite control (fleas, ticks, mites)",
      "Heartworm prevention consultation",
      "Giardia & coccidia treatment",
      "Weight-based dosing for safe medication",
      "Follow-up deworming schedule provided",
    ],
    benefits: [
      { title: "Protects Your Whole Family", desc: "Many pet parasites can transfer to humans. Regular deworming keeps your entire household safe." },
      { title: "Accurate Dosing", desc: "Dr. Ahmad calculates precise doses based on your pet's weight and species — no guessing with over-the-counter products." },
      { title: "Quarterly Schedule Advised", desc: "We provide a personalized quarterly deworming schedule to keep your pet parasite-free year-round." },
    ],
    faqs: [
      { q: "How often should I deworm my pet in Lahore?", a: "Adult dogs and cats should be dewormed every 3 months. Puppies and kittens require more frequent treatment — every 2 weeks until 12 weeks old, then monthly until 6 months." },
      { q: "Are deworming medications safe for my pet?", a: "Yes, when properly dosed by a licensed vet. Dr. Ahmad uses pharmaceutical-grade, vet-prescribed dewormers appropriate for your pet's age, weight, and species." },
      { q: "Can I deworm my pet at home without a vet?", a: "Over-the-counter products have limited efficacy and incorrect dosing can be harmful. A vet visit ensures the right medication, correct dose, and covers all parasite types." },
    ],
    schemaServiceType: "VeterinaryService",
  },
  {
    slug: "emergency-vet-lahore",
    name: "24/7 Emergency Vet at Home in Lahore",
    shortName: "Emergency Care",
    icon: AlertTriangle,
    tagline: "Rapid Response Emergency Veterinary Care — Available 24/7",
    metaTitle: "24/7 Emergency Vet at Home in Lahore | Rapid Response | Vets On Door",
    metaDescription:
      "Pet emergency in Lahore? Call Vets On Door now. Dr. Muhammad Ahmad DVM provides 24/7 emergency veterinary care at your home — rapid dispatch, life-saving equipment on board.",
    heroHeading: "24/7 Emergency Vet at Home in Lahore",
    heroSub:
      "Pet emergencies don't wait for office hours. Our rapid response team is available around the clock — call now and Dr. Ahmad will be dispatched to your home in Lahore immediately.",
    priceRange: "PKR 3,500 – 8,000",
    duration: "Varies",
    keywords: [
      "emergency vet Lahore",
      "24/7 vet Lahore",
      "emergency pet care Lahore",
      "urgent vet home visit Lahore",
      "pet emergency Lahore",
      "emergency animal doctor Lahore",
      "vet on call 24 hours Lahore",
    ],
    whatWeOffer: [
      "Rapid dispatch for critical cases",
      "IV fluid administration",
      "Oxygen therapy",
      "Emergency wound management & bandaging",
      "Toxin/poisoning treatment",
      "Seizure management & pain control",
      "Stabilization before referral if needed",
    ],
    benefits: [
      { title: "Available 24/7/365", desc: "Call 0307-8517122 anytime — day, night, weekends, or holidays. Your pet's emergency is always our priority." },
      { title: "Fully Equipped Mobile Unit", desc: "Our vehicle carries life-saving equipment: IV lines, oxygen, emergency medications, and diagnostic tools." },
      { title: "No Wait, No Queue", desc: "Emergency dispatch goes directly to your home in Lahore — no clinic waiting room when every second counts." },
    ],
    faqs: [
      { q: "What counts as a pet emergency?", a: "Signs include: difficulty breathing, collapse, severe bleeding, suspected poisoning, seizures, inability to walk, continuous vomiting (3+ times), or extreme lethargy. When in doubt — call us." },
      { q: "How quickly can you reach my home in Lahore in an emergency?", a: "Response time depends on your location and traffic, but we dispatch immediately upon receiving an emergency call and aim to reach you as fast as possible. Call 0307-8517122 now." },
      { q: "What should I do while waiting for the emergency vet?", a: "Stay calm, keep your pet warm and still, do NOT give human medications, control any bleeding with gentle pressure, and stay on the line with us for guidance." },
    ],
    schemaServiceType: "EmergencyService",
  },
  {
    slug: "dental-cleaning-lahore",
    name: "Pet Dental Cleaning at Home in Lahore",
    shortName: "Dental Cleaning",
    icon: Activity,
    tagline: "Professional Oral Care for Your Pet at Home",
    metaTitle: "Pet Dental Cleaning at Home in Lahore | Oral Care | Vets On Door",
    metaDescription:
      "Professional pet dental cleaning at home in Lahore. Dr. Muhammad Ahmad DVM performs dental scaling, polishing & oral examination for dogs and cats. All Lahore areas covered.",
    heroHeading: "Pet Dental Cleaning at Home in Lahore",
    heroSub:
      "80% of dogs and cats over age 3 have dental disease. Dr. Ahmad provides professional dental scaling and oral care at your home in Lahore — keeping your pet's mouth healthy and pain-free.",
    priceRange: "PKR 3,000 – 6,000",
    duration: "45–60 mins",
    keywords: [
      "pet dental cleaning Lahore",
      "dog teeth cleaning Lahore",
      "cat dental care Lahore",
      "pet oral hygiene Lahore",
      "dental scaling dog Lahore",
      "vet dental home visit Lahore",
    ],
    whatWeOffer: [
      "Oral examination & dental charting",
      "Plaque & tartar removal (scaling)",
      "Tooth polishing",
      "Gum health assessment",
      "Detection of broken or damaged teeth",
      "Home dental care instructions & products",
    ],
    benefits: [
      { title: "Prevents Serious Disease", desc: "Untreated dental disease can lead to heart, kidney, and liver complications. Regular cleaning prevents systemic illness." },
      { title: "Pain-Free Life", desc: "Dental pain is often silent in pets — a proper cleaning reveals and relieves discomfort your pet may be hiding." },
      { title: "Fresh Breath", desc: "Professional cleaning eliminates bacteria causing bad breath, making cuddle time much more pleasant." },
    ],
    faqs: [
      { q: "How often should I get my pet's teeth cleaned?", a: "Most pets benefit from annual professional dental cleaning. Small breeds and brachycephalic breeds (pugs, bulldogs, Persian cats) may need it every 6 months." },
      { q: "Is dental cleaning safe for my pet at home?", a: "Yes. Dr. Ahmad performs a full oral assessment first to ensure your pet is a good candidate for the procedure, and uses safe, appropriate methods." },
      { q: "What are signs my pet needs dental cleaning?", a: "Bad breath, yellow/brown tartar buildup on teeth, red or bleeding gums, difficulty chewing, pawing at the mouth, or reduced appetite." },
    ],
    schemaServiceType: "VeterinaryService",
  },
  {
    slug: "surgical-consultation-lahore",
    name: "Surgical Consultation at Home in Lahore",
    shortName: "Surgical Consultation",
    icon: Scissors,
    tagline: "Pre & Post-Surgical Care Delivered to Your Home",
    metaTitle: "Surgical Consultation for Pets at Home in Lahore | Vets On Door",
    metaDescription:
      "Pre-operative assessments and post-surgical home care for pets in Lahore. Dr. Muhammad Ahmad DVM (RVMP) provides expert surgical consultations at your doorstep. All areas of Lahore covered.",
    heroHeading: "Pet Surgical Consultation at Home in Lahore",
    heroSub:
      "Planning a procedure for your pet or recovering from surgery? Dr. Ahmad provides expert pre-operative assessments and post-surgical follow-up care at your home in Lahore.",
    priceRange: "PKR 2,000 – 5,000",
    duration: "45–60 mins",
    keywords: [
      "surgical consultation pet Lahore",
      "post surgery pet care Lahore",
      "pre op vet Lahore",
      "wound care pet at home Lahore",
      "vet surgery consultation Lahore",
      "minor surgery pet Lahore",
    ],
    whatWeOffer: [
      "Pre-anaesthetic blood work assessment",
      "Surgical risk evaluation",
      "Post-operative wound inspection & redressing",
      "Suture removal at home",
      "Pain management consultation",
      "Referral to surgical specialist if needed",
    ],
    benefits: [
      { title: "Safer Recovery at Home", desc: "Post-surgery recovery is faster and safer when pets stay in their comfortable home environment." },
      { title: "Avoid Infection Risk", desc: "Returning to clinics for wound checks risks exposure to other animals. We come to you instead." },
      { title: "Continuity of Care", desc: "Dr. Ahmad tracks your pet's recovery over time with personalized follow-up visit scheduling." },
    ],
    faqs: [
      { q: "Can Dr. Ahmad perform surgery at home?", a: "Dr. Ahmad performs minor procedures at home. For major surgeries requiring full anaesthesia and sterile operating rooms, he will provide a pre-op assessment and refer to a trusted surgical facility." },
      { q: "How soon after surgery can you check on my pet at home?", a: "We can arrange a post-surgery home visit within 24–48 hours after the procedure, or sooner if there are concerns." },
      { q: "What should I watch for after my pet's surgery?", a: "Watch for swelling, redness, discharge from the wound, persistent lethargy, loss of appetite, or signs of pain. Call us immediately if any of these occur." },
    ],
    schemaServiceType: "VeterinaryService",
  },
  {
    slug: "pet-nutrition-lahore",
    name: "Pet Nutrition Consultation in Lahore",
    shortName: "Pet Nutrition",
    icon: Bone,
    tagline: "Personalized Diet Plans for Your Pet's Optimal Health",
    metaTitle: "Pet Nutrition Consultation at Home in Lahore | Diet Plan | Vets On Door",
    metaDescription:
      "Get a personalized pet nutrition and diet plan in Lahore. Dr. Muhammad Ahmad DVM advises on optimal feeding for dogs, cats & all pets. Home visit service across all Lahore areas.",
    heroHeading: "Pet Nutrition Consultation in Lahore",
    heroSub:
      "Proper nutrition is the foundation of your pet's health. Dr. Ahmad provides evidence-based dietary assessments and personalized meal plans tailored to your pet's breed, age, and health conditions.",
    priceRange: "PKR 1,200 – 2,000",
    duration: "30–40 mins",
    keywords: [
      "pet nutrition consultation Lahore",
      "pet diet plan Lahore",
      "dog nutrition Lahore",
      "cat diet advice Lahore",
      "best pet food Lahore",
      "obese dog diet Lahore",
      "pet weight management Lahore",
    ],
    whatWeOffer: [
      "Body condition scoring & weight assessment",
      "Species and breed-specific dietary recommendations",
      "Raw food vs commercial food guidance",
      "Weight management plans for obese pets",
      "Therapeutic diets for medical conditions",
      "Supplement & vitamin recommendations",
    ],
    benefits: [
      { title: "Prevents Diet-Related Disease", desc: "Obesity, kidney disease, and diabetes in pets are largely diet-driven. Proper nutrition prevents these costly conditions." },
      { title: "Life-Stage Appropriate Feeding", desc: "Nutritional needs change from puppy/kitten to adult to senior — Dr. Ahmad tailors plans for each life stage." },
      { title: "Save Money Long-Term", desc: "Investing in proper nutrition now prevents expensive medical treatment down the line." },
    ],
    faqs: [
      { q: "How do I know if my pet is overweight?", a: "You should be able to feel your pet's ribs without pressing hard but not see them. If you can't feel the ribs, or there's no waist definition, your pet may be overweight. Dr. Ahmad will assess this accurately." },
      { q: "Is home-cooked food good for my dog?", a: "It can be, but it needs to be properly balanced. Most home-cooked diets are deficient in key nutrients. Dr. Ahmad can help formulate a safe, balanced home-cooked recipe if that's your preference." },
      { q: "What food should I feed my cat?", a: "Cats are obligate carnivores and need high-protein, low-carbohydrate diets. Wet food is generally preferable for hydration. We'll give species-appropriate recommendations during the consultation." },
    ],
    schemaServiceType: "VeterinaryService",
  },
  {
    slug: "diagnostic-lab-tests-lahore",
    name: "Pet Diagnostic & Lab Tests in Lahore",
    shortName: "Diagnostics & Lab",
    icon: Microscope,
    tagline: "On-Site Blood Work & Diagnostics Delivered to Your Home",
    metaTitle: "Pet Diagnostic & Lab Tests at Home in Lahore | Blood Work | Vets On Door",
    metaDescription:
      "On-site pet blood tests, urinalysis & diagnostic tests at home in Lahore. Dr. Muhammad Ahmad DVM (RVMP) collects samples and provides rapid results. All Lahore areas covered.",
    heroHeading: "Pet Diagnostic & Lab Tests at Home in Lahore",
    heroSub:
      "Accurate diagnosis starts with proper testing. Dr. Ahmad collects blood, urine, and other samples at your home in Lahore — no clinic visit needed for comprehensive diagnostic workups.",
    priceRange: "PKR 2,500 – 8,000",
    duration: "30–50 mins",
    keywords: [
      "pet blood test Lahore",
      "diagnostic test pet Lahore",
      "pet lab test at home Lahore",
      "urinalysis cat Lahore",
      "complete blood count dog Lahore",
      "vet test home Lahore",
      "pet diagnosis Lahore",
    ],
    whatWeOffer: [
      "Complete Blood Count (CBC)",
      "Blood biochemistry panel (liver, kidney, glucose)",
      "Urinalysis & urine culture",
      "Skin scraping & cytology",
      "Faecal examination for parasites",
      "Rapid in-clinic point-of-care tests",
    ],
    benefits: [
      { title: "Accurate & Fast Results", desc: "Samples collected stress-free at home are more accurate — cortisol spikes from clinic stress can skew results." },
      { title: "Early Disease Detection", desc: "Regular screening blood panels catch kidney disease, diabetes, and liver conditions before they become critical." },
      { title: "Transparent Reporting", desc: "Dr. Ahmad explains every test result in plain language and provides written reports for your records." },
    ],
    faqs: [
      { q: "Does my pet need to fast before blood tests?", a: "For most blood panels, yes — 8–12 hours fasting is recommended. Dr. Ahmad will advise you on the specific requirements when you book." },
      { q: "How long do lab results take?", a: "Point-of-care rapid tests give results within 15–30 minutes at your home. Samples sent to external labs typically take 24–48 hours." },
      { q: "When should I get blood work done for my pet?", a: "Annually for adult pets as a wellness screen, before any surgery or anaesthesia, when symptoms of illness appear, or every 6 months for senior pets (7+ years)." },
    ],
    schemaServiceType: "VeterinaryService",
  },
  {
    slug: "tick-flea-treatments-lahore",
    name: "Tick & Flea Treatments at Home in Lahore",
    shortName: "Tick & Flea Treatments",
    icon: Shield,
    tagline: "Complete Eradication & Prevention of External Parasites",
    metaTitle: "Tick & Flea Treatments for Pets at Home in Lahore | Vets On Door",
    metaDescription:
      "Get professional tick and flea treatments for your pets at home in Lahore. Dr. Muhammad Ahmad DVM ensures safe, effective, and lasting protection against external parasites.",
    heroHeading: "Tick & Flea Treatments at Home in Lahore",
    heroSub:
      "Ticks and fleas aren't just a nuisance — they spread deadly diseases like Tick Fever. Dr. Ahmad provides fast-acting and long-lasting treatments at your home in Lahore.",
    priceRange: "PKR 1,000 – 2,500",
    duration: "20–30 mins",
    keywords: [
      "tick treatment for dogs Lahore",
      "flea treatment for cats Lahore",
      "pet tick removal Lahore",
      "tick fever prevention Lahore",
      "vet home visit tick treatment",
      "anti tick spray for dogs Lahore",
    ],
    whatWeOffer: [
      "Full coat and skin examination",
      "Safe and effective spot-on treatments",
      "Tick and flea spray application",
      "Tick fever risk assessment",
      "Preventative care scheduling",
      "Environmental control guidance",
    ],
    benefits: [
      { title: "Prevents Fatal Diseases", desc: "Ticks transmit diseases like Babesiosis and Ehrlichiosis. Proper prevention saves lives." },
      { title: "Instant Relief", desc: "Our treatments kill existing parasites quickly, providing immediate relief from severe itching." },
      { title: "Long-lasting Protection", desc: "We use premium products that provide weeks to months of continuous protection." },
    ],
    faqs: [
      { q: "How often should I apply tick and flea treatment?", a: "For most products, spot-on treatments should be applied every 4 weeks, especially during peak seasons." },
      { q: "Are the treatments safe for puppies and kittens?", a: "Yes, we use age and weight-appropriate products that are entirely safe for young pets when administered by a vet." },
      { q: "Do I need to treat my house as well?", a: "Yes, if your pet has a severe flea infestation, we'll guide you on how to effectively treat your home environment to prevent reinfestation." },
    ],
    schemaServiceType: "VeterinaryService",
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return servicesData.find((s) => s.slug === slug);
}
