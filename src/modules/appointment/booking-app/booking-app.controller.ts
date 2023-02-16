import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppointmentBookingEntity } from 'src/entities/AppointmentBooking.entity';
import { UserCustomer } from 'src/modules/user/decorators/user-customer.decorator';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { BookingAppService } from './booking-app.service';

@Controller('appointment/booking-app')
@ApiTags('appointment/booking-app')
@ApiBearerAuth('customer-token')
@UseGuards(JwtCustomerAuthGuard)
export class BookingAppController {
    constructor(private readonly bookingAppService: BookingAppService) { }

    @Get('/history')
    async getHistory(@Query('skip') skip: number = 0, @Query('take') take: number = 10, @UserCustomer('customerId') customerId: number) {
        return this.bookingAppService.getHistory(skip, take, customerId);
    }

    @Get('/store/services/:id')
    async getServices(@Param('id') id: number,) {
        return this.bookingAppService.getServices(id);
    }

    // @Post()
    // @UsePipes(new ValidationPipe())
    // async bookAppointment(@Body() booking: AppointmentBookingEntity, @UserCustomer('customerId') customerId: number) {
    //     return this.bookingAppService.bookAppointment(booking, customerId);
    // }

    // @Delete(':id')
    // async deleteAppointment(@Param('id') id: number,) {
    //     return this.bookingAppService.deleteAppointment(id);
    // }
}
