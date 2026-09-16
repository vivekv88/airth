import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobsRepository } from './jobs.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JobsController],
  providers: [JobsService, JobsRepository],
})
export class JobsModule {}
