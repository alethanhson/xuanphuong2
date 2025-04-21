# Hướng dẫn chạy migration

Để tạo bảng `website_settings` và các bảng khác trong cơ sở dữ liệu Supabase, bạn cần chạy các migration files.

## Cách 1: Sử dụng Supabase CLI

1. Cài đặt Supabase CLI nếu bạn chưa cài đặt:
   ```bash
   npm install -g supabase
   ```

2. Đăng nhập vào Supabase:
   ```bash
   supabase login
   ```

3. Liên kết dự án của bạn:
   ```bash
   supabase link --project-ref <project-ref>
   ```
   Thay `<project-ref>` bằng ID dự án Supabase của bạn.

4. Chạy migration:
   ```bash
   supabase db push
   ```

## Cách 2: Sử dụng Supabase Dashboard

1. Đăng nhập vào [Supabase Dashboard](https://app.supabase.io)
2. Chọn dự án của bạn
3. Đi đến tab "SQL Editor"
4. Mở file `supabase/migrations/20240601000000_create_website_settings_table.sql`
5. Sao chép nội dung của file
6. Dán vào SQL Editor và chạy

## Cách 3: Sử dụng API

Bạn cũng có thể chạy SQL trực tiếp thông qua API của Supabase:

```javascript
const { data, error } = await supabase.rpc('exec_sql', {
  sql_string: `
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

    -- Insert initial hero section settings
    INSERT INTO public.website_settings (key, value)
    VALUES (
      'hero_section',
      '{"slides":[...]}'::jsonb
    ) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
  `
})
```

Sau khi chạy migration, bạn có thể sử dụng tính năng quản lý Hero Section trong admin panel.
