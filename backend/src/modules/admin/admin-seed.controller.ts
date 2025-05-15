import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('api/admin-seed')
export class AdminSeedController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async seedAdminUser(@Body() seedDto: { email: string; password: string; name?: string }) {
    // Tìm kiếm xem đã có admin nào chưa
    const existingAdmins = await this.usersService.findAdminUsers();
    
    if (existingAdmins.length > 0) {
      return {
        message: 'Đã tồn tại tài khoản admin trong hệ thống',
        admin: {
          id: existingAdmins[0].id,
          email: existingAdmins[0].email,
          name: existingAdmins[0].name,
        },
      };
    }

    // Tạo tài khoản admin mới
    const admin = await this.usersService.createAdminUser(seedDto);

    return {
      message: 'Tạo tài khoản admin thành công',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    };
  }
}