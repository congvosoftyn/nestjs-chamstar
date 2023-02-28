import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { User } from '../user/decorators/user.decorator';
import { CheckinService } from './checkin.service';
import { CheckInDto } from './dto/CheckIn.dto';
import { CheckOutDto } from './dto/CheckOut.dto';

@Controller('checkin')
@ApiTags('checkin')
export class CheckinController {
  constructor(private checkinService: CheckinService) { }

  // @Post()
  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthenticationGuard)
  // async checkIn(@Body() _checkIn: CheckInDto, @User('companyId') companyId: number, @User('storeId') storeId: number) {
  //   return this.checkinService.checkIn(_checkIn, companyId, storeId);
  // }

  @Post('/checkout')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async checkOut(@Body() body: CheckOutDto) {
    return this.checkinService.checkOut(body)
  }

  // @Get('/customers')
  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthenticationGuard)
  // async checkInCustomers(@User('companyId') companyId: number) {
  //   return this.checkinService.checkInCustomers(companyId);
  // }

  // @Post('/client')
  // @ApiBearerAuth('customer-token')
  // @UseGuards(JwtCustomerAuthGuard)
  // async checkInClient(@Body() _checkIn: CheckInDto, @User('customerId') customerId: number,) {
  //   return this.checkinService.checkIn(_checkIn, companyId);
  // }
}
