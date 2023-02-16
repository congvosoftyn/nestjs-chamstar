import { Body, Controller, Post, Res, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import JwtNoAuthenticationGuard from 'src/shared/guards/jwtNoAuthentication.guard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { RequestCodeDto } from './dto/RequestCode.dto';
import { ResendCodeDto } from './dto/ResendCode.dto';
import { VerifyCodeDto } from './dto/VerifyCode.dto';
import { PhoneVerifyService } from './phone-verify.service';

@Controller('phone-verify')
@ApiTags('phone-verify')
@ApiBearerAuth('no-token')
@UseGuards(JwtNoAuthenticationGuard)
export class PhoneVerifyController {
  constructor(private phoneVerifyService: PhoneVerifyService) {}

  @Post('/request')
  @UsePipes(new ValidationPipe())
  async requestCode(@Body() body: RequestCodeDto, @Res() res: Response) {
    return this.phoneVerifyService.requestCode(body, res);
  }

  @Post('/resend')
  @UsePipes(new ValidationPipe())
  async resendCode(@Body() body: ResendCodeDto) {
    return this.phoneVerifyService.resendCode(body);
  }

  @Post('/verify')
  @UsePipes(new ValidationPipe())
  async verifyCode(@Body() body: VerifyCodeDto, @Res() res: Response) {
    return this.phoneVerifyService.verifyCode(body, res);
  }
}
