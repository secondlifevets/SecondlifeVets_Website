-- 1. Create customer_notifications table
CREATE TABLE IF NOT EXISTS public.customer_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- e.g., 'STATUS_UPDATE', 'BOOKING_RECEIVED', 'SYSTEM'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Real-time (Replica Identity)
ALTER TABLE public.customer_notifications REPLICA IDENTITY FULL;

-- 3. Row Level Security (RLS)
ALTER TABLE public.customer_notifications ENABLE ROW LEVEL SECURITY;

-- Customers can view their own notifications
CREATE POLICY "Customers can view their own notifications"
  ON public.customer_notifications
  FOR SELECT
  USING (auth.uid() = customer_id);

-- Customers can update their own notifications (e.g. mark as read)
CREATE POLICY "Customers can update their own notifications"
  ON public.customer_notifications
  FOR UPDATE
  USING (auth.uid() = customer_id)
  WITH CHECK (auth.uid() = customer_id);

-- Explicitly block insert and delete for authenticated users (handled by triggers/service role only)
CREATE POLICY "Block insert for users"
  ON public.customer_notifications
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Block delete for users"
  ON public.customer_notifications
  FOR DELETE
  USING (false);

-- 4. Create Trigger for Appointment Status Changes
CREATE OR REPLACE FUNCTION public.notify_customer_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the status has changed AND the appointment is linked to a customer
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.customer_id IS NOT NULL THEN
    
    -- Customize message based on status
    DECLARE
      notif_title TEXT;
      notif_message TEXT;
    BEGIN
      IF NEW.status = 'confirmed' THEN
        notif_title := 'Appointment Confirmed! ✅';
        notif_message := 'Your appointment (' || NEW.service_type || ') for ' || NEW.pet_name || ' has been confirmed for ' || NEW.preferred_date || '.';
      ELSIF NEW.status = 'completed' THEN
        notif_title := 'Appointment Completed 🐾';
        notif_message := 'Your appointment for ' || NEW.pet_name || ' is complete. Thank you for choosing Vets On Door!';
      ELSIF NEW.status = 'cancelled' THEN
        notif_title := 'Appointment Cancelled ❌';
        notif_message := 'Your appointment (' || NEW.service_type || ') has been cancelled. Please contact support for details.';
      ELSE
        notif_title := 'Status Updated';
        notif_message := 'Your appointment status is now: ' || NEW.status;
      END IF;

      INSERT INTO public.customer_notifications (customer_id, type, title, message, link)
      VALUES (
        NEW.customer_id,
        'STATUS_UPDATE',
        notif_title,
        notif_message,
        '/dashboard'
      );
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_appointment_status_change ON public.appointments;

-- Attach trigger
CREATE TRIGGER on_appointment_status_change
  AFTER UPDATE OF status ON public.appointments
  FOR EACH ROW
  EXECUTE PROCEDURE public.notify_customer_on_status_change();
