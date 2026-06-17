-- Add sort_order to all medical tables to allow manual reordering
ALTER TABLE public.vaccinations ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE public.deworming_records ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE public.tick_flea_treatments ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE public.health_checkups ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE public.surgeries ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
