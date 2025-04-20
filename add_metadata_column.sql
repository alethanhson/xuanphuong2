-- Add metadata column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Add comment to explain the purpose of the column
COMMENT ON COLUMN public.products.metadata IS 'Stores additional product data like features, applications, and image information';

-- Grant permissions to access the new column
GRANT ALL ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

-- Create RLS policies to allow access to the metadata column
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
CREATE POLICY "Enable read access for all users"
ON public.products
FOR SELECT
TO public
USING (true);

-- Create or replace policy for authenticated users to insert products with metadata
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.products;
CREATE POLICY "Enable insert for authenticated users"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create or replace policy for authenticated users to update products with metadata
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.products;
CREATE POLICY "Enable update for authenticated users"
ON public.products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
