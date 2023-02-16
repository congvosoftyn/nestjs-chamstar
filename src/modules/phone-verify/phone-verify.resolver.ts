import { Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { CustomerEntity } from 'src/entities/Customer.entity';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { RequestCodeInput } from './dto/RequestCode.input';
import { ResendCodeInput } from './dto/ResendCode.input';
import { VerifyCodeInput } from './dto/VerifyCode.input';
import { PhoneVerifyService } from './phone-verify.service';

@Resolver(() => CustomerEntity)
// @ApiBearerAuth('no-token')
@UseGuards(JwtAuthenticationGuard)
export class PhoneVerifyResolver {
  constructor(private phoneVerifyService: PhoneVerifyService) {}

  @Mutation(() => CustomerEntity, { name: 'request' })
  @UsePipes(new ValidationPipe())
  async requestCode(
    @Args('requestCodeInput') requestCodeInput: RequestCodeInput,
    @Res() res: Response,
  ) {
    return this.phoneVerifyService.requestCode(requestCodeInput, res);
  }

  @Mutation(() => CustomerEntity, { name: 'resend' })
  @UsePipes(new ValidationPipe())
  async resendCode(@Args('_resendcode') _resendcode: ResendCodeInput) {
    return this.phoneVerifyService.resendCode(_resendcode);
  }

  @Mutation(() => CustomerEntity, { name: 'verify' })
  @UsePipes(new ValidationPipe())
  async verifyCode(
    @Args('_verifyCode') _verifyCode: VerifyCodeInput,
    @Res() res: Response,
  ) {
    return this.phoneVerifyService.verifyCode(_verifyCode, res);
  }
}
