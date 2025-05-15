import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { Role } from '../../../common/enums/role.enum';

interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const { sub: id } = payload;
    const user = await this.usersService.findById(Number(id));

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    // Kiểm tra nếu user không phải admin thì từ chối truy cập
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Chỉ admin mới có quyền truy cập');
    }

    // Tạo một đối tượng mới không chứa password
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
} 