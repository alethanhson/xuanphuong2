const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục public
const publicDir = path.join(process.cwd(), 'public');

// Danh sách các thư mục cần tạo
const directories = [
  'uploads',
  'products',
  'hero-section',
];

// Tạo thư mục nếu chưa tồn tại
directories.forEach(dir => {
  const dirPath = path.join(publicDir, dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  } else {
    console.log(`Directory already exists: ${dirPath}`);
  }
});

console.log('All directories created successfully!');
