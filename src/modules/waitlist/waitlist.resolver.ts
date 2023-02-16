import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OpenHourEntity } from 'src/entities/OpenHour.entity';
import { WaitListEntity } from 'src/entities/WaitList.entity';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { UserCustomer } from '../user/decorators/user-customer.decorator';
import { User } from '../user/decorators/user.decorator';
import { GetWaitListsInput } from './dto/GetWaitLists.input';
import { NewWaitListInput } from './dto/NewWaitList.input';
import { RequestWaitListFromCustomerInput } from './dto/RequestWaitListFromCustomer.input';
import { WaitlistService } from './waitlist.service';

@Resolver(() => WaitListEntity)
export class WaitlistResolver {
    constructor(private waitlistService: WaitlistService) { }

    // setup route for get waitlist by customer id
    // @ApiBearerAuth('customer-token')
    @UseGuards(JwtCustomerAuthGuard)
    @Query(() => WaitListEntity, { name: 'customer' })
    async getCustomerActiveWaitlist(@UserCustomer('customerId') customerId: number) {
        return this.waitlistService.getCustomerActiveWaitlist(customerId);
    }

    // @ApiBearerAuth('customer-token')
    @UseGuards(JwtCustomerAuthGuard)
    @Query(() => WaitListEntity, { name: 'customer_history' })
    async getCustomerHistoryWaitlist(@UserCustomer('customerId') customerId: number) {
        return this.waitlistService.getCustomerHistoryWaitlist(customerId);
    }

    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Query(() => WaitListEntity)
    async getWaitLists(@Args('query') query: GetWaitListsInput, @User('storeId') storeId: number) {
        return this.waitlistService.getWaitLists(query, storeId);
    }

    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Query(() => WaitListEntity, { name: 'setDone' })
    async setDone(@Args('id', { type: () => Int }) id: number) {
        return this.waitlistService.setDone(id);
    }

    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Query(() => WaitListEntity, { name: 'sendMessage' })
    async sendMessage(@Args('id', { type: () => Int }) id: number, @User('companyId') companyId: number, @User('storeId') storeId: number) {
        return this.waitlistService.sendMessage(id, companyId, storeId);
    }

    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Query(() => WaitListEntity, { name: 'call' })
    async callNumber(@Args('id', { type: () => Int }) id: number) {
        return this.waitlistService.callNumber(id);
    }

    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Mutation(() => WaitListEntity)
    async newWaitList(@Args('newWaitList') newWaitList: NewWaitListInput, @User('companyId') companyId: number, @User('storeId') storeId: number) {
        return this.waitlistService.newWaitList(newWaitList, companyId, storeId);
    }

    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Mutation(() => WaitListEntity)
    @UsePipes(new ValidationPipe())
    async updateWaitList(@Args('updateWaitList') updateWaitList: NewWaitListInput, @User('companyId') companyId: number, @User('storeId') storeId: number) {
        return this.waitlistService.newWaitList(updateWaitList, companyId, storeId);
    }

    // // delete Waitlist
    // @Delete('/delete/:id')
    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Mutation(() => WaitListEntity, { name: 'delete' })
    async deleteWaitlist(@Args('id', { type: () => Int }) id: number) {
        return this.waitlistService.deleteWaitlist(id);
    }


    // // Statistic
    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Query(() => WaitListEntity, { name: 'statistic' })
    async getACustomerStatistic(@Args('phoneNumber', { type: () => String }) phoneNumber: string, @User('storeId') storeId: number) {
        return this.waitlistService.getACustomerStatistic(phoneNumber, storeId);
    }

    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Query(() => WaitListEntity, { name: 'storeStatistic' })
    async getWailistStatisticForAStore(@User('storeId') storeId: number) {
        return this.waitlistService.getWailistStatisticForAStore(storeId);
    }

    // @Post('/customer')
    // @ApiBearerAuth('customer-token')
    @UseGuards(JwtAuthenticationGuard)
    @Mutation(() => WaitListEntity, { name: 'customer' })
    @UsePipes(new ValidationPipe())
    async requestWaitListFromCustomer(@Args('requestWLFC') requestWLFC: RequestWaitListFromCustomerInput, @User('customerId') customerId: number) {
        return this.waitlistService.requestWaitListFromCustomer(requestWLFC, customerId);
    }

    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Mutation(() => WaitListEntity, { name: 'customer_delete' })
    async cancelWaitlistRequestOfCustomer(@Args('customerId', { type: () => Int }) customerId: number, @User('storeId') storeId: number, @User('companyId') companyId: number) {
        return this.waitlistService.cancelWaitlistRequestOfCustomer(customerId, storeId, companyId);
    }

    // // Insert Open Hour for Testing
    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Query(() => OpenHourEntity, { name: 'openhour' })
    async insertOpenHour() {
        return this.waitlistService.insertOpenHour();
    }

    // // Automatic Delete Waitlist after midnight
    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Query(() => WaitListEntity, { name: 'expire' })
    async autoRemoveWaitlist(@User('storeId') storeId: number) {
        return this.waitlistService.autoRemoveWaitlist(storeId);
    }
}
