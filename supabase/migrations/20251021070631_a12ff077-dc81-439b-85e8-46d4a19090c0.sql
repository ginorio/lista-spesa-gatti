-- Add new optional fields to user_products table
ALTER TABLE public.user_products 
ADD COLUMN IF NOT EXISTS custom_name TEXT,
ADD COLUMN IF NOT EXISTS comment TEXT,
ADD COLUMN IF NOT EXISTS location TEXT;