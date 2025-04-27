#!/bin/bash

# Script triển khai ứng dụng Next.js lên máy chủ AWS Linux

# Màu sắc cho output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Hàm hiển thị thông báo
print_message() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Kiểm tra cài đặt Docker và Docker Compose
check_docker() {
  print_message "Kiểm tra cài đặt Docker..."
  if ! command -v docker &> /dev/null; then
    print_error "Docker chưa được cài đặt. Đang cài đặt Docker..."
    sudo yum update -y
    sudo amazon-linux-extras install docker -y
    sudo service docker start
    sudo systemctl enable docker
    sudo usermod -a -G docker ec2-user
    print_message "Docker đã được cài đặt."
  else
    print_message "Docker đã được cài đặt."
  fi

  print_message "Kiểm tra cài đặt Docker Compose..."
  if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose chưa được cài đặt. Đang cài đặt Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_message "Docker Compose đã được cài đặt."
  else
    print_message "Docker Compose đã được cài đặt."
  fi
}

# Tạo thư mục SSL nếu chưa tồn tại
setup_directories() {
  print_message "Tạo cấu trúc thư mục..."
  mkdir -p ./nginx/conf
  mkdir -p ./nginx/ssl
  mkdir -p ./nginx/www

  # Kiểm tra file SSL có tồn tại không
  if [ ! -f ./nginx/ssl/cert.pem ] || [ ! -f ./nginx/ssl/key.pem ]; then
    print_warning "Không tìm thấy file SSL. Tạo self-signed certificate tạm thời..."
    
    # Tạo self-signed certificate tạm thời
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./nginx/ssl/key.pem -out ./nginx/ssl/cert.pem -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
    
    print_warning "Đã tạo self-signed certificate tạm thời. Vui lòng thay thế bằng certificate thật trong production."
  fi
}

# Kiểm tra file .env có tồn tại không
check_env() {
  print_message "Kiểm tra file .env..."
  if [ ! -f .env ]; then
    print_error "Không tìm thấy file .env. Vui lòng tạo file .env với các biến môi trường cần thiết."
    cat > .env.example << EOL
# Môi trường
NODE_ENV=production

# URL cơ sở
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EOL
    print_warning "Đã tạo file .env.example. Vui lòng sao chép thành .env và cập nhật các giá trị."
    exit 1
  else
    print_message "Đã tìm thấy file .env."
  fi
}

# Build và khởi chạy containers
build_and_run() {
  print_message "Build và khởi chạy ứng dụng..."
  docker-compose build --no-cache
  docker-compose up -d
  print_message "Ứng dụng đã được triển khai thành công!"
}

# Hiển thị log
show_logs() {
  print_message "Hiển thị logs (nhấn Ctrl+C để thoát)..."
  docker-compose logs -f
}

# Thực thi các hàm
main() {
  print_message "Bắt đầu quá trình triển khai..."
  check_docker
  setup_directories
  check_env
  build_and_run
  show_logs
}

# Chạy script
main 