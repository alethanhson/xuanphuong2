-- Create product_categories table
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.product_categories(id),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS product_categories_slug_idx ON public.product_categories(slug);

-- Enable Row Level Security
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Product categories are viewable by everyone" 
  ON public.product_categories 
  FOR SELECT 
  USING (true);

CREATE POLICY "Product categories are insertable by admins" 
  ON public.product_categories 
  FOR INSERT 
  WITH CHECK (
    auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Product categories are updatable by admins" 
  ON public.product_categories 
  FOR UPDATE 
  USING (
    auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Product categories are deletable by admins" 
  ON public.product_categories 
  FOR DELETE 
  USING (
    auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Insert some initial categories
INSERT INTO public.product_categories (name, slug, description, is_active, order_num)
VALUES 
  ('Máy CNC Gỗ', 'may-cnc-go', 'Các loại máy CNC chuyên dụng cho ngành gỗ', true, 1),
  ('Máy CNC Kim Loại', 'may-cnc-kim-loai', 'Các loại máy CNC chuyên dụng cho ngành kim loại', true, 2),
  ('Máy CNC Laser', 'may-cnc-laser', 'Các loại máy CNC sử dụng công nghệ laser', true, 3),
  ('Phụ kiện CNC', 'phu-kien-cnc', 'Các loại phụ kiện và linh kiện cho máy CNC', true, 4)
ON CONFLICT (slug) DO NOTHING;
