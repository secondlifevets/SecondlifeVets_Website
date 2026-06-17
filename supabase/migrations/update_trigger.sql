-- 1. Upgrade the Auth Trigger to also check phone if present
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  
  -- Retroactively link old guest appointments by matching email
  IF NEW.email IS NOT NULL THEN
    UPDATE public.appointments 
    SET customer_id = NEW.id 
    WHERE client_email = NEW.email AND customer_id IS NULL;
  END IF;

  -- Retroactively link old guest appointments by matching phone
  IF NEW.raw_user_meta_data->>'phone' IS NOT NULL THEN
    UPDATE public.appointments 
    SET customer_id = NEW.id 
    WHERE REPLACE(client_phone, '-', '') = REPLACE(NEW.raw_user_meta_data->>'phone', '-', '') 
    AND customer_id IS NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create a new trigger for when users update their profile settings!
CREATE OR REPLACE FUNCTION public.handle_profile_update() 
RETURNS TRIGGER AS $$
BEGIN
  -- If phone is updated/added in the Dashboard Settings, sweep guest appointments and link them!
  IF NEW.phone IS NOT NULL AND OLD.phone IS DISTINCT FROM NEW.phone THEN
    UPDATE public.appointments 
    SET customer_id = NEW.id 
    WHERE REPLACE(client_phone, '-', '') = REPLACE(NEW.phone, '-', '') 
    AND customer_id IS NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  AFTER UPDATE OF phone ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_profile_update();
