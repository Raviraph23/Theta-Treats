-- Theta Treats Phase 3 schema
-- Run in Supabase Dashboard → SQL Editor (after 002_products.sql)
--
-- Adds mock payment tracking on orders:
--   payment_status   — pending | paid | failed | cod
--   payment_method   — mock_upi | mock_card | cod
--   payment_reference — fake txn id (demo) or future Razorpay id
--   paid_at          — when payment completed
--
-- After running:
--   1. Checkout → /order/[orderNumber]/pay (mock payment page)
--   2. Admin orders show payment status
--   3. Set PAYMENT_PROVIDER=mock in .env.local (default for demo)

CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'cod');

ALTER TABLE orders
  ADD COLUMN payment_status payment_status NOT NULL DEFAULT 'pending',
  ADD COLUMN payment_method TEXT,
  ADD COLUMN payment_reference TEXT,
  ADD COLUMN paid_at TIMESTAMPTZ;

CREATE INDEX idx_orders_payment_status ON orders (payment_status);
