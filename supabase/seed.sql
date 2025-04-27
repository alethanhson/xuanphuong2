-- Insert mock data into product_categories
INSERT INTO public.product_categories (name, slug, description, is_active, order_num)
VALUES
  ('Máy CNC Gỗ', 'may-cnc-go', 'Máy CNC gia công gỗ chuyên nghiệp, hiệu suất cao', true, 1),
  ('Máy Dán Cạnh', 'may-dan-canh', 'Máy dán cạnh tự động cho ngành nội thất', true, 2),
  ('Máy Gia Công Nội Thất', 'may-gia-cong-noi-that', 'Thiết bị gia công nội thất chuyên dụng', true, 3),
  ('Máy Khoan Ngang', 'may-khoan-ngang', 'Máy khoan ngang chính xác cao, năng suất tốt', true, 4),
  ('Máy Cưa Bàn Trượt', 'may-cua-ban-truot', 'Máy cưa bàn trượt đa năng, an toàn', true, 5)
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs for inserting products
-- This assumes the slugs exist from the previous insert or a migration
DO $$
DECLARE
  cnc_go_id UUID;
  may_dan_canh_id UUID;
  may_gia_cong_noi_that_id UUID;
  may_khoan_ngang_id UUID;
  may_cua_ban_truot_id UUID;
  product1_id UUID;
  product2_id UUID;
BEGIN
  SELECT id INTO cnc_go_id FROM public.product_categories WHERE slug = 'may-cnc-go' LIMIT 1;
  SELECT id INTO may_dan_canh_id FROM public.product_categories WHERE slug = 'may-dan-canh' LIMIT 1;
  SELECT id INTO may_gia_cong_noi_that_id FROM public.product_categories WHERE slug = 'may-gia-cong-noi-that' LIMIT 1;
  SELECT id INTO may_khoan_ngang_id FROM public.product_categories WHERE slug = 'may-khoan-ngang' LIMIT 1;
  SELECT id INTO may_cua_ban_truot_id FROM public.product_categories WHERE slug = 'may-cua-ban-truot' LIMIT 1;

  -- Insert mock data into products
  INSERT INTO public.products (name, description, price, category_id)
  VALUES
    ('Máy CNC Gỗ 1325', 'Máy CNC 3 trục khổ lớn cho gỗ', 150000000, cnc_go_id),
    ('Máy Dán Cạnh Tự Động', 'Máy dán cạnh tự động với hệ thống cắt đuôi', 120000000, may_dan_canh_id),
    ('Máy Khoan Ngang 21 Đầu', 'Máy khoan ngang 21 đầu khoan, hiệu suất cao', 80000000, may_khoan_ngang_id)
  ON CONFLICT DO NOTHING
  RETURNING id INTO product1_id;

  INSERT INTO public.products (name, description, price, category_id)
  VALUES
    ('Máy Cưa Bàn Trượt 3200mm', 'Máy cưa bàn trượt khổ lớn, đa năng', 95000000, may_cua_ban_truot_id)
  ON CONFLICT DO NOTHING
  RETURNING id INTO product2_id;

  -- Insert mock data into product_images
  -- Assuming product1_id and product2_id were successfully returned
  IF product1_id IS NOT NULL THEN
    INSERT INTO public.product_images (product_id, url, alt, is_primary)
    VALUES
      (product1_id, '/public/products/cnc-go-1325-image1.jpg', 'Máy CNC Gỗ 1325 ảnh 1', true),
      (product1_id, '/public/products/cnc-go-1325-image2.jpg', 'Máy CNC Gỗ 1325 ảnh 2', false);
  END IF;

  IF product2_id IS NOT NULL THEN
    INSERT INTO public.product_images (product_id, url, alt, is_primary)
    VALUES
      (product2_id, '/public/products/cua-ban-truot-image1.jpg', 'Máy Cưa Bàn Trượt 3200mm ảnh 1', true);
  END IF;

  -- Insert mock data into product_features
    IF product1_id IS NOT NULL THEN
    INSERT INTO public.product_features (product_id, title, description)
    VALUES
      (product1_id, 'Khổ làm việc', '1300mm x 2500mm'),
      (product1_id, 'Công suất Spindle', '3.5KW');
  END IF;

  IF product2_id IS NOT NULL THEN
    INSERT INTO public.product_features (product_id, title, description)
    VALUES
      (product2_id, 'Chiều dài cắt', '3200mm'),
      (product2_id, 'Công suất motor', '5.5 HP');
  END IF;

  -- Insert mock data into product_reviews
    IF product1_id IS NOT NULL THEN
    INSERT INTO public.product_reviews (product_id, author, rating, comment, date)
    VALUES
      (product1_id, 'Nguyễn Văn A', 5, 'Máy hoạt động ổn định, cắt gỗ rất đẹp.', '2024-10-26');
  END IF;

  IF product2_id IS NOT NULL THEN
    INSERT INTO public.product_reviews (product_id, author, company, rating, comment, date)
    VALUES
      (product2_id, 'Trần Thị B', 'Công ty XYZ', 4, 'Máy cưa rất chính xác, đáp ứng tốt nhu cầu sản xuất.', '2024-11-15');
  END IF;

END $$;