-- 1. Ensure table exists with correct schema
CREATE TABLE IF NOT EXISTS public.pets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    breed TEXT,
    date_of_birth DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Grant base SQL permissions to the authenticated role
-- (This fixes "permission denied" errors when RLS is correct but base permissions are missing)
GRANT ALL ON TABLE public.pets TO authenticated;

-- 3. Enable Row Level Security
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- 4. Drop ALL existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Users can view own pets" ON public.pets;
DROP POLICY IF EXISTS "Users can insert own pets" ON public.pets;
DROP POLICY IF EXISTS "Users can update own pets" ON public.pets;
DROP POLICY IF EXISTS "Users can delete own pets" ON public.pets;

-- 5. Create robust, user-scoped security policies
CREATE POLICY "Users can view own pets" 
ON public.pets FOR SELECT TO authenticated
USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert own pets" 
ON public.pets FOR INSERT TO authenticated
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own pets" 
ON public.pets FOR UPDATE TO authenticated
USING (auth.uid() = customer_id);

CREATE POLICY "Users can delete own pets" 
ON public.pets FOR DELETE TO authenticated
USING (auth.uid() = customer_id);
