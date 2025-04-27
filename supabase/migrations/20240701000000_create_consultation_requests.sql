-- Create consultation requests table
CREATE TABLE IF NOT EXISTS public.consultation_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT,
  product_id UUID REFERENCES public.products(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  responded_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to read all consultation requests
CREATE POLICY "Admin can read all consultation requests" 
  ON public.consultation_requests 
  FOR SELECT 
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Create policy to allow anyone to insert consultation requests
CREATE POLICY "Anyone can create consultation requests" 
  ON public.consultation_requests 
  FOR INSERT 
  TO anon
  WITH CHECK (true); 