// Khai báo kiểu cho suppressHydrationWarning
declare namespace JSX {
  interface IntrinsicElements {
    body: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLBodyElement> & {
        suppressHydrationWarning?: boolean;
      },
      HTMLBodyElement
    >;
    html: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLHtmlElement> & {
        suppressHydrationWarning?: boolean;
      },
      HTMLHtmlElement
    >;
    div: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement> & {
        suppressHydrationWarning?: boolean;
      },
      HTMLDivElement
    >;
  }
}

// Cho phép import file .css trực tiếp
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Cho phép import file hình ảnh
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';

// Định nghĩa kiểu cho window object mở rộng
interface Window {
  gtag?: (type: string, propertyId: string, options: any) => void;
}

// Định nghĩa kiểu cho dữ liệu người dùng
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  isActive: boolean;
}

// Định nghĩa kiểu cho dữ liệu sản phẩm
interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  images?: string[];
  category?: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa kiểu cho dữ liệu dịch vụ
interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price?: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa kiểu cho blog
interface Blog {
  id: string;
  title: string;
  slug: string;
  content?: string;
  image?: string;
  authorId?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author?: User;
}

// Định nghĩa kiểu cho khách hàng
interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa kiểu cho liên hệ
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
} 