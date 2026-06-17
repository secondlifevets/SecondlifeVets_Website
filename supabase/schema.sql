-- =============================================================
-- Vets On Door — Supabase Database Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- =============================================================

-- ─── EXTENSIONS ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- fuzzy text search on names

-- =============================================================
-- 1. APPOINTMENTS
-- =============================================================

CREATE TABLE IF NOT EXISTS public.appointments (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref       text          NOT NULL UNIQUE,
  client_name       text          NOT NULL CHECK (char_length(client_name) >= 2),
  client_phone      text          NOT NULL CHECK (client_phone ~ '^[0-9+\s\-]{7,15}$'),
  client_email      text          CHECK (client_email ~* '^[^@]+@[^@]+\.[^@]+$'),
  pet_name          text          NOT NULL,
  pet_type          text          NOT NULL,
  pet_breed         text,
  pet_age           text,
  service_type      text          NOT NULL,
  preferred_date    date          NOT NULL,
  preferred_time    time          NOT NULL,
  address           text          NOT NULL,
  city              text          NOT NULL,
  pin_lat           float8,
  pin_lng           float8,
  status            text          NOT NULL DEFAULT 'pending'
                                  CHECK (status IN (
                                    'pending',
                                    'confirmed',
                                    'in-progress',
                                    'completed',
                                    'cancelled'
                                  )),
  notes             text,
  is_emergency      boolean       NOT NULL DEFAULT false,
  admin_notes       text,
  created_at        timestamptz   NOT NULL DEFAULT now()
);

-- Index for public lookup by booking_ref (confirmation page)
CREATE INDEX IF NOT EXISTS idx_appointments_booking_ref
  ON public.appointments (booking_ref);

-- Index for admin queries by status & date
CREATE INDEX IF NOT EXISTS idx_appointments_status
  ON public.appointments (status);

CREATE INDEX IF NOT EXISTS idx_appointments_preferred_date
  ON public.appointments (preferred_date);

CREATE INDEX IF NOT EXISTS idx_appointments_city
  ON public.appointments (city);

-- Full-text search index on client name (admin)
CREATE INDEX IF NOT EXISTS idx_appointments_client_name_trgm
  ON public.appointments USING gin (client_name gin_trgm_ops);

-- ─── Booking reference generator ─────────────────────────────
-- Format: VOD-YYYY-XXXX (e.g. VOD-2025-A1B2)
CREATE OR REPLACE FUNCTION generate_booking_ref()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_year  text;
  v_rand  text;
  v_ref   text;
BEGIN
  v_year := to_char(now(), 'YYYY');
  LOOP
    v_rand := upper(substring(encode(gen_random_bytes(4), 'hex'), 1, 6));
    v_ref  := 'VOD-' || v_year || '-' || v_rand;
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.appointments WHERE booking_ref = v_ref
    );
  END LOOP;
  RETURN v_ref;
END;
$$;

-- Auto-generate booking_ref before insert
CREATE OR REPLACE FUNCTION set_booking_ref()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.booking_ref IS NULL OR NEW.booking_ref = '' THEN
    NEW.booking_ref := generate_booking_ref();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_booking_ref ON public.appointments;
CREATE TRIGGER trg_set_booking_ref
  BEFORE INSERT ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION set_booking_ref();


-- =============================================================
-- 2. TIME_SLOT_BLOCKS
-- Admin can block specific date+time slots (holidays, breaks)
-- =============================================================

CREATE TABLE IF NOT EXISTS public.time_slot_blocks (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_date  date          NOT NULL,
  blocked_time  time          NOT NULL,
  reason        text,
  created_at    timestamptz   NOT NULL DEFAULT now(),

  -- Prevent duplicate blocks for the same slot
  UNIQUE (blocked_date, blocked_time)
);

CREATE INDEX IF NOT EXISTS idx_time_slot_blocks_date
  ON public.time_slot_blocks (blocked_date);


-- =============================================================
-- 3. SERVICES
-- =============================================================

