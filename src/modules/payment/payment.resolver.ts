import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompanyEntity } from 'src/entities/Company.entity';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { User } from '../user/decorators/user.decorator';
import { AddNewCardInput } from './dto/AddNewCard.input';
import { ChargePaymentInput } from './dto/ChargePayment.input';
import { FindPaymentInput } from './dto/FindPayment.input';
import { PaymentService } from './payment.service';

@Resolver(() => CompanyEntity)
@UseGuards(JwtAuthenticationGuard)
export class PaymentResolver {
  constructor(private paymentService: PaymentService) { }

  //   @ApiBearerAuth('access-token')
  @Mutation(() => CompanyEntity, { name: 'addCard' })
  @UsePipes(new ValidationPipe())
  async addNewCard(
    @Args('addNewCard') addNewCard: AddNewCardInput,
    @User('companyId') companyId: number,
  ) {
    return this.paymentService.addNewCard(addNewCard, companyId);
  }

  // @Mutation(() => CompanyEntity, { name: 'charge' })
  // @UsePipes(new ValidationPipe())
  // async chargePayment(@Args('chargePayment') chargePayment: ChargePaymentInput, @User('companyId') companyId: number, @User('userId') userId: number,) {
  //   return this.paymentService.chargePayment(chargePayment, companyId, userId);
  // }

  //   @ApiBearerAuth('access-token')
  @Query(() => CompanyEntity, { name: 'listCard' })
  async listCard(@User('companyId') companyId: number) {
    return this.paymentService.listCard(companyId);
  }

  //   @ApiBearerAuth('access-token')
  @Query(() => CompanyEntity, { name: 'listBankAccount' })
  async listBankAccount(@User('companyId') companyId: number) {
    return this.paymentService.listBankAccount(companyId);
  }

  //   @ApiBearerAuth('access-token')
  @Query(() => CompanyEntity, { name: 'all' })
  async getPayments(
    @Args('skip', { type: () => Int }) skip: number = 0,
    @Args('take', { type: () => Int }) take: number = 0,
    @User('companyId') companyId: number,
  ) {
    return this.paymentService.getPayments(skip, take, companyId);
  }

  //   @ApiBearerAuth('access-token')
  @Query(() => CompanyEntity, { name: 'find' })
  async findPayment(
    @Args('findPayment') findPayment: FindPaymentInput,
    @User('companyId') companyId: number,
  ) {
    return this.paymentService.findPayment(
      findPayment.pageNumber,
      findPayment.pageSize,
      companyId,
    );
  }
}
