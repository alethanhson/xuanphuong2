#!/bin/bash

# Kiểm tra xem file .env tồn tại chưa
if [ ! -f .env ]; then
  echo "File .env không tồn tại. Tạo từ file .env.example..."
  cp .env.example .env
  echo "Hãy cập nhật file .env với các giá trị thực trước khi tiếp tục."
  exit 1
fi

# Build và chạy Docker
echo "Đang build và chạy Docker..."
docker compose down
docker compose build --no-cache
docker compose up 