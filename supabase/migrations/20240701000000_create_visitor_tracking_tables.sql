-- Create visitor_logs table
CREATE TABLE IF NOT EXISTS public.visitor_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  page_url TEXT NOT NULL,
  page_title TEXT,
  visit_duration INTEGER DEFAULT 0,
  is_unique BOOLEAN DEFAULT true,
  country TEXT DEFAULT 'Việt Nam',
  region TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_views table to track page view statistics
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date DATE NOT NULL,
  page_url TEXT NOT NULL,
  page_title TEXT,
  view_count INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  avg_time_on_page INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visitor_stats table for aggregated statistics
CREATE TABLE IF NOT EXISTS public.visitor_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date DATE NOT NULL,
  total_visitors INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  bounce_rate FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create geographic_stats table for location-based statistics
CREATE TABLE IF NOT EXISTS public.geographic_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date DATE NOT NULL,
  country TEXT DEFAULT 'Việt Nam',
  region TEXT NOT NULL,
  city TEXT,
  visitor_count INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT geographic_stats_unique_region UNIQUE(stat_date, region, city)
);

-- Enable Row Level Security
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geographic_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
  -- Kiểm tra policy đã tồn tại chưa trước khi tạo
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'visitor_logs' AND policyname = 'Visitor logs are viewable by admins'
  ) THEN
    CREATE POLICY "Visitor logs are viewable by admins" 
      ON public.visitor_logs 
      FOR SELECT 
      USING (
        auth.role() = 'authenticated' AND EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'page_views' AND policyname = 'Page views are viewable by admins'
  ) THEN
    CREATE POLICY "Page views are viewable by admins" 
      ON public.page_views 
      FOR SELECT 
      USING (
        auth.role() = 'authenticated' AND EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'visitor_stats' AND policyname = 'Visitor stats are viewable by admins'
  ) THEN
    CREATE POLICY "Visitor stats are viewable by admins" 
      ON public.visitor_stats 
      FOR SELECT 
      USING (
        auth.role() = 'authenticated' AND EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'geographic_stats' AND policyname = 'Geographic stats are viewable by admins'
  ) THEN
    CREATE POLICY "Geographic stats are viewable by admins" 
      ON public.geographic_stats 
      FOR SELECT 
      USING (
        auth.role() = 'authenticated' AND EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS visitor_logs_session_id_idx ON public.visitor_logs(session_id);
CREATE INDEX IF NOT EXISTS visitor_logs_created_at_idx ON public.visitor_logs(created_at);
CREATE INDEX IF NOT EXISTS visitor_logs_region_idx ON public.visitor_logs(region);
CREATE INDEX IF NOT EXISTS visitor_logs_city_idx ON public.visitor_logs(city);
CREATE UNIQUE INDEX IF NOT EXISTS page_views_date_url_idx ON public.page_views(stat_date, page_url);
CREATE UNIQUE INDEX IF NOT EXISTS visitor_stats_date_idx ON public.visitor_stats(stat_date);
CREATE INDEX IF NOT EXISTS geographic_stats_region_idx ON public.geographic_stats(region);
CREATE INDEX IF NOT EXISTS geographic_stats_stat_date_idx ON public.geographic_stats(stat_date);

-- Insert sample data for Vietnamese regions
INSERT INTO public.geographic_stats (stat_date, region, city, visitor_count, page_views)
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
ON CONFLICT (stat_date, region, city) DO NOTHING;

-- Insert sample visitor stats
INSERT INTO public.visitor_stats (stat_date, total_visitors, unique_visitors, page_views, avg_session_duration, bounce_rate)
VALUES
  (CURRENT_DATE - 14, 12500, 8750, 37500, 185, 35.2),
  (CURRENT_DATE - 13, 13200, 9240, 39600, 192, 34.8),
  (CURRENT_DATE - 12, 12800, 8960, 38400, 188, 35.5),
  (CURRENT_DATE - 11, 13500, 9450, 40500, 195, 33.9),
  (CURRENT_DATE - 10, 14200, 9940, 42600, 201, 32.7),
  (CURRENT_DATE - 9, 14800, 10360, 44400, 205, 31.8),
  (CURRENT_DATE - 8, 15100, 10570, 45300, 210, 30.5),
  (CURRENT_DATE - 7, 15600, 10920, 46800, 215, 29.8),
  (CURRENT_DATE - 6, 16200, 11340, 48600, 220, 28.9),
  (CURRENT_DATE - 5, 16800, 11760, 50400, 225, 28.2),
  (CURRENT_DATE - 4, 17500, 12250, 52500, 230, 27.5),
  (CURRENT_DATE - 3, 18200, 12740, 54600, 235, 26.8),
  (CURRENT_DATE - 2, 18900, 13230, 56700, 240, 26.1),
  (CURRENT_DATE - 1, 19500, 13650, 58500, 245, 25.5),
  (CURRENT_DATE, 20000, 14000, 60000, 250, 25.0)
ON CONFLICT (stat_date) DO NOTHING;

-- Insert sample page views
INSERT INTO public.page_views (stat_date, page_url, page_title, view_count, unique_visitors, avg_time_on_page)
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
ON CONFLICT (stat_date, page_url) DO NOTHING;
