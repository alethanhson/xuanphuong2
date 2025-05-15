-- Tạo database nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS xuanphuong;
USE xuanphuong;

-- Tạo bảng users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng categories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng products
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'PUBLISHED',
  categoryId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tạo bảng product_images
CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  alt VARCHAR(255),
  isPrimary BOOLEAN DEFAULT FALSE,
  productId INT NOT NULL,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Tạo bảng services
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2),
  image VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng blogs
CREATE TABLE IF NOT EXISTS blogs (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT,
  image VARCHAR(255),
  authorId VARCHAR(36),
  published BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (authorId) REFERENCES users(id)
);

-- Tạo bảng customers
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng contacts
CREATE TABLE IF NOT EXISTS contacts (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert admin user
INSERT INTO users (email, firstName, lastName, password, role)
VALUES (
  'xuanphuong@gmail.com', 
  'Xuan', 
  'Phuong', 
  '$2b$10$8GpRmzsXaA9aNtNcD4/mCu7Fh.hWJn81Vki1iBzpE8LLQTgLvgCU.', -- password: admin123
  'admin'
);

-- Insert mẫu categories
INSERT INTO categories (name, slug) VALUES
('Điện thoại', 'dien-thoai'),
('Máy tính', 'may-tinh'),
('Phụ kiện', 'phu-kien');

-- Insert mẫu products
INSERT INTO products (title, slug, description, price, categoryId) VALUES
('iPhone 14 Pro Max', 'iphone-14-pro-max', 'Điện thoại iPhone 14 Pro Max mới nhất', 28990000, 1),
('MacBook Pro M2', 'macbook-pro-m2', 'Laptop MacBook Pro với chip M2', 35990000, 2),
('Tai nghe AirPods Pro', 'tai-nghe-airpods-pro', 'Tai nghe không dây AirPods Pro', 4990000, 3);

-- Insert mẫu product_images
INSERT INTO product_images (url, alt, isPrimary, productId) VALUES
('https://example.com/iphone14.jpg', 'iPhone 14 Pro Max', 1, 1),
('https://example.com/macbook.jpg', 'MacBook Pro M2', 1, 2),
('https://example.com/airpods.jpg', 'Tai nghe AirPods Pro', 1, 3);