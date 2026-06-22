-- Theta Treats Phase 2 schema
-- Run in Supabase Dashboard → SQL Editor (after 001_initial.sql)
--
-- Adds:
--   products  — menu catalog (replaces src/data/products.ts at runtime)
--   customers — repeat buyer records (upserted on each order)
--
-- After running:
--   1. Storefront reads products from Supabase
--   2. Admin → /admin/products to edit prices and availability
--   3. Optional: set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID in .env.local

CREATE TYPE product_category AS ENUM ('brownie', 'cookie');

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  category product_category NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  pricing JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  last_address TEXT,
  order_count INTEGER NOT NULL DEFAULT 0 CHECK (order_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON products (category, sort_order);
CREATE INDEX idx_products_active ON products (is_active) WHERE is_active = true;
CREATE INDEX idx_customers_phone ON customers (phone);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Public can read active products (storefront)
CREATE POLICY "Anyone can read active products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admin can read all products (including inactive)
CREATE POLICY "Admin can read all products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Customers table: admin only (no public access)
CREATE POLICY "Admin can read customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

-- Seed menu from original static catalog
INSERT INTO products (id, category, name, description, image, tags, pricing, sort_order) VALUES
  ('classic-fudgy', 'brownie', 'Classic Fudgy Brownies',
   'Rich, dense, and deeply chocolatey. Our signature brownie with a crackly top and molten fudgy center.',
   '/brownies/classic-fudgy-brownie.png', ARRAY['Bestseller'],
   '{"500g": 750, "750g": 1125, "1kg": 1500}'::jsonb, 1),
  ('banana-walnut', 'brownie', 'Banana Walnut Brownies',
   'Ripe banana folded into fudgy chocolate batter with toasted walnuts for a wholesome, nutty bite.',
   '/brownies/banana-walnut-brownie.png', ARRAY['Wholesome'],
   '{"500g": 875, "750g": 1310, "1kg": 1750}'::jsonb, 2),
  ('rich-coffee', 'brownie', 'Rich Coffee Brownies',
   'Dark chocolate meets bold espresso in a deeply indulgent brownie with a subtle coffee kick.',
   '/brownies/rich-coffee-brownie.png', ARRAY['Bold'],
   '{"500g": 800, "750g": 1200, "1kg": 1600}'::jsonb, 3),
  ('lotus-biscoff', 'brownie', 'Lotus Biscoff Brownies',
   'Caramelized Biscoff biscuit crumbs swirled through chocolate brownie — buttery, spiced, irresistible.',
   '/brownies/lotus-biscoff-brownie.png', ARRAY['Fan favourite'],
   '{"500g": 950, "750g": 1425, "1kg": 1900}'::jsonb, 4),
  ('pistachio', 'brownie', 'Pistachio Brownies',
   'Premium pistachios baked into rich chocolate with a delicate green pistachio drizzle on top.',
   '/brownies/pistachio-brownie.png', ARRAY['Premium'],
   '{"500g": 1000, "750g": 1500, "1kg": 2000}'::jsonb, 5),
  ('oreo', 'brownie', 'Oreo Brownies',
   'Creamy cookie chunks and crushed Oreo folded into fudgy chocolate — a playful classic twist.',
   '/brownies/oreo-brownie.png', ARRAY['Indulgent'],
   '{"500g": 850, "750g": 1275, "1kg": 1700}'::jsonb, 6),
  ('classic-chocolate-chunk', 'cookie', 'Classic Chocolate Chunk',
   'Generous dark chocolate chunks in a buttery, golden cookie — our everyday favourite at ₹100 per piece.',
   '/cookies/classic-chocolate-chunk.png', ARRAY['Classic'],
   '{"3": 300, "6": 540, "12": 960}'::jsonb, 10),
  ('madras-filter-coffee', 'cookie', 'Madras Filter Coffee Dark Choc',
   'Roasted chicory-coffee infusion swirled through dark chocolate — a Chennai-inspired local fusion.',
   '/cookies/madras-filter-coffee.png', ARRAY['Local fusion'],
   '{"3": 330, "6": 590, "12": 1050}'::jsonb, 11),
  ('oats-cranberry-almond', 'cookie', 'Toasted Oats, Cranberry & Almond',
   'Wholesome toasted oats with real dried cranberries and crunchy almonds — a health-forward indulgence.',
   '/cookies/oats-cranberry-almond.png', ARRAY['Healthy'],
   '{"3": 350, "6": 630, "12": 1120}'::jsonb, 12),
  ('nutella-lava-bomb', 'cookie', 'Nutella Lava Bomb',
   'Gooey Nutella cores piped and frozen before baking — an Instagram-worthy stuffed cookie experience.',
   '/cookies/nutella-lava-bomb.png', ARRAY['Luxury'],
   '{"3": 400, "6": 720, "12": 1280}'::jsonb, 13),
  ('red-velvet-cream-cheese', 'cookie', 'Red Velvet Cream Cheese',
   'Vibrant red velvet cookie with a rich eggless cream cheese filling — stunning inside and out.',
   '/cookies/red-velvet-cream-cheese.png', ARRAY['Luxury'],
   '{"3": 420, "6": 750, "12": 1340}'::jsonb, 14),
  ('damascus-rose-pistachio', 'cookie', 'Damascus Rose & Pistachio',
   'Delicate Damascus rose and crushed pistachios in a luxury botanical cookie — floral, nutty, unforgettable.',
   '/cookies/damascus-rose-pistachio.png', ARRAY['Luxury'],
   '{"3": 450, "6": 800, "12": 1440}'::jsonb, 15);
