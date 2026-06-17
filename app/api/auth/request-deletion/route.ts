import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { sendMail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate a secure random token
    const token = crypto.randomUUID();

    // We use the admin client because the tokens table has RLS enabled without public policies
    const supabaseAdmin = await createAdminClient();
    const { error: dbError } = await supabaseAdmin
      .from('account_deletion_tokens')
      .insert({
        token,
        user_id: user.id,
      });

    if (dbError) {
      console.error('Error inserting token:', dbError);
      return NextResponse.json({ error: 'Failed to generate verification token' }, { status: 500 });
    }

    // Determine the base URL dynamically from the request headers
    const hostHeader = request.headers.get('host') || 'localhost:3000';
    const protocol = hostHeader.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${hostHeader}`;
    const confirmUrl = `${baseUrl}/confirm-deletion?token=${token}`;

    // Send the email via SMTP/Resend
    const { error: emailError } = await sendMail({
      from: 'Vets On Door <no-reply@vetsondoor.com>',
      to: user.email!,
      subject: 'Verify Account Deletion - Vets On Door',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Account Deletion Request</h2>
          <p>We received a request to permanently delete your account at Vets On Door.</p>
          <p><strong>This action is irreversible.</strong> All your profile data and pets will be permanently removed.</p>
          <p>If you are sure you want to proceed, click the link below to verify your request:</p>
          <div style="margin: 30px 0;">
            <a href="${confirmUrl}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Permanently Delete My Account
            </a>
          </div>
          <p>If you did not request this, please ignore this email and your account will remain active. This link will expire in 1 hour.</p>
          <hr style="border-top: 1px solid #eaeaea; margin-top: 30px;" />
          <p style="color: #666; font-size: 12px;">Vets On Door Team</p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Request deletion error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
