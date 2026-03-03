-- ============================================================
-- STORY C2: Testimonials table for curated client quotes
-- ============================================================

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  quote text NOT NULL,
  tags text[] DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_testimonials_active ON testimonials (active) WHERE active = true;
CREATE INDEX idx_testimonials_tags ON testimonials USING GIN (tags);
CREATE INDEX idx_testimonials_sort ON testimonials (sort_order, created_at DESC);

-- RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public can SELECT only active testimonials
CREATE POLICY testimonials_public_select ON testimonials
  FOR SELECT TO anon
  USING (active = true);

-- Authenticated (admin) can CRUD
CREATE POLICY testimonials_admin_all ON testimonials
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
