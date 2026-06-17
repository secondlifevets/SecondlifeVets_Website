import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabaseClient = await createClient();
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch last 20 notifications (RLS implicitly protects this, but we filter by customer_id for performance/explicitness)
    const { data, error } = await supabaseClient
      .from('customer_notifications')
      .select('*')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json({ notifications: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabaseClient = await createClient();
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (body.markAllRead) {
      // Mark all as read for THIS specific customer
      const { error } = await supabaseClient
        .from('customer_notifications')
        .update({ is_read: true })
        .eq('customer_id', user.id)
        .eq('is_read', false);
        
      if (error) throw error;
    } else if (body.id) {
      // Mark specific notification as read, ensuring it belongs to the customer
      const { error } = await supabaseClient
        .from('customer_notifications')
        .update({ is_read: true })
        .eq('id', body.id)
        .eq('customer_id', user.id);
        
      if (error) throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
