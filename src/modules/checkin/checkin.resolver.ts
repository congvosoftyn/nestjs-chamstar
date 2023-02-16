import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CheckInEntity } from 'src/entities/CheckIn.entity';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { User } from '../user/decorators/user.decorator';
import { CheckinService } from './checkin.service';
import { CheckInInputDTO } from './dto/CheckIn.input';
import { CheckOutInput } from './dto/CheckOut.input';

@Resolver(() => CheckInEntity)
export class CheckInResolver {
  constructor(private checkinService: CheckinService) { }

  @UseGuards(JwtAuthenticationGuard)
  @Mutation(() => CheckInEntity)
  async checkIn(@Args('_checkIn') _checkIn: CheckInInputDTO, @User('companyId') companyId: number, @User('storeId') storeId: number, @User('customerId') customerId: number,) {
    return this.checkinService.checkIn(_checkIn, companyId, storeId, customerId,);
  }

  // @UseGuards(JwtAuthenticationGuard)
  // @Mutation(() => CheckInEntity, { name: 'checkout' })
  // async checkOut(@Args('checkOut') checkOut: CheckOutInput) {
  //   return this.checkinService.checkOut(checkOut);
  // }

  @UseGuards(JwtAuthenticationGuard)
  @Query(() => CompanyCustomerEntity, { name: 'customers' })
  async checkInCustomers(@User('companyId') companyId: number) {
    return this.checkinService.checkInCustomers(companyId);
  }

  @Mutation(() => CheckInEntity, { name: 'client' })
  @UseGuards(JwtCustomerAuthGuard)
  async checkInClient(@Args('_checkIn') _checkIn: CheckInInputDTO, @User('companyId') companyId: number,) {
    return this.checkinService.checkIn(_checkIn, companyId);
  }
}
