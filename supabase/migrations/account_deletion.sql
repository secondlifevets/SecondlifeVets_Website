-- 1. Create tokens table
CREATE TABLE IF NOT EXISTS public.account_deletion_tokens (
    token UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '1 hour'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Secure tokens table (no public access, only server side)
ALTER TABLE public.account_deletion_tokens ENABLE ROW LEVEL SECURITY;

-- 3. Ensure appointments customer_id has SET NULL
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='appointments' AND column_name='customer_id') THEN
        ALTER TABLE public.appointments ADD COLUMN customer_id UUID;
    END IF;
END $$;

ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_customer_id_fkey;
ALTER TABLE public.appointments ADD CONSTRAINT appointments_customer_id_fkey 
    FOREIGN KEY (customer_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 4. Create the Stored Procedure for deletion
CREATE OR REPLACE FUNCTION delete_user_account(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete pets
  DELETE FROM public.pets WHERE customer_id = target_user_id;
  
  -- Delete notifications
  DELETE FROM public.customer_notifications WHERE customer_id = target_user_id;

  -- Delete profile
  DELETE FROM public.profiles WHERE id = target_user_id;

  -- Delete tokens
  DELETE FROM public.account_deletion_tokens WHERE user_id = target_user_id;

  -- Delete user storage objects (avatars) from the pet-images bucket
  DELETE FROM storage.objects WHERE bucket_id = 'pet-images' AND (storage.foldername(name))[1] = target_user_id::text;

  -- Delete auth user (This requires admin privileges which SECURITY DEFINER provides)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

-- Secure the RPC so it cannot be called directly from the public API
REVOKE ALL ON FUNCTION delete_user_account(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION delete_user_account(UUID) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO service_role;
