import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { DatabaseService } from '../database/database.service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

let databaseService: DatabaseService | null = null;

// Hàm để khởi tạo databaseService từ bên ngoài
export const setDatabaseService = (service: DatabaseService) => {
  databaseService = service;
};

export interface RegisterUserData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string | null;
    role: string;
  };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: number): string {
  const payload = { sub: userId };
  const options: SignOptions = { 
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] 
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export async function registerUser(userData: RegisterUserData): Promise<AuthResponse> {
  if (!databaseService) {
    throw new Error('Database service chưa được khởi tạo');
  }

  const { email, password, name } = userData;

  // Kiểm tra email đã tồn tại chưa
  const existingUser = await databaseService.user.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email đã được sử dụng');
  }

  // Mã hóa mật khẩu
  const hashedPassword = await hashPassword(password);

  // Tạo user mới
  const newUser = databaseService.user.create({
    email,
    password: hashedPassword,
    name,
    role: 'USER',
  });

  await databaseService.user.save(newUser);

  // Tạo JWT token
  const token = generateToken(newUser.id);

  return {
    access_token: token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    },
  };
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  if (!databaseService) {
    throw new Error('Database service chưa được khởi tạo');
  }

  // Tìm user theo email
  const user = await databaseService.user.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  // Kiểm tra mật khẩu
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  // Tạo JWT token
  const token = generateToken(user.id);

  return {
    access_token: token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

export async function getAllUsers() {
  if (!databaseService) {
    throw new Error('Database service chưa được khởi tạo');
  }

  return databaseService.user.find({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getUserById(id: number) {
  if (!databaseService) {
    throw new Error('Database service chưa được khởi tạo');
  }

  return databaseService.user.findOne({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateUser(id: number, data: any) {
  if (!databaseService) {
    throw new Error('Database service chưa được khởi tạo');
  }

  // Nếu có cập nhật mật khẩu, mã hóa mật khẩu trước
  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  await databaseService.user.update(id, data);
  
  return databaseService.user.findOne({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteUser(id: number) {
  if (!databaseService) {
    throw new Error('Database service chưa được khởi tạo');
  }

  return databaseService.user.delete(id);
} 