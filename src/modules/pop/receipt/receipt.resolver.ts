import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { ReceiptEntity } from 'src/entities/Receipt.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { SendReceiptToCustomerInput } from './dto/send-reciept-to-customer.input';
import { ReceiptService } from './receipt.service';

@Resolver(() => ReceiptEntity)
export class ReceiptResolver {
  constructor(private readonly receiptService: ReceiptService) { }

  @Query(() => ReceiptEntity)
  async getReceiptInfoByReference(@Args('reference', { type: () => String }) reference: string,) {
    return this.receiptService.getReceiptInfoByReference(reference);
  }

  //     @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @Mutation(() => ReceiptEntity)
  @UsePipes(new ValidationPipe())
  async sendReceiptToCustomer(@Args('sendReceiptToCustomer') sendReceiptToCustomer: SendReceiptToCustomerInput, @User('storeId') storeId: number,) {
    return this.receiptService.sendReceiptToCustomer(sendReceiptToCustomer as ReceiptEntity, storeId,);
  }
}
