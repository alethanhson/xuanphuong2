-- Create product_specifications table
CREATE TABLE IF NOT EXISTS public.product_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.product_specifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Product specifications are viewable by everyone" 
  ON public.product_specifications 
  FOR SELECT 
  USING (true);

CREATE POLICY "Product specifications are insertable by authenticated users" 
  ON public.product_specifications 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Product specifications are updatable by admins" 
  ON public.product_specifications 
  FOR UPDATE 
  USING (
    auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Product specifications are deletable by admins" 
  ON public.product_specifications 
  FOR DELETE 
  USING (
    auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS product_specifications_product_id_idx 
  ON public.product_specifications(product_id);
