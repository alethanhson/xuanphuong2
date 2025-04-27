#!/bin/sh
npm i

# Gỡ bỏ các gói lỗi thời và cài đặt gói mới
npm uninstall @supabase/auth-helpers-nextjs @supabase/auth-helpers-shared || true
npm install @supabase/ssr

# Cài đặt các thư viện React cần thiết
npm install react@18 react-dom@18 @types/react@19 @types/react-dom@19

# Cài đặt các thư viện Radix UI còn thiếu
npm install @radix-ui/react-radio-group @radix-ui/react-switch @radix-ui/react-toggle-group

# Chạy ứng dụng ở chế độ dev để hỗ trợ hot reload
echo "Bắt đầu máy chủ phát triển..."
npm run dev