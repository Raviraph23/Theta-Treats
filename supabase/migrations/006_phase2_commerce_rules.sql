-- Theta Treats Phase 2 schema (portfolio commerce rules)
-- Run in Supabase Dashboard → SQL Editor (after 005_phase1_customer_ux.sql)
--
-- Adds:
--   promo_codes     — discount codes (THETA10, etc.)
--   store_settings  — min order, delivery fees, zones (singleton row)
--   products        — is_sold_out, daily_limit
--   orders          — subtotal, discount_amount, delivery_fee, promo_code

CREATE TYPE promo_discount_type AS ENUM ('percent', 'fixed');

CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type promo_discount_type NOT NULL,
  discount_value INTEGER NOT NULL CHECK (discount_value > 0),
  min_order INTEGER NOT NULL DEFAULT 0 CHECK (min_order >= 0),
  max_uses INTEGER CHECK (max_uses IS NULL OR max_uses > 0),
  use_count INTEGER NOT NULL DEFAULT 0 CHECK (use_count >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE store_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  min_order_amount INTEGER NOT NULL DEFAULT 500 CHECK (min_order_amount >= 0),
  free_delivery_threshold INTEGER NOT NULL DEFAULT 999 CHECK (free_delivery_threshold >= 0),
  default_delivery_fee INTEGER NOT NULL DEFAULT 49 CHECK (default_delivery_fee >= 0),
  delivery_zones JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO store_settings (id) VALUES ('default');

ALTER TABLE products
  ADD COLUMN is_sold_out BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN daily_limit INTEGER CHECK (daily_limit IS NULL OR daily_limit > 0);

ALTER TABLE orders
  ADD COLUMN subtotal INTEGER,
  ADD COLUMN discount_amount INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN delivery_fee INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN promo_code TEXT;

UPDATE orders SET subtotal = total WHERE subtotal IS NULL;

CREATE INDEX idx_promo_codes_code ON promo_codes (code);
CREATE INDEX idx_promo_codes_active ON promo_codes (is_active) WHERE is_active = true;
CREATE INDEX idx_orders_promo_code ON orders (promo_code) WHERE promo_code IS NOT NULL;

CREATE TRIGGER promo_codes_updated_at
  BEFORE UPDATE ON promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

CREATE TRIGGER store_settings_updated_at
  BEFORE UPDATE ON store_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage promo codes"
  ON promo_codes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can read store settings"
  ON store_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can update store settings"
  ON store_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Demo promo codes
INSERT INTO promo_codes (code, discount_type, discount_value, min_order) VALUES
  ('THETA10', 'percent', 10, 0),
  ('FLAT50', 'fixed', 50, 800);

-- Demo delivery zones (Bangalore pincode prefixes)
UPDATE store_settings SET delivery_zones = '[
  {"prefix": "560", "label": "Central Bangalore", "fee": 0},
  {"prefix": "561", "label": "North Bangalore", "fee": 39},
  {"prefix": "562", "label": "East Bangalore", "fee": 39},
  {"prefix": "563", "label": "South Bangalore", "fee": 49}
]'::jsonb
WHERE id = 'default';
