-- Theta Treats Phase 4 schema (portfolio admin power)
-- Run in Supabase Dashboard → SQL Editor (after 006_phase2_commerce_rules.sql)
--
-- Adds:
--   testimonials — customer quotes for homepage (admin CRUD)

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_testimonials_active ON testimonials (is_active, sort_order)
  WHERE is_active = true;

CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO testimonials (quote, author_name, author_role, sort_order) VALUES
  (
    'The fudgy brownies are unreal — ordered for a birthday and everyone asked where they were from.',
    'Priya S.',
    'Koramangala',
    1
  ),
  (
    'Fresh, rich, and delivered right on time. The cookie party pack is now our go-to for office treats.',
    'Arjun M.',
    'Indiranagar',
    2
  ),
  (
    'You can taste the quality in every bite. Mock checkout made it easy to try the full experience.',
    'Neha K.',
    'HSR Layout',
    3
  );
