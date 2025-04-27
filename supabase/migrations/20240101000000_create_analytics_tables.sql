-- Create visitor_stats table
CREATE TABLE IF NOT EXISTS visitor_stats (
  id BIGSERIAL PRIMARY KEY,
  stat_date DATE NOT NULL UNIQUE,
  total_visitors INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  page_views INTEGER NOT NULL DEFAULT 0,
  avg_session_duration INTEGER NOT NULL DEFAULT 0, -- in seconds
  bounce_rate DECIMAL(5,2) NOT NULL DEFAULT 0, -- percentage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create geographic_stats table
CREATE TABLE IF NOT EXISTS geographic_stats (
  id BIGSERIAL PRIMARY KEY,
  stat_date DATE NOT NULL,
  region VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  visitor_count INTEGER NOT NULL DEFAULT 0,
  page_views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(stat_date, region, city)
);

-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id BIGSERIAL PRIMARY KEY,
  stat_date DATE NOT NULL,
  page_url VARCHAR(255) NOT NULL,
  page_title VARCHAR(255) NOT NULL,
  view_count INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  avg_time_on_page INTEGER NOT NULL DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(stat_date, page_url)
);

-- Create visitor_logs table for raw data
CREATE TABLE IF NOT EXISTS visitor_logs (
  id BIGSERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  visitor_id VARCHAR(100) NOT NULL,
  page_url VARCHAR(255) NOT NULL,
  page_title VARCHAR(255) NOT NULL,
  referrer VARCHAR(255),
  user_agent VARCHAR(255),
  ip_address VARCHAR(50),
  region VARCHAR(100),
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Vietnam',
  device_type VARCHAR(50),
  browser VARCHAR(50),
  os VARCHAR(50),
  visit_duration INTEGER, -- in seconds
  is_bounce BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='visitor_stats' AND column_name='stat_date') THEN
        ALTER TABLE visitor_stats ADD COLUMN stat_date DATE NOT NULL DEFAULT CURRENT_DATE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_visitor_stats_date ON visitor_stats(stat_date);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='geographic_stats' AND column_name='stat_date') THEN
        ALTER TABLE geographic_stats ADD COLUMN stat_date DATE NOT NULL DEFAULT CURRENT_DATE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_geographic_stats_date ON geographic_stats(stat_date);
CREATE INDEX IF NOT EXISTS idx_geographic_stats_region ON geographic_stats(region);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='page_views' AND column_name='stat_date') THEN
        ALTER TABLE page_views ADD COLUMN stat_date DATE NOT NULL DEFAULT CURRENT_DATE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(stat_date);
