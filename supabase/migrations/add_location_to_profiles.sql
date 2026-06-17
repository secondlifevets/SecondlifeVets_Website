-- Run this in Supabase SQL Editor
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pin_lat FLOAT8;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pin_lng FLOAT8;
