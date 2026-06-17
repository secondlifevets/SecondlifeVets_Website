import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { sendMail } from '@/lib/email';
import { sendPushToAdmins } from '@/lib/push';
import { waitUntil } from '@vercel/functions';

export async function GET(request: Request) {
  try {
    const supabaseClient = await createClient();
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const emergency = searchParams.get('emergency');

    const supabase = await createAdminClient();
    let query = supabase.from('appointments').select('*');

    if (status) query = query.eq('status', status);
    if (date) query = query.eq('preferred_date', date);
    if (emergency === 'true') query = query.eq('is_emergency', true);

    query = query.order('preferred_date', { ascending: true }).order('preferred_time', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ appointments: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Get current user if authenticated
    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    // 1. Validate required fields
    const required = ['client_name', 'client_phone', 'client_whatsapp', 'pet_type', 'service_type', 'preferred_date', 'preferred_time', 'city', 'address'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // 2. Validate phone is Pakistani format 03XX-XXXXXXX
    // We allow optional dashes or spaces for flexibility but check pattern roughly
    const phoneRegex = /^03[0-9]{2}-?[0-9]{7}$/;
    if (!phoneRegex.test(body.client_phone)) {
      return NextResponse.json({ error: 'Invalid phone format. Must be 03XX-XXXXXXX' }, { status: 400 });
    }
    if (!phoneRegex.test(body.client_whatsapp)) {
      return NextResponse.json({ error: 'Invalid WhatsApp format. Must be 03XX-XXXXXXX' }, { status: 400 });
    }

    // 3. Validate preferred_date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const prefDate = new Date(body.preferred_date);
    if (prefDate < today) {
      return NextResponse.json({ error: 'preferred_date cannot be in the past' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // 4. Validate preferred_time is not in time_slot_blocks
    const { data: blocks } = await supabase
      .from('time_slot_blocks')
      .select('id')
      .eq('blocked_date', body.preferred_date)
      .eq('blocked_time', body.preferred_time)
      .single();

    if (blocks) {
      return NextResponse.json({ error: 'Selected time slot is blocked' }, { status: 400 });
    }

    // 5. Generate booking_ref: query last booking_ref from Supabase and increment
    const year = new Date().getFullYear();
    const prefix = `VOD-${year}-`;

    const { data: lastRefData } = await supabase
      .from('appointments')
      .select('booking_ref')
      .like('booking_ref', `${prefix}%`)
      .order('booking_ref', { ascending: false })
      .limit(1);

    let nextRef = `${prefix}0001`;
    if (lastRefData && lastRefData.length > 0) {
      const lastRef = lastRefData[0].booking_ref;
      const lastNum = parseInt(lastRef.replace(prefix, ''), 10);
      if (!isNaN(lastNum)) {
        nextRef = `${prefix}${(lastNum + 1).toString().padStart(4, '0')}`;
      }
    }

    // Check if the user's profile actually exists (legacy users or admins might not have one)
    let validCustomerId = null;
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
      if (profile) validCustomerId = user.id;
    }

    // Auto-link guest bookings: If no logged-in user, check if a profile exists with this phone number
    if (!validCustomerId && body.client_phone) {
      const rawPhone = body.client_phone.trim();
      const cleanPhone = rawPhone.replace(/[\s-]/g, '');
      const dashedPhone = cleanPhone.replace(/(\d{4})(\d{7})/, '$1-$2');

      const { data: matchedProfiles } = await supabase
        .from('profiles')
        .select('id')
        .or(`phone.eq.${cleanPhone},phone.eq.${dashedPhone}`)
        .limit(1);
        
      if (matchedProfiles && matchedProfiles.length > 0) {
        validCustomerId = matchedProfiles[0].id;
      }
    }

    // 6. Insert to appointments table
    const { data: newAppointment, error: insertError } = await supabase
      .from('appointments')
      .insert({
        booking_ref: nextRef,
        client_name: body.client_name,
        client_phone: body.client_phone,
        client_whatsapp: body.client_whatsapp,
        client_email: body.client_email || null,
        pet_name: body.pet_name || 'Not provided',
        pet_type: body.pet_type,
        pet_breed: body.pet_breed,
        pet_age: body.pet_age,
        pet_id: body.pet_id || null,
        service_type: body.service_type,
        preferred_date: body.preferred_date,
        preferred_time: body.preferred_time,
        address: body.address,
        city: body.city,
        pin_lat: body.pin_lat,
        pin_lng: body.pin_lng,
        notes: body.notes,
        is_emergency: body.is_emergency || false,
        customer_id: validCustomerId
      })
      .select('id, booking_ref')
      .single();

    if (insertError) throw insertError;

    // 7. Generate WhatsApp notification URL
    const waMessage = `🐾 New Appointment - Vets On Door
Ref: ${newAppointment.booking_ref}
Client: ${body.client_name}
Phone: ${body.client_phone}
WhatsApp: ${body.client_whatsapp}
Pet: ${body.pet_name || 'Not provided'} (${body.pet_type})
Service: ${body.service_type}
Date: ${body.preferred_date} at ${body.preferred_time}
City: ${body.city}
Address: ${body.address}
Emergency: ${body.is_emergency ? "yes" : "no"}`;

    const waUrl = `https://wa.me/923078517122?text=${encodeURIComponent(waMessage)}`;

    // 8. Fire-and-forget background notifications (so customer doesn't wait)
    const sendNotifications = async () => {
      // Save notification to admin database
      try {
        await supabase.from('admin_notifications').insert({
          appointment_id: newAppointment.id,
          title: body.is_emergency ? '🚨 Emergency Appointment!' : '🐾 New Appointment',
          message: `${body.client_name} booked a ${body.service_type} for ${body.pet_name || 'their pet'}.`,
          link: `/admin/appointments?id=${newAppointment.id}`
        });
      } catch (dbErr) {
        console.error("Failed to save admin notification:", dbErr);
      }

      // Save notification to CUSTOMER database if authenticated
      if (validCustomerId) {
        try {
          await supabase.from('customer_notifications').insert({
            customer_id: validCustomerId,
            type: 'BOOKING_RECEIVED',
            title: 'Booking Received! 🎉',
            message: `We have received your booking request for ${body.pet_name || 'your pet'}. Our team will review it shortly!`,
            link: '/dashboard'
          });
        } catch (dbErr) {
          console.error("Failed to save customer notification:", dbErr);
        }
      }

      // Web Push Notifications to Admins
      await sendPushToAdmins({
        title: body.is_emergency ? '🚨 Emergency Appointment!' : '🐾 New Appointment',
        body: `${body.client_name} booked a ${body.service_type} for ${body.pet_name || 'their pet'}.`,
        url: `/admin/appointments?id=${newAppointment.id}`
      });
    };

    // Execute in the background using waitUntil so it doesn't block the response
    waitUntil(sendNotifications());

    return NextResponse.json({
      success: true,
      booking_ref: newAppointment.booking_ref,
      whatsapp_url: waUrl
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
