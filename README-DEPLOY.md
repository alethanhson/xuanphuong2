# Hướng dẫn triển khai lên AWS EC2

Hướng dẫn này giúp bạn triển khai ứng dụng Next.js lên máy chủ AWS EC2 sử dụng Docker và Nginx.

## Yêu cầu

- Một máy chủ AWS EC2 (khuyến nghị Amazon Linux 2)
- Kết nối SSH tới máy chủ
- Domain đã trỏ về địa chỉ IP của máy chủ (nếu muốn sử dụng HTTPS)

## Các bước triển khai

### 1. Chuẩn bị máy chủ

1. Đăng nhập vào máy chủ EC2:
   ```bash
   ssh -i path/to/your-key.pem ec2-user@your-ec2-ip-address
   ```

2. Cập nhật hệ thống:
   ```bash
   sudo yum update -y
   ```

3. Cài đặt Git (nếu chưa có):
   ```bash
   sudo yum install git -y
   ```

### 2. Clone dự án

1. Clone dự án từ repository:
   ```bash
   git clone https://github.com/your-username/xuanphuong2.git
   cd xuanphuong2
   ```

### 3. Cấu hình môi trường

1. Tạo file `.env` với các biến môi trường cần thiết:
   ```bash
   cp .env.example .env
   nano .env
   ```

2. Điều chỉnh các giá trị trong file `.env`:
   ```
   # Môi trường
   NODE_ENV=production
   
   # URL cơ sở
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### 4. Cấu hình SSL (cho HTTPS)

1. Nếu bạn có chứng chỉ SSL:
   - Đặt file chứng chỉ SSL vào thư mục `nginx/ssl/`:
     ```bash
     mkdir -p nginx/ssl
     # Sao chép file chứng chỉ SSL của bạn vào thư mục
     cp path/to/cert.pem nginx/ssl/
     cp path/to/key.pem nginx/ssl/
     ```

2. Nếu không có chứng chỉ SSL, script sẽ tạo một self-signed certificate tạm thời. Trong production, bạn nên sử dụng Let's Encrypt để có được chứng chỉ SSL miễn phí và hợp lệ.

### 5. Triển khai ứng dụng

1. Cấp quyền thực thi cho script triển khai:
   ```bash
   chmod +x deploy.sh
   ```

2. Chạy script triển khai:
   ```bash
   ./deploy.sh
   ```

Script sẽ tự động:
- Kiểm tra và cài đặt Docker và Docker Compose
- Tạo cấu trúc thư mục cần thiết
- Kiểm tra file `.env`
- Build và chạy ứng dụng
- Hiển thị log (bạn có thể nhấn Ctrl+C để thoát)

### 6. Kiểm tra ứng dụng

Sau khi triển khai thành công, bạn có thể truy cập ứng dụng qua:
- HTTP: http://your-ec2-ip-address
- HTTPS (nếu đã cấu hình): https://your-domain.com

### 7. Quản lý ứng dụng

- Khởi động ứng dụng:
  ```bash
  docker-compose up -d
  ```

- Dừng ứng dụng:
  ```bash
  docker-compose down
  ```

- Xem logs:
  ```bash
  docker-compose logs -f
  ```

- Rebuild khi có cập nhật:
  ```bash
  docker-compose build --no-cache
  docker-compose up -d
  ```

## Cấu hình DNS (optional)

Nếu bạn muốn sử dụng tên miền cho ứng dụng:

1. Đăng nhập vào bảng điều khiển DNS của nhà cung cấp tên miền
2. Thêm bản ghi A trỏ tên miền của bạn đến địa chỉ IP của EC2
   ```
   Type: A
   Name: @ (hoặc subdomain)
   Value: your-ec2-ip-address
   TTL: 3600 (hoặc thấp hơn)
   ```

3. Sau khi DNS cập nhật (có thể mất đến 48 giờ), bạn có thể truy cập ứng dụng qua tên miền của mình.

## Cấu hình Let's Encrypt (optional)

Để sử dụng chứng chỉ SSL miễn phí từ Let's Encrypt:

1. Cài đặt Certbot:
   ```bash
   sudo amazon-linux-extras install epel -y
   sudo yum install certbot -y
   ```

2. Lấy chứng chỉ SSL:
   ```bash
   sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com
   ```

3. Sao chép chứng chỉ vào thư mục nginx/ssl:
   ```bash
   sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/cert.pem
   sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/key.pem
   ```

4. Khởi động lại Nginx:
   ```bash
   docker-compose restart nginx
   ```

5. Cấu hình tự động gia hạn chứng chỉ:
   ```bash
   echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q" | sudo tee -a /etc/crontab > /dev/null
   ```

## Khắc phục sự cố

- **Không thể kết nối đến ứng dụng**:
  - Kiểm tra security group của EC2, đảm bảo các cổng 80 và 443 đã được mở
  - Kiểm tra logs: `docker-compose logs`

- **Lỗi SSL**:
  - Kiểm tra đường dẫn chứng chỉ trong file `nginx/conf/default.conf`
  - Đảm bảo quyền truy cập file chứng chỉ phù hợp 