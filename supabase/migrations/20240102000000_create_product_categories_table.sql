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
DO $$
BEGIN
  -- Check if policies exist before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_categories' AND policyname = 'Product categories are viewable by everyone'
  ) THEN
    CREATE POLICY "Product categories are viewable by everyone" 
      ON public.product_categories 
      FOR SELECT 
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_categories' AND policyname = 'Product categories are insertable by admins'
  ) THEN
    CREATE POLICY "Product categories are insertable by admins" 
      ON public.product_categories 
      FOR INSERT 
      WITH CHECK (
        auth.role() = 'authenticated' AND EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_categories' AND policyname = 'Product categories are updatable by admins'
  ) THEN
    CREATE POLICY "Product categories are updatable by admins" 
      ON public.product_categories 
      FOR UPDATE 
      USING (
        auth.role() = 'authenticated' AND EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_categories' AND policyname = 'Product categories are deletable by admins'
  ) THEN
    CREATE POLICY "Product categories are deletable by admins" 
      ON public.product_categories 
      FOR DELETE 
      USING (
        auth.role() = 'authenticated' AND EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Insert initial categories with updated names
INSERT INTO public.product_categories (name, slug, description, is_active, order_num)
VALUES 
  ('Máy CNC Gỗ', 'may-cnc-go', 'Máy CNC gia công gỗ chuyên nghiệp, hiệu suất cao', true, 1),
  ('Máy Dán Cạnh', 'may-dan-canh', 'Máy dán cạnh tự động cho ngành nội thất', true, 2),
  ('Máy Gia Công Nội Thất', 'may-gia-cong-noi-that', 'Thiết bị gia công nội thất chuyên dụng', true, 3),
  ('Máy Khoan Ngang', 'may-khoan-ngang', 'Máy khoan ngang chính xác cao, năng suất tốt', true, 4),
  ('Máy Cưa Bàn Trượt', 'may-cua-ban-truot', 'Máy cưa bàn trượt đa năng, an toàn', true, 5)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  order_num = EXCLUDED.order_num;
