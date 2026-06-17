ALTER TABLE public.appointments
ADD COLUMN pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL;