CREATE TABLE IF NOT EXISTS public.services (
  id               uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text          NOT NULL,
  description      text,
  duration_minutes integer       NOT NULL DEFAULT 45,
  price_min        integer,                          -- PKR
  price_max        integer,                          -- PKR
  icon             text,                             -- emoji or icon key
  is_active        boolean       NOT NULL DEFAULT true,
  is_emergency     boolean       NOT NULL DEFAULT false,
  display_order    integer       NOT NULL DEFAULT 0,
  created_at       timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_active
  ON public.services (is_active, display_order);

-- Seed default services
INSERT INTO public.services
  (name, description, duration_minutes, price_min, price_max, icon, is_active, is_emergency, display_order)
VALUES
  ('General Checkup',              'Comprehensive physical exam, vitals check and health advice',           45, 1500, 2500,  '🩺', true, false, 1),
  ('Vaccination',                  'Core and non-core vaccines administered at home with cold-chain',        30,  800, 3000,  '💉', true, false, 2),
  ('Deworming',                    'Internal and external parasite treatment for a healthy pet',             20,  600, 1200,  '🐛', true, false, 3),
  ('Surgical Consultation',        'Pre/post-operative assessments and wound care by veterinary surgeons',  60, 2000, 5000,  '🔬', true, false, 4),
  ('Dental Cleaning',              'Professional dental scaling and polishing to prevent periodontal disease',60,3000, 6000, '🦷', true, false, 5),
  ('Emergency Care',               '24/7 emergency home visits for critical cases — rapid response team',    90, 3500, 8000,  '🚨', true, true,  6),
  ('Pet Nutrition Consultation',   'Personalised dietary plans and nutritional counselling',                  40, 1200, 2000, '🥗', true, false, 7),
  ('Diagnostic & Lab Tests',       'On-site blood panels, urinalysis, and fast-turnaround lab results',      50, 2500, 8000, '🧪', true, false, 8),
  ('Tick & Flea Treatments',       'Complete eradication and prevention of external parasites',              30, 1000, 2500, '🛡️', true, false, 9)
ON CONFLICT DO NOTHING;


-- =============================================================
-- 4. CONTACT_MESSAGES
-- =============================================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text          NOT NULL CHECK (char_length(name) >= 2),
  phone       text          NOT NULL,
  email       text          CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  subject     text,
  message     text          NOT NULL CHECK (char_length(message) >= 10),
  is_read     boolean       NOT NULL DEFAULT false,
  created_at  timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read
  ON public.contact_messages (is_read, created_at DESC);


-- =============================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================

ALTER TABLE public.appointments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slot_blocks   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages   ENABLE ROW LEVEL SECURITY;


-- ─── APPOINTMENTS policies ────────────────────────────────────

-- 1. Anon can INSERT a new booking
CREATE POLICY "anon_can_insert_appointment"
  ON public.appointments
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 2. Anon can SELECT their own appointment by booking_ref
--    (used on /book/success confirmation page)
CREATE POLICY "anon_can_select_own_appointment_by_ref"
  ON public.appointments
  FOR SELECT
  TO anon
  USING (
    booking_ref = current_setting('request.jwt.claims', true)::json->>'booking_ref'
    OR
    -- Allow lookup via URL param by matching booking_ref passed as app_metadata
    -- In practice the booking page passes ?ref= to a route handler that uses service role
    -- This policy is intentionally restrictive; use service-role key in Route Handlers
    false
  );

-- 3. Authenticated admin can SELECT all appointments
CREATE POLICY "admin_can_select_all_appointments"
  ON public.appointments
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. Authenticated admin can UPDATE appointments (status, admin_notes)
CREATE POLICY "admin_can_update_appointments"
  ON public.appointments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Authenticated admin can DELETE cancelled appointments
CREATE POLICY "admin_can_delete_appointments"
  ON public.appointments
  FOR DELETE
  TO authenticated
  USING (status = 'cancelled');


-- ─── TIME_SLOT_BLOCKS policies ────────────────────────────────

-- 1. Anon can SELECT blocked slots (to show unavailable in booking form)
CREATE POLICY "anon_can_select_blocked_slots"
  ON public.time_slot_blocks
  FOR SELECT
  TO anon
  USING (true);

-- 2. Authenticated admin can INSERT blocks
CREATE POLICY "admin_can_insert_blocks"
  ON public.time_slot_blocks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 3. Authenticated admin can UPDATE blocks
CREATE POLICY "admin_can_update_blocks"
  ON public.time_slot_blocks
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Authenticated admin can DELETE blocks
CREATE POLICY "admin_can_delete_blocks"
  ON public.time_slot_blocks
  FOR DELETE
  TO authenticated
  USING (true);


-- ─── SERVICES policies ───────────────────────────────────────

-- 1. Anon can SELECT active services only
CREATE POLICY "anon_can_select_active_services"
  ON public.services
  FOR SELECT
  TO anon
  USING (is_active = true);

-- 2. Authenticated admin can SELECT all (including inactive)
CREATE POLICY "admin_can_select_all_services"
  ON public.services
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Authenticated admin can INSERT services
CREATE POLICY "admin_can_insert_services"
  ON public.services
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 4. Authenticated admin can UPDATE services
CREATE POLICY "admin_can_update_services"
  ON public.services
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Authenticated admin can DELETE services
CREATE POLICY "admin_can_delete_services"
  ON public.services
  FOR DELETE
  TO authenticated
  USING (true);


-- ─── CONTACT_MESSAGES policies ───────────────────────────────

-- 1. Anon can INSERT a contact message
CREATE POLICY "anon_can_insert_contact_message"
  ON public.contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 2. Authenticated admin can SELECT all messages
CREATE POLICY "admin_can_select_contact_messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Authenticated admin can UPDATE (mark as read)
CREATE POLICY "admin_can_update_contact_messages"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- =============================================================
-- HELPER VIEWS (admin convenience)
-- =============================================================

-- Today's appointments with service details
CREATE OR REPLACE VIEW public.v_today_appointments AS
SELECT
  a.id,
  a.booking_ref,
  a.client_name,
  a.client_phone,
  a.pet_name,
  a.pet_type,
  a.service_type,
  a.preferred_time,
  a.address,
  a.city,
  a.status,
  a.is_emergency,
  a.created_at
FROM public.appointments a
WHERE a.preferred_date = CURRENT_DATE
ORDER BY a.preferred_time ASC;

-- Appointment counts by status (dashboard stats)
CREATE OR REPLACE VIEW public.v_appointment_stats AS
SELECT
  COUNT(*)                                                    AS total,
  COUNT(*) FILTER (WHERE preferred_date = CURRENT_DATE)       AS today_total,
  COUNT(*) FILTER (WHERE status = 'pending')                  AS pending,
  COUNT(*) FILTER (WHERE status = 'confirmed')                AS confirmed,
  COUNT(*) FILTER (WHERE status = 'in-progress')              AS in_progress,
  COUNT(*) FILTER (WHERE status = 'completed'
                   AND   preferred_date = CURRENT_DATE)        AS completed_today,
  COUNT(*) FILTER (WHERE is_emergency = true
                   AND   preferred_date = CURRENT_DATE)        AS emergencies_today,
  COUNT(DISTINCT client_phone)                                AS total_clients,
  COUNT(*) FILTER (WHERE created_at >= date_trunc('month', now())) AS this_month
FROM public.appointments;


-- =============================================================
-- GRANT PERMISSIONS FOR VIEWS
-- =============================================================
GRANT SELECT ON public.v_today_appointments  TO authenticated;
GRANT SELECT ON public.v_appointment_stats   TO authenticated;


-- =============================================================
-- REALTIME (optional — enable for live dashboard updates)
-- =============================================================
-- Run in Supabase Dashboard > Database > Replication
-- or uncomment the lines below:
--
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;


-- =============================================================
-- 5. BUSINESS_SETTINGS
-- =============================================================

CREATE TABLE IF NOT EXISTS public.business_settings (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name     text          NOT NULL DEFAULT 'Vets On Door',
  primary_phone     text          NOT NULL DEFAULT '0307-8517122',
  email             text          NOT NULL DEFAULT 'contact@vetsondoor.com',
  working_hours     text          NOT NULL DEFAULT 'Monday – Saturday: 9:00 AM – 8:00 PM',
  updated_at        timestamptz   NOT NULL DEFAULT now()
);

-- Ensure only one row exists
CREATE UNIQUE INDEX IF NOT EXISTS idx_business_settings_single_row ON public.business_settings((true));

ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- 1. Anon can SELECT business settings
CREATE POLICY "anon_can_select_business_settings"
  ON public.business_settings
  FOR SELECT
  TO anon
  USING (true);

-- 2. Authenticated admin can SELECT business settings
CREATE POLICY "admin_can_select_business_settings"
  ON public.business_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Authenticated admin can UPDATE business settings
CREATE POLICY "admin_can_update_business_settings"
  ON public.business_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default row
INSERT INTO public.business_settings (business_name, primary_phone, email, working_hours)
VALUES ('Vets On Door', '0307-8517122', 'contact@vetsondoor.com', 'Monday – Saturday: 9:00 AM – 8:00 PM')
ON CONFLICT DO NOTHING;

-- =============================================================
-- DONE
-- =============================================================
-- After running this schema:
-- 1. Go to Authentication > Providers and enable Email auth
-- 2. Create an admin user in Authentication > Users
-- 3. Copy your Project URL and anon key to .env.local
-- =============================================================
