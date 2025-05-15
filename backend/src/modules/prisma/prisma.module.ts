import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DatabaseModule } from '../../database/database.module';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {} 