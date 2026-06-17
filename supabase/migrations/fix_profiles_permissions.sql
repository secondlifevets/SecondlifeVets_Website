-- Run this in Supabase SQL Editor to fix the "permission denied for table profiles" error
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT ALL ON TABLE public.profiles TO anon;
