import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GiftCardEntity } from 'src/entities/GiftCard.entity';
import { UserCustomer } from 'src/modules/user/decorators/user-customer.decorator';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { GiftCardService } from './gift-card.service';

@Controller('pop/gift-card')
@ApiTags('pop/gift-card')
export class GiftCardController {
    constructor(private readonly giftCardService: GiftCardService) { }

    @Post()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async createGiftCard(@Body() body: GiftCardEntity, @User('companyId') companyId: number) {
        return this.giftCardService.createGiftCard(body, companyId);
    }

    @Post('/exist')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async checkGiftCardExist(@Body('code') code: number) {
        return this.giftCardService.checkGiftCardExist(code);
    }

    @Post('/redeem')
    @ApiBearerAuth('customer-token')
    @UseGuards(JwtCustomerAuthGuard)
    async redeemGiftCard(@Body('code') code: number, @UserCustomer('companyId') companyId: number) {
        return this.giftCardService.redeemGiftCard(code, companyId);
    }

}
