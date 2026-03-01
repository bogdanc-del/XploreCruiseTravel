-- ============================================================
-- XploreCruiseTravel — Supabase PostgreSQL Schema
-- Migration 001: Initial tables, indexes, RLS policies
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. CRUISE LINES
-- ============================================================
CREATE TABLE cruise_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('luxury','premium','contemporary','river','expedition','boutique')),
  logo_url TEXT,
  ship_count INT DEFAULT 0,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. DESTINATIONS
-- ============================================================
CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_ro TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  description_ro TEXT,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. SUB-REGIONS (e.g. Western Med, Eastern Med under Mediterranean)
-- ============================================================
CREATE TABLE sub_regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ro TEXT NOT NULL,
  slug TEXT NOT NULL,
  UNIQUE(destination_id, slug)
);

-- ============================================================
-- 4. SHIPS
-- ============================================================
CREATE TABLE ships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cruise_line_id UUID NOT NULL REFERENCES cruise_lines(id) ON DELETE CASCADE,
  year_built INT,
  passenger_capacity INT,
  tonnage INT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. CRUISES (main product catalog)
-- ============================================================
CREATE TABLE cruises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id TEXT UNIQUE,                    -- ID from croaziere.net for sync
  title TEXT NOT NULL,
  title_ro TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  cruise_line_id UUID REFERENCES cruise_lines(id),
  ship_id UUID REFERENCES ships(id),
  destination_id UUID REFERENCES destinations(id),
  sub_region_id UUID REFERENCES sub_regions(id),
  cruise_type TEXT NOT NULL DEFAULT 'ocean' CHECK (cruise_type IN ('ocean','river','luxury','expedition')),
  nights INT NOT NULL CHECK (nights > 0),
  price_from DECIMAL(10,2) NOT NULL CHECK (price_from > 0),
  currency TEXT DEFAULT 'EUR',
  departure_port TEXT NOT NULL,
  departure_port_country TEXT,
  departure_date DATE NOT NULL,
  return_date DATE,
  ports_of_call TEXT[] DEFAULT '{}',          -- Array of port names
  ports_of_call_ro TEXT[] DEFAULT '{}',
  itinerary JSONB DEFAULT '[]',               -- [{day, port, arrival, departure}]
  image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  included TEXT[] DEFAULT '{}',
  included_ro TEXT[] DEFAULT '{}',
  excluded TEXT[] DEFAULT '{}',
  excluded_ro TEXT[] DEFAULT '{}',
  description TEXT,
  description_ro TEXT,
  advisor_note TEXT,
  advisor_note_ro TEXT,
  tags TEXT[] DEFAULT '{}',                   -- ['popular','family','budget','luxury','adults-only']
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  booking_url TEXT,                            -- Deep link to croaziere.net
  source TEXT DEFAULT 'manual',               -- 'manual' or 'croaziere_net'
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. CABIN TYPES (per cruise)
-- ============================================================
CREATE TABLE cabin_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cruise_id UUID NOT NULL REFERENCES cruises(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                         -- 'Interior', 'Ocean View', 'Balcony', 'Suite'
  type_ro TEXT NOT NULL,
  price_from DECIMAL(10,2) NOT NULL CHECK (price_from > 0),
  currency TEXT DEFAULT 'EUR',
  available BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0
);

-- ============================================================
-- 7. BOOKINGS (reservations from customers)
-- ============================================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_ref TEXT UNIQUE NOT NULL,           -- e.g. 'BK-20260301-ABC'
  cruise_id UUID REFERENCES cruises(id),
  cruise_title TEXT NOT NULL,                 -- Denormalized for quick access
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  cabin_preference TEXT,
  passengers INT DEFAULT 1 CHECK (passengers > 0),
  special_requests TEXT,
  gdpr_consent BOOLEAN NOT NULL DEFAULT FALSE,
  terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  total_price DECIMAL(10,2),
  currency TEXT DEFAULT 'EUR',
  notes TEXT,                                 -- Admin notes
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. CONTACT MESSAGES
-- ============================================================
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cruise_interest TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  replied BOOLEAN DEFAULT FALSE,
  admin_notes TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. SITE SETTINGS (key-value store)
-- ============================================================
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. SYNC LOGS (croaziere.net sync history)
-- ============================================================
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL DEFAULT 'croaziere_net',
  status TEXT NOT NULL CHECK (status IN ('running','success','failed','partial')),
  cruises_added INT DEFAULT 0,
  cruises_updated INT DEFAULT 0,
  cruises_removed INT DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- ============================================================
