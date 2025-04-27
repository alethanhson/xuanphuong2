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

-- Create policies using DO block to check if they exist first
DO $$
BEGIN
  -- Create select policy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_specifications' AND policyname = 'Product specifications are viewable by everyone'
  ) THEN
    CREATE POLICY "Product specifications are viewable by everyone" 
      ON public.product_specifications 
      FOR SELECT 
      USING (true);
  END IF;

  -- Create insert policy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_specifications' AND policyname = 'Product specifications are insertable by authenticated users'
  ) THEN
    CREATE POLICY "Product specifications are insertable by authenticated users" 
      ON public.product_specifications 
      FOR INSERT 
      WITH CHECK (auth.role() = 'authenticated');
  END IF;

  -- Create update policy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_specifications' AND policyname = 'Product specifications are updatable by admins'
  ) THEN
    CREATE POLICY "Product specifications are updatable by admins" 
      ON public.product_specifications 
      FOR UPDATE 
      USING (
        auth.role() = 'authenticated' AND EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;

  -- Create delete policy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_specifications' AND policyname = 'Product specifications are deletable by admins'
  ) THEN
    CREATE POLICY "Product specifications are deletable by admins" 
      ON public.product_specifications 
      FOR DELETE 
      USING (
        auth.role() = 'authenticated' AND EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS product_specifications_product_id_idx 
  ON public.product_specifications(product_id);
