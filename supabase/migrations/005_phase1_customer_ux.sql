-- Theta Treats Phase 1 schema (portfolio customer UX)
-- Run in Supabase Dashboard → SQL Editor (after 004_products_insert.sql)
--
-- Adds delivery scheduling and gift fields on orders:
--   delivery_date   — preferred delivery date (YYYY-MM-DD)
--   delivery_slot   — morning | afternoon | evening
--   gift_message    — optional message for gift orders
--   occasion        — optional occasion label (birthday, thank_you, etc.)

ALTER TABLE orders
  ADD COLUMN delivery_date DATE,
  ADD COLUMN delivery_slot TEXT,
  ADD COLUMN gift_message TEXT,
  ADD COLUMN occasion TEXT;

CREATE INDEX idx_orders_delivery_date ON orders (delivery_date);
