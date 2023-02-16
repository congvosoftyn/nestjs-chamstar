import { Body, Controller, Get, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppointmentBookingEntity } from 'src/entities/AppointmentBooking.entity';
import JwtNoAuthenticationGuard from 'src/shared/guards/jwtNoAuthentication.guard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { BookingWebService } from './booking-web.service';

@Controller('appointment/booking-web')
@ApiTags('appointment/booking-web')
export class BookingWebController {
    constructor(private readonly bookingWebService: BookingWebService) { }

    @Get('/customer')
    @ApiBearerAuth('no-token')
    @UseGuards(JwtNoAuthenticationGuard)
    async getCustomerByPhoneNumber(@Query('phoneNumber') phoneNumber: string) {
        return this.bookingWebService.getCustomerByPhoneNumber(phoneNumber);
    }

    @Get('/staff')
    async getStaffByName(@Query('subDomain') subDomain: string, @Query('staffName') staffName: string) {
        return this.bookingWebService.getStaffByName(subDomain, staffName);
    }

    @Get('/store/services')
    @ApiBearerAuth('no-token')
    @UseGuards(JwtNoAuthenticationGuard)
    async getServices(@Query('subDomain') subDomain: string, @Query('staffName') staffName: string) {
        return this.bookingWebService.getServices(subDomain, staffName);
    }

    @Get('/store/staffs')
    @ApiBearerAuth('no-token')
    @UseGuards(JwtNoAuthenticationGuard)
    async getStaffs(@Query('subDomain') subDomain: string,) {
        return this.bookingWebService.getStaffs(subDomain);
    }

    @Get('/store')
    @ApiBearerAuth('no-token')
    @UseGuards(JwtNoAuthenticationGuard)
    async getStore(@Query('subDomain') subDomain: string,) {
        return this.bookingWebService.getStore(subDomain);
    }

    // @Post()
    // @ApiBearerAuth('no-token')
    // @UseGuards(JwtNoAuthenticationGuard)
    // @UsePipes(new ValidationPipe())
    // async bookAppointment(@Body() booking: AppointmentBookingEntity) {
    //     return this.bookingWebService.bookAppointment(booking);
    // }

}
