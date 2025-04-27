# Stage 1: Dependency và build
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt dependencies và các gói còn thiếu
COPY package*.json ./
RUN npm uninstall @supabase/auth-helpers-nextjs @supabase/auth-helpers-shared || true
RUN npm install
RUN npm install @supabase/ssr
# Cài đặt các thư viện Radix UI còn thiếu
RUN npm install @radix-ui/react-radio-group @radix-ui/react-switch @radix-ui/react-toggle-group
# Cài đặt các thư viện phụ thuộc cần thiết
RUN npm install react@18 react-dom@18 @types/react@19 @types/react-dom@19 @swc/helpers

# Sao chép toàn bộ source code
COPY . .

# Đảm bảo các thư mục UI component tồn tại
RUN mkdir -p components/ui

# Đảm bảo tsconfig đã được cấu hình đúng
RUN echo '{ "compilerOptions": { "jsx": "preserve", "lib": ["dom", "dom.iterable", "esnext"], "moduleResolution": "bundler", "paths": {"@/*": ["./*"]}, "strict": true, "noEmit": true, "esModuleInterop": true, "module": "esnext", "target": "es5", "allowJs": true, "resolveJsonModule": true, "isolatedModules": true, "incremental": true, "plugins": [{ "name": "next" }] }, "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"], "exclude": ["node_modules"] }' > tsconfig.json

# Build ứng dụng
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: Chạy ứng dụng
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Tạo người dùng non-root cho bảo mật
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Sao chép các tệp cần thiết từ stage builder
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Sao chép thư mục .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Chuyển quyền sở hữu cho người dùng nextjs
USER nextjs

# Expose cổng mặc định
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Chạy ứng dụng với standalone mode
CMD ["node", "server.js"]