import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DiscountEntity } from "src/entities/Discount.entity";
import { User } from "src/modules/user/decorators/user.decorator";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import { DiscountService } from "./discount.service";
import { NewDiscountInput } from "./dto/NewDiscount.input";

@Resolver(() => DiscountEntity)
@UseGuards(JwtAuthenticationGuard)
export class DiscountResolver {
    constructor(private readonly discountService: DiscountService) { }

    // @ApiBearerAuth('access-token')
    @Query(() => DiscountEntity)
    async getStoreDiscounts(@User('storeId') storeId: number) {
        return this.discountService.getStoreDiscounts(storeId);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(() => DiscountEntity)
    @UsePipes(new ValidationPipe())
    async newDiscount(@Args('_newDiscount') _newDiscount: NewDiscountInput, @User('storeId') storeId: number) {
        return this.discountService.newDiscount(_newDiscount, storeId);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(() => DiscountEntity)
    @UsePipes(new ValidationPipe())
    async updateDiscount(@Args('_updateDiscount') _updateDiscount: NewDiscountInput, @User('storeId') storeId: number) {
        return this.discountService.newDiscount(_updateDiscount, storeId);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(() => DiscountEntity)
    async deleteDiscount(@Args('id', { type: () => Int }) id: number) {
        return this.discountService.deleteDiscount(id);
    }
}