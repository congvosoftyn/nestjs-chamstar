import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('cronjob')
@ApiTags('cronjob')
export class CronJobController {
  @Get()
  init(@Res() res: Response) {
    return res.status(HttpStatus.OK).send({ status: 'done' });
  }
}
