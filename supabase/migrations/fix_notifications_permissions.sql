-- Run this in Supabase SQL Editor to fix the "permission denied for table customer_notifications" error
GRANT ALL ON TABLE public.customer_notifications TO authenticated;
GRANT ALL ON TABLE public.customer_notifications TO service_role;
GRANT ALL ON TABLE public.customer_notifications TO anon;
