-- Create product_features table
CREATE TABLE IF NOT EXISTS public.product_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Product features are viewable by everyone"
  ON public.product_features
  FOR SELECT
  USING (true);

CREATE POLICY "Product features are insertable by authenticated users"
  ON public.product_features
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Product features are updatable by admins"
  ON public.product_features
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Product features are deletable by admins"
  ON public.product_features
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS product_features_product_id_idx
  ON public.product_features(product_id);