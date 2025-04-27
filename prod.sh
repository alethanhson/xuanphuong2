#!/bin/bash

# Script khởi chạy môi trường production

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

# Tạo thư mục SSL nếu chưa tồn tại
setup_directories() {
  echo_message "Tạo cấu trúc thư mục..."
  mkdir -p ./nginx/conf
  mkdir -p ./nginx/ssl
  mkdir -p ./nginx/www

  # Kiểm tra file SSL có tồn tại không
  if [ ! -f ./nginx/ssl/cert.pem ] || [ ! -f ./nginx/ssl/key.pem ]; then
    echo_warning "Không tìm thấy file SSL. Tạo self-signed certificate tạm thời..."
    
    # Tạo self-signed certificate tạm thời
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./nginx/ssl/key.pem -out ./nginx/ssl/cert.pem -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
    
    echo_warning "Đã tạo self-signed certificate tạm thời. Vui lòng thay thế bằng certificate thật trong production."
  fi
}

# Kiểm tra file .env
check_env() {
  echo_message "Kiểm tra file .env..."
  if [ ! -f .env ]; then
    echo_warning "Không tìm thấy file .env. Đang tạo file .env từ .env.example..."
    
    if [ -f .env.example ]; then
      cp .env.example .env
      echo_message "Đã tạo file .env từ .env.example. Vui lòng kiểm tra và cập nhật các giá trị."
    else
      echo_warning "Không tìm thấy file .env.example. Đang tạo file .env mới..."
      cat > .env << EOL
# Môi trường
NODE_ENV=production

# URL cơ sở
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EOL
      echo_warning "Đã tạo file .env mới. Vui lòng cập nhật các giá trị trong file .env trước khi tiếp tục."
      nano .env
    fi
  fi
}

# Build và khởi chạy containers
build_and_run() {
  echo_message "Build và khởi chạy ứng dụng production..."
  docker-compose -f docker-compose.prod.yml down
  docker-compose -f docker-compose.prod.yml build --no-cache
  docker-compose -f docker-compose.prod.yml up -d
  echo_message "Ứng dụng production đã được triển khai thành công!"
}

# Hiển thị log
show_logs() {
  echo_message "Hiển thị logs (nhấn Ctrl+C để thoát)..."
  docker-compose -f docker-compose.prod.yml logs -f
}

# Thực thi các hàm
main() {
  echo_message "Bắt đầu quá trình triển khai production..."
  setup_directories
  check_env
  build_and_run
  show_logs
}

# Chạy script
main 