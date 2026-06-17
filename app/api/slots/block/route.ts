import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabaseClient = await createClient();
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.date || !body.time) {
      return NextResponse.json({ error: 'Date and time are required' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('time_slot_blocks')
      .insert({
        blocked_date: body.date,
        blocked_time: body.time,
        reason: body.reason || null
      })
      .select('*')
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, block: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabaseClient = await createClient();
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.date || !body.time) {
      return NextResponse.json({ error: 'Date and time are required' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const { error } = await supabase
      .from('time_slot_blocks')
      .delete()
      .eq('blocked_date', body.date)
      .eq('blocked_time', body.time);

    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
