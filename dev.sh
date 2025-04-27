#!/bin/bash

# Script khởi chạy môi trường development

# Màu sắc cho output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Hàm hiển thị thông báo
echo_message() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Kiểm tra Docker đã được cài đặt chưa
if ! command -v docker &> /dev/null; then
    echo_error "Docker chưa được cài đặt. Vui lòng cài đặt Docker trước khi tiếp tục."
    exit 1
fi

# Kiểm tra Docker Compose đã được cài đặt chưa
if ! command -v docker-compose &> /dev/null; then
    echo_error "Docker Compose chưa được cài đặt. Vui lòng cài đặt Docker Compose trước khi tiếp tục."
    exit 1
fi

# Kiểm tra file .env
if [ ! -f .env ]; then
    echo_warning "Không tìm thấy file .env. Đang tạo file .env từ .env.example..."
    
    if [ -f .env.example ]; then
        cp .env.example .env
        echo_message "Đã tạo file .env từ .env.example. Vui lòng kiểm tra và cập nhật các giá trị nếu cần."
    else
        echo_warning "Không tìm thấy file .env.example. Đang tạo file .env mới..."
        cat > .env << EOL
# Môi trường
NODE_ENV=development

# URL cơ sở
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EOL
        echo_message "Đã tạo file .env mới. Vui lòng cập nhật các giá trị trong file .env."
    fi
fi

# Khởi động môi trường development
echo_message "Khởi động môi trường development..."

# Dừng container nếu đang chạy
echo_message "Dừng các container đang chạy (nếu có)..."
docker-compose -f docker-compose.dev.yml down

# Build và khởi động container
echo_message "Build và khởi động container development..."
docker-compose -f docker-compose.dev.yml up -d

# Hiển thị logs
echo_message "Môi trường development đã được khởi động. Đang hiển thị logs..."
echo_message "Nhấn Ctrl+C để thoát khỏi logs (ứng dụng vẫn tiếp tục chạy)."
docker-compose -f docker-compose.dev.yml logs -f 