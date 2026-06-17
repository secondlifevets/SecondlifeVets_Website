import nodemailer from 'nodemailer';

interface SendMailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
}

/**
 * Sends an email using either standard SMTP (nodemailer) or the Resend SDK.
 * 
 * If SMTP_HOST, SMTP_USER, and SMTP_PASSWORD are set in environment variables,
 * it will use standard SMTP. Otherwise, it will fall back to the Resend SDK.
 */
export async function sendMail({ from, to, subject, html }: SendMailOptions) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const defaultFrom = process.env.SMTP_FROM || 'Vets On Door <noreply@vetsondoor.com>';

  const resolvedFrom = from || defaultFrom;
  const resolvedTo = Array.isArray(to) ? to.join(', ') : to;

  try {
    // 1. Check if SMTP configuration is provided
    if (host && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465 SSL, false for other ports (like 587 TLS)
        auth: {
          user,
          pass,
        },
      });

      const info = await transporter.sendMail({
        from: resolvedFrom,
        to: resolvedTo,
        subject,
        html,
      });

      return {
        success: true,
        data: { id: info.messageId },
        error: null,
      };
    }

    // 2. Fall back to Resend SDK
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const { data, error } = await resend.emails.send({
        from: resolvedFrom,
        to,
        subject,
        html,
      });

      return {
        success: !error,
        data,
        error,
      };
    }

    // 3. No email provider configured
    throw new Error('No email provider configured. Please set SMTP_* or RESEND_API_KEY environment variables.');
  } catch (err: any) {
    console.error('Error sending email:', err);
    return {
      success: false,
      data: null,
      error: err,
    };
  }
}
