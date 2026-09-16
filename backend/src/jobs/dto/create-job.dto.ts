import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { JobType } from '../job-status';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty({ message: 'Title must not be empty' })
  @MaxLength(100, { message: 'Title must be at most 100 characters' })
  title: string;

  @IsEnum(JobType, {
    message: `type must be one of: ${Object.values(JobType).join(', ')}`,
  })
  type: JobType;
}
