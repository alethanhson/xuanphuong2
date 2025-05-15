import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getAllProducts(@Query() query: any) {
    try {
      // Tạo options cho phân trang và sắp xếp
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Lấy tổng số sản phẩm
      const total = await this.prisma.product.count();
      
      // Lấy danh sách sản phẩm có phân trang
      const products = await this.prisma.product.find({
        skip,
        take: limit,
        relations: {
          category: true,
          images: true
        },
        order: {
          createdAt: 'DESC'
        }
      });
      
      return {
        data: {
          products,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
          }
        }
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        error: {
          message: 'Không thể lấy danh sách sản phẩm',
          details: error.message
        }
      };
    }
  }

  @Get('categories')
  async getCategories() {
    try {
      const categories = await this.prisma.category.find({
        order: { name: 'ASC' }
      });
      
      return {
        data: categories
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        error: {
          message: 'Không thể lấy danh sách danh mục',
          details: error.message
        }
      };
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    try {
      const productId = Number(id);
      
      const product = await this.prisma.product.findOne({
        where: { id: productId },
        relations: {
          category: true,
          images: true
        }
      });
      
      if (!product) {
        return {
          error: {
            message: 'Không tìm thấy sản phẩm'
          }
        };
      }
      
      return {
        data: product
      };
    } catch (error) {
      return {
        error: {
          message: 'Không thể lấy thông tin sản phẩm',
          details: error.message
        }
      };
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() data: any) {
    try {
      console.log('Received product data:', data);
      
      // Tạo slug từ title nếu chưa có
      if (!data.slug && data.title) {
        data.slug = data.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
      }
      
      // Xử lý dữ liệu hình ảnh
      let images: Array<{url: string, alt?: string}> = [];
      if (data.images && Array.isArray(data.images)) {
        images = data.images;
      }
      
      // Xử lý categoryId
      let categoryId: number | undefined = undefined;
      if (data.categoryId && data.categoryId !== 'null') {
        categoryId = Number(data.categoryId);
      }
      
      // Tạo sản phẩm với thông tin cơ bản
      const productData = {
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        price: Number(data.price) || 0,
        categoryId,
        status: data.status || 'PUBLISHED'
      };
      
      const product = await this.prisma.product.create(productData);
      
      console.log('Created product:', product);
      
      // Tạo các bản ghi hình ảnh cho sản phẩm
      if (images.length > 0) {
        for (const image of images) {
          const productImage = await this.prisma.productImage.create({
            url: image.url,
            alt: image.alt || product.title,
            isPrimary: images.indexOf(image) === 0, // Hình ảnh đầu tiên là hình ảnh chính
            productId: product.id
          });
        }
      }
      
      // Lấy thông tin sản phẩm đã tạo kèm theo các quan hệ
      const createdProduct = await this.prisma.product.findOne({
        where: { id: product.id },
        relations: {
          category: true,
          images: true
        }
      });
      
      return {
        data: createdProduct,
        message: 'Tạo sản phẩm thành công'
      };
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        error: {
          message: 'Không thể tạo sản phẩm',
          details: error.message
        }
      };
    }
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() data: any) {
    try {
      const productId = Number(id);
      
      // Kiểm tra sản phẩm tồn tại chưa
      const existingProduct = await this.prisma.product.findOne({
        where: { id: productId }
      });
      
      if (!existingProduct) {
        return {
          error: {
            message: 'Không tìm thấy sản phẩm'
          }
        };
      }
      
      // Xử lý categoryId
      let categoryId: number | undefined = existingProduct.categoryId;
      if (data.categoryId !== undefined) {
        categoryId = data.categoryId && data.categoryId !== 'null' ? Number(data.categoryId) : undefined;
      }
      
      // Cập nhật thông tin sản phẩm
      const productData = {
        title: data.title !== undefined ? data.title : existingProduct.title,
        slug: data.slug !== undefined ? data.slug : existingProduct.slug,
        description: data.description !== undefined ? data.description : existingProduct.description,
        price: data.price !== undefined ? Number(data.price) : existingProduct.price,
        categoryId,
        status: data.status !== undefined ? data.status : existingProduct.status
      };
      
      await this.prisma.product.update(productId, productData);
      
      // Xử lý cập nhật hình ảnh nếu có
      if (data.images && Array.isArray(data.images)) {
        // Xóa hình ảnh hiện tại
        const images = await this.prisma.productImage.find({ where: { productId } });
        for (const image of images) {
          await this.prisma.productImage.delete(image.id);
        }
        
        // Thêm hình ảnh mới
        const newImages: Array<{url: string, alt?: string, isPrimary?: boolean}> = data.images;
        for (const [index, image] of newImages.entries()) {
          const productImage = await this.prisma.productImage.create({
            url: image.url,
            alt: image.alt || data.title,
            isPrimary: index === 0 || image.isPrimary,
            productId
          });
        }
      }
      
      // Lấy thông tin sản phẩm đã cập nhật với các quan hệ
      const result = await this.prisma.product.findOne({
        where: { id: productId },
        relations: {
          category: true,
          images: true
        }
      });
      
      return {
        data: result,
        message: 'Cập nhật sản phẩm thành công'
      };
    } catch (error) {
      console.error('Error updating product:', error);
      return {
        error: {
          message: 'Không thể cập nhật sản phẩm',
          details: error.message
        }
      };
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    try {
      const productId = Number(id);
      
      // Kiểm tra sản phẩm tồn tại chưa
      const existingProduct = await this.prisma.product.findOne({
        where: { id: productId }
      });
      
      if (!existingProduct) {
        return {
          error: {
            message: 'Không tìm thấy sản phẩm'
          }
        };
      }
      
      // Xóa tất cả hình ảnh liên quan
      const images = await this.prisma.productImage.find({ where: { productId } });
      for (const image of images) {
        await this.prisma.productImage.delete(image.id);
      }
      
      // Xóa sản phẩm
      await this.prisma.product.delete(productId);
      
      return {
        message: 'Xóa sản phẩm thành công'
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      return {
        error: {
          message: 'Không thể xóa sản phẩm',
          details: error.message
        }
      };
    }
  }
}