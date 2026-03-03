-- ============================================================
-- STORY C4: Reviews table for QR-driven review collection
-- ============================================================

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  name text,
  city text,
  cruise_type text,
  message text NOT NULL,
  consent_publish boolean NOT NULL DEFAULT false,
  approved boolean NOT NULL DEFAULT false,
  source text NOT NULL DEFAULT 'qr' CHECK (source IN ('qr', 'direct', 'manual')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_reviews_approved ON reviews (approved) WHERE approved = true;
CREATE INDEX idx_reviews_created_at ON reviews (created_at DESC);
CREATE INDEX idx_reviews_cruise_type ON reviews (cruise_type) WHERE cruise_type IS NOT NULL;

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (submit reviews)
CREATE POLICY reviews_public_insert ON reviews
  FOR INSERT TO anon
  WITH CHECK (true);

-- Public can SELECT only approved reviews
CREATE POLICY reviews_public_select ON reviews
  FOR SELECT TO anon
  USING (approved = true);

-- Authenticated (admin) can do everything
CREATE POLICY reviews_admin_all ON reviews
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
