import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // We must use the admin client (Service Role) because normal RLS prevents 
    // users from deleting themselves from auth.users
    const supabaseAdmin = await createAdminClient();

    // 1. Validate the token
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('account_deletion_tokens')
      .select('user_id, expires_at')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Verification token has expired' }, { status: 400 });
    }

    // 2. Delete user's images from storage (must be done via API, not SQL)
    try {
      const { data: files } = await supabaseAdmin.storage
        .from('pet-images')
        .list(`${tokenData.user_id}`);
      
      if (files && files.length > 0) {
        // Collect all file paths recursively or shallow (assume shallow for now since pets are direct images)
        const pathsToRemove = files.map(file => `${tokenData.user_id}/${file.name}`);
        await supabaseAdmin.storage.from('pet-images').remove(pathsToRemove);
      }
    } catch (e) {
      console.warn('Non-fatal: Failed to clean up user images:', e);
    }

    // 3. Call the Stored Procedure to perform the atomic deletion
    const { error: rpcError } = await supabaseAdmin.rpc('delete_user_account', {
      target_user_id: tokenData.user_id,
    });

    if (rpcError) {
      console.error('RPC Error deleting user:', rpcError);
      return NextResponse.json({ error: 'Failed to securely delete account' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Confirm deletion error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
