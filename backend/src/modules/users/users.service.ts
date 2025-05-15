import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Role } from '../../common/enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private database: DatabaseService) {}

  async findByEmail(email: string): Promise<any> {
    return this.database.user.findOne({
      where: { email },
    });
  }

  async findById(id: number): Promise<any> {
    return this.database.user.findOne({
      where: { id },
    });
  }

  async create(data: {
    email: string;
    password: string;
    name?: string;
    role?: string;
  }): Promise<any> {
    const hashedPassword = await this.hashPassword(data.password);

    const user = this.database.user.create({
      ...data,
      password: hashedPassword,
    });
    
    return this.database.user.save(user);
  }

  async update(
    id: number,
    data: {
      email?: string;
      password?: string;
      name?: string;
      role?: string;
    },
  ): Promise<any> {
    // Nếu password được cập nhật, hash nó
    if (data.password) {
      data.password = await this.hashPassword(data.password);
    }

    await this.database.user.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<any> {
    return this.database.user.delete(id);
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async findAdminUsers(): Promise<any[]> {
    return this.database.user.find({
      where: { role: Role.ADMIN },
    });
  }

  async createAdminUser(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<any> {
    return this.create({
      ...data,
      role: Role.ADMIN,
    });
  }
}