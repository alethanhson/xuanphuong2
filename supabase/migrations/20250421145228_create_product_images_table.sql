-- Create product_images table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Product images are viewable by everyone"
  ON public.product_images
  FOR SELECT
  USING (true);

CREATE POLICY "Product images are insertable by authenticated users"
  ON public.product_images
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Product images are updatable by admins"
  ON public.product_images
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Product images are deletable by admins"
  ON public.product_images
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS product_images_product_id_idx
  ON public.product_images(product_id);