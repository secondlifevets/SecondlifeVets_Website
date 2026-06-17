-- 1. Modify pets table
ALTER TABLE public.pets 
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Create vaccinations table
-- NOTE ON VACCINE TYPES: We intentionally group vaccines into two buckets: 'Rabies' and 'Other' (Core).
-- This constraint prevents reliance on string-matching against the free-text `vaccine_name` field (e.g., typos like 'DHPPi').
-- FUTURE UPGRADES: If granular per-vaccine tracking (DHPP vs Bordetella) is ever required, it will demand TWO things:
-- 1. A schema change to expand the CHECK constraint enum (or moving to a lookup table).
-- 2. A data migration strategy to map all existing free-text `vaccine_name` rows to the new strict categories.
CREATE TABLE IF NOT EXISTS public.vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  vaccine_type TEXT NOT NULL CHECK (vaccine_type IN ('Rabies', 'Other')),
  vaccination_date DATE NOT NULL,
  valid_until DATE,
  is_vod_verified BOOLEAN DEFAULT FALSE,
  vaccine_name TEXT,
  batch_no TEXT,
  veterinarian_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;

-- 3. Create deworming_records table
CREATE TABLE IF NOT EXISTS public.deworming_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  dewormer TEXT,
  veterinarian_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.deworming_records ENABLE ROW LEVEL SECURITY;

-- 4. Create tick_flea_treatments table
CREATE TABLE IF NOT EXISTS public.tick_flea_treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  medicine TEXT,
  veterinarian_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tick_flea_treatments ENABLE ROW LEVEL SECURITY;

-- 5. Create health_checkups table
CREATE TABLE IF NOT EXISTS public.health_checkups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  tpr TEXT,
  body_weight TEXT,
  general_body_condition TEXT,
  prescription TEXT,
  veterinarian_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.health_checkups ENABLE ROW LEVEL SECURITY;

-- 6. Create surgeries table
CREATE TABLE IF NOT EXISTS public.surgeries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  surgery_details TEXT,
  veterinarian_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.surgeries ENABLE ROW LEVEL SECURITY;

-- 7. Add RLS Policies (Admins bypass via Service Role)
-- Allow pet owners to read their own pets' records
CREATE POLICY "Users can view own pet vaccinations" 
  ON public.vaccinations FOR SELECT 
  USING ( pet_id IN (SELECT id FROM public.pets WHERE customer_id = auth.uid()) );

CREATE POLICY "Users can view own pet deworming_records" 
  ON public.deworming_records FOR SELECT 
  USING ( pet_id IN (SELECT id FROM public.pets WHERE customer_id = auth.uid()) );

CREATE POLICY "Users can view own pet tick_flea_treatments" 
  ON public.tick_flea_treatments FOR SELECT 
  USING ( pet_id IN (SELECT id FROM public.pets WHERE customer_id = auth.uid()) );

CREATE POLICY "Users can view own pet health_checkups" 
  ON public.health_checkups FOR SELECT 
  USING ( pet_id IN (SELECT id FROM public.pets WHERE customer_id = auth.uid()) );

CREATE POLICY "Users can view own pet surgeries" 
  ON public.surgeries FOR SELECT 
  USING ( pet_id IN (SELECT id FROM public.pets WHERE customer_id = auth.uid()) );
