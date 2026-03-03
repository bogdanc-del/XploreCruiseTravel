-- ============================================================
-- Site stats — trust metrics displayed on the homepage
-- Key-value approach: one row per stat for easy admin updates
-- ============================================================

CREATE TABLE IF NOT EXISTS site_stats (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_key    text NOT NULL UNIQUE,
  stat_value  integer NOT NULL DEFAULT 0,
  label_en    text NOT NULL DEFAULT '',
  label_ro    text NOT NULL DEFAULT '',
  suffix      text NOT NULL DEFAULT '+',
  sort_order  integer NOT NULL DEFAULT 0,
  active      boolean NOT NULL DEFAULT true,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Seed with default values
INSERT INTO site_stats (stat_key, stat_value, label_en, label_ro, suffix, sort_order)
VALUES
  ('cruises',      150, 'Cruise Offers',     'Oferte Croaziere',   '+', 1),
  ('destinations',  25, 'Destinations',      'Destinatii',         '+', 2),
  ('clients',      500, 'Happy Clients',     'Clienti Multumiti',  '+', 3),
  ('years',         10, 'Years Experience',   'Ani Experienta',     '+', 4)
ON CONFLICT (stat_key) DO NOTHING;

-- Row Level Security
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

-- Public can read active stats
CREATE POLICY "Public can read active stats"
  ON site_stats FOR SELECT
  TO anon
  USING (active = true);

-- Authenticated users can read all stats
CREATE POLICY "Authenticated can read all stats"
  ON site_stats FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can update stats
CREATE POLICY "Authenticated can update stats"
  ON site_stats FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can insert stats
CREATE POLICY "Authenticated can insert stats"
  ON site_stats FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can delete stats
CREATE POLICY "Authenticated can delete stats"
  ON site_stats FOR DELETE
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_site_stats_active ON site_stats (active);
CREATE INDEX IF NOT EXISTS idx_site_stats_sort ON site_stats (sort_order);

-- Auto-update updated_at on change
CREATE OR REPLACE FUNCTION update_site_stats_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_site_stats_timestamp
  BEFORE UPDATE ON site_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_site_stats_timestamp();
