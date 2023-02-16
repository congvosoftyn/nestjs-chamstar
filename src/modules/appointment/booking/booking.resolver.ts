import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AppointmentBookingEntity } from 'src/entities/AppointmentBooking.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { BookingService } from './booking.service';
import { CreateAppointmentInput } from './dto/create-booking.input';
import { GetCalendarSlotInput } from './dto/GetCalendarSlot.input';
import { QueryBookingSlotsInput } from './dto/QueryBookingSlots.input';
import { QueryHistoryByDateInput } from './dto/QueryHistoryByDate.input';
import * as jwt from 'jsonwebtoken';
import { LIFE_SECRET } from 'src/config';
import { DataStoredInToken } from 'src/shared/interfaces/DataStoreInToken.interface';
import { AppointmentBookingDto } from './dto/appointment-booking.dto';
import { UpdateBookingInput } from './dto/update-booking.input';
import { ReponseBookingInput } from './dto/reponse-booking.input';
const pubSub = new PubSub();
const NEW_BOOKING_EVENT = 'newBooking';
const UPDATE_BOOKING_EVENT = 'updateBooking';
const DELETE_BOOKING_EVENT = 'deleteBooking';

@Resolver(() => AppointmentBookingEntity)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) { }

  @Query(() => [ReponseBookingInput])
  async getAppointments(@User('storeId') storeId: number, @User('companyId') companyId: number,) {
    return this.bookingService.getAppointments(storeId, companyId);
  }

  @Query(() => ReponseBookingInput)
  getBookingInfo(@Args('id', { type: () => Int }) id: number) {
    return this.bookingService.findByBooking(+id)
  }

  // @Query(() => [AppointmentBookingEntity], { name: 'slots' })
  // async getBookingSlots(@Args('queryBookingSlotsInput') queryBookingSlotsInput: QueryBookingSlotsInput,) {
  //   return this.bookingService.getBookingSlots(queryBookingSlotsInput);
  // }

  // @Query(() => [AppointmentBookingEntity], { name: 'calendar_slots' })
  // @UseGuards(JwtAuthenticationGuard)
  // async getCalendarSlot(@Args('getCalendarSlotInput') getCalendarSlotInput: GetCalendarSlotInput,) {
  //   return this.bookingService.getCalendarSlot(getCalendarSlotInput.date, getCalendarSlotInput.staffId,);
  // }

  @Mutation(() => AppointmentBookingEntity)
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async createBookAppointment(@Args('bookAppointmentInput') bookAppointmentInput: CreateAppointmentInput, @User('storeId') storeId: number, @User('companyId') companyId: number,) {
    const booking = await this.bookingService.createBookAppointment(bookAppointmentInput, storeId, companyId,);
    pubSub.publish(NEW_BOOKING_EVENT, { newBooking: booking })
    return booking
  }

  @Mutation(() => AppointmentBookingEntity)
  @UseGuards(JwtAuthenticationGuard)
  async updateAppointment(@Args('id', { type: () => Int }) id: number, @Args('updateBooking') updateBooking: UpdateBookingInput, @User('userId') userId: number) {
    const booking = await this.bookingService.updateAppointment(+id, updateBooking,userId);
    pubSub.publish(UPDATE_BOOKING_EVENT, { updateBooking: booking })
    return booking
  }

  // @UseGuards(JwtAuthenticationGuard)
  // @Query(() => AppointmentBookingEntity, { name: 'historyByCustomer' })
  // async getHistoryByCustomer(@Args('id', { type: () => Int }) id: number, @User('storeId') storeId: number,) {
  //   return this.bookingService.getHistoryByCustomer(id, storeId);
  // }

  @UseGuards(JwtAuthenticationGuard)
  @Query(() => [AppointmentBookingEntity], { name: 'history_date' })
  @UsePipes(new ValidationPipe())
  async getHistoryByDate(@Args('queryHistoryByDateInput') queryHistoryByDateInput: QueryHistoryByDateInput, @User('storeId') storeId: number, @User('companyId') companyId: number,) {
    return this.bookingService.getHistoryByDate(queryHistoryByDateInput, storeId, companyId,);
  }



  @UseGuards(JwtAuthenticationGuard)
  @Query(() => [AppointmentBookingEntity], { name: 'historyStatus' })
  @UsePipes(new ValidationPipe())
  async getHistoryStatus(@Args('queryHistoryByDateInput') queryHistoryByDateInput: QueryHistoryByDateInput, @User('storeId') storeId: number,) {
    return this.bookingService.getHistoryStatus(queryHistoryByDateInput, storeId,);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Mutation(() => AppointmentBookingEntity)
  @UsePipes(new ValidationPipe())
  async deleteAppointment(@Args('id', { type: () => Int }) id: number, @User('storeId') storeId: number, @User('companyId') companyId: number,) {
    return this.bookingService.deleteAppointment(id, storeId, companyId);
  }

  @Subscription(() => AppointmentBookingDto, {
    name: 'newBooking',
    filter: async (_payload, _variables, context) => {
      const booking: AppointmentBookingEntity = _payload.newBooking;
      const token = context.req.headers.authorization.split(' ')[1];
      const decode = jwt.verify(token, `${LIFE_SECRET}`) as DataStoredInToken;

      if (booking.storeId === decode.storeId) return true
      return false
    }
  })
  newBooking() {
    return pubSub.asyncIterator(NEW_BOOKING_EVENT)
  }

  @Subscription(() => AppointmentBookingDto, {
    name: 'updateBooking',
    filter: async (_payload, _variables, context) => {
      const booking: AppointmentBookingEntity = _payload.newBooking;
      const token = context.req.headers.authorization.split(' ')[1];
      const decode = jwt.verify(token, `${LIFE_SECRET}`) as DataStoredInToken;

      if (booking.storeId === decode.storeId) return true
      return false
    }
  })
  updateBooking() {
    return pubSub.asyncIterator(UPDATE_BOOKING_EVENT)
  }

  @Subscription(() => AppointmentBookingDto, {
    name: 'deleteBooking',
    filter: async (_payload, _variables, context) => {
      const booking: AppointmentBookingEntity = _payload.newBooking;
      const token = context.req.headers.authorization.split(' ')[1];
      const decode = jwt.verify(token, `${LIFE_SECRET}`) as DataStoredInToken;

      if (booking.storeId === decode.storeId) return true
      return false
    }
  })
  deleteBooking() {
    return pubSub.asyncIterator(DELETE_BOOKING_EVENT)
  }
}
