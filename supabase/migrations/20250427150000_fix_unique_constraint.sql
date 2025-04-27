-- Fix for the duplicate constraint error
DO $$
BEGIN
    -- Check if the constraint exists first
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'unique_geographic_stats'
    ) THEN
        -- If it exists, drop it first
        ALTER TABLE geographic_stats DROP CONSTRAINT IF EXISTS unique_geographic_stats;
    END IF;

    -- Add the constraint if the combination doesn't already have a constraint
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'geographic_stats'::regclass AND contype = 'u'
        AND conkey = (SELECT array_agg(attnum ORDER BY attname) FROM pg_attribute WHERE attrelid = 'geographic_stats'::regclass AND attname IN ('stat_date', 'region', 'city'))
    ) THEN
        -- Add the unique constraint safely
        ALTER TABLE geographic_stats ADD CONSTRAINT unique_geographic_stats UNIQUE (stat_date, region, city);
    END IF;
    
    -- Check if the page_views constraint exists first
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'unique_page_views'
    ) THEN
        -- If it exists, drop it first
        ALTER TABLE page_views DROP CONSTRAINT IF EXISTS unique_page_views;
    END IF;

    -- Add the page_views constraint if needed
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'page_views'::regclass AND contype = 'u'
        AND conkey = (SELECT array_agg(attnum ORDER BY attname) FROM pg_attribute WHERE attrelid = 'page_views'::regclass AND attname IN ('stat_date', 'page_url'))
    ) THEN
        -- Add the unique constraint safely
        ALTER TABLE page_views ADD CONSTRAINT unique_page_views UNIQUE (stat_date, page_url);
    END IF;
END $$; 