FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY ./backend/package*.json ./
# Cài đặt các gói cần thiết cho SQLite
RUN apk add --no-cache python3 make g++ sqlite

# Cài đặt các dependencies
RUN npm ci
# Đảm bảo sqlite3 được cài đặt đúng cách với các dependencies cần thiết
RUN npm install sqlite3 --build-from-source

# Development stage
FROM base AS development
COPY ./backend .
RUN mkdir -p /usr/src/app/generated/prisma
RUN npm run build
# Không sao chép server.js nữa vì chúng ta sẽ dùng NestJS
RUN mkdir -p /usr/src/app/dist
RUN mkdir -p /usr/src/app/data

# Thêm file entrypoint cho NestJS
COPY ./backend/docker/backend/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "start:dev"]

# Production stage
FROM node:20-alpine AS production
WORKDIR /usr/src/app
# Cài đặt các gói cần thiết cho SQLite trong môi trường production
RUN apk add --no-cache python3 make g++ sqlite
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/package*.json ./
COPY --from=development /usr/src/app/prisma ./prisma
COPY --from=development /usr/src/app/generated ./generated

# Đảm bảo sqlite3 được cài đặt đúng cách trong production
RUN npm install sqlite3 --build-from-source

# Tạo thư mục data cho SQLite
RUN mkdir -p /usr/src/app/data

# Thêm file entrypoint cho NestJS
COPY ./backend/docker/backend/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "start:prod"] 