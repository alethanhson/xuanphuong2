# Sử dụng Node.js bản mới nhất với Alpine Linux để giảm kích thước image
FROM node:20-alpine AS deps

# Cài đặt các gói cần thiết cho việc build
RUN apk add --no-cache libc6-compat

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và các file liên quan
COPY package.json package-lock.json* ./

# Cài đặt các dependencies
RUN npm ci

# Giai đoạn build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Thiết lập biến môi trường
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build ứng dụng
RUN npm run build

# Giai đoạn production
FROM node:20-alpine AS runner
WORKDIR /app

# Cài đặt các gói cần thiết 
RUN apk add --no-cache bash curl

# Tạo người dùng không phải root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Thiết lập các biến môi trường
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Sao chép các file cần thiết từ giai đoạn build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Thiết lập quyền sở hữu
USER nextjs

# Mở cổng mặc định
EXPOSE 3000

# Thiết lập biến môi trường cho hostname
ENV HOSTNAME 0.0.0.0

# Lệnh chạy ứng dụng
CMD ["node", "server.js"]