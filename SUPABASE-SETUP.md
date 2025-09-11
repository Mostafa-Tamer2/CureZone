# Supabase Setup for CureZone

This guide explains how to set up the Supabase database for the CureZone e-commerce platform.

## Database Tables

The CureZone platform uses the following tables:

1. `categories` - Product categories
2. `products` - Product information with references to categories
3. `users` - User profiles (extends Supabase Auth)
4. `cart` - Shopping cart items
5. `wishlist` - Wishlist items
6. `orders` - Order information
7. `order_items` - Individual items in orders

## Setup Instructions

### 1. Create Tables

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy the contents of the `supabase-tables.sql` file and paste it into the query editor
5. Run the query to create all tables, set up RLS policies, and insert sample data

### 2. Configure Environment Variables

Update your `.env.local` file with your Supabase project URL and anon key:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Data Model

The database follows this structure:

- Products belong to Categories (many-to-one)
- Users can have many Cart items
- Users can have many Wishlist items
- Users can place many Orders
- Orders contain many Order Items
- Order Items reference Products

## Row Level Security (RLS)

The Supabase setup includes RLS policies for security:

- Products and Categories are publicly readable
- User data is protected - users can only access their own data
- Cart and Wishlist items are protected - users can only access their own items
- Orders and Order Items are protected - users can only access their own orders

## Sample Data

The SQL script includes sample data for:

- Product categories (Medicines, Skin Care, Hair Care, Medical Equipment)
- Sample products in each category

Feel free to modify the sample data or add more products through the Supabase dashboard.

## Status Values

Product status values correspond to the tabs in the UI:

- `medicines` - Medicines tab
- `skin care` - Skin Care tab
- `hair care` - Hair Care tab
- `medical equipments` - Medical Equipments tab
