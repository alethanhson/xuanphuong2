-- Add RLS for products table if not already set
DO $$
BEGIN
  -- Enable Row Level Security if not already enabled
  EXECUTE 'ALTER TABLE public.products ENABLE ROW LEVEL SECURITY';
  
  -- Create select policy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' AND policyname = 'Products are viewable by everyone'
  ) THEN
    CREATE POLICY "Products are viewable by everyone" 
      ON public.products
      FOR SELECT 
      USING (true);
  END IF;
  
  -- Create admin policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' AND policyname = 'Products are insertable by admins'
  ) THEN
    CREATE POLICY "Products are insertable by admins" 
      ON public.products
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
    WHERE tablename = 'products' AND policyname = 'Products are updatable by admins'
  ) THEN
    CREATE POLICY "Products are updatable by admins" 
      ON public.products
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
    WHERE tablename = 'products' AND policyname = 'Products are deletable by admins'
  ) THEN
    CREATE POLICY "Products are deletable by admins" 
      ON public.products
      FOR DELETE 
      USING (
        auth.role() = 'authenticated' AND EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$; 