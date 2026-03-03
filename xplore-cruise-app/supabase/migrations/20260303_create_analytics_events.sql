-- ============================================================
-- Analytics events — privacy-safe event tracking
-- Stores CTA impressions, clicks, and other funnel events
-- ============================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name  text NOT NULL,
  url         text,
  locale      text,
  page        text,
  cruise_slug text,
  metadata    jsonb DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Indexes for efficient aggregation queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events (event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events (created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name_created ON analytics_events (event_name, created_at);

-- Composite index for A/B testing queries (event_name + variant from metadata)
CREATE INDEX IF NOT EXISTS idx_analytics_events_metadata_variant ON analytics_events ((metadata->>'variant')) WHERE event_name IN ('cta_impression', 'cta_click');

-- Row Level Security
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Service role can insert (server-side only)
CREATE POLICY "Service role can insert events"
  ON analytics_events FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Authenticated users (admin) can read events
CREATE POLICY "Authenticated can read events"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (true);

-- Anon can insert via API route (server proxies)
CREATE POLICY "Anon can insert events"
  ON analytics_events FOR INSERT
  TO anon
  WITH CHECK (true);

-- Auto-cleanup: events older than 90 days (optional, run via cron)
-- SELECT cron.schedule('cleanup-old-events', '0 3 * * 0', $$
--   DELETE FROM analytics_events WHERE created_at < now() - interval '90 days';
-- $$);
