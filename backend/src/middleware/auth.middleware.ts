import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { DatabaseService } from '../database/database.service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
let databaseService: DatabaseService | null = null;

export interface AuthenticatedRequest extends Request {
  user?: any;
}

// Hàm để khởi tạo databaseService từ bên ngoài
export const setDatabaseService = (service: DatabaseService) => {
  databaseService = service;
};

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!databaseService) {
      return res.status(500).json({ message: 'Database service chưa được khởi tạo' });
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Không có token xác thực' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await databaseService.user.findOne({
        where: { id: decoded.sub }
      });

      if (!user) {
        return res.status(401).json({ message: 'Người dùng không tồn tại' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const adminAuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
  }
  next();
}; 