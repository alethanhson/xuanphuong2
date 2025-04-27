# Xuân Phương - Dự án Next.js

## Triển khai

Dự án này hỗ trợ hai môi trường triển khai: **Development** và **Production**.

### Yêu cầu chung

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Môi trường Development

Môi trường này phù hợp cho việc phát triển, với các tính năng như hot-reloading để cập nhật thay đổi mã nguồn ngay lập tức.

#### Khởi chạy môi trường Development

1. Cấp quyền thực thi cho script:
   ```bash
   chmod +x dev.sh
   ```

2. Chạy script:
   ```bash
   ./dev.sh
   ```

Script sẽ tự động:
- Kiểm tra và tạo file `.env` nếu cần
- Dừng các container đang chạy (nếu có)
- Build và khởi động môi trường development
- Hiển thị logs (bạn có thể nhấn Ctrl+C để thoát khỏi logs mà không dừng ứng dụng)

#### Truy cập ứng dụng development

Sau khi khởi chạy thành công, bạn có thể truy cập ứng dụng tại:
```
http://localhost:3000
```

### Môi trường Production

Môi trường này được tối ưu hóa cho performance và bảo mật, thích hợp cho việc triển khai lên server thực tế.

#### Khởi chạy môi trường Production

1. Cấp quyền thực thi cho script:
   ```bash
   chmod +x prod.sh
   ```

2. Chạy script:
   ```bash
   ./prod.sh
   ```

Script sẽ tự động:
- Tạo cấu trúc thư mục cần thiết
- Tạo self-signed certificate SSL tạm thời (nếu cần)
- Kiểm tra và tạo file `.env` nếu cần
- Build và khởi động môi trường production
- Hiển thị logs (bạn có thể nhấn Ctrl+C để thoát khỏi logs mà không dừng ứng dụng)

#### Truy cập ứng dụng production

Sau khi khởi chạy thành công, bạn có thể truy cập ứng dụng tại:
```
https://your-domain.com
```
hoặc
```
https://localhost
```

### Quản lý Container

#### Dừng ứng dụng

Development:
```bash
docker-compose -f docker-compose.dev.yml down
```

Production:
```bash
docker-compose -f docker-compose.prod.yml down
```

#### Xem logs

Development:
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

Production:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Triển khai lên AWS EC2

Để triển khai lên AWS EC2, vui lòng tham khảo file hướng dẫn chi tiết tại [README-DEPLOY.md](README-DEPLOY.md). 