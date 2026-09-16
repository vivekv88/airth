import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JobsRepository } from './jobs.repository';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { isValidTransition, JobStatus } from './job-status';

@Injectable()
export class JobsService {
  constructor(private readonly jobsRepository: JobsRepository) {}

  findAll() {
    return this.jobsRepository.findAll();
  }

  create(dto: CreateJobDto) {
    return this.jobsRepository.create(dto);
  }

  async updateStatus(id: string, dto: UpdateJobStatusDto): Promise<object> {
    // 1. Read the current job state.
    const job = await this.jobsRepository.findById(id);
    if (!job) {
      throw new NotFoundException(`Job with id "${id}" not found`);
    }

    const currentStatus = job.status as JobStatus;
    const nextStatus = dto.status;

    // 2. Validate the state-machine transition.
    //    This check runs on EVERY request — including direct API calls that
    //    bypass the React UI — so the rule is always enforced server-side.
    if (!isValidTransition(currentStatus, nextStatus)) {
      throw new BadRequestException(
        `Invalid transition: "${currentStatus}" → "${nextStatus}". ` +
          `A job in "${currentStatus}" state cannot move to "${nextStatus}".`,
      );
    }

    // 3. Attempt an optimistic-concurrency update.
    //    The WHERE clause includes the version we just read. If a concurrent
    //    request has already changed the row (incremented version), this
    //    update matches 0 rows, and we surface a 409 Conflict instead of
    //    silently applying a transition on top of stale data.
    //
    //    Example race: two tabs both read version=0 and status=pending.
    //    Tab A's PATCH wins → row becomes version=1, status=running.
    //    Tab B's PATCH arrives → WHERE id=X AND version=0 matches nothing
    //    → count=0 → 409 is returned to Tab B.
    const result = await this.jobsRepository.updateStatusOptimistic(
      id,
      nextStatus,
      job.version,
    );

    if (result.count === 0) {
      throw new ConflictException(
        'This job was modified by another request. Please refresh and try again.',
      );
    }

    // Return the updated job.
    return this.jobsRepository.findById(id) as Promise<object>;
  }

  async delete(id: string): Promise<void> {
    const job = await this.jobsRepository.findById(id);
    if (!job) {
      throw new NotFoundException(`Job with id "${id}" not found`);
    }
    await this.jobsRepository.delete(id);
  }
}
