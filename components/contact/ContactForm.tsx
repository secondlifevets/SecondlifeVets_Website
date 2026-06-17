"use client";

import { BRAND } from "@/lib/constants";

export default function ContactForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const name = data.get("name")?.toString() || "";
    const phone = data.get("phone")?.toString() || "";
    const email = data.get("email")?.toString() || "";
    const subject = data.get("subject")?.toString() || "";
    const message = data.get("message")?.toString() || "";

    const text = `*New Message from Vets on Door Website*
*Name:* ${name}
*Phone:* ${phone}
${email ? `*Email:* ${email}\n` : ""}${subject ? `*Subject:* ${subject}\n` : ""}
*Message:*
${message}`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodedText}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="card p-8">
      <h2 className="font-display font-bold text-dark text-2xl mb-2">Send Us a Message</h2>
      <p className="text-dark/60 text-sm mb-6">
        Fill out the form below and you will be redirected to WhatsApp to send your message directly to our team.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-dark/80" htmlFor="contact-name">
              Your Name <span className="text-emergency">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Ahmed Ali"
              required
              minLength={2}
              className="input-field"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-dark/80" htmlFor="contact-phone">
              Phone Number <span className="text-emergency">*</span>
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              placeholder="0307 8517122"
              required
              className="input-field"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-dark/80" htmlFor="contact-email-field">
            Email Address
          </label>
          <input
            id="contact-email-field"
            name="email"
            type="email"
            placeholder="ahmed@example.com"
            className="input-field"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-dark/80" htmlFor="contact-subject">
            Subject
          </label>
          <select id="contact-subject" name="subject" className="input-field appearance-none">
            <option value="">Select a topic</option>
            <option>Book a Vet Visit</option>
            <option>Emergency Care</option>
            <option>Service Inquiry</option>
            <option>Feedback</option>
            <option>Partnership</option>
            <option>Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-dark/80" htmlFor="contact-message">
            Message <span className="text-emergency">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            placeholder="Tell us about your pet and what you need..."
            required
            minLength={10}
            className="input-field resize-none"
          />
        </div>

        <button
          type="submit"
          id="contact-submit"
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <span>Send via WhatsApp</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
        </button>

      </form>
    </div>
  );
}
