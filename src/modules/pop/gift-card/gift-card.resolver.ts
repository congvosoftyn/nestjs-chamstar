import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { GiftCardEntity } from "src/entities/GiftCard.entity";
import { UserCustomer } from "src/modules/user/decorators/user-customer.decorator";
import { User } from "src/modules/user/decorators/user.decorator";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import JwtCustomerAuthGuard from "src/shared/guards/jwtCustomerAuth.guard";
import { CreateGiftCard } from "./dto/create-giftcard.input";
import { GiftCardService } from "./gift-card.service";

@Resolver(() => GiftCardEntity)
export class GiftCardResolver {
    constructor(private readonly giftCardService: GiftCardService) { }

    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Mutation(() => GiftCardEntity)
    @UsePipes(new ValidationPipe())
    async createGiftCard(@Args('createGiftCard') createGiftCard: CreateGiftCard, @User('companyId') companyId: number) {
        return this.giftCardService.createGiftCard(createGiftCard as GiftCardEntity, companyId);
    }

    // @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @Mutation(() => GiftCardEntity, { name: 'exist' })
    async checkGiftCardExist(@Args('code', { type: () => Number }) code: number) {
        return this.giftCardService.checkGiftCardExist(code);
    }

    @UseGuards(JwtCustomerAuthGuard)
    @Mutation(() => GiftCardEntity, { name: 'redeem' })
    async redeemGiftCard(@Args('code', { type: () => Number }) code: number, @UserCustomer('companyId') companyId: number) {
        return this.giftCardService.redeemGiftCard(code, companyId);
    }

}