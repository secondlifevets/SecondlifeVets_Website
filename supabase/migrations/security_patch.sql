-- 1. Enable RLS on core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 2. Profiles Policies
-- Customers can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Customers can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 3. Pets Policies
-- Customers can view their own pets
DROP POLICY IF EXISTS "Users can view own pets" ON public.pets;
CREATE POLICY "Users can view own pets" 
ON public.pets FOR SELECT 
USING (auth.uid() = customer_id);

-- Customers can insert their own pets
DROP POLICY IF EXISTS "Users can insert own pets" ON public.pets;
CREATE POLICY "Users can insert own pets" 
ON public.pets FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

-- Customers can update their own pets
DROP POLICY IF EXISTS "Users can update own pets" ON public.pets;
CREATE POLICY "Users can update own pets" 
ON public.pets FOR UPDATE 
USING (auth.uid() = customer_id);

-- Customers can delete their own pets
DROP POLICY IF EXISTS "Users can delete own pets" ON public.pets;
CREATE POLICY "Users can delete own pets" 
ON public.pets FOR DELETE 
USING (auth.uid() = customer_id);

-- 4. Appointments Policies
-- Customers can view their own appointments
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
CREATE POLICY "Users can view own appointments" 
ON public.appointments FOR SELECT 
USING (auth.uid() = customer_id);

-- Customers can insert appointments (where customer_id is theirs)
DROP POLICY IF EXISTS "Users can insert own appointments" ON public.appointments;
CREATE POLICY "Users can insert own appointments" 
ON public.appointments FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

-- Customers can update their own appointments (only if status is pending)
DROP POLICY IF EXISTS "Users can update own appointments" ON public.appointments;
CREATE POLICY "Users can update own appointments" 
ON public.appointments FOR UPDATE 
USING (auth.uid() = customer_id AND status = 'pending');

-- Customers CANNOT delete appointments directly (they must cancel via support or update status if allowed)
DROP POLICY IF EXISTS "Block delete appointments for users" ON public.appointments;
CREATE POLICY "Block delete appointments for users" 
ON public.appointments FOR DELETE 
USING (false);

-- 5. Bypass RLS for Service Role (Admin Dashboard uses Service Role, so it automatically bypasses RLS)
