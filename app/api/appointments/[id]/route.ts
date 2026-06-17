import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { sendPushToCustomer } from '@/lib/push';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseClient = await createClient();
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    return NextResponse.json({ appointment: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseClient = await createClient();
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const supabase = await createAdminClient();

    // Fetch existing appointment to check if status is actually changing
    const { data: existingAppt, error: fetchError } = await supabase
      .from('appointments')
      .select('status, booking_ref, preferred_date, preferred_time, address, client_phone, client_whatsapp, client_email, customer_id, modification_request_type, requested_reschedule_date, requested_reschedule_time')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingAppt) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    const updates: any = {};
    if (body.status) updates.status = body.status;
    if (body.admin_notes !== undefined) updates.admin_notes = body.admin_notes;
    if (body.preferred_date) updates.preferred_date = body.preferred_date;
    if (body.preferred_time) updates.preferred_time = body.preferred_time;

    if (body.modification_action) {
      if (body.modification_action === 'approve') {
        updates.modification_request_status = 'approved';
        if (existingAppt.modification_request_type === 'cancel') {
          updates.status = 'cancelled';
        } else if (existingAppt.modification_request_type === 'reschedule') {
          updates.preferred_date = existingAppt.requested_reschedule_date;
          updates.preferred_time = existingAppt.requested_reschedule_time;
        }
      } else if (body.modification_action === 'deny') {
        updates.modification_request_status = 'denied';
      }
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', params.id)
      .select('*')
      .single();

    if (error) throw error;

    let responseData: any = { appointment: data };

    // Generate WhatsApp URLs for status changes
    let phone = (existingAppt.client_whatsapp || existingAppt.client_phone).replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '92' + phone.slice(1);
    }

    if (body.modification_action === 'approve') {
      if (existingAppt.modification_request_type === 'cancel') {
        const waMessage = `✅ Your Vets On Door cancellation request for Ticket: ${existingAppt.booking_ref} has been approved. Let us know if you'd like to book again!`;
        responseData.whatsapp_url = `https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`;
      } else if (existingAppt.modification_request_type === 'reschedule') {
        const waMessage = `✅ Your Vets On Door reschedule request for Ticket: ${existingAppt.booking_ref} has been approved! Your new time is ${updates.preferred_date} at ${updates.preferred_time}.`;
        responseData.whatsapp_url = `https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`;
      }
    } else if (body.modification_action === 'deny') {
      const waMessage = `❌ Hi, regarding your Vets On Door modification request (Ticket: ${existingAppt.booking_ref}), we unfortunately cannot accommodate the requested change. Please reply here so we can find a suitable alternative for you.`;
      responseData.whatsapp_url = `https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`;
    } else if (body.status === 'confirmed' && existingAppt.status !== 'confirmed') {
      const waMessage = `✅ Your Vets On Door appointment is confirmed!
Ref: ${existingAppt.booking_ref}
Date: ${existingAppt.preferred_date} at ${existingAppt.preferred_time}
Dr. Muhammad Ahmad will visit you at ${existingAppt.address}.
Questions? Reply here.`;
      responseData.whatsapp_url = `https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`;
    } else if (body.status === 'cancelled' && existingAppt.status !== 'cancelled') {
      const waMessage = `❌ Your Vets On Door appointment (Ref: ${existingAppt.booking_ref}) has been cancelled. Let us know if you'd like to book again in the future!`;
      responseData.whatsapp_url = `https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`;
    } else if (body.is_reschedule) {
      // The admin manually rescheduled using the new date/time fields
      const waMessage = `📅 Your Vets On Door appointment (Ref: ${existingAppt.booking_ref}) has been rescheduled to ${body.preferred_date} at ${body.preferred_time}. Please reply to this message to confirm if this new time works for you!`;
      responseData.whatsapp_url = `https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`;
    }

    // Send In-App Notification to Customer
    if (body.modification_action && existingAppt.customer_id) {
      try {
        let title = "";
        let message = "";
        const ref = existingAppt.booking_ref;

        if (body.modification_action === 'approve') {
          if (existingAppt.modification_request_type === 'cancel') {
            title = `Cancellation Approved`;
            message = `Your cancellation request for ticket ${ref} has been approved.`;
          } else if (existingAppt.modification_request_type === 'reschedule') {
            title = `Reschedule Approved`;
            message = `Your reschedule request for ticket ${ref} is approved! New time: ${updates.preferred_date || existingAppt.requested_reschedule_date} at ${updates.preferred_time || existingAppt.requested_reschedule_time}.`;
          }
        } else if (body.modification_action === 'deny') {
          title = `Request Denied`;
          message = `We are unable to accommodate your modification request for ticket ${ref}. Please check your dashboard to try a different slot.`;
        }

        await supabase.from('customer_notifications').insert({
          customer_id: existingAppt.customer_id,
          type: 'modification_response',
          title,
          message,
          link: '/dashboard'
        });

        // Push Notification to Customer
        await sendPushToCustomer(existingAppt.customer_id, {
          title,
          body: message,
          url: '/dashboard'
        });

      } catch (err) {
        console.error("Failed to insert customer notification:", err);
      }
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseClient = await createClient();
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createAdminClient();
    
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
