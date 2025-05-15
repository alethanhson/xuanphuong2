#!/bin/sh

set -e

cd /usr/src/app

# Đảm bảo các thư mục cần thiết tồn tại
echo "Chuẩn bị môi trường..."
mkdir -p ./data
mkdir -p ./dist

# Tạo thư mục database nếu chưa tồn tại
if [ ! -f "./data/database.sqlite" ]; then
  echo "Tạo file database SQLite mới..."
  touch ./data/database.sqlite
  sqlite3 ./data/database.sqlite "PRAGMA journal_mode=WAL;"
  echo "Đã tạo file database SQLite."
fi

# Kiểm tra quyền truy cập vào file database
chown -R node:node ./data
chmod 755 ./data
chmod 644 ./data/database.sqlite
echo "Đã cấu hình quyền truy cập cho database."

# Patch cho lỗi crypto.randomUUID() 
echo "Patching crypto.randomUUID() in @nestjs/typeorm..."
TYPEORM_UTILS_FILE="/usr/src/app/node_modules/@nestjs/typeorm/dist/common/typeorm.utils.js"
if [ -f "$TYPEORM_UTILS_FILE" ]; then
  # Tạo backup file
  cp "$TYPEORM_UTILS_FILE" "${TYPEORM_UTILS_FILE}.bak"
  
  # Thay đổi dòng mã gây lỗi
  sed -i 's/const generateString = () => crypto.randomUUID();/const generateString = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);/g' "$TYPEORM_UTILS_FILE"
  
  echo "Đã patch thành công file $TYPEORM_UTILS_FILE"
fi

# Khởi động NestJS thay vì Express
echo "Khởi động NestJS server..."
if [ "$NODE_ENV" = "production" ]; then
  node dist/src/main.js
else
  npm run start:dev
fi

exec "$@" 