import { Controller, Get, Post } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Controller('test')
export class TestController {
  @Public()
  @Get()
  getTest(): any {
    return {
      message: 'API test controller hoạt động',
      timestamp: new Date().toISOString()
    };
  }

  @Public()
  @Post()
  postTest(): any {
    return {
      message: 'POST request đến test controller thành công',
      timestamp: new Date().toISOString()
    };
  }
} 