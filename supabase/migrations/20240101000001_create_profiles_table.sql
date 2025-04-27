-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
    -- Check if the policy "Public profiles are viewable by everyone" exists
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policy
        WHERE polname = 'Public profiles are viewable by everyone' AND polrelid = 'public.profiles'::regclass
    ) THEN
        -- Create the policy if it doesn't exist
        CREATE POLICY "Public profiles are viewable by everyone"
          ON public.profiles
          FOR SELECT
          USING (true);
    END IF;
END $$;

DO $$
BEGIN
    -- Check if the policy "Users can insert their own profile" exists
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policy
        WHERE polname = 'Users can insert their own profile' AND polrelid = 'public.profiles'::regclass
    ) THEN
        -- Create the policy if it doesn't exist
        CREATE POLICY "Users can insert their own profile"
          ON public.profiles
          FOR INSERT
          WITH CHECK (auth.uid() = id);
    END IF;
END $$;

DO $$
BEGIN
    -- Check if the policy "Users can update their own profile" exists
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policy
        WHERE polname = 'Users can update their own profile' AND polrelid = 'public.profiles'::regclass
    ) THEN
        -- Create the policy if it doesn't exist
        CREATE POLICY "Users can update their own profile"
          ON public.profiles
          FOR UPDATE
          USING (auth.uid() = id);
    END IF;
END $$;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url, role)
  VALUES (new.id, '', '', '', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
