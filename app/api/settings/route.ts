import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return NextResponse.json({ data: null }, { status: 200 });
        }
        console.error("GET PUBLIC SETTINGS ERROR:", error);
        throw error;
    }
    
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("GET PUBLIC CATCH ERROR:", error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
