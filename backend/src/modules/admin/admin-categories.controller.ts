import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('admin/categories')
@Public()
export class AdminCategoriesController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async getAllCategories() {
    try {
      const categories = await this.databaseService.category.find({
        order: { name: 'ASC' },
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
  async getCategoryById(@Param('id') id: string) {
    try {
      const categoryId = Number(id);
      
      const category = await this.databaseService.category.findOne({
        where: { id: categoryId },
      });
      
      if (!category) {
        return {
          error: {
            message: 'Không tìm thấy danh mục'
          }
        };
      }
      
      return {
        data: category
      };
    } catch (error) {
      return {
        error: {
          message: 'Không thể lấy thông tin danh mục',
          details: error.message
        }
      };
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body() data: any) {
    try {
      // Tạo slug từ name nếu chưa có
      if (!data.slug && data.name) {
        data.slug = data.name
          .toLowerCase()
          .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
          .replace(/[èéẹẻẽêềếệểễ]/g, "e")
          .replace(/[ìíịỉĩ]/g, "i")
          .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
          .replace(/[ùúụủũưừứựửữ]/g, "u")
          .replace(/[ỳýỵỷỹ]/g, "y")
          .replace(/đ/g, "d")
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      
      // Tạo danh mục mới
      const categoryData = {
        name: data.name,
        slug: data.slug,
        description: data.description || '',
      };
      
      const category = await this.databaseService.category.save(categoryData);
      
      return {
        data: category,
        message: 'Tạo danh mục thành công'
      };
    } catch (error) {
      console.error('Error creating category:', error);
      return {
        error: {
          message: 'Không thể tạo danh mục',
          details: error.message
        }
      };
    }
  }

  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body() data: any) {
    try {
      const categoryId = Number(id);
      
      // Kiểm tra danh mục tồn tại chưa
      const existingCategory = await this.databaseService.category.findOne({
        where: { id: categoryId }
      });
      
      if (!existingCategory) {
        return {
          error: {
            message: 'Không tìm thấy danh mục'
          }
        };
      }
      
      // Cập nhật thông tin danh mục
      const categoryData = {
        id: categoryId,
        name: data.name !== undefined ? data.name : existingCategory.name,
        slug: data.slug !== undefined ? data.slug : existingCategory.slug,
        description: data.description !== undefined ? data.description : existingCategory.description,
      };
      
      await this.databaseService.category.save(categoryData);
      
      // Lấy thông tin danh mục đã cập nhật
      const result = await this.databaseService.category.findOne({
        where: { id: categoryId }
      });
      
      return {
        data: result,
        message: 'Cập nhật danh mục thành công'
      };
    } catch (error) {
      console.error('Error updating category:', error);
      return {
        error: {
          message: 'Không thể cập nhật danh mục',
          details: error.message
        }
      };
    }
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    try {
      const categoryId = Number(id);
      
      // Kiểm tra danh mục tồn tại chưa
      const existingCategory = await this.databaseService.category.findOne({
        where: { id: categoryId }
      });
      
      if (!existingCategory) {
        return {
          error: {
            message: 'Không tìm thấy danh mục'
          }
        };
      }
      
      // Kiểm tra xem có sản phẩm nào đang sử dụng danh mục này không
      const productsCount = await this.databaseService.product.count({
        where: { categoryId }
      });
      
      if (productsCount > 0) {
        return {
          error: {
            message: 'Không thể xóa danh mục đang được sử dụng cho sản phẩm',
            details: `Danh mục này đang được sử dụng cho ${productsCount} sản phẩm`
          }
        };
      }
      
      // Xóa danh mục
      await this.databaseService.category.delete(categoryId);
      
      return {
        message: 'Xóa danh mục thành công'
      };
    } catch (error) {
      console.error('Error deleting category:', error);
      return {
        error: {
          message: 'Không thể xóa danh mục',
          details: error.message
        }
      };
    }
  }
} 