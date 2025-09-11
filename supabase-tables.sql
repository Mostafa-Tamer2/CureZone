-- Create categories table
CREATE TABLE categories (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT
);

-- Create products table
CREATE TABLE products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  status TEXT, -- 'medicines', 'skin care', 'hair care', 'medical equipments'
  discount_percent DECIMAL(5, 2),
  category_id BIGINT REFERENCES categories(id)
);

-- Create cart table
CREATE TABLE cart (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wishlist table
CREATE TABLE wishlist (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_date TIMESTAMPTZ DEFAULT NOW(),
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  payment_method TEXT DEFAULT 'card', -- 'card', 'cod' (cash on delivery)
  shipping_details JSONB -- Store shipping address and contact information
);

-- Create order_items table
CREATE TABLE order_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Create RLS policies for security

-- Allow public read access to products and categories
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products" 
  ON products FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to categories" 
  ON categories FOR SELECT 
  USING (true);

-- Protect cart data
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own cart" 
  ON cart FOR ALL 
  USING (auth.uid() = user_id);

-- Protect wishlist data
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own wishlist" 
  ON wishlist FOR ALL 
  USING (auth.uid() = user_id);

-- Protect order data
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own orders" 
  ON orders FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own order items" 
  ON order_items FOR ALL 
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

--data insertion 
INSERT INTO categories (name, description) VALUES
  ('Medicines', 'All types of medications and pharmaceuticals'),
  ('Skin Care', 'Products for skin health and beauty'),
  ('Hair Care', 'Products for hair health and styling'),
  ('Medical Equipments', 'Medical devices and equipment');

-- Product Insertion
INSERT INTO products (name, image_url, description, price, stock_quantity, status, discount_percent, category_id) VALUES
  ('Paracetamol', 'https://example.com/paracetamol.jpg', 'Pain reliever and fever reducer', 5.99, 100, 'medicines', NULL, 1),
  ('Vitamin C Serum', 'https://example.com/vitaminc.jpg', 'Brightening serum with antioxidants', 24.99, 50, 'skin care', 10.00, 2),
  ('Biotin Shampoo', 'https://example.com/biotin.jpg', 'Strengthening shampoo for hair growth', 12.99, 75, 'hair care', 5.00, 3),
  ('Digital Thermometer', 'https://example.com/thermometer.jpg', 'Accurate temperature measurement device', 15.99, 30, 'medical equipments', NULL, 4),
  ('Aloe Vera Gel', 'https://example.com/aloevera.jpg', 'Soothing gel for skin irritation', 8.99, 60, 'skin care', NULL, 2),
  ('Blood Pressure Monitor', 'https://example.com/bpmonitor.jpg', 'Digital blood pressure measurement device', 49.99, 25, 'medical equipments', 15.00, 4); 