FROM node:18-alpine AS base

# Cài đặt các dependency
FROM base AS deps
WORKDIR /app

COPY frontend/package.json frontend/package-lock.json* ./
# Đảm bảo cài đặt tất cả dependencies bao gồm cả devDependencies
RUN npm install --include=dev

# Development - cho môi trường phát triển và production
FROM base AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
# Thiết lập biến môi trường để tránh một số lỗi với Next.js
ENV NODE_OPTIONS="--max-old-space-size=4096"

EXPOSE 3000
CMD ["npm", "run", "dev"]

# Sử dụng development stage cho tất cả
FROM development AS production 