CREATE INDEX IF NOT EXISTS idx_page_views_url ON page_views(page_url);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_session ON visitor_logs(session_id);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='visitor_logs' AND column_name='visitor_id') THEN
        ALTER TABLE visitor_logs ADD COLUMN visitor_id VARCHAR(100) NOT NULL DEFAULT ''; -- Assuming VARCHAR(100) based on table definition
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_visitor_logs_visitor ON visitor_logs(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_region ON visitor_logs(region);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created ON visitor_logs(created_at);

-- Insert sample data for visitor_stats (15 days)
DO $$
BEGIN
    -- Skip creating this constraint as it might already exist
    -- It will be handled in a separate migration
END $$;

INSERT INTO visitor_stats (stat_date, total_visitors, unique_visitors, page_views, avg_session_duration, bounce_rate)
VALUES
  (CURRENT_DATE, 20000, 14000, 60000, 250, 25.0),
  (CURRENT_DATE - INTERVAL '1 day', 19500, 13650, 58500, 245, 25.5),
  (CURRENT_DATE - INTERVAL '2 days', 18900, 13230, 56700, 240, 26.1),
  (CURRENT_DATE - INTERVAL '3 days', 18200, 12740, 54600, 235, 26.8),
  (CURRENT_DATE - INTERVAL '4 days', 17500, 12250, 52500, 230, 27.5),
  (CURRENT_DATE - INTERVAL '5 days', 16800, 11760, 50400, 225, 28.2),
  (CURRENT_DATE - INTERVAL '6 days', 16200, 11340, 48600, 220, 28.9),
  (CURRENT_DATE - INTERVAL '7 days', 15600, 10920, 46800, 215, 29.8),
  (CURRENT_DATE - INTERVAL '8 days', 15100, 10570, 45300, 210, 30.5),
  (CURRENT_DATE - INTERVAL '9 days', 14800, 10360, 44400, 205, 31.8),
  (CURRENT_DATE - INTERVAL '10 days', 14200, 9940, 42600, 201, 32.7),
  (CURRENT_DATE - INTERVAL '11 days', 13500, 9450, 40500, 195, 33.9),
  (CURRENT_DATE - INTERVAL '12 days', 12800, 8960, 38400, 188, 35.5),
  (CURRENT_DATE - INTERVAL '13 days', 13200, 9240, 39600, 192, 34.8),
  (CURRENT_DATE - INTERVAL '14 days', 12500, 8750, 37500, 185, 35.2)
ON CONFLICT (stat_date) DO UPDATE SET
  total_visitors = EXCLUDED.total_visitors,
  unique_visitors = EXCLUDED.unique_visitors,
  page_views = EXCLUDED.page_views,
  avg_session_duration = EXCLUDED.avg_session_duration,
  bounce_rate = EXCLUDED.bounce_rate,
  updated_at = NOW();

-- Insert sample data for geographic_stats
DO $$
BEGIN
    -- Check if the unique constraint on stat_date, region, city exists
    -- Skip creating this constraint as it might already exist
    -- It will be handled in a later migration (20250427150000_fix_unique_constraint.sql)
END $$;

INSERT INTO geographic_stats (stat_date, region, city, visitor_count, page_views)
VALUES
  (CURRENT_DATE, 'Hồ Chí Minh', 'Quận 1', 8352, 25056),
  (CURRENT_DATE, 'Hà Nội', 'Ba Đình', 5212, 15636),
  (CURRENT_DATE, 'Đà Nẵng', 'Hải Châu', 1845, 5535),
  (CURRENT_DATE, 'Cần Thơ', 'Ninh Kiều', 982, 2946),
  (CURRENT_DATE, 'Hải Phòng', 'Hồng Bàng', 754, 2262),
  (CURRENT_DATE, 'Bình Dương', 'Thủ Dầu Một', 623, 1869),
  (CURRENT_DATE, 'Đồng Nai', 'Biên Hòa', 587, 1761),
  (CURRENT_DATE, 'Khánh Hòa', 'Nha Trang', 498, 1494),
  (CURRENT_DATE, 'Bắc Ninh', 'TP. Bắc Ninh', 412, 1236),
  (CURRENT_DATE, 'Quảng Ninh', 'Hạ Long', 389, 1167)
ON CONFLICT (stat_date, region, city) DO UPDATE SET
  visitor_count = EXCLUDED.visitor_count,
  page_views = EXCLUDED.page_views,
  updated_at = NOW();

-- Insert sample data for page_views
DO $$
BEGIN
    -- Skip creating this constraint as it might already exist
    -- It will be handled properly in another migration
END $$;

INSERT INTO page_views (stat_date, page_url, page_title, view_count, unique_visitors, avg_time_on_page)
VALUES
  (CURRENT_DATE, '/', 'Trang chủ | Tân Tiến Vinh', 15420, 9252, 120),
  (CURRENT_DATE, '/products', 'Sản phẩm | Tân Tiến Vinh', 12350, 7410, 180),
  (CURRENT_DATE, '/products/may-cnc-go', 'Máy CNC Gỗ | Tân Tiến Vinh', 8750, 5250, 210),
  (CURRENT_DATE, '/products/may-dan-canh', 'Máy Dán Cạnh | Tân Tiến Vinh', 7320, 4392, 195),
  (CURRENT_DATE, '/products/may-gia-cong-noi-that', 'Máy Gia Công Nội Thất | Tân Tiến Vinh', 6540, 3924, 185),
  (CURRENT_DATE, '/products/may-khoan-ngang', 'Máy Khoan Ngang | Tân Tiến Vinh', 5280, 3168, 150),
  (CURRENT_DATE, '/products/may-cua-ban-truot', 'Máy Cưa Bàn Trượt | Tân Tiến Vinh', 4950, 2970, 90),
  (CURRENT_DATE, '/blog', 'Blog | Tân Tiến Vinh', 3850, 2310, 105),
  (CURRENT_DATE, '/contact', 'Liên hệ | Tân Tiến Vinh', 3420, 2052, 135),
  (CURRENT_DATE, '/admin', 'Dashboard | Admin Tân Tiến Vinh', 5842, 1752, 255)
ON CONFLICT (stat_date, page_url) DO UPDATE SET
  page_title = EXCLUDED.page_title,
  view_count = EXCLUDED.view_count,
  unique_visitors = EXCLUDED.unique_visitors,
  avg_time_on_page = EXCLUDED.avg_time_on_page,
  updated_at = NOW();

-- Create a function to track page views
CREATE OR REPLACE FUNCTION track_page_view(
  p_session_id VARCHAR,
  p_visitor_id VARCHAR,
  p_page_url VARCHAR,
  p_page_title VARCHAR,
  p_referrer VARCHAR DEFAULT NULL,
  p_user_agent VARCHAR DEFAULT NULL,
  p_ip_address VARCHAR DEFAULT NULL,
  p_region VARCHAR DEFAULT NULL,
  p_city VARCHAR DEFAULT NULL,
  p_device_type VARCHAR DEFAULT NULL,
  p_browser VARCHAR DEFAULT NULL,
  p_os VARCHAR DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  -- Insert into visitor_logs
  INSERT INTO visitor_logs (
    session_id, visitor_id, page_url, page_title, referrer, 
    user_agent, ip_address, region, city, device_type, browser, os
  ) VALUES (
    p_session_id, p_visitor_id, p_page_url, p_page_title, p_referrer,
    p_user_agent, p_ip_address, p_region, p_city, p_device_type, p_browser, p_os
  );
  
  -- Update page_views
  INSERT INTO page_views (stat_date, page_url, page_title, view_count, unique_visitors, avg_time_on_page)
  VALUES (CURRENT_DATE, p_page_url, p_page_title, 1, 1, 0)
  ON CONFLICT (stat_date, page_url) DO UPDATE SET
    view_count = page_views.view_count + 1,
    unique_visitors = (
      SELECT COUNT(DISTINCT visitor_id) 
      FROM visitor_logs 
      WHERE page_url = p_page_url AND DATE(created_at) = CURRENT_DATE
    ),
    updated_at = NOW();
  
  -- Update geographic_stats if region is provided
  IF p_region IS NOT NULL THEN
    INSERT INTO geographic_stats (stat_date, region, city, visitor_count, page_views)
    VALUES (CURRENT_DATE, p_region, p_city, 1, 1)
    ON CONFLICT (stat_date, region, city) DO UPDATE SET
      visitor_count = (
        SELECT COUNT(DISTINCT visitor_id) 
        FROM visitor_logs 
        WHERE region = p_region AND city IS NOT DISTINCT FROM p_city AND DATE(created_at) = CURRENT_DATE
      ),
      page_views = geographic_stats.page_views + 1,
      updated_at = NOW();
  END IF;
  
  -- Update visitor_stats
  INSERT INTO visitor_stats (stat_date, total_visitors, unique_visitors, page_views)
  VALUES (CURRENT_DATE, 1, 1, 1)
  ON CONFLICT (stat_date) DO UPDATE SET
    total_visitors = visitor_stats.total_visitors + 1,
    unique_visitors = (
      SELECT COUNT(DISTINCT visitor_id) 
      FROM visitor_logs 
      WHERE DATE(created_at) = CURRENT_DATE
    ),
    page_views = visitor_stats.page_views + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a function to update session duration and bounce rate
CREATE OR REPLACE FUNCTION update_session_metrics(
  p_session_id VARCHAR,
  p_duration INTEGER,
  p_is_bounce BOOLEAN
) RETURNS VOID AS $$
BEGIN
  -- Update the visitor_logs entry
  UPDATE visitor_logs
  SET visit_duration = p_duration, is_bounce = p_is_bounce
  WHERE session_id = p_session_id AND visit_duration IS NULL;
  
  -- Update avg_session_duration in visitor_stats
  UPDATE visitor_stats
  SET avg_session_duration = (
    SELECT COALESCE(AVG(visit_duration), 0)::INTEGER
    FROM visitor_logs
    WHERE DATE(created_at) = CURRENT_DATE AND visit_duration IS NOT NULL
  ),
  bounce_rate = (
    SELECT COALESCE(
      (COUNT(*) FILTER (WHERE is_bounce = TRUE) * 100.0 / NULLIF(COUNT(*), 0))::DECIMAL(5,2),
      0
    )
    FROM visitor_logs
    WHERE DATE(created_at) = CURRENT_DATE AND is_bounce IS NOT NULL
  ),
  updated_at = NOW()
  WHERE stat_date = CURRENT_DATE;
  
  -- Update avg_time_on_page in page_views
  UPDATE page_views
  SET avg_time_on_page = (
    SELECT COALESCE(AVG(visit_duration), 0)::INTEGER
    FROM visitor_logs
    WHERE DATE(created_at) = CURRENT_DATE AND page_url = (
      SELECT page_url FROM visitor_logs WHERE session_id = p_session_id LIMIT 1
    ) AND visit_duration IS NOT NULL
  ),
  updated_at = NOW()
  WHERE stat_date = CURRENT_DATE AND page_url = (
    SELECT page_url FROM visitor_logs WHERE session_id = p_session_id LIMIT 1
  );
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE geographic_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
DO $$
BEGIN
  -- Kiểm tra xem policy đã tồn tại hay chưa trước khi tạo
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'visitor_stats' AND policyname = 'Allow read access for authenticated users'
  ) THEN
    CREATE POLICY "Allow read access for authenticated users" ON visitor_stats
      FOR SELECT TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'geographic_stats' AND policyname = 'Allow read access for authenticated users'
  ) THEN
    CREATE POLICY "Allow read access for authenticated users" ON geographic_stats
      FOR SELECT TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'page_views' AND policyname = 'Allow read access for authenticated users'
  ) THEN
    CREATE POLICY "Allow read access for authenticated users" ON page_views
      FOR SELECT TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'visitor_logs' AND policyname = 'Allow read access for authenticated users'
  ) THEN
    CREATE POLICY "Allow read access for authenticated users" ON visitor_logs
      FOR SELECT TO authenticated USING (true);
  END IF;

  -- Kiểm tra policy cho anonymous users
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'visitor_logs' AND policyname = 'Allow insert for anonymous users'
  ) THEN
    CREATE POLICY "Allow insert for anonymous users" ON visitor_logs
      FOR INSERT TO anon WITH CHECK (true);
  END IF;
END $$;

-- Create API for tracking
CREATE OR REPLACE FUNCTION public.track_analytics(
  session_id TEXT,
  visitor_id TEXT,
  page_url TEXT,
  page_title TEXT,
  referrer TEXT DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  ip_address TEXT DEFAULT NULL,
  region TEXT DEFAULT NULL,
  city TEXT DEFAULT NULL,
  device_type TEXT DEFAULT NULL,
  browser TEXT DEFAULT NULL,
  os TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  PERFORM track_page_view(
    session_id, visitor_id, page_url, page_title, referrer,
    user_agent, ip_address, region, city, device_type, browser, os
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create API for updating session metrics
CREATE OR REPLACE FUNCTION public.update_analytics_session(
  session_id TEXT,
  duration INTEGER,
  is_bounce BOOLEAN
) RETURNS VOID AS $$
BEGIN
  PERFORM update_session_metrics(session_id, duration, is_bounce);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
