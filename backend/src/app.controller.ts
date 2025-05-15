import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './modules/auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('test')
  getTest(): any {
    return {
      message: 'API test endpoint hoạt động',
      timestamp: new Date().toISOString()
    };
  }

  @Public()
  @Post('test')
  postTest(): any {
    return {
      message: 'POST request nhận được thành công',
      timestamp: new Date().toISOString()
    };
  }
}
