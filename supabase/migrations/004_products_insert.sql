-- Allow authenticated admin users to insert products (Menu CRUD)

CREATE POLICY "Admin can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);