-- 11. PAGE VIEWS / ANALYTICS (simple tracking)
-- ============================================================
CREATE TABLE page_views (
  id BIGSERIAL PRIMARY KEY,
  page TEXT NOT NULL,
  cruise_id UUID REFERENCES cruises(id),
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_cruises_destination ON cruises(destination_id);
CREATE INDEX idx_cruises_cruise_line ON cruises(cruise_line_id);
CREATE INDEX idx_cruises_departure_date ON cruises(departure_date);
CREATE INDEX idx_cruises_price ON cruises(price_from);
CREATE INDEX idx_cruises_active ON cruises(active);
CREATE INDEX idx_cruises_featured ON cruises(featured) WHERE featured = TRUE;
CREATE INDEX idx_cruises_tags ON cruises USING GIN(tags);
CREATE INDEX idx_cruises_slug ON cruises(slug);
CREATE INDEX idx_cruises_external_id ON cruises(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX idx_cabin_types_cruise ON cabin_types(cruise_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);
CREATE INDEX idx_contact_messages_read ON contact_messages(read);
CREATE INDEX idx_contact_messages_created ON contact_messages(created_at DESC);
CREATE INDEX idx_page_views_page ON page_views(page, created_at DESC);
CREATE INDEX idx_page_views_cruise ON page_views(cruise_id) WHERE cruise_id IS NOT NULL;
CREATE INDEX idx_ships_cruise_line ON ships(cruise_line_id);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_cruises_updated BEFORE UPDATE ON cruises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_bookings_updated BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_cruise_lines_updated BEFORE UPDATE ON cruise_lines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_site_settings_updated BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE cruise_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ships ENABLE ROW LEVEL SECURITY;
ALTER TABLE cruises ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabin_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ: cruise_lines, destinations, sub_regions, ships, cruises (active only), cabin_types
CREATE POLICY "Public can read cruise lines" ON cruise_lines FOR SELECT USING (true);
CREATE POLICY "Public can read destinations" ON destinations FOR SELECT USING (active = true);
CREATE POLICY "Public can read sub regions" ON sub_regions FOR SELECT USING (true);
CREATE POLICY "Public can read ships" ON ships FOR SELECT USING (true);
CREATE POLICY "Public can read active cruises" ON cruises FOR SELECT USING (active = true);
CREATE POLICY "Public can read cabin types" ON cabin_types FOR SELECT USING (true);
CREATE POLICY "Public can read settings" ON site_settings FOR SELECT USING (true);

-- PUBLIC INSERT: bookings, contact_messages, page_views (anyone can submit)
CREATE POLICY "Public can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can send messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can log views" ON page_views FOR INSERT WITH CHECK (true);

-- ADMIN (authenticated): full CRUD on everything
CREATE POLICY "Admin full access cruise_lines" ON cruise_lines FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access destinations" ON destinations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access sub_regions" ON sub_regions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access ships" ON ships FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access cruises" ON cruises FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access cabin_types" ON cabin_types FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access sync_logs" ON sync_logs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access page_views" ON page_views FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- HELPER VIEWS
-- ============================================================

-- Cruise listing view with joined data
CREATE VIEW v_cruise_listing AS
SELECT
  c.id,
  c.slug,
  c.title,
  c.title_ro,
  cl.name AS cruise_line,
  cl.category AS cruise_line_category,
  s.name AS ship_name,
  d.name AS destination,
  d.name_ro AS destination_ro,
  d.slug AS destination_slug,
  c.cruise_type,
  c.nights,
  c.price_from,
  c.currency,
  c.departure_port,
  c.departure_date,
  c.ports_of_call,
  c.image_url,
  c.tags,
  c.featured,
  c.booking_url
FROM cruises c
LEFT JOIN cruise_lines cl ON c.cruise_line_id = cl.id
LEFT JOIN ships s ON c.ship_id = s.id
LEFT JOIN destinations d ON c.destination_id = d.id
WHERE c.active = TRUE
ORDER BY c.featured DESC, c.departure_date ASC;

-- Dashboard stats view
CREATE VIEW v_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM cruises WHERE active = TRUE) AS total_cruises,
  (SELECT COUNT(DISTINCT destination_id) FROM cruises WHERE active = TRUE) AS total_destinations,
  (SELECT COUNT(*) FROM bookings WHERE created_at > NOW() - INTERVAL '30 days') AS bookings_30d,
  (SELECT COUNT(*) FROM bookings WHERE status = 'pending') AS pending_bookings,
  (SELECT COUNT(*) FROM contact_messages WHERE read = FALSE) AS unread_messages,
  (SELECT COUNT(*) FROM page_views WHERE created_at > NOW() - INTERVAL '30 days') AS views_30d;

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Generate unique booking reference
CREATE OR REPLACE FUNCTION generate_booking_ref()
RETURNS TRIGGER AS $$
DECLARE
  ref TEXT;
  suffix TEXT;
BEGIN
  suffix := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
  ref := 'BK-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || suffix;
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM bookings WHERE booking_ref = ref) LOOP
    suffix := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
    ref := 'BK-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || suffix;
  END LOOP;
  NEW.booking_ref := ref;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_bookings_ref BEFORE INSERT ON bookings
  FOR EACH ROW WHEN (NEW.booking_ref IS NULL)
  EXECUTE FUNCTION generate_booking_ref();

-- Search cruises full-text
CREATE OR REPLACE FUNCTION search_cruises(search_query TEXT)
RETURNS SETOF v_cruise_listing AS $$
BEGIN
  RETURN QUERY
  SELECT vl.*
  FROM v_cruise_listing vl
  JOIN cruises c ON c.id = vl.id
  WHERE
    c.title ILIKE '%' || search_query || '%'
    OR c.title_ro ILIKE '%' || search_query || '%'
    OR vl.cruise_line ILIKE '%' || search_query || '%'
    OR vl.ship_name ILIKE '%' || search_query || '%'
    OR vl.destination ILIKE '%' || search_query || '%'
    OR c.departure_port ILIKE '%' || search_query || '%'
    OR search_query = ANY(c.tags)
  ORDER BY c.featured DESC, c.departure_date ASC;
END;
$$ LANGUAGE plpgsql;
