import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppointmentBookingEntity } from 'src/entities/AppointmentBooking.entity';
import { UserCustomer } from 'src/modules/user/decorators/user-customer.decorator';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { CreateAppointmentInput } from '../booking/dto/create-booking.input';
import { BookingAppService } from './booking-app.service';

@Resolver(() => AppointmentBookingEntity)
@UseGuards(JwtCustomerAuthGuard)
export class BookingAppResolver {
  constructor(private readonly bookingAppService: BookingAppService) { }

  @Query(() => [AppointmentBookingEntity], { name: 'history' })
  async getHistory(@Args('skip', { type: () => Int }) skip: number, @Args('take', { type: () => Int }) take: number,  @UserCustomer('customerId') customerId: number) {
    return this.bookingAppService.getHistory(skip, take, customerId);
  }

  @Query(() => [AppointmentBookingEntity], { name: 'store_services' })
  async getServices(@Args('id', { type: () => Int }) id: number) {
    return this.bookingAppService.getServices(id);
  }

  // @Mutation(() => AppointmentBookingEntity, { name: 'store_services' })
  // @UsePipes(new ValidationPipe())
  // async bookAppointment(@Args('bookAppointmentInput') bookAppointmentInput: CreateAppointmentInput, @UserCustomer('customerId') customerId: number,) {
  //   return this.bookingAppService.bookAppointment(bookAppointmentInput as AppointmentBookingEntity, customerId,);
  // }

  // @Mutation(() => AppointmentBookingEntity)
  // async deleteAppointment(@Args('id', { type: () => Int }) id: number) {
  //   return this.bookingAppService.deleteAppointment(id);
  // }
}
