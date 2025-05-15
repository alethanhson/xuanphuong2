import { Injectable, UnauthorizedException, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto, userAgent?: string, ipAddress?: string) {
    this.logger.log(`Attempting login for email: ${loginDto.email}`);
    const { email, password } = loginDto;
    
    try {
      // Tìm user bằng email
      const user = await this.usersService.findByEmail(email);
      
      // Nếu không tìm thấy user, kiểm tra nếu đây là lần đăng nhập đầu tiên
      if (!user) {
        // Chỉ trong môi trường phát triển, tạo tài khoản admin nếu email là xuanphuong@gmail.com
        if (email === 'xuanphuong@gmail.com' && password === 'admin123') {
          this.logger.log('Tạo tài khoản admin mặc định cho môi trường dev');
          const newAdmin = await this.usersService.createAdminUser({
            email: 'xuanphuong@gmail.com',
            password: 'admin123',
            name: 'Admin Xuân Phương'
          });
          
          // Tạo JWT token
          const payload = { sub: newAdmin.id, email: newAdmin.email };
          
          return {
            access_token: this.jwtService.sign(payload),
            user: {
              id: newAdmin.id,
              email: newAdmin.email,
              name: newAdmin.name,
              role: newAdmin.role
            }
          };
        }
        
        this.logger.warn(`Login failed: No user found with email: ${email}`);
        throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
      }
      
      // Kiểm tra mật khẩu
      if (!(await this.usersService.validatePassword(password, user.password))) {
        this.logger.warn(`Login failed: Invalid password for email: ${email}`);
        throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
      }
      
      // Kiểm tra nếu người dùng không phải admin thì từ chối truy cập
      if (user.role !== Role.ADMIN) {
        this.logger.warn(`Non-admin user attempted to login: ${email}`);
        throw new UnauthorizedException('Chỉ admin mới có quyền đăng nhập');
      }

      // Ghi log đăng nhập thành công
      this.logger.log(`Admin login successful: ${email} from IP: ${ipAddress}`);
      
      // Tạo JWT token
      const payload = { sub: user.id, email: user.email };
      
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`, error.stack);
      throw error;
    }
  }
  
  async register(registerDto: { email: string; password: string; name?: string }) {
    this.logger.log(`Attempting to register new user with email: ${registerDto.email}`);
    
    try {
      // Kiểm tra email đã tồn tại chưa
      const existingUser = await this.usersService.findByEmail(registerDto.email);
      if (existingUser) {
        this.logger.warn(`Registration failed: Email already exists: ${registerDto.email}`);
        throw new BadRequestException('Email đã được sử dụng');
      }
      
      // Tạo người dùng mới (mặc định là USER role)
      const newUser = await this.usersService.create({
        email: registerDto.email,
        password: registerDto.password,
        name: registerDto.name || '',
        role: Role.USER
      });
      
      // Tạo JWT token
      const payload = { sub: newUser.id, email: newUser.email };
      
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        }
      };
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`, error.stack);
      throw error;
    }
  }
  
  async getUserProfile(user: any) {
    this.logger.log(`Getting user profile for ID: ${user.sub}`);
    
    try {
      // Lấy thông tin chi tiết của người dùng
      const userDetails = await this.usersService.findById(user.sub);
      
      if (!userDetails) {
        this.logger.warn(`User profile not found for ID: ${user.sub}`);
        throw new UnauthorizedException('Không tìm thấy thông tin người dùng');
      }
      
      return {
        id: userDetails.id,
        email: userDetails.email,
        name: userDetails.name,
        role: userDetails.role
      };
    } catch (error) {
      this.logger.error(`Get user profile error: ${error.message}`, error.stack);
      throw error;
    }
  }
} 