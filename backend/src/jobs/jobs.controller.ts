import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateJobDto) {
    return this.jobsService.create(dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateJobStatusDto,
  ) {
    return this.jobsService.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.jobsService.delete(id);
  }
}
