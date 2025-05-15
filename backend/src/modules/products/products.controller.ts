import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Public } from '../auth/decorators/public.decorator';
import { Not, In } from 'typeorm';

@Controller('products')
@Public()
export class ProductsController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async getAllProducts(@Query() query: any) {
    try {
      // Tạo options cho phân trang và sắp xếp
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Lọc theo danh mục nếu có
      const categorySlug = query.category;
      const where: any = { status: 'PUBLISHED' };
      
      if (categorySlug) {
        const category = await this.databaseService.category.findOne({
          where: { slug: categorySlug },
        });
        if (category) {
          where.categoryId = category.id;
        }
      }
      
      // Lấy tổng số sản phẩm
      const total = await this.databaseService.product.count({ where });
      
      // Lấy danh sách sản phẩm có phân trang
      const products = await this.databaseService.product.find({
        where,
        skip,
        take: limit,
        relations: {
          category: true,
          images: true,
          highlightItems: true,
          specificationItems: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      
      return {
        data: products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        error: {
          message: 'Không thể lấy danh sách sản phẩm',
          details: error.message,
        },
      };
    }
  }

  @Get('categories')
  async getCategories() {
    try {
      const categories = await this.databaseService.category.find({
        order: { name: 'ASC' },
      });
      
      return {
        data: categories,
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        error: {
          message: 'Không thể lấy danh sách danh mục',
          details: error.message,
        },
      };
    }
  }

  @Get('related/:id')
  async getRelatedProducts(@Param('id') id: string, @Query() query: any) {
    try {
      const productId = Number(id);
      const limit = Number(query.limit) || 4;
      
      // Tìm sản phẩm gốc để lấy categoryId
      const product = await this.databaseService.product.findOne({
        where: { id: productId },
        select: ['id', 'categoryId']
      });
      
      if (!product) {
        throw new NotFoundException('Không tìm thấy sản phẩm');
      }
      
      // Tìm các sản phẩm liên quan (cùng danh mục, không bao gồm sản phẩm hiện tại)
      const relatedProducts = await this.databaseService.product.find({
        where: {
          categoryId: product.categoryId,
          id: Not(productId),
          status: 'PUBLISHED'
        },
        take: limit,
        relations: {
          category: true,
          images: true,
        },
        order: {
          viewCount: 'DESC',
        }
      });
      
      // Nếu không đủ sản phẩm liên quan, bổ sung thêm sản phẩm khác danh mục
      if (relatedProducts.length < limit) {
        const remainingLimit = limit - relatedProducts.length;
        const relatedIds = relatedProducts.map(p => p.id);
        
        // Lấy thêm sản phẩm không cùng danh mục và không trùng với các sản phẩm đã lấy
        const moreProducts = await this.databaseService.product.find({
          where: {
            id: Not(In([...relatedIds, productId])),
            status: 'PUBLISHED'
          },
          take: remainingLimit,
          relations: {
            category: true,
            images: true,
          },
          order: {
            viewCount: 'DESC',
          }
        });
        
        // Gộp hai danh sách sản phẩm
        return {
          data: [...relatedProducts, ...moreProducts],
        };
      }
      
      return {
        data: relatedProducts,
      };
    } catch (error) {
      console.error('Error fetching related products:', error);
      return {
        error: {
          message: 'Không thể lấy danh sách sản phẩm liên quan',
          details: error.message,
        },
      };
    }
  }

  @Get('slug/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    try {
      const product = await this.databaseService.product.findOne({
        where: { slug, status: 'PUBLISHED' },
        relations: {
          category: true,
          images: true,
          highlightItems: true,
          specificationItems: true,
        },
      });
      
      if (!product) {
        throw new NotFoundException('Không tìm thấy sản phẩm');
      }
      
      // Tăng số lượt xem của sản phẩm
      await this.databaseService.product.update(
        { id: product.id },
        { viewCount: product.viewCount + 1 }
      );
      
      // Sắp xếp thông số kỹ thuật và điểm nổi bật theo thứ tự
      if (product.highlightItems) {
        product.highlightItems.sort((a, b) => a.order - b.order);
      }
      
      if (product.specificationItems) {
        product.specificationItems.sort((a, b) => a.order - b.order);
      }
      
      // Chuyển đổi thông tin sản phẩm trả về dạng phù hợp với frontend
      const transformedProduct = {
        ...product,
        features: product.highlightItems.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          icon: item.icon
        }))
      };
      
      return {
        data: transformedProduct,
      };
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      return {
        error: {
          message: 'Không thể lấy thông tin sản phẩm',
          details: error.message,
        },
      };
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    try {
      const productId = Number(id);
      
      const product = await this.databaseService.product.findOne({
        where: { id: productId, status: 'PUBLISHED' },
        relations: {
          category: true,
          images: true,
          highlightItems: true,
          specificationItems: true,
        },
      });
      
      if (!product) {
        throw new NotFoundException('Không tìm thấy sản phẩm');
      }
      
      // Sắp xếp thông số kỹ thuật và điểm nổi bật theo thứ tự
      if (product.highlightItems) {
        product.highlightItems.sort((a, b) => a.order - b.order);
      }
      
      if (product.specificationItems) {
        product.specificationItems.sort((a, b) => a.order - b.order);
      }
      
      return {
        data: product,
      };
    } catch (error) {
      console.error('Error fetching product by id:', error);
      return {
        error: {
          message: 'Không thể lấy thông tin sản phẩm',
          details: error.message,
        },
      };
    }
  }

  @Get('category/:categorySlug')
  async getProductsByCategory(
    @Param('categorySlug') categorySlug: string,
    @Query() query: any,
  ) {
    try {
      const category = await this.databaseService.category.findOne({
        where: { slug: categorySlug },
      });
      
      if (!category) {
        throw new NotFoundException('Không tìm thấy danh mục');
      }
      
      // Tạo options cho phân trang và sắp xếp
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Lấy tổng số sản phẩm trong danh mục
      const total = await this.databaseService.product.count({
        where: { categoryId: category.id, status: 'PUBLISHED' },
      });
      
      // Lấy danh sách sản phẩm trong danh mục
      const products = await this.databaseService.product.find({
        where: { categoryId: category.id, status: 'PUBLISHED' },
        skip,
        take: limit,
        relations: {
          category: true,
          images: true,
          highlightItems: true,
          specificationItems: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      
      return {
        data: {
          category,
          products,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return {
        error: {
          message: 'Không thể lấy danh sách sản phẩm theo danh mục',
          details: error.message,
        },
      };
    }
  }
} 