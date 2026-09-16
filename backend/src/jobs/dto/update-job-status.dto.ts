import { IsEnum } from 'class-validator';
import { JobStatus } from '../job-status';

export class UpdateJobStatusDto {
  @IsEnum(JobStatus, {
    message: `status must be one of: ${Object.values(JobStatus).join(', ')}`,
  })
  status: JobStatus;
}
