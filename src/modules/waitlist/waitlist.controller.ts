import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { UserCustomer } from '../user/decorators/user-customer.decorator';
import { User } from '../user/decorators/user.decorator';
import { GetWaitListsDto } from './dto/GetWaitLists.dto';
import { NewWaitListDto } from './dto/NewWaitList.dto';
import { RequestWaitListFromCustomerDto } from './dto/RequestWaitListFromCustomer.dto';
import { WaitlistService } from './waitlist.service';

@Controller('waitlist')
@ApiTags('waitlist')
export class WaitlistController {
    constructor(private waitlistService: WaitlistService) { }

    // setup route for get waitlist by customer id
    @Get('/customer')
    @ApiBearerAuth('customer-token')
    @UseGuards(JwtCustomerAuthGuard)
    async getCustomerActiveWaitlist(@UserCustomer('customerId') customerId: number) {
        return this.waitlistService.getCustomerActiveWaitlist(customerId);
    }

    @Get('/customer/history')
    @ApiBearerAuth('customer-token')
    @UseGuards(JwtCustomerAuthGuard)
    async getCustomerHistoryWaitlist(@UserCustomer('customerId') customerId: number) {
        return this.waitlistService.getCustomerHistoryWaitlist(customerId);
    }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getWaitLists(@Query() query: GetWaitListsDto, @User('storeId') storeId: number) {
        return this.waitlistService.getWaitLists(query, storeId);
    }

    @Get("/setDone/:id")
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async setDone(@Param('id') id: number) {
        return this.waitlistService.setDone(id);
    }

    @Get("/sendMessage/:id")
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async sendMessage(@Param('id') id: number, @User('companyId') companyId: number, @User('storeId') storeId: number) {
        return this.waitlistService.sendMessage(id, companyId, storeId);
    }

    @Get("/call/:id")
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async callNumber(@Param('id') id: number) {
        return this.waitlistService.callNumber(id);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async newWaitList(@Body() body: NewWaitListDto, @User('companyId') companyId: number, @User('storeId') storeId: number) {
        return this.waitlistService.newWaitList(body, companyId, storeId);
    }

    @Put()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)

    @UsePipes(new ValidationPipe())
    async updateWaitList(@Body() body: NewWaitListDto, @User('companyId') companyId: number, @User('storeId') storeId: number) {
        return this.waitlistService.newWaitList(body, companyId, storeId);
    }

    // delete Waitlist
    @Delete('/delete/:id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)

    async deleteWaitlist(@Param('id', ParseIntPipe) id: number) {
        return this.waitlistService.deleteWaitlist(id);
    }


    // Statistic
    @Get('/statistic/:phoneNumber')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getACustomerStatistic(@Param('phoneNumber') phoneNumber: string, @User('storeId') storeId: number) {
        return this.waitlistService.getACustomerStatistic(phoneNumber, storeId);
    }

    @Get('/storeStatistic')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getWailistStatisticForAStore(@User('storeId') storeId: number) {
        return this.waitlistService.getWailistStatisticForAStore(storeId);
    }

    @Post('/customer')
    @ApiBearerAuth('customer-token')
    @UseGuards(JwtCustomerAuthGuard)
    @UsePipes(new ValidationPipe())
    async requestWaitListFromCustomer(@Body() body: RequestWaitListFromCustomerDto, @UserCustomer('customerId') customerId: number) {
        return this.waitlistService.requestWaitListFromCustomer(body, customerId);
    }

    @Delete('/customer/:customerId')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async cancelWaitlistRequestOfCustomer(@Param('customerId') customerId: number, @User('storeId') storeId: number, @User('companyId') companyId: number) {
        return this.waitlistService.cancelWaitlistRequestOfCustomer(customerId, storeId, companyId);
    }

    // Insert Open Hour for Testing
    @Get('/openhour')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async insertOpenHour() {
        return this.waitlistService.insertOpenHour();
    }

    // Automatic Delete Waitlist after midnight
    @Get('/expire')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async autoRemoveWaitlist(@User('storeId') storeId: number) {
        return this.waitlistService.autoRemoveWaitlist(storeId);
    }
}
