import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobStatus } from './job-status';

@Injectable()
export class JobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.job.findUnique({ where: { id } });
  }

  create(dto: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        title: dto.title,
        type: dto.type,
        status: JobStatus.PENDING,
        version: 0,
      },
    });
  }

  updateStatusOptimistic(id: string, status: JobStatus, currentVersion: number) {
    return this.prisma.job.updateMany({
      where: { id, version: currentVersion },
      data: { status, version: { increment: 1 } },
    });
  }

  delete(id: string) {
    return this.prisma.job.delete({ where: { id } });
  }
}
