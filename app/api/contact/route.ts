import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone || !body.message) {
      return NextResponse.json({ error: 'Name, phone, and message are required' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: body.name,
        phone: body.phone,
        email: body.email,
        subject: body.subject,
        message: body.message
      })
      .select('id')
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
