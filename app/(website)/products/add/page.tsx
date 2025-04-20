'use client';

import ProductForm from './product-form';

export default function AddProductPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Thêm Sản Phẩm Mới</h1>
      <ProductForm />
    </div>
  );
}
