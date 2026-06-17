"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendPushToAdmins } from "@/lib/push";
import { sendMail } from "@/lib/email";
import { waitUntil } from '@vercel/functions';
import { headers } from 'next/headers';

export async function requestAppointmentChange(
  appointmentId: string, 
  type: 'cancel' | 'reschedule', 
  reason: string,
  newDate?: string,
  newTime?: string
) {
  const supabaseClient = await createClient();
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const supabaseAdmin = await createAdminClient();

  // Get current appointment to verify ownership
  const { data: appt, error: fetchError } = await supabaseAdmin
    .from('appointments')
    .select('customer_id, booking_ref')
    .eq('id', appointmentId)
    .single();

  if (fetchError || !appt) {
    return { success: false, error: "Appointment not found" };
  }

  if (appt.customer_id !== user.id) {
    return { success: false, error: "Unauthorized access to appointment" };
  }

  const updatePayload: any = {
    modification_request_type: type,
    modification_request_status: 'pending',
    modification_reason: reason,
  };

  if (type === 'reschedule' && newDate && newTime) {
    updatePayload.requested_reschedule_date = newDate;
    updatePayload.requested_reschedule_time = newTime;
  }

  const { error: updateError } = await supabaseAdmin
    .from('appointments')
    .update(updatePayload)
    .eq('id', appointmentId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Fire-and-forget notifications
  const sendNotifications = async () => {
    try {
      try {
        await supabaseAdmin.from('admin_notifications').insert({
          appointment_id: appointmentId,
          title: type === 'cancel' ? '🚨 Cancellation Request' : '📅 Reschedule Request',
          message: `${user.email} requested to ${type} their appointment (Ref: ${appt.booking_ref}).`,
          link: `/admin/appointments?id=${appointmentId}`
        });
      } catch (dbErr) {
        console.error("Failed to save admin notification:", dbErr);
      }

      await sendPushToAdmins({
        title: type === 'cancel' ? "🚨 Cancellation Request" : "📅 Reschedule Request",
        body: `${user.email} requested to ${type} their appointment. Reason: ${reason}`,
        url: `/admin/appointments?id=${appointmentId}`
      });
    } catch (e) {
      console.error("Push failed:", e);
    }

    try {
      const hostHeader = headers().get('host') || 'localhost:3000';
      const protocol = hostHeader.includes('localhost') ? 'http' : 'https';
      const baseUrl = `${protocol}://${hostHeader}`;

      const actionText = type === 'cancel' ? "Cancel Request" : "Reschedule Request";
      
      let htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2D3748;">Action Required: Appointment Modification</h2>
          <p>A customer has submitted a request to <strong>${type}</strong> their appointment.</p>
          <div style="background-color: #F7FAFC; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Customer Email:</strong> ${user.email}</p>
            <p style="margin: 5px 0;"><strong>Ticket Ref:</strong> ${appt.booking_ref}</p>
            <p style="margin: 5px 0;"><strong>Type:</strong> ${type.toUpperCase()}</p>
            <p style="margin: 5px 0;"><strong>Reason/Details:</strong> ${reason}</p>
      `;

      if (type === 'reschedule' && newDate && newTime) {
        htmlContent += `<p style="margin: 5px 0;"><strong>Requested New Time:</strong> ${newDate} at ${newTime}</p>`;
      }

      htmlContent += `
          </div>
          <p style="margin-top: 30px;">
            <a href="${baseUrl}/admin/appointments" style="background-color: #D97706; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Review Request in Dashboard</a>
          </p>
        </div>
      `;

      await sendMail({
        from: 'Vets On Door <noreply@vetsondoor.com>',
        to: process.env.ADMIN_EMAIL || 'contact@vetsondoor.com',
        subject: `[Action Required] ${actionText} - Ref: ${appt.booking_ref}`,
        html: htmlContent
      });
    } catch (emailErr) {
      console.error("Failed to send email notification:", emailErr);
    }
  };

  // Queue background work
  waitUntil(sendNotifications());

  // Generate WhatsApp URL
  const adminPhone = "923078517122";
  const actionText = type === 'cancel' ? "cancel" : "reschedule";
  
  let waMessage = `Hi, I would like to ${actionText} my appointment (Ticket: ${appt.booking_ref}).\nReason: ${reason}`;
  if (type === 'reschedule' && newDate && newTime) {
    waMessage = `Hi, I would like to reschedule my appointment (Ticket: ${appt.booking_ref}).\nRequested New Time: ${newDate} at ${newTime}\nDetails: ${reason}`;
  }

  const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(waMessage)}`;

  return { success: true, whatsappUrl };
}

export async function updateProfile(address: string, city: string, phone: string, whatsapp: string, fullName: string) {
  const supabaseClient = await createClient();
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabaseClient
    .from('profiles')
    .update({ address, city, phone, whatsapp_number: whatsapp, full_name: fullName })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
