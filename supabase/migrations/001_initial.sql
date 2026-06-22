-- Theta Treats Phase 1 schema
-- Run this in Supabase Dashboard → SQL Editor
--
-- After running this migration:
-- 1. Copy Project URL + anon key + service_role key into .env.local (see .env.example)
-- 2. Supabase → Authentication → Users → Add user (email + password) for admin login
-- 3. npm run dev → test checkout at /checkout and admin at /admin/login

CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  notes TEXT,
  whatsapp_consent BOOLEAN NOT NULL DEFAULT true,
  status order_status NOT NULL DEFAULT 'pending',
  total INTEGER NOT NULL CHECK (total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  variant TEXT NOT NULL,
  variant_label TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 99),
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
  line_total INTEGER NOT NULL CHECK (line_total >= 0)
);

CREATE INDEX idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_order_number ON orders (order_number);
CREATE INDEX idx_order_items_order_id ON order_items (order_id);

CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Authenticated admin users can read and update orders.
-- Order creation uses the service role key from Next.js server actions only.
CREATE POLICY "Admin can read orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can read order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);
