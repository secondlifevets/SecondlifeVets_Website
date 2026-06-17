import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseClient = await createClient();
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
        // If no rows, return default empty state but 200
        if (error.code === 'PGRST116') {
            return NextResponse.json({ data: null }, { status: 200 });
        }
        console.error("GET SETTINGS ERROR:", error);
        throw error;
    }
    
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabaseClient = await createClient();
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { business_name, primary_phone, email, working_hours } = body;

    const supabase = await createAdminClient();
    
    // Check if row exists
    const { data: existingData } = await supabase.from('business_settings').select('id').limit(1).single();

    let result;
    if (existingData?.id) {
        // Update
        result = await supabase
        .from('business_settings')
        .update({ business_name, primary_phone, email, working_hours, updated_at: new Date().toISOString() })
        .eq('id', existingData.id)
        .select()
        .single();
    } else {
        // Insert
        result = await supabase
        .from('business_settings')
        .insert([{ business_name, primary_phone, email, working_hours }])
        .select()
        .single();
    }

    if (result.error) {
        console.error("PUT SETTINGS ERROR:", result.error);
        throw result.error;
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch (error: any) {
    console.error("PUT CATCH ERROR:", error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
