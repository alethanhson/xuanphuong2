-- Fix for the duplicate constraint error for visitor_stats
DO $$
BEGIN
    -- Check if the constraint exists first
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'unique_visitor_stats_date'
    ) THEN
        -- If it exists, drop it first
        ALTER TABLE visitor_stats DROP CONSTRAINT IF EXISTS unique_visitor_stats_date;
    END IF;

    -- Add the constraint if needed
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'visitor_stats'::regclass AND contype = 'u'
        AND conkey = (SELECT array_agg(attnum ORDER BY attname) FROM pg_attribute WHERE attrelid = 'visitor_stats'::regclass AND attname = 'stat_date')
    ) THEN
        -- Add the unique constraint safely
        ALTER TABLE visitor_stats ADD CONSTRAINT unique_visitor_stats_date UNIQUE (stat_date);
    END IF;
END $$; 