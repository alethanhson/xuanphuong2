-- Fix all policies in database to avoid duplication errors
DO $$
DECLARE
    all_tables TEXT[] := ARRAY[
        'product_categories',
        'products',
        'product_images',
        'product_features',
        'product_specifications',
        'product_reviews',
        'visitor_stats',
        'geographic_stats',
        'page_views',
        'visitor_logs',
        'profiles',
        'website_settings'
    ];
    t_name TEXT;
    pol RECORD;
BEGIN
    -- Drop and recreate all policies for all tables
    FOREACH t_name IN ARRAY all_tables
    LOOP
        -- Handle case when table might not exist yet
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t_name AND table_schema = 'public') THEN
            -- Drop all existing policies
            FOR pol IN (
                SELECT policyname
                FROM pg_policies
                WHERE tablename = t_name AND schemaname = 'public'
            )
            LOOP
                EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, t_name);
            END LOOP;
            
            -- Create the basic SELECT policy for everyone
            EXECUTE format('
                CREATE POLICY "%s are viewable by everyone" 
                ON public.%I
                FOR SELECT 
                USING (true)
            ', initcap(t_name), t_name);
            
            -- For admin tables, add policies for admin operations
            IF t_name IN ('products', 'product_categories', 'product_images', 'product_features', 
                              'product_specifications', 'product_reviews', 'website_settings') THEN
                
                -- Insert policy for admins
                EXECUTE format('
                    CREATE POLICY "%s are insertable by admins" 
                    ON public.%I
                    FOR INSERT 
                    WITH CHECK (
                        auth.role() = ''authenticated'' AND EXISTS (
                            SELECT 1 FROM public.profiles
                            WHERE profiles.id = auth.uid() AND profiles.role = ''admin''
                        )
                    )', initcap(t_name), t_name);
                
                -- Update policy for admins
                EXECUTE format('
                    CREATE POLICY "%s are updatable by admins" 
                    ON public.%I
                    FOR UPDATE 
                    USING (
                        auth.role() = ''authenticated'' AND EXISTS (
                            SELECT 1 FROM public.profiles
                            WHERE profiles.id = auth.uid() AND profiles.role = ''admin''
                        )
                    )', initcap(t_name), t_name);
                
                -- Delete policy for admins
                EXECUTE format('
                    CREATE POLICY "%s are deletable by admins" 
                    ON public.%I
                    FOR DELETE 
                    USING (
                        auth.role() = ''authenticated'' AND EXISTS (
                            SELECT 1 FROM public.profiles
                            WHERE profiles.id = auth.uid() AND profiles.role = ''admin''
                        )
                    )', initcap(t_name), t_name);
            END IF;
            
            -- Special case for visitor_logs - allow anonymous inserts
            IF t_name = 'visitor_logs' THEN
                EXECUTE '
                    CREATE POLICY "Allow insert for anonymous users" 
                    ON public.visitor_logs
                    FOR INSERT 
                    TO anon 
                    WITH CHECK (true)
                ';
            END IF;
        END IF;
    END LOOP;
    
    -- Enable RLS on all tables that might not have it enabled
    FOREACH t_name IN ARRAY all_tables
    LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t_name AND table_schema = 'public') THEN
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t_name);
        END IF;
    END LOOP;
END
$$; 