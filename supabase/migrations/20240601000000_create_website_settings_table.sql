-- Create website_settings table
CREATE TABLE IF NOT EXISTS public.website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Website settings are viewable by everyone" 
  ON public.website_settings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Website settings are insertable by admins" 
  ON public.website_settings 
  FOR INSERT 
  WITH CHECK (
    auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Website settings are updatable by admins" 
  ON public.website_settings 
  FOR UPDATE 
  USING (
    auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Website settings are deletable by admins" 
  ON public.website_settings 
  FOR DELETE 
  USING (
    auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Insert initial hero section settings
INSERT INTO public.website_settings (key, value)
VALUES (
  'hero_section',
  '{
    "slides": [
      {
        "id": "slide1",
        "title": "Giải Pháp CNC Toàn Diện",
        "subtitle": "Cho Ngành Gỗ & Kim Loại",
        "description": "Nâng cao hiệu suất sản xuất với máy móc CNC hiện đại, chất lượng cao và dịch vụ chuyên nghiệp.",
        "image": "/images/hero/hero-1.jpg",
        "cta": {
          "primary": {
            "text": "Khám phá sản phẩm",
            "link": "/products"
          },
          "secondary": {
            "text": "Liên hệ tư vấn",
            "link": "/contact"
          }
        }
      },
      {
        "id": "slide2",
        "title": "Máy CNC Gỗ Chất Lượng Cao",
        "subtitle": "Độ Chính Xác Tuyệt Đối",
        "description": "Tối ưu hóa quy trình sản xuất đồ gỗ với các dòng máy CNC hiện đại, độ chính xác cao.",
        "image": "/images/hero/hero-2.jpg",
        "cta": {
          "primary": {
            "text": "Xem máy CNC gỗ",
            "link": "/products?category=wood"
          },
          "secondary": {
            "text": "Yêu cầu báo giá",
            "link": "/contact"
          }
        }
      },
      {
        "id": "slide3",
        "title": "Máy CNC Kim Loại Hiện Đại",
        "subtitle": "Công Nghệ Tiên Tiến",
        "description": "Gia công kim loại chính xác với các dòng máy CNC công suất lớn, bền bỉ và đa năng.",
        "image": "/images/hero/hero-3.jpg",
        "cta": {
          "primary": {
            "text": "Xem máy CNC kim loại",
            "link": "/products?category=metal"
          },
          "secondary": {
            "text": "Đặt lịch tư vấn",
            "link": "/contact"
          }
        }
      }
    ]
  }'::jsonb
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
