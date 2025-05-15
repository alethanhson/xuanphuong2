import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../../auth/decorators/public.decorator';

interface UploadedFileData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Controller('admin/product-upload')
export class ProductUploadController {
  
  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: UploadedFileData) {
    // Trong môi trường thực tế, bạn sẽ upload file lên cloud storage
    // Ở đây chúng ta giả lập bằng cách trả về một đường dẫn giả
    
    // Tạo một ID ngẫu nhiên cho file
    const fileId = Math.random().toString(36).substring(2, 15);
    
    return {
      success: true,
      url: `/uploads/products/${fileId}_${file.originalname}`,
      fileName: file.originalname
    };
  }
}
