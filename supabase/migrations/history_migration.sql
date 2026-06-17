CREATE TABLE IF NOT EXISTS public.vaccination_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES public.pets(id) ON DELETE CASCADE,
  vaccination_date date NOT NULL,
  shot_type text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Grant privileges so Supabase APIs can interact with the table
GRANT ALL ON TABLE public.vaccination_history TO anon, authenticated, service_role;

ALTER TABLE public.vaccination_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_vax_history" ON public.vaccination_history FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_vax_history" ON public.vaccination_history FOR ALL TO anon USING (true) WITH CHECK (true);

INSERT INTO public.vaccination_history (pet_id, vaccination_date)
SELECT id, last_vaccination_date FROM public.pets WHERE last_vaccination_date IS NOT NULL;

