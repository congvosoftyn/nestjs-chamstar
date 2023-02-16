import { UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppointmentBookingEntity } from 'src/entities/AppointmentBooking.entity';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { ProductEntity } from 'src/entities/Product.entity';
import { StaffEntity } from 'src/entities/Staff.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import JwtNoAuthenticationGuard from 'src/shared/guards/jwtNoAuthentication.guard';
import { CreateAppointmentInput } from '../booking/dto/create-booking.input';
import { BookingWebService } from './booking-web.service';

@Resolver(() => AppointmentBookingEntity)
export class BookingWebResolver {
  constructor(private readonly bookingWebService: BookingWebService) { }

  //   @ApiBearerAuth('no-token')
  @UseGuards(JwtNoAuthenticationGuard)
  @Query(() => CustomerEntity, { name: 'customer' })
  async getCustomerByPhoneNumber(@Args('phoneNumber') phoneNumber: string) {
    return this.bookingWebService.getCustomerByPhoneNumber(phoneNumber);
  }

  @Query(() => [StaffEntity], { name: 'staff' })
  async getStaffByName(@Args('subDomain', { type: () => String }) subDomain: string, @Args('staffName', { type: () => String }) staffName: string,) {
    return this.bookingWebService.getStaffByName(subDomain, staffName);
  }

  //   @ApiBearerAuth('no-token')
  @UseGuards(JwtNoAuthenticationGuard)
  @Query(() => [ProductEntity], { name: 'store_services' })
  async getServices(@Args('subDomain', { type: () => String }) subDomain: string, @Args('staffName', { type: () => String }) staffName: string,) {
    return this.bookingWebService.getServices(subDomain, staffName);
  }

  //   @ApiBearerAuth('no-token')
  @UseGuards(JwtNoAuthenticationGuard)
  @Query(() => [StaffEntity], { name: 'store_staffs' })
  async getStaffs(@Args('subDomain', { type: () => String }) subDomain: string,) {
    return this.bookingWebService.getStaffs(subDomain);
  }

  //   @ApiBearerAuth('no-token')
  @UseGuards(JwtNoAuthenticationGuard)
  @Query(() => StoreEntity, { name: 'store' })
  async getStore(@Args('subDomain', { type: () => String }) subDomain: string) {
    return this.bookingWebService.getStore(subDomain);
  }

  // //   @ApiBearerAuth('no-token')
  // @UseGuards(JwtNoAuthenticationGuard)
  // @Mutation(() => AppointmentBookingEntity, { name: 'store' })
  // @UsePipes(new ValidationPipe())
  // async bookAppointment(@Args('bookAppointmentInput') bookAppointmentInput: CreateAppointmentInput,) {
  //   return this.bookingWebService.bookAppointment(bookAppointmentInput as AppointmentBookingEntity,);
  // }
}
